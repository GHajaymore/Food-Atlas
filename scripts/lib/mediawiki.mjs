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
 * How the source data is written back, and why it is not pretty-printed.
 *
 * Every writer under `scripts/` uses `JSON.stringify(rows)` with no indent. Two
 * repair scripts written in a hurry used `null, 1` instead, and the result was that
 * whichever script ran last decided the file's format — so an ordinary enrichment run
 * produced a 400,000-line diff that was entirely whitespace and hid the twenty lines
 * that actually changed.
 *
 * Pick either, but pick one. This is the one already in use.
 */
export const writeRows = (rows) => JSON.stringify(rows);

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

/**
 * Unit symbols for the handful of measures a food article actually uses.
 *
 * Deliberately short. An unknown unit is emitted as written rather than guessed at,
 * because "39 kelvin-ish" is worse than "39 K" and both are worse than the number
 * being there at all.
 */
const UNITS = {
  c: '\u00B0C', f: '\u00B0F', k: 'K',
  kg: 'kg', g: 'g', mg: 'mg', lb: 'lb', lbs: 'lb', oz: 'oz', t: 't',
  l: 'litres', litre: 'litres', liter: 'litres', litres: 'litres', liters: 'litres',
  ml: 'ml', usgal: 'US gallons', impgal: 'imperial gallons',
  m: 'm', cm: 'cm', mm: 'mm', km: 'km', ft: 'ft', in: 'in', mi: 'mi',
  ha: 'hectares', acre: 'acres', m2: 'm\u00B2', sqft: 'sq ft',
};

/** A template's parameters, positional only — `abbr=on` and friends are formatting. */
const positional = (body) =>
  body
    .split('|')
    .slice(1)
    .map((p) => p.trim())
    .filter((p) => p && !p.includes('='));

/** `{{convert|39|C}}` -> "39 °C"; `{{convert|4000|30000|litre}}` -> "4000–30000 litres". */
const convert = (body) => {
  const parts = positional(body);
  const numbers = [];
  /*
   * A range is written {{convert|4000|-|30000|litre}} — the separator is a parameter of
   * its own. Treating it as a number because it matched a character class produced
   * "4000–-–30000", which is a worse answer than the gap it replaced.
   */
  const SEPARATOR = /^(-|\u2013|\u2014|to|and|by|x|\u00d7)$/i;
  while (parts.length && (/\d/.test(parts[0]) || SEPARATOR.test(parts[0]))) {
    const part = parts.shift();
    if (/\d/.test(part)) numbers.push(part);
  }
  if (!numbers.length) return '';
  const raw = (parts.shift() ?? '').toLowerCase();
  const unit = UNITS[raw] ?? raw;
  return `${numbers.join('\u2013')}${unit ? ` ${unit}` : ''}`;
};

/**
 * Templates that render as text, and what to keep of them.
 *
 * These were being deleted whole, which is how a method came to read "heated over a
 * wood fire to about ." — `{{convert|39|C}}` erased, taking the temperature with it —
 * and how a cheese came to be "generally known as ." with its `{{lang|it|…}}` name
 * gone. A number that carries the technique and a name that carries the identity are
 * the two things this atlas is least able to lose.
 *
 * `IPA` is dropped on purpose: a pronunciation guide is not prose, and leaving it in
 * the middle of a method reads as corruption of a different kind.
 */
const INLINE = {
  convert, cvt: convert,
  /* {{lang|it|robiola}} and {{tlit|ja|robiola}} — the text is the last parameter. */
  lang: (body) => positional(body).slice(1).join(' '),
  langx: (body) => positional(body).slice(1).join(' '),
  tlit: (body) => positional(body).slice(1).join(' '),
  transliteration: (body) => positional(body).slice(1).join(' '),
  /* {{nihongo|English name|漢字|romaji}} — the English name is what reads. */
  nihongo: (body) => positional(body)[0] ?? '',
  /* {{ill|Label|de}} — a link to an article that does not exist here yet. */
  ill: (body) => positional(body)[0] ?? '',
  interlanguage_link: (body) => positional(body)[0] ?? '',
  nowrap: (body) => positional(body).join(' '),
  nobold: (body) => positional(body).join(' '),
  small: (body) => positional(body).join(' '),
  /*
   * {{As of|2021}} opens a sentence: "As of 2021, there are seven producers." Dropped,
   * it left ", there are seven Roquefort producers" — a sentence starting on a comma.
   */
  as_of: (body) => {
    const parts = positional(body);
    const when = parts.filter((p) => /^\d{1,4}$/.test(p)).join(' ');
    return when ? (body.includes(String.fromCharCode(108, 99, 61, 121)) ? "as of " : "As of ") + when : "";
  },
  /*
   * Wikibooks writes oven temperatures as a Lua module rather than a template:
   * {{#invoke:Temperature|gm|5}} renders "Gas mark 5" — checked against the rendered
   * page rather than assumed. Deleted, it left "Preheat an oven to ."
   */
  "#invoke:temperature": (body) => {
    const parts = positional(body);
    const mode = (parts[0] ?? "").toLowerCase();
    const value = parts[1] ?? "";
    if (!value) return "";
    if (mode === "gm") return "Gas mark " + value;
    if (mode === "c") return value + " °C";
    if (mode === "f") return value + " °F";
    return value;
  },
  /*
   * The Spanish cookbook names an ingredient and a utensil with templates of its own:
   * {{ing|Agua}} and {{ute|almirez}}. Deleted, a step read "Machacamos el ajo en un ,
   * con la sal" — the mortar gone from the instruction to use it. The label is the last
   * positional parameter, the same shape ingest-cookbooks-multilingual already assumed
   * for {{ing}}.
   */
  /* {{rec|Conejo al ajillo}} links one Spanish recipe to another; the label reads. */
  rec: (body) => positional(body).pop() ?? "",
  ute: (body) => positional(body).pop() ?? "",
  ing: (body) => positional(body).pop() ?? "",
  i: (body) => positional(body).pop() ?? "",
  ipa: () => '',
};

/**
 * Render the templates that carry words, so that stripping the rest loses nothing.
 *
 * Innermost-first, repeatedly, so `{{nowrap|{{convert|39|C}}}}` resolves rather than
 * being matched from the wrong brace. Bounded, because a malformed article should cost
 * a few wasted passes and not the whole run.
 */
export function renderInlineTemplates(text) {
  let out = text;
  for (let pass = 0; pass < 6; pass += 1) {
    const next = out.replace(/\{\{([^{}]*)\}\}/g, (whole, body) => {
      const name = body.split('|')[0].trim().toLowerCase().replace(/\s+/g, '_');
      const render = INLINE[name];
      return render ? render(body) : whole;
    });
    if (next === out) return out;
    out = next;
  }
  return out;
}

/**
 * Remove the templates that are left, counting braces rather than trusting a regex.
 *
 * The old rule was /{{[^}]*}}/g, which cannot see a template inside a template:
 * given {{Refimprove section|date={{CURRENTMONTH}}}} it matches to the first "}}" and
 * leaves a bare "}}" behind. That mattered more than it sounds, because the prose is
 * then checked for stray brackets and thrown away whole if it has any — so one nested
 * template anywhere in a preparation section cost the record its entire method.
 * Parmesan was one: a full production section, discarded, and the record showed no
 * method at all rather than a damaged one.
 *
 * Runs after renderInlineTemplates, so what it deletes is citations and maintenance
 * banners — things with no words a reader wants.
 */
export function stripTemplates(text) {
  let out = "";
  let depth = 0;
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === "{" && text[i + 1] === "{") { depth += 1; i += 1; continue; }
    if (text[i] === "}" && text[i + 1] === "}" && depth > 0) { depth -= 1; i += 1; continue; }
    if (depth === 0) out += text[i];
  }
  return out;
}
/**
 * Remove image links whole, counting brackets, captions and all.
 *
 * A caption is prose and routinely contains links of its own:
 *
  *   [[File:Vats.png|thumb|Copper-lined vats for making [[Parmigiano]]]]
 *
 * The old rule matched [[ up to the first ]] with a negated class, so it stopped
 * inside the caption and left a trailing "]]" and a pipe. Prose is then rejected if it
 * holds a stray bracket — so an article with one illustrated step lost its whole
 * method. Parmesan lost a 3,277-character production section to a single vat photo.
 *
 * Only image links. An ordinary [[wikilink]] keeps its text and is unwrapped later.
 */
export function stripImageLinks(text) {
  const IMAGE = /^(file|image|\u0623|\u56fe):|\.(jpe?g|png|svg|gif|webp)\b/i;
  let out = "";
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === "[" && text[i + 1] === "[") {
      let depth = 0;
      let j = i;
      for (; j < text.length; j += 1) {
        if (text[j] === "[" && text[j + 1] === "[") { depth += 1; j += 1; continue; }
        if (text[j] === "]" && text[j + 1] === "]") { depth -= 1; j += 1; if (!depth) break; }
      }
      if (depth === 0 && j < text.length) {
        const inner = text.slice(i + 2, j - 1);
        if (IMAGE.test(inner.trim())) { i = j; continue; }
      }
    }
    out += text[i];
  }
  return out;
}
/**
 * Prose that lost a value where a template used to be.
 *
 * Two shapes. A space before a comma or full stop is the obvious one. The second is
 * a preposition standing immediately before the punctuation — "Preheat an oven to." —
 * which happens once something collapses the space, and which is worse precisely
 * because it reads as a finished sentence. An ellipsis is neither.
 */
export const VALUE_DROPPED =
  /\s[,.](?!\.)|\b(?:to|at|of|for|about|between|approximately|around|than|until|with|reaches|reaching)[,.](?!\.)/i;