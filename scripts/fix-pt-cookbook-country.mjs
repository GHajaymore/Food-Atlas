/**
 * File Brazilian-written recipes from the Portuguese cookbook under Brazil.
 *
 *   node scripts/fix-pt-cookbook-country.mjs [--dry]
 *
 * ## What was wrong
 *
 * The multilingual ingest gave every recipe the country of its book, and it named the
 * Portuguese-language Wikibooks cookbook "Portugal". That book is shared by every
 * Portuguese-speaking country and is mostly written from Brazil: Acarajé, Arroz
 * carreteiro, Arroz mineiro, Barreado, Biju de tapioca and Bolo de fubá all reached the
 * atlas as Portuguese dishes, and the card said each was "from the cookbook of the
 * country the dish is from". Measured on 9 October: 243 of its 250 recipes carried the
 * book's default, not one of them from evidence.
 *
 * ## The evidence used, and why it is enough
 *
 * Brazilian and European Portuguese write a kitchen differently, and recipes are full of
 * exactly those words: a Brazilian cook measures in "xícaras" where a Portuguese one uses
 * "chávenas", buys "creme de leite" rather than "natas", squeezes "suco" rather than
 * "sumo", keeps things in the "geladeira" rather than the "frigorífico". Add the dishes
 * and regions only Brazil names — fubá, polvilho, requeijão, dendê; mineiro, caipira,
 * gaúcho, baiano — and a recipe that uses any of them was written down in Brazil.
 *
 * That is the same standard the cookbook already applied, made correct: a recipe is
 * filed where it was documented. `fix-cookbook-origin.mjs` still overrides it wherever
 * the atlas knows the dish's own origin from Wikidata, an infobox or a register.
 *
 * ## What it does not touch
 *
 * A recipe with any European marker as well (Bacalhau à Brás measured in xícaras — a
 * Portuguese dish written up in Brazil) keeps Portugal. So does every recipe with no
 * marker at all: absence of evidence moves nothing. Words shared by both — presunto,
 * bacalhau, chouriço, linguiça — are not markers. Each moved row records the words that
 * moved it, so the decision can be read back.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(HERE, '../src/data/cookbook.json');
const dry = process.argv.includes('--dry');

const BRAZIL =
  /\b(x[íi]caras?|suco|creme de leite|geladeira|abacaxi|requeij[ãa]o|aipim|fub[áa]|dend[êe]|polvilho|goiabada|catupiry|mandioquinha|brasileir[oa]s?|mineir[oa]|caipira|baian[oa]|ga[úu]ch[oa]|carioca|paulista|nordestin[oa]|capixaba|carreteiro|barreado|tapioca|acaraj[ée]|feijoada|moqueca|brigadeiro|pa[çc]oca|vatap[áa])\b/gi;
const PORTUGAL =
  /\b(ch[áa]venas?|sumo|natas|frigor[íi]fico|anan[áa]s|alentejan[oa]|transmontan[oa]|minhot[oa]|lagareiro|br[áa][sz]|algarvi[oa]|a[çc]orian[oa]|madeirense|lisboeta|tripeir[oa]|caldo verde|bifana|cataplana)\b/gi;

const rows = JSON.parse(await readFile(SOURCE, 'utf8'));
const moved = [];
let kept = 0;
for (const row of rows) {
  if (!/^pt:/.test(row.title ?? '') || row.country !== 'Portugal' || row.countryFromCatalogue) continue;
  const text = [row.name, ...(row.ingredients ?? []), ...(row.steps ?? [])].join(' ');
  const brazil = [...new Set((text.match(BRAZIL) ?? []).map((w) => w.toLowerCase()))];
  const portugal = text.match(PORTUGAL);
  if (!brazil.length || portugal) {
    kept++;
    continue;
  }
  row.country = 'Brazil';
  row.countryBy = `Written in Brazilian Portuguese: ${brazil.join(', ')}`;
  moved.push(`${row.name} (${brazil.join(', ')})`);
}

console.log(`${moved.length} moved to Brazil, ${kept} left under Portugal.`);
console.log(moved.slice(0, 20).join('\n'));
if (!dry && moved.length) {
  /* One-space indent and a closing newline: the file's own format. */
  await writeFile(SOURCE, `${JSON.stringify(rows, null, 1)}\n`, 'utf8');
  console.log(`written: ${SOURCE}`);
}
