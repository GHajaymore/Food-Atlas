/**
 * Put back the words Wikipedia passages lost inside language templates.
 *
 *   node scripts/repair-prose-templates.mjs [--write]
 *
 * ## What was wrong
 *
 * Passages read from Wikipedia before `renderInlineTemplates` learned the language
 * templates kept the sentence and lost the word: "The used in is a type of shaobing"
 * was "The {{Transliteration|zh|mo}} used in {{Transliteration|zh|paomo}} is…"; Tereré's
 * water was "poured over the held in the and extracted from the" — yerba, guampa, yerba.
 * Found on 9 October when Yang rou pao mo rotated onto the front page.
 *
 * ## The repair
 *
 * The exact revision each row records is fetched and rendered to plain text with the
 * shared `renderInlineTemplates` (the code a fresh import uses). Then each damaged
 * sentence — and only a damaged one — is swapped for the article sentence that keeps
 * every word and number of it, in order, and adds at most eight: the cookbook repairs'
 * rule. Nothing else in the passage moves. A sentence with no such partner is left.
 *
 * Text in another script (Korean, Tamil, Russian) is not touched: the pattern that finds
 * a gap is English, and an English rule reading Korean would find gaps that are not.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { renderInlineTemplates, stripImageLinks, stripTemplates } from './lib/mediawiki.mjs';

const AGENT = 'WikiFoodia-data-repair/1.0 (https://wikifoodia.ajailabs.app; contact@ajailabs.app)';
const write = process.argv.includes('--write');

/** An article noun missing between two function words, or a list with an empty slot. */
const GAP = /\b(?:The|the) (?:is|are|was|of|used in|and|with)\b(?! as\b)|\bwith (?:of|and) |,,|\bbetween a and\b|\bis called in\b|\bvarieties of are\b|\bover the held\b|\bin the and\b|\bfrom the with\b/;
const LATIN = /^[\p{Script=Latin}\p{N}\p{P}\p{Zs}\p{S}]*$/u;

/*
 * Links are unwrapped before templates are rendered, not after: a link inside a language
 * template — {{lang|bn-Latn|[[Fried eggplant#South Asia|begun bhaja]]}} — carries its own
 * pipe, and splitting the template on it printed "Fried eggplant#South Asia begun bhaja".
 * Headings become sentence breaks, or "==Production==" leads the sentence after it.
 */
const plain = (wikitext) =>
  stripTemplates(
    renderInlineTemplates(
      stripImageLinks(wikitext)
        .replace(/<ref[^>]*\/>|<ref[^>]*>[\s\S]*?<\/ref>/g, '')
        .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1'),
    ),
  )
    .replace(/^\s*=+[^=\n]+=+\s*$/gm, '. ')
    .replace(/\[https?:\/\/\S+\s([^\]]+)\]/g, '$1')
    .replace(/'{2,}/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ');

const sentences = (text) => text.split(/(?<=[.!?])\s+/);
const words = (s) => s.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
const onlyAdds = (old, fresh) => {
  const have = words(fresh);
  let at = 0;
  for (const w of words(old).filter((x) => x.length > 1 || /\d/.test(x))) {
    while (at < have.length && have[at] !== w) at++;
    if (at === have.length) return false;
    at++;
  }
  return true;
};

let mended = 0;
for (const file of ['cuisines', 'catalogue']) {
  const path = `src/data/${file}.json`;
  const rows = JSON.parse(await readFile(path, 'utf8'));
  const broken = rows.filter((r) => typeof r.prepSummary === 'string' && r.rev && LATIN.test(r.prepSummary) && GAP.test(r.prepSummary));
  for (const row of broken) {
    const data = await (await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=revisions&revids=${row.rev}&rvprop=content&rvslots=main&format=json&formatversion=2`, { headers: { 'User-Agent': AGENT } })).json();
    await new Promise((d) => setTimeout(d, 700));
    const text = data.query?.pages?.[0]?.revisions?.[0]?.slots?.main?.content;
    if (!text) { console.log(`  no revision   ${row.name}`); continue; }
    const pool = sentences(plain(text));
    let changed = false;
    const next = sentences(row.prepSummary).map((s) => {
      /* Five words at least, so a match is evidence. Bai pong moan's passage is from
         Indonesian Wikipedia, and a revision id belongs to one wiki — four words of it
         ("(,, lit.") matched an English sentence by accident. */
      if (!GAP.test(s) || words(s).length < 5) return s;
      const partner = pool.find((p) => {
        const gained = words(p).length - words(s).length;
        // No markup, no heading marks, and no empty list slot left over.
        return gained > 0 && gained <= 8 && !/[{}|[\]=#]/.test(p) && !/,\s*,|\(\s*,/.test(p) && onlyAdds(s, p);
      });
      if (!partner) return s;
      changed = true;
      console.log(`  ${row.name}\n    was: ${s}\n    now: ${partner.trim()}`);
      return partner.trim();
    });
    if (changed) { row.prepSummary = next.join(' '); mended++; }
    else console.log(`  left          ${row.name}: ${row.prepSummary.match(GAP)[0]}`);
  }
  if (write) await writeFile(path, `${JSON.stringify(rows, null, 1)}\n`, 'utf8');
}
console.log(`${mended} passages mended${write ? '' : ' (report only — --write to apply)'}.`);
