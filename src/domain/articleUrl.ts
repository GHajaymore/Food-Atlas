/**
 * The address of the article a record was read from, rebuilt from its title.
 *
 * Every `cuisines` row carried its English Wikipedia URL and every `cookbook` row its
 * Wikibooks URL, beside the article title they were made from — measured, all 12,178 are
 * byte-for-byte what this function produces from that title. So the published files stop
 * shipping them (about 104 KB compressed off the first load, the same move
 * `compact-data.mjs` already makes for photographs) and `buildCatalogue` puts them back.
 *
 * Wikibooks titles carry the edition as a prefix — "it:Libro di cucina/Ricette/…" — which
 * is the host and not part of the page name. Pages are encoded the way MediaWiki writes
 * them: spaces become underscores, then `encodeURIComponent`, which is why a colon or a
 * slash inside a title comes out as %3A or %2F, exactly as the stored links had them.
 *
 * Shared by the compactor and the builder, so the rule that removes a link and the rule
 * that restores it cannot disagree. The compactor keeps any link this does not reproduce.
 */

export type ArticleSite = 'wikipedia' | 'wikibooks';

export function articleUrl(title: string, site: ArticleSite): string {
  const prefixed = site === 'wikibooks' ? String(title).match(/^([a-z]{2}):(.*)$/) : null;
  const lang = prefixed ? prefixed[1] : 'en';
  const page = prefixed ? prefixed[2] : String(title);
  return `https://${lang}.${site}.org/wiki/${encodeURIComponent(page.replace(/ /g, '_'))}`;
}

/** The row's own link, or the one its title implies where the published file left it out. */
export const urlOf = (row: { url?: string; title?: string }, site: ArticleSite): string =>
  row.url || (row.title ? articleUrl(row.title, site) : '');
