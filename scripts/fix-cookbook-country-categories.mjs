/**
 * File French-, German- and Italian-cookbook recipes under the cuisine their page names.
 *
 *   node --experimental-strip-types --import ./scripts/lib/ts-resolve.mjs \
 *     scripts/fix-cookbook-country-categories.mjs [--dry] [--cache revs.json]
 *
 * The same fault, and the same rule, as `fix-es-cookbook-country.mjs`: the ingest filed
 * every recipe under its book's country, and each page already says otherwise in a
 * category the ingest ignored — "Catégorie:Cuisine espagnole", "Kategorie:Kochbuch/
 * Italienische Küche", "Categoria:Ricette francesi".
 *
 * ## The tables, and what is deliberately not in them
 *
 * Each maps a category's adjective to the country the atlas files under, written from a
 * census of the categories these pages actually carry (9 October), not from memory.
 * A regional cuisine inside the book's own country — alsacienne, provençale, Schwäbische,
 * Bayerische — names that country and moves nothing.
 *
 * Left out on purpose, so they move nothing either: names that do not pick one country.
 * "Antillaise" is Guadeloupe or Martinique, "catalane" and "basque" are both sides of a
 * border, "coréenne" is two states, and "asiatique", "juive", "méditerranéenne",
 * "orientalische" and "arabe" are not countries at all.
 *
 * ## The rule
 *
 * Read from the exact revision each row records. A recipe moves only when its page names
 * exactly one country, that is not the book's own, the page does not also name the
 * book's country, and the atlas files under it (`isCountry` — a move to anything else
 * would make the cookbook builder drop the row and renumber every recipe after it).
 * Rows placed by `fix-cookbook-origin.mjs` or already moved are left alone. Each moved
 * row records the category that moved it in `countryBy`.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isCountry } from '../src/domain/continents.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(HERE, '../src/data/cookbook.json');
const AGENT = 'WikiFoodia-data-repair/1.0 (https://wikifoodia.ajailabs.app; contact@ajailabs.app)';
const dry = process.argv.includes('--dry');
const cacheAt = process.argv.indexOf('--cache');
const cachePath = cacheAt > -1 ? process.argv[cacheAt + 1] : null;

const BOOKS = {
  fr: {
    home: 'France',
    category: /\[\[\s*Cat[ée]gorie\s*:\s*Cuisine ([^|\]]+?)\s*[|\]]/gi,
    regional: ['française', 'franc-comtoise', 'comtoise', 'alsacienne', 'provençale', 'auvergnate', 'savoyarde', 'du Sud-Ouest', 'limousine', 'normande', 'du Nord', 'de Nord', 'bretonne', 'périgourdine', 'angevine', 'corse', 'lorraine', 'bourguignonne', 'ardéchoise', 'corrézienne', 'languedocienne', 'lyonnaise', 'gasconne', 'poitevine', 'charentaise'],
    country: {
      espagnole: 'Spain', italienne: 'Italy', chinoise: 'China', belge: 'Belgium', liégeoise: 'Belgium', wallonne: 'Belgium',
      suisse: 'Switzerland', polonaise: 'Poland', grecque: 'Greece', crétoise: 'Greece', japonaise: 'Japan',
      ivoirienne: "Côte d'Ivoire", américaine: 'United States', algérienne: 'Algeria', marocaine: 'Morocco',
      allemande: 'Germany', vietnamienne: 'Vietnam', brésilienne: 'Brazil', portugaise: 'Portugal',
      thaïlandaise: 'Thailand', russe: 'Russia', tunisienne: 'Tunisia', libanaise: 'Lebanon',
      britannique: 'United Kingdom', anglaise: 'United Kingdom', québécoise: 'Canada', canadienne: 'Canada',
      tchadienne: 'Chad', turque: 'Turkey', cubaine: 'Cuba', arménienne: 'Armenia', indonésienne: 'Indonesia',
      cambodgienne: 'Cambodia', pakistanaise: 'Pakistan', togolaise: 'Togo', argentine: 'Argentina',
      mexicaine: 'Mexico', malgache: 'Madagascar', comorienne: 'Comoros', hongroise: 'Hungary', péruvienne: 'Peru',
    },
  },
  de: {
    home: 'Germany',
    category: /\[\[\s*Kategorie\s*:\s*Kochbuch\/\s*([^|\]]*?)[\s-]*K[üu]che\s*[‎]?\s*[|\]]/gi,
    regional: ['Deutsche', 'Norddeutsche', 'Schwäbische', 'Westfälische', 'Harzer', 'Hessische', 'Kölner', 'Rheinische', 'Bayerische'],
    country: {
      Italienische: 'Italy', Indische: 'India', Böhmische: 'Czech Republic', Schottische: 'United Kingdom',
      Schwedische: 'Sweden', Mexikanische: 'Mexico', Österreichische: 'Austria', Französische: 'France',
      Schweizer: 'Switzerland', Spanische: 'Spain', Griechische: 'Greece', Ungarische: 'Hungary',
      Niederländische: 'Netherlands', Gambia: 'Gambia', Polnische: 'Poland', Belgische: 'Belgium',
      Peruanische: 'Peru', Portugiesische: 'Portugal', Cajun: 'United States', Finnische: 'Finland',
      Chinesische: 'China', Chilenische: 'Chile', Slowenische: 'Slovenia', Liechtensteiner: 'Liechtenstein',
      Thailändische: 'Thailand', Türkische: 'Turkey',
    },
  },
  it: {
    home: 'Italy',
    category: /\[\[\s*Categoria\s*:\s*Ricette ([^|\]]+?)\s*[|\]]/gi,
    regional: [],
    country: {
      francesi: 'France', israeliane: 'Israel', spagnole: 'Spain', statunitensi: 'United States', giapponesi: 'Japan',
      argentine: 'Argentina', austriache: 'Austria', malesi: 'Malaysia', scozzesi: 'United Kingdom',
      tedesche: 'Germany', svizzere: 'Switzerland', messicane: 'Mexico', ungheresi: 'Hungary', inglesi: 'United Kingdom',
      russe: 'Russia', indiane: 'India', brasiliane: 'Brazil', greche: 'Greece', cinesi: 'China', moldave: 'Moldova',
      armene: 'Armenia',
    },
  },
};

const rows = JSON.parse(await readFile(SOURCE, 'utf8'));
const cache = cachePath ? JSON.parse(await readFile(cachePath, 'utf8')) : {};
const moved = [];
const tally = {};

for (const [lang, book] of Object.entries(BOOKS)) {
  const work = rows.filter(
    (row) => row.title?.startsWith(`${lang}:`) && row.rev && row.country === book.home && !row.countryFromCatalogue && !row.countryBy,
  );
  const pages = cache[lang] ?? {};
  const missing = work.filter((row) => !(row.rev in pages)).map((row) => row.rev);
  for (let i = 0; i < missing.length; i += 50) {
    const url = `https://${lang}.wikibooks.org/w/api.php?action=query&prop=revisions&revids=${missing.slice(i, i + 50).join('|')}&rvprop=ids|content&rvslots=main&format=json&formatversion=2`;
    const data = JSON.parse(await (await fetch(url, { headers: { 'User-Agent': AGENT } })).text());
    for (const page of data.query?.pages ?? []) for (const v of page.revisions ?? []) pages[v.revid] = v.slots?.main?.content ?? '';
    await new Promise((done) => setTimeout(done, 1000));
  }

  const count = (tally[lang] = { moved: 0, shared: 0, notACountry: new Set() });
  for (const row of work) {
    const named = new Set();
    const said = [];
    for (const m of (pages[row.rev] ?? '').matchAll(book.category)) {
      const adjective = m[1].trim();
      if (book.regional.includes(adjective)) named.add(book.home);
      else if (book.country[adjective]) {
        named.add(book.country[adjective]);
        said.push(m[0].replace(/^\[\[\s*/, '').replace(/\s*[|\]]$/, ''));
      }
    }
    if (named.size !== 1) {
      if (named.size > 1) count.shared++;
      continue;
    }
    const [country] = named;
    if (country === book.home) continue;
    if (!isCountry(country)) {
      count.notACountry.add(country);
      continue;
    }
    count.moved++;
    moved.push(`${lang}  ${row.name} → ${country}`);
    if (!dry) {
      row.country = country;
      row.countryBy = `Its page is filed under "${said[0]}" on ${lang} Wikibooks.`;
    }
  }
}

for (const [lang, c] of Object.entries(tally)) {
  console.log(`${lang}: ${c.moved} moved, ${c.shared} shared between countries${c.notACountry.size ? `, not a country here: ${[...c.notACountry].join(', ')}` : ''}`);
}
console.log(moved.join('\n'));
if (!dry && moved.length) {
  /* One-space indent and a closing newline: the file's own format. */
  await writeFile(SOURCE, `${JSON.stringify(rows, null, 1)}\n`, 'utf8');
  console.log(`written: ${SOURCE}`);
}
