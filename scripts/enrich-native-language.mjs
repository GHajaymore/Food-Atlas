/**
 * Read each dish in the language of the place it comes from.
 *
 *   node scripts/enrich-native-language.mjs [--dry] [--limit 300]
 *
 * Every enrichment this project has run asked English Wikipedia. That is the wrong
 * question to ask about most of the world's food, and the numbers say so: 5,807
 * imported records have no English article at all, and 3,018 more have an English
 * article too thin to describe how the dish is made — while an article about the
 * same dish exists, often a much better one, in the language of the people who cook
 * it.
 *
 * The `langlinks` pass already collected those sitelinks. It used them to decide
 * which languages the app could offer and to show the dish's name in each. This
 * reads them.
 *
 * ## Which language to ask
 *
 * The one spoken where the dish is from, first. A Ukrainian article on borscht is
 * written by people who eat borscht; the English one is written about them. Where
 * the country's language has no article, any other edition is better than none, and
 * the larger encyclopaedias are tried in turn.
 *
 * ## What is kept and what is admitted
 *
 * The prose is stored as it is written, in its own language, and `sourceLanguage` is
 * set to that language. It is not machine-translated on the way in. The app already
 * has the machinery for this — a translation layer that refuses to rename an
 * ingredient or alter a number, and a badge saying whether a human or a machine
 * produced what you are reading — and a record whose method exists honestly in
 * Ukrainian is worth more than one that exists in approximate English.
 *
 * Ingredients come from the infobox and are stored as written too. That matters more
 * here than anywhere: this is a project whose central rule is that a dish's
 * ingredients keep their own names.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CUISINES = resolve(HERE, '../src/data/cuisines.json');

const USER_AGENT = 'GlobalTaste/1.0 (food atlas native-language enrichment; contact: via repository)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const retryAfter = (res, attempt) => {
  const header = Number(res.headers.get('retry-after'));
  return Number.isFinite(header) && header > 0 ? header * 1000 + 250 : 2000 * attempt;
};

/**
 * The language spoken where a dish is from.
 *
 * Only where a country has one dominant written language for food writing. India,
 * Switzerland and Nigeria are deliberately absent: choosing one of their languages
 * would be a claim about whose food it is, which is not this script's to make.
 */
const COUNTRY_LANGUAGE = {
  Ukraine: 'uk', Russia: 'ru', Poland: 'pl', Germany: 'de', Austria: 'de', France: 'fr',
  Italy: 'it', Spain: 'es', Mexico: 'es', Argentina: 'es', Colombia: 'es', Peru: 'es',
  Chile: 'es', Venezuela: 'es', Cuba: 'es', Portugal: 'pt', Brazil: 'pt', Netherlands: 'nl',
  Belgium: 'nl', Sweden: 'sv', Norway: 'nb', Denmark: 'da', Finland: 'fi', Iceland: 'is',
  Greece: 'el', Turkey: 'tr', Israel: 'he', Iran: 'fa', Japan: 'ja', China: 'zh',
  Taiwan: 'zh', 'South Korea': 'ko', 'North Korea': 'ko', Vietnam: 'vi', Thailand: 'th',
  Indonesia: 'id', Malaysia: 'ms', Philippines: 'tl', Cambodia: 'km', Laos: 'lo',
  Myanmar: 'my', Bangladesh: 'bn', Pakistan: 'ur', Nepal: 'ne', 'Sri Lanka': 'si',
  Czechia: 'cs', 'Czech Republic': 'cs', Slovakia: 'sk', Hungary: 'hu', Romania: 'ro',
  Bulgaria: 'bg', Serbia: 'sr', Croatia: 'hr', Slovenia: 'sl', Estonia: 'et',
  Latvia: 'lv', Lithuania: 'lt', Georgia: 'ka', Armenia: 'hy', Azerbaijan: 'az',
  Kazakhstan: 'kk', Uzbekistan: 'uz', Mongolia: 'mn', Ethiopia: 'am', Egypt: 'ar',
  Morocco: 'ar', Tunisia: 'ar', Algeria: 'ar', Lebanon: 'ar', Syria: 'ar', Iraq: 'ar',
  'Saudi Arabia': 'ar', Jordan: 'ar', Yemen: 'ar', Tanzania: 'sw', Kenya: 'sw',
};

/**
 * Countries with several languages of food writing, in order of preference.
 *
 * These were left out of the map above because naming one language as *the* language
 * of a country is a claim about whose food it is. They still need answering, and the
 * first attempt at this got it badly wrong: with India absent, an Indian dish fell
 * through to the general fallback and Akki rotti was read in Indonesian, Appam in
 * Spanish and Baingan bharta in French.
 *
 * A Spanish article about a Keralan dish is precisely the "written about them rather
 * than by them" case this script exists to avoid, so any language of the place beats
 * every language that is merely large.
 */
const COUNTRY_LANGUAGES = {
  India: ['hi', 'ta', 'ml', 'te', 'kn', 'bn', 'mr', 'gu', 'pa', 'or', 'as'],
  Nigeria: ['ha', 'yo', 'ig'],
  Switzerland: ['de', 'fr', 'it'],
  Canada: ['fr'],
  Singapore: ['ms', 'zh', 'ta'],
  Malaysia: ['ms', 'zh', 'ta'],
  'South Africa': ['af', 'zu'],
  Philippines: ['tl'],
  Afghanistan: ['fa'],
  Tajikistan: ['tg', 'fa'],
  Belgium: ['nl', 'fr'],
  Spain: ['es', 'ca', 'eu', 'gl'],
  China: ['zh'],
  Ireland: ['ga'],
  Kenya: ['sw'],
  Tanzania: ['sw'],
  Cyprus: ['el', 'tr'],
  Bolivia: ['es'],
  Paraguay: ['es'],
};

/**
 * Editions to fall back on when nothing of the place is available.
 *
 * Used only after both maps above have been tried, and it is genuinely a fallback:
 * an encyclopaedia account of a dish is worth having even at second hand, so long as
 * the record says which language it came from — which `sourceLanguage` does.
 */
const FALLBACKS = ['es', 'fr', 'de', 'it', 'ru', 'ja', 'zh', 'pt', 'pl', 'nl', 'uk', 'id'];

/** The language to read a dish in, or null when none of its editions is useful. */
export function languageFor(country, available) {
  const native = COUNTRY_LANGUAGE[country];
  if (native && available.includes(native)) return native;

  const local = COUNTRY_LANGUAGES[country]?.find((code) => available.includes(code));
  if (local) return local;

  return FALLBACKS.find((code) => available.includes(code)) ?? null;
}

/** Raw wikitext of up to fifty articles from one language edition. */
async function wikitext(lang, titles, attempt = 1) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    titles: titles.join('|'),
    prop: 'revisions',
    rvprop: 'content',
    rvslots: 'main',
    redirects: '1',
  });

  try {
    const res = await fetch(`https://${lang}.wikipedia.org/w/api.php?${params}`, {
      headers: { 'User-Agent': USER_AGENT },
    });
    if (res.status === 429 || res.status >= 500) {
      if (attempt > 5) return new Map();
      await sleep(retryAfter(res, attempt));
      return wikitext(lang, titles, attempt + 1);
    }
    if (!res.ok) return new Map();

    const data = await res.json();
    const backToAsked = new Map();
    for (const r of data?.query?.redirects ?? []) backToAsked.set(r.to, r.from);
    for (const n of data?.query?.normalized ?? []) backToAsked.set(n.to, n.from);

    const out = new Map();
    for (const page of data?.query?.pages ?? []) {
      const text = page?.revisions?.[0]?.slots?.main?.content;
      if (text) out.set(backToAsked.get(page.title) ?? page.title, text);
    }
    return out;
  } catch {
    return new Map();
  }
}

/**
 * Remove wiki templates, counting braces rather than matching a pattern.
 *
 * A regex cannot do this. `{{...}}` non-greedy stops at the first closing braces,
 * which are the *inner* ones of a nested template — and an infobox is nothing but
 * nested templates. The first version of this script used the regex and produced
 * seventy-five records whose "description of the dish" was the leftover infobox
 * parameters: "| національна кухня = ... | складність = 4 | час1 = 120".
 *
 * Counting depth is a few lines and is correct for any nesting.
 */
function stripTemplates(text) {
  let out = '';
  let depth = 0;

  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '{' && text[i + 1] === '{') {
      depth += 1;
      i += 1;
    } else if (text[i] === '}' && text[i + 1] === '}' && depth > 0) {
      depth -= 1;
      i += 1;
    } else if (depth === 0) {
      out += text[i];
    }
  }
  return out;
}

/**
 * Image links, in every language at once.
 *
 * Each Wikipedia names the File namespace itself — Berkas, Ficheiro, Tập tin, Datei,
 * Файл — so a list of prefixes is a list of the editions somebody remembered. Twelve
 * records were written with "jmpl|Onde-onde biasa (kuning)" and "300px|nhỏ|phải|Bánh
 * rán" sitting at the front of their prose because Indonesian and Vietnamese were not
 * on that list.
 *
 * The file extension is the part that does not change between editions, so match on
 * that instead and delete the whole link.
 */
const IMAGE_LINK = /\[\[[^\]]*\.(?:jpe?g|png|svg|gif|webp|tiff?|ogg|ogv|webm)[^\]]*\]\]/gi;

const strip = (value) =>
  (value ?? '')
    .replace(IMAGE_LINK, '')
    // Take the text after the LAST pipe, not the first. A link with several pipes is
    // an image with parameters, and keeping everything after the first pipe is what
    // put "thumb|200px|direita|" into a Portuguese record's opening sentence.
    .replace(/\[\[([^\]]*)\]\]/g, (_, inner) => inner.split('|').pop())
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>|<ref[^>]*\/>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/'{2,}/g, '')
    // Brackets left empty by a removed template — "Хлеб 10 вон ()". Both the ASCII
    // pair and the full-width one CJK editions use, which is most of where this shows.
    .replace(/[(（]\s*[)）]/g, '')
    // Only the comma and full stop. French puts a space before ; : ! ? on purpose,
    // and "correcting" it would be this app flattening someone's language again.
    .replace(/\s+([,.])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Ingredients from an infobox, whatever the edition calls the field.
 *
 * Each Wikipedia names its own template parameters, so the English
 * `main_ingredient` is `ingrediente_principale` in Italian and `основні_інгредієнти`
 * in Ukrainian. Only the fields that mean ingredients are read.
 */
const INGREDIENT_FIELDS =
  /\|\s*(main_ingredient|ingredienti|ingrediente_principale|ingredientes|zutaten|ingrédient_principal|ingredienti_principali|основні_інгредієнти|ингредиенты|主な材料|主要食材|주재료|hoofdingrediënt|huvudingredienser|glowne_skladniki|główne_składniki)\s*=\s*([^\n|]+)/i;

function ingredientsFrom(text) {
  const match = INGREDIENT_FIELDS.exec(text ?? '');
  if (!match) return [];
  return strip(match[2])
    .split(/[,;·]| e | y | und | и | と /)
    .map((p) => p.trim())
    .filter((p) => p.length > 1 && p.length < 40)
    .slice(0, 12);
}

/**
 * The article's opening paragraphs, which is where a non-English Wikipedia most
 * often describes how a dish is made.
 *
 * Deliberately the lead rather than a "Preparation" section: section headings differ
 * per language and per article, while every edition opens by saying what the thing
 * is. Stored as prose and never promoted to numbered steps.
 */
function leadProse(text) {
  const body = stripTemplates(text ?? '').replace(
    /^\s*\[\[(File|Image|Datei|Archivo|Fichier|Файл|ファイル|图像|파일):[\s\S]*?\]\]\s*$/gim,
    '',
  );

  const upToFirstHeading = body.split(/\n=={1,}/)[0] ?? '';
  const prose = strip(upToFirstHeading);

  // A lead that still opens with a stray parameter or a citation fragment is not
  // prose. Requiring it to start like a sentence is a cheap check that the stripping
  // actually worked.
  if (prose.length < 120 || /^[|=*#:.,)\]]/.test(prose)) return '';

  // A closing bracket with nothing opening it means the stripping ate the middle of
  // a sentence. The French lead for Shirataki came through as "Les , souvent écrit en
  // hiragana )" — long enough to pass the length check, and not a sentence.
  const opens = (prose.match(/\(/g) ?? []).length;
  const closes = (prose.match(/\)/g) ?? []).length;
  if (closes > opens) return '';

  /**
   * The structural guard, and the reason it is structural.
   *
   * The first fix here listed the File-namespace aliases, missed Berkas and Tập tin,
   * and shipped 312 records with markup in their prose. The second matched `300px`
   * and missed `300x300पिक्सेल` and `300x300پ`, because Hindi and Persian write the
   * pixel width in their own scripts — as they write "thumb" as अंगूठाकार and
   * بندانگشتی. Every version of that list is a list of the editions somebody happened
   * to think of, and there are three hundred editions.
   *
   * So this matches on shape rather than vocabulary: a pipe, a bracket, a brace or a
   * bare URL is markup residue in every language, and running prose has none of them.
   * A handful of genuine leads will be refused for containing a stray bracket. No
   * account is better than an account that opens with "right|thumb|300px|".
   */
  if (/[|[\]{}]|https?:\/\//.test(prose)) return '';

  return prose.slice(0, 600);
}

async function mergeWrite(path, updates) {
  const current = JSON.parse(await readFile(path, 'utf8'));
  const byTitle = new Map(current.map((r) => [r.title, r]));
  for (const [title, patch] of updates) {
    const existing = byTitle.get(title);
    if (existing) Object.assign(existing, patch);
  }
  await writeFile(path, JSON.stringify([...byTitle.values()]), 'utf8');
}

const main = async () => {
  const dry = process.argv.includes('--dry');
  const i = process.argv.indexOf('--limit');
  const limit = i > -1 ? Number(process.argv[i + 1]) : 0;

  const rows = JSON.parse(await readFile(CUISINES, 'utf8'));
  const pending = rows.filter(
    (r) =>
      !r.prepSummary &&
      !r.nativeChecked &&
      // Already known not to be food — a taxon, a person, a restaurant chain. The
      // build drops these, so reading a Wikipedia article about each one in its own
      // language was 270 records' worth of requests spent on rows nobody will see.
      !r.notFood &&
      r.langNames &&
      Object.keys(r.langNames).length,
  );
  const targets = limit ? pending.slice(0, limit) : pending;
  process.stdout.write(`${targets.length} records with no preparation and an article elsewhere.\n`);

  // Grouped by language so each edition is asked in batches of fifty rather than
  // one request per record across eighty hosts.
  const byLanguage = new Map();
  for (const row of targets) {
    const lang = languageFor(row.country, Object.keys(row.langNames));
    if (!lang) continue;
    if (!byLanguage.has(lang)) byLanguage.set(lang, []);
    byLanguage.get(lang).push(row);
  }

  const updates = new Map();
  let gainedProse = 0;
  let gainedIngredients = 0;

  for (const [lang, group] of [...byLanguage.entries()].sort((a, b) => b[1].length - a[1].length)) {
    process.stdout.write(`\n${lang}: ${group.length} records\n`);

    for (let start = 0; start < group.length; start += 50) {
      const batch = group.slice(start, start + 50);
      const byTitle = new Map(batch.map((r) => [r.langNames[lang], r]));
      const texts = await wikitext(lang, [...byTitle.keys()]);

      for (const [title, row] of byTitle) {
        const patch = { nativeChecked: true };
        const text = texts.get(title);

        if (text) {
          const prose = leadProse(text);
          if (prose) {
            patch.prepSummary = prose;
            patch.sourceLanguage = lang;
            gainedProse += 1;
          }
          const ingredients = ingredientsFrom(text);
          if (ingredients.length && !row.ingredients?.length) {
            patch.ingredients = ingredients;
            patch.ingredientsLanguage = lang;
            gainedIngredients += 1;
          }
        }

        if (!dry) Object.assign(row, patch);
        updates.set(row.title, patch);
      }

      if (!dry) await mergeWrite(CUISINES, updates);
      process.stdout.write(`  ${start + batch.length}/${group.length} — ${gainedProse} accounts, ${gainedIngredients} ingredient lists\n`);
      await sleep(400);
    }
  }

  if (!dry) await mergeWrite(CUISINES, updates);
  process.stdout.write(
    `\n${gainedProse} records gained an account of the dish in its own language.\n` +
      `${gainedIngredients} gained ingredients, stored as written.\n`,
  );
};

main().catch((error) => {
  process.stderr.write(`\nNative-language enrichment failed: ${error.message}\n`);
  process.exitCode = 1;
});
