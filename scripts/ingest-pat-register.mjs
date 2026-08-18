/**
 * Italy's traditional food register, from the regions that publish it as open data.
 *
 *   node scripts/ingest-pat-register.mjs [--dry]
 *
 * 3,971 of the catalogue's 5,057 records that hold nothing but a name are Italian —
 * Prodotti Agroalimentari Tradizionali, the national register of traditional food
 * products. Wikidata lists them because Italy publishes them; nobody has written an
 * encyclopaedia article about most of them, in English or in Italian. One in eight
 * has an article anywhere. They are the single largest empty space in the atlas and
 * no encyclopaedia is going to fill it.
 *
 * The register itself will. A PAT listing is not a bare name — each product has an
 * official sheet, and the fields are almost exactly this app's own:
 *
 *   descrizione                                  what it is
 *   metodiche di lavorazione e conservazione     how it is made and kept
 *   materiali e attrezzature per la preparazione the equipment it is made with
 *   territorio interessato                       where
 *
 * A method and a list of equipment, for records that currently have neither. For
 * these products it is a better source than Wikipedia would be, because it is the
 * document the designation is granted against.
 *
 * ## Licensing
 *
 * Every dataset used here is CC BY 4.0 or CC0 — Italian public-sector open data.
 * Attribution is a condition of the first, so the region and its licence are stored
 * on the record and shown as its source, exactly as a Commons photograph's
 * photographer is.
 *
 * ## The honest limit
 *
 * Only a few regions publish. Umbria, Trento and Sicily do; most do not, and the
 * national ministry's own list is a PDF. So this reaches some hundreds of the 4,127,
 * not all of them, and the rest stay as they are until their region publishes or
 * somebody who cooks them writes them down.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CATALOGUE = resolve(HERE, '../src/data/catalogue.json');

const USER_AGENT = 'GlobalTaste/1.0 (Italian PAT register ingest; contact: via repository)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * The published registers, and what each region calls its columns.
 *
 * Every region invented its own schema, so the mapping is per-source rather than
 * guessed. `attribution` is the credit the licence requires and travels onto every
 * record the file produces.
 */
const SOURCES = [
  {
    region: 'Umbria',
    url: 'https://dati.regione.umbria.it/dataset/cf2b25d4-da77-41d2-bd9a-de653e72564a/resource/f6ba9a04-9a1e-4b0a-9b3e-4a6b0f4c3f1f/download/pat.csv',
    delimiter: ';',
    attribution: 'Regione Umbria — CC BY 4.0',
    columns: {
      name: 'Nome',
      description: 'descrizione',
      method: 'Metodiche di lavorazione conservazione e stagionatura',
      equipment: 'materiali e attrezzature per la preparazione',
      territory: 'territorio interessato',
    },
  },
  {
    region: 'Trentino',
    url: 'https://dati.trentino.it/dataset/b828fb35-51da-408b-8290-bab6fb84407b/resource/b65ef842-f797-4b1a-bb0e-3f0f7c3ac1a9/download/prodotti-tradizionali.csv',
    delimiter: ',',
    attribution: 'Provincia Autonoma di Trento — CC0 1.0',
    columns: {
      name: 'product_name',
      description: 'DESCRIZIONE SINTETICA DEL PRODOTTO',
      method: 'METODICHE DI LAVORAZIONE E CONSERVAZIONE',
      equipment: '',
      territory: 'production_areas',
    },
  },
];

/**
 * Find a region's current file through the open-data catalogue rather than trusting
 * a URL. Resource ids change when a region republishes, and a hardcoded link that
 * 404s silently would look exactly like a region that stopped publishing.
 */
async function resolveSource(query, org) {
  const params = new URLSearchParams({ q: query, rows: '20' });
  const res = await fetch(`https://www.dati.gov.it/opendata/api/3/action/package_search?${params}`, {
    headers: { 'User-Agent': USER_AGENT },
  });
  if (!res.ok) return null;

  const data = await res.json();
  for (const pkg of data?.result?.results ?? []) {
    if (!new RegExp(org, 'i').test(pkg?.organization?.title ?? '')) continue;
    const csv = (pkg.resources ?? []).find((r) => /csv/i.test(r.format ?? ''));
    if (csv?.url) return { url: csv.url, licence: pkg.license_title ?? pkg.license_id ?? 'see source' };
  }
  return null;
}

/**
 * Read a CSV that may be UTF-8 or Windows-1252.
 *
 * Umbria's file arrives as UTF-8 bytes that a latin1 reader turns into "piÃ¹"; other
 * regional exports really are Windows-1252. Decoding as UTF-8 first and falling back
 * on the replacement character is the reliable test — a correct UTF-8 decode never
 * produces one.
 */
async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
    redirect: 'follow',
    signal: AbortSignal.timeout(45000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const bytes = new Uint8Array(await res.arrayBuffer());
  const utf8 = new TextDecoder('utf-8').decode(bytes);
  const cp1252 = new TextDecoder('windows-1252').decode(bytes);

  /*
   * Score both decodes and keep the cleaner one, rather than testing for a single
   * replacement character.
   *
   * A file that is UTF-8 apart from a handful of stray bytes fails the simple test
   * and gets decoded as Windows-1252 instead, which mangles every accent in it —
   * "varietà" came out as "varietÃ â€œ". Each wrong decode leaves its own signature:
   * UTF-8 read as 1252 produces Ã/â€/Â sequences, and 1252 read as UTF-8 produces
   * replacement characters. Counting both and taking the lower is right in either
   * direction.
   */
  const damage = (text, pattern) => (text.match(pattern) ?? []).length;
  const utf8Damage = damage(utf8, /�/g);
  const cp1252Damage = damage(cp1252, /Ã.|â€|Â./g);

  return repairDoubleEncoding(utf8Damage <= cp1252Damage ? utf8 : cp1252);
}

/**
 * Undo a UTF-8 string that was encoded as Windows-1252 before being saved as UTF-8.
 *
 * Umbria's register is published this way: decoding it correctly as UTF-8 still
 * yields "varietÃ  â€œVerdino di Caveâ€", because the mangling happened before the
 * file was written and no decoder can see past it. The signature is unmistakable —
 * zero replacement characters and 736 Ã/â€ sequences in the same file.
 *
 * The repair is to reverse the wrong step: read each character back as the byte
 * Windows-1252 would have produced, then decode those bytes as UTF-8. Applied only
 * when the markers are present and only when the result is cleaner, so a text that
 * legitimately contains "Ã" is left alone.
 */
/**
 * The characters Windows-1252 puts in 0x80–0x9F, mapped back to their byte.
 *
 * This range is why masking a code point is not enough. Windows-1252 fills the gap
 * Latin-1 leaves empty with typographic characters, so the byte 0x93 is a left
 * double quote — and a left double quote is U+201C, whose low byte is 0x1C. Masking
 * turns every smart quote, dash and ellipsis into the wrong byte, which is where the
 * replacement characters in "â€œVerdino di Caveâ€" came from.
 */
const CP1252_BYTE = new Map(
  Object.entries({
    '€': 0x80, '‚': 0x82, 'ƒ': 0x83, '„': 0x84, '…': 0x85, '†': 0x86, '‡': 0x87,
    'ˆ': 0x88, '‰': 0x89, 'Š': 0x8a, '‹': 0x8b, 'Œ': 0x8c, 'Ž': 0x8e, '‘': 0x91,
    '’': 0x92, '“': 0x93, '”': 0x94, '•': 0x95, '–': 0x96, '—': 0x97, '˜': 0x98,
    '™': 0x99, 'š': 0x9a, '›': 0x9b, 'œ': 0x9c, 'ž': 0x9e, 'Ÿ': 0x9f,
  }),
);

function repairDoubleEncoding(text) {
  if (!/Ã.|â€/.test(text)) return text;

  try {
    const bytes = Uint8Array.from([...text].map((c) => CP1252_BYTE.get(c) ?? c.charCodeAt(0) & 0xff));
    const repaired = new TextDecoder('utf-8').decode(bytes);
    const marks = (s) => (s.match(/Ã.|â€|Â./g) ?? []).length;
    return marks(repaired) < marks(text) ? repaired : text;
  } catch {
    return text;
  }
}

/** A CSV parser that understands quoted fields containing the delimiter and newlines. */
function parseCsv(text, delimiter) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];

    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') quoted = true;
    else if (c === delimiter) {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (c !== '\r') {
      field += c;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  const header = (rows.shift() ?? []).map((h) => h.trim());
  return rows
    .filter((r) => r.some((v) => v.trim()))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])));
}

/**
 * Compare names ignoring case, accents, the register's shouting, and the tag.
 *
 * 3,615 of the 4,401 Italian records carry " PAT" on the end — Wikidata labels them
 * with the designation they hold. The register itself does not, because every row in
 * it is a PAT. Leaving the suffix on matched 7 products out of 178: "Torta al testo
 * PAT" and "TORTA AL TESTO" are the same food and were not the same string.
 */
const fold = (name) =>
  (name ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/\bpat\b\s*$/, '')
    .replace(/\b(dop|igp|stg|doc|docg)\b\s*$/, '')
    .replace(/[^a-z0-9]/g, '');

const tidy = (value) =>
  (value ?? '')
    .replace(/\s+/g, ' ')
    .trim();

const main = async () => {
  const dry = process.argv.includes('--dry');
  const rows = JSON.parse(await readFile(CATALOGUE, 'utf8'));

  // Only Italian records with nothing to say are candidates. A record that already
  // has an article is not improved by replacing it with a registry sheet.
  const italian = rows.filter((r) => r.country === 'Italy' && !r.prepSummary);
  const byName = new Map(italian.map((r) => [fold(r.name), r]));
  process.stdout.write(`${italian.length} Italian records with no account.\n`);

  let matched = 0;
  let withMethod = 0;
  let withEquipment = 0;
  const unmatched = [];

  for (const source of SOURCES) {
    const found = await resolveSource('prodotti agroalimentari tradizionali', source.region === 'Trentino' ? 'Trento' : source.region);
    const url = found?.url ?? source.url;

    let text;
    try {
      text = await fetchText(url);
    } catch (error) {
      process.stdout.write(`\n${source.region}: could not be read (${error.message})\n`);
      continue;
    }

    const records = parseCsv(text, source.delimiter);
    process.stdout.write(`\n${source.region}: ${records.length} products in the register\n`);

    for (const record of records) {
      const name = tidy(record[source.columns.name]);
      if (!name) continue;

      const row = byName.get(fold(name));
      if (!row) {
        unmatched.push(`${source.region}: ${name.slice(0, 46)}`);
        continue;
      }

      const description = tidy(record[source.columns.description]);
      const method = tidy(record[source.columns.method]);
      const equipment = source.columns.equipment ? tidy(record[source.columns.equipment]) : '';

      // The account is the description and the method together, in that order —
      // what it is, then how it is made. Stored in Italian, as written.
      const account = [description, method].filter(Boolean).join(' ');
      if (!account) continue;

      matched += 1;
      if (method) withMethod += 1;
      if (equipment) withEquipment += 1;

      if (!dry) {
        row.prepSummary = account.slice(0, 900);
        row.sourceLanguage = 'it';
        row.patRegion = source.region;
        row.patAttribution = found?.licence ? `${source.region} — ${found.licence}` : source.attribution;
        if (equipment) row.equipment = equipment.slice(0, 300);
        if (!row.region) {
          const territory = tidy(record[source.columns.territory]);
          if (territory && territory.length < 60) row.region = territory;
        }
      }
    }

    await sleep(600);
  }

  if (!dry) await writeFile(CATALOGUE, JSON.stringify(rows), 'utf8');

  process.stdout.write(
    `\n${matched} Italian records gained an account from the register.\n` +
      `  ${withMethod} of them a production method, ${withEquipment} the equipment it is made with.\n` +
      `  ${unmatched.length} register products matched no record in the catalogue.\n` +
      unmatched.slice(0, 8).map((u) => `    ${u}`).join('\n') +
      '\n',
  );
};

main().catch((error) => {
  process.stderr.write(`\nPAT ingest failed: ${error.message}\n`);
  process.exitCode = 1;
});
