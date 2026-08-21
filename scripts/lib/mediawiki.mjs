/**
 * The one piece of MediaWiki bookkeeping every enrichment script here gets wrong.
 *
 * A request goes through two rewrites before it becomes an answer. `normalized`
 * fixes capitalisation and underscores; `redirects` follows the redirect. Both are
 * reported in the response, and neither is optional to handle: ask for "Curry leaves"
 * with `redirects=1` and the answer is titled "Curry tree".
 *
 * A script that files the answer under the title it came back with therefore misses
 * the row that asked the question — and, because these passes mark a row as walked
 * only when they patch it, the row stays pending and is re-fetched on **every
 * subsequent run, forever**. 145 rows in the cuisine source were in that loop. It
 * reported as "still pending", which reads like work remaining rather than a bug, and
 * once fixed those rows immediately yielded 45 preparations, 35 places and 60
 * ingredient lists that had been sitting there the whole time.
 *
 * Lifted out of `enrich-infobox.mjs` when the second script needed it. Three copies of
 * a rule is how this project got five fields a script wrote and the app ignored.
 */

/**
 * Map each title MediaWiki answers with back to the titles that asked for it.
 *
 * Returns a list per answer, because one answer can belong to several askers:
 * "Rau muống", "Kangkung (vegetable)" and "Trakuon" are three records in this atlas
 * and one article on Wikipedia. MediaWiki answers all three with a single page, so
 * filing it against only the first leaves the other two unmarked — the same infinite
 * loop, one layer down.
 *
 * @param {any} data a parsed `action=query` response
 * @returns {Map<string, string[]>} answered title -> the titles that were requested
 */
export function requestedTitles(data) {
  const back = new Map();
  const add = (to, from) => back.set(to, [...(back.get(to) ?? []), from]);

  const step = (pairs) => {
    for (const { from, to } of pairs ?? []) {
      // `from` may itself be the product of an earlier rewrite, so the chain is
      // followed: "curry_leaves" -> "Curry leaves" -> "Curry tree", where only the
      // first is a key in our data.
      for (const origin of back.get(from) ?? [from]) add(to, origin);
    }
  };

  step(data?.query?.normalized);
  step(data?.query?.redirects);
  return back;
}

/**
 * Every row that asked for this page.
 *
 * The shape callers actually want: hand it the response, the page and a lookup, and
 * get back the rows to patch. Falls back to the page's own title, which is correct
 * when nothing was rewritten.
 */
export function rowsFor(data, page, lookup) {
  const asked = requestedTitles(data).get(page.title) ?? [page.title];
  return asked.map((title) => lookup(title)).filter(Boolean);
}
