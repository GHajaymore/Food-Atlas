/**
 * The catalogue: the curated records plus the imported ones.
 *
 * Two tiers, deliberately kept distinct rather than blended:
 *
 *   - **Curated records** (`seed.ts`) have been through the evidence assessment. They
 *     carry a method, sources, videos, a confidence score, a dietary reading and the
 *     occasions they are eaten at.
 *   - **Imported records** (`catalogue.json`, from `scripts/ingest-wikidata.mjs`) are
 *     `unverified`. They assert that a dish exists and where it is associated with —
 *     nothing more. No score, no method, no dietary classification, no meal occasion.
 *
 * The import is what makes the atlas global; the tiering is what keeps it honest.
 * Coverage and evidence are not the same thing, and an imported record never borrows
 * the standing of a curated one just by sitting next to it.
 *
 * Rebuild the import with:
 *   node scripts/ingest-wikidata.mjs
 *   node scripts/ingest-wikidata.mjs --missing   # top up countries that timed out
 */

import { DEFAULT_THRESHOLDS, assess, type Evidence, type Thresholds } from '../domain/assess';
import { detectAtRisk } from '../domain/atRisk';
import { confirmationsFor, confirmedLocally, validationsOf, type ConfirmationIndex } from '../domain/confirmations';
import { continentOf, isCountry, registerContinents } from '../domain/continents';
import { canonicalCountry } from '../domain/countryNames';
import { dishFromInscription } from '../domain/inscription';
import { isFood } from '../domain/isDish';
import { coverageOf } from '../domain/language';
import { isPhotograph, photoOriginLine, tidyCredit, type PhotoSource } from '../domain/photoProvenance';
import { placeBelow } from '../domain/place';
import { recipeLines } from '../domain/recipeLines';
import { decodeEntities } from '../domain/text';
import { findViolations } from '../domain/invariants';
import type { BreakdownRow, Dish } from '../domain/types';
import { dishes as curated } from './seed';

/**
 * `assess` with the thresholds first.
 *
 * Only so the three call sites below can keep their evidence object as the last
 * argument. Each spans thirty lines and ends in `});`, and appending a second argument
 * to those meant editing three closing braces by hand — the kind of change that is
 * correct four times out of five.
 */
const assessWith = (t: Thresholds, e: Evidence) => assess(e, t);

/**
 * The compact shape the importer writes. Everything shared across all imported
 * records is applied here instead of being repeated 7,900 times in the JSON — that
 * difference is several megabytes of app bundle.
 */

const IMPORT_DIET_BASIS =
  'Imported from Wikidata, which does not record the preparation. No dietary classification can be made until ' +
  'the method is documented.';

/**
 * Wikipedia's parenthetical disambiguator, where it names a kind of food.
 *
 * "Momo (food)" and "Kulfi (dessert)" are titles doing Wikipedia's job of separating
 * an article from a film or a place of the same name. The parenthesis belongs to the
 * encyclopaedia's index, not to the dish — nobody calls it "momo food" — so it comes
 * off for the same reason Italy's " PAT" registry tag does.
 *
 * Only this closed list is removed. Plenty of parentheses in these names are the
 * source explaining itself — "Abacha Mmiri (Soaked Cassava Flakes)", "Aadun
 * (Nigerian Corn Flour with Palm Oil)" — and those are a gloss the reader wants,
 * not an index artefact. Stripping every bracket would delete them.
 */
const FOOD_DISAMBIGUATOR =
  /\s*\((food|dish|drink|beverage|soft drink|bread|pastry|dessert|sweet|snack|soup|sauce|cheese|wine|beer|cocktail|confectionery|candy|cake|biscuit|fruit|vegetable|spice|herb|plant|grain|cuisine)\)\s*$/i;

/**
 * The dish's own name, with the source's indexing artefacts taken off.
 *
 * Wikidata labels sometimes carry a register's tag rather than the food's name —
 * Italy's ~4,400 Prodotti Agroalimentari Tradizionali all end in " PAT". That suffix
 * belongs to the registry, not to the dish, and showing it would put a bureaucratic
 * acronym where the tradition's name should be. The Wikidata link on the record still
 * points at the registered entry, so nothing is lost by dropping it from the label.
 */
/**
 * Sentence-case a name that arrives lowercase.
 *
 * Wikidata labels common nouns in lower case — "popcorn", "pea soup", "chimichurri" —
 * and UNESCO writes its dish inside a sentence, so "ceviche" and "tea" came out of the
 * inscriptions in lower case too. 1,368 records were affected, and on a shelf beside
 * "Kozhikode Halwa" and "Neapolitan Pizza Margherita" they read as a mistake rather
 * than as a convention.
 *
 * Only the first letter, and only when it is a lower-case letter: nothing else about
 * the name is touched. "il-Ftira" becomes "Il-Ftira"; a name in a non-Latin script has
 * no case and is returned unchanged.
 */
const sentenceCase = (name: string): string =>
  /^\p{Ll}/u.test(name) ? name[0].toUpperCase() + name.slice(1) : name;

/**
 * Close a bracket the source left open.
 *
 * Seven Italian register entries reach us as "Coppa (viterbese PAT", "Lardo (di
 * Leonessa PAT", "Salsiccia al coriandolo di Monte San Biagio (fresca PAT". The labels
 * are malformed **at Wikidata** — checked against the live API rather than assumed —
 * where a bulk import appended " PAT" and lost the closing bracket. Stripping the
 * suffix then leaves "Coppa (viterbese" on the card.
 *
 * Closing it is the smaller repair. The alternative is dropping the parenthetical,
 * which would turn seven distinct registered products into "Coppa", "Lardo" and
 * "Prosciutto" — the qualifier is the part that says *which* one.
 *
 * Deliberately narrow: exactly one unmatched opener, and not a name that ends on the
 * bracket, so nothing is invented where the source merely used a bracket oddly.
 */
const closeBracket = (name: string): string => {
  const opens = (name.match(/\(/g) ?? []).length;
  const closes = (name.match(/\)/g) ?? []).length;
  return opens === closes + 1 && !name.endsWith('(') ? `${name})` : name;
};

const cleanName = (name: string): string =>
  sentenceCase(
    closeBracket(decodeEntities(name).replace(/\s+PAT$/, '').replace(FOOD_DISAMBIGUATOR, '').trim()),
  );

/**
 * The line under a dish's name, as a line rather than as a database field.
 *
 * 5,276 of these are Wikidata descriptions, which are lower-case by convention because
 * they are fragments meant to disambiguate a search result: "traditional Acadian dish",
 * "rolled dried apricots". Printed as the sentence under a heading they read as
 * unfinished, so they get the same first-letter treatment the names do.
 *
 * Two blurbs are dropped rather than tidied, because tidying cannot help them: one that
 * only repeats the dish's own name — smaženice described as "smaženice" — and one that
 * is a bare category word, which is how "Craquelin · Food" reached a card. Saying
 * nothing is better than filling the line with the reader's own question back.
 */
const GENERIC_BLURB = /^(food|foods|dish|dishes|drink|drinks|beverage|meal|recipe|cuisine)$/i;

/**
 * An article's account of a dish, with two things the strippers left behind.
 *
 * **A bare image parameter at the front.** Ten records open with the word "thumb" and
 * then Kannada — the pipe was removed by an earlier repair and the parameter beside it
 * was not, so the structural guard that refuses pipes never saw anything wrong.
 *
 * **A missing subject.** Wikipedia opens an article with the dish's name in bold, and
 * removing the bold markup took the name with it: chimichurri's account began "is
 * usually made from finely chopped flat-leaf parsley". Eight records read that way. The
 * record's own name is exactly the word the source had there, so putting it back
 * restores the sentence rather than inventing one.
 *
 * Deliberately not applied to prose starting "It is…" — 57 records do, and those are
 * ordinary sentences that read fine standing alone. Prepending a name there would
 * produce "Bauernfrühstück It is similar to…", which is worse than what it fixes.
 */
const LEADING_IMAGE_PARAM =
  /^(?:thumb|thumbnail|mini|miniatur|jmpl|left|right|center|centre|upright|border|frameless|alt)\b[\s|]+/i;

const LOST_SUBJECT = /^(is|are|was|were|refers to|consists of)\b/;

const cleanProse = (text: string, name: string): string => {
  const prose = decodeEntities(text).replace(LEADING_IMAGE_PARAM, '').replace(/\s+/g, ' ').trim();
  if (!prose) return '';
  return LOST_SUBJECT.test(prose) ? `${name.trim()} ${prose}` : prose;
};

const cleanBlurb = (blurb: string, name: string): string => {
  const text = decodeEntities(blurb).replace(/\s+/g, ' ').trim().replace(/[,;:]$/, '');
  if (!text) return '';
  if (text.toLowerCase() === name.trim().toLowerCase()) return '';
  if (GENERIC_BLURB.test(text)) return '';
  return sentenceCase(text);
};

/**
 * The lines of an ingredient list or a method, made readable.
 *
 * 320 of them arrive holding HTML entities, and in this field that is not a
 * blemish — it is the measurement. A reader met `&frac34; pounds (330 g) peeled
 * cooking apples`, `1 large (2.5&nbsp;kg / 5 lb) fresh cabbage`, and oven
 * temperatures written `180&deg;C`. The quantity is the whole point of the line, so
 * an unreadable one is worse here than anywhere else on the record.
 *
 * Entities are decoded first, then `recipeLines` decides what is a line at all —
 * dropping page furniture that became a step, and splitting a bullet list that lost
 * its newlines back into the ingredients it holds.
 */
const cleanLines = (lines: string[] | undefined): string[] =>
  recipeLines((lines ?? []).map(decodeEntities));

/** The photograph fields an enrichment pass may have written onto a source row. */
interface PhotoRow {
  photo?: string;
  credit?: string;
  licence?: string;
}

interface ImportedRow extends PhotoRow {
  id: number;
  name: string;
  country: string;
  region: string;
  continent: string;
  qid: string;
  blurb: string;
  photo: string;
  /** Present once `scripts/enrich-wikipedia.mjs` has run over the row. */
  evidence?: {
    ingredients: string[];
    heritage: string[];
    hasArticle: boolean;
    extractLength: number;
  };

  /**
   * Written by `scripts/enrich-infobox.mjs --file catalogue`.
   *
   * These 7,870 records were the emptiest part of the atlas — a name, a country and
   * a Q-number — because this pass had no way to find their articles until
   * `resolve-article-urls.mjs` filled in the URL. The fields sit at the top level
   * rather than under `evidence` because they come from the article's infobox and
   * prose, which is a different reading from the Wikidata claims `evidence` holds.
   */
  url?: string;
  infobox?: boolean;
  ingredients?: string[];
  prepSummary?: string;
  course?: string;
  atRiskEvidence?: string;
  originClaims?: string[];
  langs?: string[];
  langNames?: Record<string, string>;
  views?: number;
  notFood?: string;
  /** Set by scripts/ingest-pat-register.mjs when a regional register supplied the account. */
  patRegion?: string;
  patAttribution?: string;
  /**
   * Set by `scripts/ingest-eu-gi-register.mjs` when the EU register holds a protected
   * designation under this name. `giAttribution` is not decoration: CC BY 4.0 is the
   * licence the register is published under, and crediting it is a condition of use.
   */
  heritage?: string[];
  giReference?: string;
  giAttribution?: string;
  /**
   * From `scripts/ingest-geonames.mjs`: the levels below region, read off the code of
   * the place the region was confirmed against. Absent unless it was confirmed, so a
   * breadcrumb never claims a depth nothing checked.
   */
  province?: string;
  city?: string;
  placeConfirmed?: string;
  equipment?: string;
  sourceLanguage?: string;
}

/**
 * Readership as a display string, or empty for "we do not know".
 *
 * `scripts/ingest-pageviews.mjs` writes a number; absent and zero are different
 * states and stay different, because a record nobody looked up is a fact and a
 * record this pass never reached is not.
 */
function viewsLabel(views: number | undefined): string {
  if (typeof views !== 'number') return '';
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M readers`;
  return `${views.toLocaleString()} readers`;
}

/**
 * Force an image URL to https.
 *
 * Wikidata returns its image property over plain http, so all 3,055 photographs from
 * that source were stored as `http://commons.wikimedia.org/…` while every other source
 * stored https. It works perfectly on the dev server, which is itself http. Served
 * over https — which is every real deployment — a browser blocks an http image as
 * mixed content and renders nothing, so **thirty per cent of the atlas's photographs
 * would have been invisible in production and fine in every check made here.**
 *
 * Applied at the build rather than fixed once in the data, because the next Wikidata
 * ingest would put them straight back. Commons serves the same files over https, so
 * the rewrite costs nothing and loses nothing.
 */
const secure = (url: string): string => url.replace(/^http:\/\//i, 'https://');

/**
 * The photograph fields for an imported record.
 *
 * The line under the picture says where it came from, and the four sources are not
 * equally trustworthy. A Commons name search returns a plausible match and not a
 * confirmed one — asked for Al-Man'ouche it returned an Israeli zaatar manakeesh, a
 * related bread from a different country. An image attached to the dish's own Wikidata
 * item, or chosen by editors to head its own article, was not matched to anything.
 *
 * Every record used to carry the name-search warning, which was false for about seven
 * thousand of the ten thousand photographs — and a warning printed on everything stops
 * being read on the three thousand that need it. `photoVerified` stays false for all of
 * them: knowing a picture was attached to the right subject is not knowing it shows the
 * dish as made in the place.
 *
 * The artist and licence travel with the image because Commons files carry their own
 * terms, several of them CC BY-SA, and attribution is a condition of use rather than
 * a courtesy.
 */
function photoFields(row: PhotoRow, source: PhotoSource = 'unknown') {
  // A file that is not a photograph of the food is not a photograph. 283 records were
  // illustrated with a KDE icon, a company logo, a locator map or a scanned PDF; they
  // show the monogram now, which says no photograph is on record and is true.
  if (!row.photo || !isPhotograph(row.photo)) {
    return {
      photo: '',
      credit: '',
      creditHref: '',
      photoOrigin: 'No photograph on record',
      photoVerified: false,
    };
  }

  // Tidied for presentation, never shortened or dropped: attribution is a condition
  // of these licences, not a courtesy.
  const artist = tidyCredit(row.credit ?? '') || 'Wikimedia Commons';
  return {
    photo: secure(row.photo),
    credit: row.licence ? `${artist} · ${row.licence}` : artist,
    creditHref: secure(row.photo),
    photoOrigin: photoOriginLine(source),
    // False for every source, deliberately. Knowing a picture was attached to the
    // right subject is not knowing it shows the dish as made in the place.
    photoVerified: false,
  };
}

/**
 * A region has to be *below* the country to mean anything.
 *
 * Wikidata's administrative-territory statements sometimes point back at the country
 * itself, or at its formal name — so China arrived carrying "People's Republic of
 * China" as a region, which the atlas then presented as geographic depth it does not
 * have. An empty region is the honest answer there.
 */
const cleanRegion = (region: string, country: string): string => placeBelow(region ?? '', country);

/**
 * Regions that are not places — they are the branch of Wikipedia's category tree the
 * scraper walked to find the dish.
 *
 * The cuisine source records where it found a record in `region`, and most of the time
 * that is genuinely a place: Kerala, Sichuan, Guangdong, Java. Sometimes it is a kind of
 * food — "Category:Wagashi", "Category:Sushi", "Category:Tteok" — and those arrived as
 * the record's region and printed in its breadcrumb. A reader saw **Japan › Wagashi**,
 * and after the facet work they could click it and ask for "everything from Wagashi".
 * 125 records were affected before the count was widened by this rule.
 *
 * ## Three conditions, because the obvious one deletes real geography
 *
 * **It names a food the atlas holds.** The first version stopped here and it is not
 * safe: naming a dish after its place is the normal case in food, so this alone flags
 * Pithiviers, a French town, and Phú Quốc, a Vietnamese island.
 *
 * **Nothing else calls it a place.** A region used by any source other than the cuisine
 * tree has been corroborated by something that was not walking a category tree — which
 * is what rescues Pithiviers, and is the same instinct applied everywhere else here:
 * make the match agree with something the data already knows.
 *
 * **It groups at least two records.** A category is a grouping and therefore groups; a
 * town that happens to name one pastry does not. This is what rescues Phú Quốc, the last
 * false positive, at the price of leaving four single-record categories alone —
 * under-removal, which is the safe direction when the alternative is deleting real
 * geography.
 *
 * ## Why here rather than after the catalogue is built
 *
 * Because `assess` reads `hasRegion`. Stripping the region afterwards would leave a
 * record scored for a geographic connection it no longer shows — and this app prints the
 * six dimensions and invites the reader to add them up. A score that does not match its
 * own breakdown is the one bug this project cannot afford.
 */
function categoryRegions(rawCuisines: unknown[], everythingElse: unknown[][]): Set<string> {
  const nameOf = (row: unknown): string =>
    String((row as { name?: string; title?: string }).name ?? (row as { title?: string }).title ?? '')
      .trim()
      .toLowerCase();

  const names = new Set<string>();
  for (const rows of [rawCuisines, ...everythingElse]) for (const row of rows) names.add(nameOf(row));

  /** Regions another source vouches for. Corroboration, not a vote. */
  const corroborated = new Set<string>();
  for (const rows of everythingElse) {
    for (const row of rows) {
      const r = (row as { region?: string }).region?.trim();
      if (r) corroborated.add(r);
    }
  }

  const counts = new Map<string, number>();
  for (const row of rawCuisines as { region?: string; country?: string }[]) {
    const region = cleanRegion(row.region ?? '', canonicalCountry(row.country ?? ''));
    if (region) counts.set(region, (counts.get(region) ?? 0) + 1);
  }

  const found = new Set<string>();
  for (const [region, count] of counts) {
    if (count < 2) continue;
    if (corroborated.has(region)) continue;
    if (!names.has(region.toLowerCase())) continue;
    found.add(region);
  }
  return found;
}

function expand(row: ImportedRow, confirmations: ConfirmationIndex, t: Thresholds): Dish {
  const confirmed = confirmationsFor(confirmations, row.id);
  const country = canonicalCountry(row.country);
  const region = cleanRegion(row.region ?? '', country);
  /*
   * The levels below region come from the GeoNames pass, which reads them off the
   * code of the place it matched rather than guessing at them. Absent unless that
   * pass confirmed the region, so a breadcrumb never claims a depth nothing checked.
   */
  const province = placeBelow(row.province ?? '', country);
  const city = placeBelow(row.city ?? '', country);
  const breadcrumb = [country, region, province, city].filter(Boolean);
  const name = cleanName(row.name);

  // The infobox pass reads the article itself; `evidence` holds what Wikidata
  // claimed. Either counts, and a record enriched by the newer pass is not made to
  // look unassessed because it arrived by the other route.
  const ingredients = cleanLines(
    row.ingredients?.length ? row.ingredients : (row.evidence?.ingredients ?? []),
  );
  const prepSummary = cleanProse(row.prepSummary ?? '', name);

  // Classification is earned from the evidence gathered by the enrichment pass, not
  // assumed. Un-enriched rows have no evidence and stay Unverified with no score.
  const assessment = assessWith(t, {
    hasCountry: !!country,
    hasRegion: !!row.region,
    ingredients,
    // Two passes write heritage and neither knows about the other: `evidence` is what
    // the Wikidata read found, `heritage` is what the EU register matched onto this
    // row by name. A record may legitimately hold both.
    heritage: [...(row.evidence?.heritage ?? []), ...(row.heritage ?? [])],
    // Having read the article is itself the evidence that one exists.
    hasArticle: row.evidence?.hasArticle ?? Boolean(row.infobox && row.url),
    extractLength: row.evidence?.extractLength ?? prepSummary.length,
    hasAccount: prepSummary.length > 0,
    /*
     * The one source in the catalogue whose account is a register's own documented
     * production method. `ingest-pat-register.mjs` fills `prepSummary` from the PAT
     * sheet's `metodiche di lavorazione e conservazione` — the method the region
     * records in order to protect the product — and sets `patRegion` when it does.
     *
     * Nothing else qualifies. A Wikibooks recipe and an encyclopaedia paragraph both
     * describe a method without evidencing that it is the method of the place.
     */
    registerMethod: Boolean(row.patRegion && prepSummary),
    // The only dimensions no source can fill. Zero for every record until the
    // confirmations endpoint exists — see `domain/confirmations.ts`.
    validations: validationsOf(confirmed),
    validatedLocally: confirmedLocally(confirmed),
  });

  // Same rule as the cuisine source: a stored finding came from the article's
  // opening and history, which is where decline is actually stated.
  const risk = row.atRiskEvidence
    ? { atRisk: true, evidence: row.atRiskEvidence }
    : detectAtRisk(prepSummary);

  return {
    id: row.id,
    name,
    category: 'Unclassified',
    diet: { group: 'unclassified', kinds: [], contains: [], basis: IMPORT_DIET_BASIS },
    // Not recorded — never "probably dinner".
    meals: { occasions: [], note: '' },
    loc: { country: country, region, province, city, village: '' },
    breadcrumb,

    badgeLevel: assessment.level,
    badgeIcon: assessment.badgeIcon,
    badgeLabel: assessment.badgeLabel,
    badgeLabelFull: assessment.badgeLabelFull,
    // Never set on an import: it certifies that no modern substitution was found,
    // and nothing here has looked at the preparation.
    traditionalBadge: false,
    atRisk: risk.atRisk,
    atRiskEvidence: risk.evidence || undefined,

    blurb:
      cleanBlurb(row.blurb ?? '', name) ||
      `Recorded in the atlas as a dish of ${breadcrumb.join(' › ')}. How it is traditionally prepared has not been documented here yet.`,

    // Wikidata P18: an image somebody attached to this item, not a name match.
    ...photoFields(row, 'wikidata'),

    score: assessment.score,
    breakdown: assessment.breakdown,
    views: viewsLabel(row.views),

    readableIn: row.langs,
    localNames: row.langNames,

    prepSummary,
    // From Wikidata's "made from material". Traditional ingredients only — there is
    // no substitute list on an import, so nothing can leak between the two.
    ingredients,
    // The register lists the equipment a product is made with, which no other
    // source here does. Kept as one line because that is how it is published.
    equipment: cleanLines(row.equipment ? [row.equipment] : []),
    steps: [],
    adaptation: null,
    popular: null,
    videos: [],

    sources: [
      {
        // The source keeps the registered label, suffix and all — that is what the
        // reader would find at the other end of the link.
        title: row.name,
        publisher: 'Wikidata',
        url: `https://www.wikidata.org/wiki/${row.qid}`,
        note: row.patRegion
          ? 'Imported record. The account below comes from the regional register, not from here.'
          : 'Imported record. Place and name only — no preparation is claimed.',
      },
      // Attribution is a condition of the CC BY licence these registers carry, not a
      // courtesy, so the region is credited on the record itself rather than in a
      // note somewhere about the project.
      ...(row.patRegion
        ? [
            {
              title: `Prodotti Agroalimentari Tradizionali — ${row.patRegion}`,
              publisher: row.patAttribution ?? row.patRegion,
              url: 'https://www.dati.gov.it/',
              note:
                'The official register entry: what the product is, how it is made and kept, and the ' +
                'equipment it is made with. Published as open data by the region.',
            },
          ]
        : []),
      ...giSource(row),
    ],
    // Shown on the record, not just counted into the score.
    confirmations: confirmed.people,
    disclaimer: assessment.disclaimer,
    originClaims: originClaimsFrom(row.originClaims, row.url),
    sourceLanguage: row.sourceLanguage ?? 'en',
  };
}

/**
 * The EU register, credited on any record it gave a designation to.
 *
 * Attribution is the condition eAmbrosia is published under — CC BY 4.0, by
 * Commission Decision 2011/833/EU — so this is not a courtesy and is not optional.
 * The file reference is carried in the note because the register's own detail pages
 * are a single-page app with no linkable address per entry: quoting "PDO-FR-A0994"
 * is what actually lets a reader find the entry again.
 *
 * The designation is stated in words and never as a logo. The PDO and PGI marks are
 * EU trade marks with their own rules about who may display them, and a record here
 * is not entitled to wear one.
 */
function giSource(row: { heritage?: string[]; giReference?: string; giAttribution?: string }) {
  if (!row.heritage?.length) return [];

  return [
    {
      title: `EU register of geographical indications${row.giReference ? ` — ${row.giReference}` : ''}`,
      publisher: row.giAttribution ?? 'European Commission — eAmbrosia',
      url: 'https://ec.europa.eu/agriculture/eambrosia/geographical-indications-register/',
      note:
        'The protected name is registered against a published specification, which ties it to its place ' +
        'in law. The register records the designation, not the method — nobody here has written down how ' +
        'it is made.',
    },
  ];
}

/**
 * A dish found by walking a cuisine's Wikipedia category tree.
 *
 * These exist because Wikidata's country-of-origin is a poor census of the world's
 * food — it holds 173 Indian dishes to Wikipedia's 1,200. Every one of these has an
 * encyclopaedia article by construction, which is both why it is worth showing and
 * the only evidence it arrives with.
 */
interface CuisineRow extends PhotoRow {
  /** The Commons file the article leads with, where the lead-image pass found one.
   *  Its presence is what distinguishes a picture chosen for this article from one a
   *  name search returned. */
  leadFile?: string;
  /** A sentence from the article stating the tradition is in decline. */
  atRiskEvidence?: string;
  /** Countries the article names as origins, where it names more than one. */
  originClaims?: string[];
  /**
   * The language the account on this record was read in.
   *
   * Most were read in English; 2,253 were read in the language of the place the dish
   * comes from, because that is where the better article usually is. The field is not
   * decoration — the translation layer keys off it, and without it Hindi prose would
   * be presented as though it were the English record.
   */
  sourceLanguage?: string;
  ingredientsLanguage?: string;
  /**
   * Why Wikidata says this is not a food — "a person", "a taxon", "a restaurant".
   *
   * Set by `scripts/resolve-wikidata.mjs` from the item's `instance of` statement.
   * It catches what no rule written against a name can: the most-read record in the
   * catalogue was Yao Ming, who reached an atlas of food through a category of
   * Chinese winemakers and whose name looks exactly like a dish.
   */
  notFood?: string;
  /** Twelve-month English Wikipedia readership, once the pageviews pass has run. */
  views?: number;
  /** Other Wikipedia editions this dish has an article in, and its name in each. */
  langs?: string[];
  langNames?: Record<string, string>;
  /** From `scripts/ingest-eu-gi-register.mjs` — see the note on `ImportedRow`. */
  heritage?: string[];
  giReference?: string;
  giAttribution?: string;
  /** From `scripts/ingest-geonames.mjs` — see the note on `ImportedRow`. */
  province?: string;
  city?: string;
  placeConfirmed?: string;
  title: string;
  name: string;
  country: string;
  region: string;
  url: string;
  /** From `{{Infobox food}}`, once the enrichment pass has run. */
  ingredients?: string[];
  /** The culinary tradition it was found under — "Tamil", "Sichuan". */
  cuisine?: string;
  /**
   * The article's own account of how the dish is made, in prose.
   *
   * Deliberately not `steps`. An encyclopaedia paragraph describes how a dish is
   * generally made; presenting it as an ordered method would claim a precision the
   * source does not have, and would let an import read as a documented tradition.
   */
  prepSummary?: string;
}

/** A Wikibooks Cookbook recipe: a real method, and a country from its categories. */
interface CookbookRow extends PhotoRow {
  /** Set once the recipe-page image pass has walked this row. Where it produced the
   *  photograph, the picture is the one published on the recipe's own page. */
  pageImageChecked?: boolean;
  title: string;
  name: string;
  ingredients: string[];
  steps: string[];
  url: string;
  /** Derived from "Category:Indian recipes" and the like. */
  country?: string;
  /**
   * The cookbook this recipe was written in.
   *
   * The English Cookbook is not the only one: Italian, French, German, Spanish and
   * Portuguese Wikibooks each keep their own, and a Roman recipe written by Italians
   * is a better record than an English account of it. The method is stored in that
   * language, so the app has to say which — otherwise it presents Italian as English
   * and the translation layer never offers to translate it.
   */
  sourceLanguage?: string;
  /** A region the recipe names for itself, where the cookbook records one. */
  region?: string;
}


/**
 * The cookbook a recipe came from, and whether it is the country's own.
 *
 * This distinction did not exist while the only cookbook was English. Reading the
 * Italian, French, German, Spanish and Portuguese cookbooks made it matter, because
 * the copy written for the English one is false about the other five: the Italian
 * Cookbook's amatriciana told the reader it was "written for a general audience
 * rather than recorded in Italy", when it was written in Italian, in Italy, by
 * Italians.
 *
 * It is still a published recipe rather than a household's tradition — that is why
 * these records stay Modern Adaptation and carry no score — but "not from there" and
 * "not one family's version" are different claims, and only the second is true.
 */
const COOKBOOK_COUNTRY: Record<string, string> = {
  it: 'Italy',
  fr: 'France',
  de: 'Germany',
  es: 'Spain',
  pt: 'Portugal',
};

const COOKBOOK_LANGUAGE: Record<string, string> = {
  it: 'Italian',
  fr: 'French',
  de: 'German',
  es: 'Spanish',
  pt: 'Portuguese',
};

/** True when the recipe was published in the cookbook of the country it is from. */
function nativeCookbook(row: CookbookRow): boolean {
  const lang = row.sourceLanguage;
  return Boolean(lang && lang !== 'en' && COOKBOOK_COUNTRY[lang] === row.country);
}

function cookbookBlurb(row: CookbookRow): string {
  const lang = row.sourceLanguage;
  if (nativeCookbook(row)) {
    return `A published recipe for ${row.name}, written in ${COOKBOOK_LANGUAGE[lang!]} in the cookbook of ${row.country} — a common version rather than one household's.`;
  }
  if (lang && lang !== 'en') {
    return `A published recipe for ${row.name}, written in ${COOKBOOK_LANGUAGE[lang] ?? lang} for a general audience rather than recorded in ${row.country}.`;
  }
  return `A published recipe for ${row.name}, written for a general audience rather than recorded in ${row.country}.`;
}

function cookbookDisclaimer(row: CookbookRow): string {
  if (nativeCookbook(row)) {
    return (
      'This is a published recipe from the cookbook of the country the dish comes from. It records a common ' +
      'version, not how any one household makes it, so it is classified as a Modern Adaptation and carries no ' +
      'authenticity score — nobody from the place has confirmed it as their own.'
    );
  }
  return (
    'This is a published recipe, not a record of how the dish is prepared where it comes from. It is classified ' +
    'as a Modern Adaptation for that reason, and it carries no authenticity score — nobody from the place has ' +
    'confirmed that this is how they make it.'
  );
}

/** Match key for reconciling the same dish arriving from different sources. */
const key = (name: string, country = '') => `${name.trim().toLowerCase()}|${country.trim().toLowerCase()}`;

/**
 * Build the catalogue from the four raw sources.
 *
 * Everything above this point is a pure helper. Everything below depends on the
 * data, which is why it lives in a function now: the JSON used to be imported at the
 * top of this file, and Metro answers a static import by inlining the file into the
 * bundle. Sixteen thousand records of prose came to 24 MB of JavaScript that a
 * reader had to download and parse before the first screen could paint.
 */
export function buildCatalogue(
  rawImported: unknown[],
  rawCuisines: unknown[],
  rawCookbook: unknown[],
  rawUnesco: unknown[],
  rawGi: unknown[] = [],
  /**
   * What people have confirmed, fetched live rather than shipped. Empty until the
   * endpoint exists, which is the state every record has been in so far.
   */
  rawConfirmations: ConfirmationIndex = {},
  /**
   * The thresholds that decide what Authentic means, which an administrator can change
   * without a deploy. Defaulted, so every existing caller and all 338 tests score
   * exactly as they did — and so an atlas that cannot reach its settings never
   * silently re-badges itself.
   */
  t: Thresholds = DEFAULT_THRESHOLDS,
): { catalogue: Dish[]; stats: CatalogueStats } {
/**
 * Cookbook recipes carry a method but no place, so they cannot stand as atlas
 * records of their own — a record with no country has nowhere to sit and nothing to
 * be authentic *to*. They are far more useful reconciled onto dishes already in the
 * catalogue, where they supply the preparation those records lack.
 *
 * What they supply is explicitly *the common recipe*, not the local tradition, which
 * is why a record enriched this way is never promoted by it.
 */
const cookbookByName = new Map<string, CookbookRow>(
  (rawCookbook as CookbookRow[]).map((r) => [r.name.trim().toLowerCase(), r]),
);

const importedRows = rawImported as ImportedRow[];

// The atlas cannot group 240 countries from a six-entry literal, so the import
// supplies the continent for every country it covers.
registerContinents(importedRows.map((row) => [row.country, row.continent] as [string, string]));

/**
 * No empty dishes.
 *
 * A record whose only content is a name and a country tells the reader nothing: no
 * description, no ingredients, no documentation, not even a photograph. Listing it
 * pads the count without adding knowledge, and it is what makes the atlas feel
 * hollow. Those rows are held back until the enrichment pass finds something for
 * them — they are not deleted from `catalogue.json`, so a later run brings them in
 * rather than having to re-fetch.
 *
 * A dish is worth showing when it carries at least one of: a real description, its
 * ingredients, a heritage designation, an encyclopaedia article, or a photograph.
 */
const hasSomethingToShow = (row: ImportedRow): boolean =>
  isFood(cleanName(row.name)) &&
  (!!row.blurb?.trim() ||
    !!row.evidence?.ingredients?.length ||
    !!row.evidence?.heritage?.length ||
    !!row.evidence?.hasArticle ||
    !!row.photo);

const imported: Dish[] = importedRows.filter(hasSomethingToShow).map((row) => expand(row, rawConfirmations, t));

/**
 * Cuisine-tree records, added for the countries the structured sources under-serve.
 *
 * Ids start at 100000 so the three sources never collide. Anything already present
 * from Wikidata under the same name and country is skipped rather than duplicated —
 * the same dish arriving twice is a data bug, not two traditions.
 */
const alreadyPresent = new Set([...curated, ...imported].map((d) => key(d.name, d.loc.country)));

/* Computed once from the raw rows, before anything is scored. See `categoryRegions`. */
const treeCategories = categoryRegions(rawCuisines, [rawImported, rawCookbook, rawUnesco, rawGi]);

const fromCuisines: Dish[] = (rawCuisines as CuisineRow[])
  .filter(
    (row) =>
      row.name &&
      row.country &&
      // Wikidata's own verdict, where it has one. It outranks the name rules
      // because it is a statement about the subject rather than a reading of its
      // title, and it is the only thing that catches a person named like a dish.
      !row.notFood &&
      isFood(cleanName(row.name)) &&
      !alreadyPresent.has(key(row.name, canonicalCountry(row.country))),
  )
  .map((row, index) => {
    const name = cleanName(row.name);
    const country = canonicalCountry(row.country);
    /* The branch of the category tree this was found in is not necessarily a place the
       dish is from. See `categoryRegions`. */
    const walked = cleanRegion(row.region ?? '', country);
    const region = treeCategories.has(walked) ? '' : walked;
    /*
   * The levels below region come from the GeoNames pass, which reads them off the
   * code of the place it matched rather than guessing at them. Absent unless that
   * pass confirmed the region, so a breadcrumb never claims a depth nothing checked.
   */
  const province = placeBelow(row.province ?? '', country);
  const city = placeBelow(row.city ?? '', country);
  const breadcrumb = [country, region, province, city].filter(Boolean);

    // Its Wikipedia article is the one piece of evidence it arrives with.
    const ingredients = cleanLines(row.ingredients);
    const prepSummary = cleanProse(row.prepSummary ?? '', name);
    /**
     * Decline is stated in an article's opening and its history, not in its recipe.
     *
     * `enrich-infobox.mjs` reads those sections and stores the sentence it found.
     * This used to ignore that and re-derive the finding from `prepSummary`, which
     * is the preparation — the one section that describes how a dish is made rather
     * than whether anyone still makes it. Thirty records carried real evidence of
     * decline while the shelf showed six.
     *
     * The stored finding wins; the local scan remains for records no pass has read.
     */
    const risk = row.atRiskEvidence
      ? { atRisk: true, evidence: row.atRiskEvidence }
      : detectAtRisk(prepSummary);

    const assessment = assessWith(t, {
      hasCountry: true,
      hasRegion: !!region,
      ingredients,
      // From `ingest-eu-gi-register.mjs`. A cuisine-tree record can hold a protected
      // designation as readily as a Wikidata one — Époisses arrived by this route.
      heritage: row.heritage ?? [],
      hasArticle: true,
      // A described preparation is more of the article than a bare stub, and the
      // assessment reads length as a proxy for how much is actually documented.
      extractLength: prepSummary.length,
    });

    return {
      id: 100_000 + index,
      name: cleanName(row.name),
      category: 'Unclassified',
      // Rows ingested before the cuisine label was recorded fall back to the
      // country's own adjective, which is right for the national cuisines and
      // simply absent for the sub-national ones until they are re-walked.
      cuisine: row.cuisine || '',
      diet: {
        group: 'unclassified' as const,
        kinds: [],
        contains: [],
        basis: IMPORT_DIET_BASIS,
      },
      meals: { occasions: [], note: '' },
      loc: { country: country, region, province, city, village: '' },
      breadcrumb,

      badgeLevel: assessment.level,
      badgeIcon: assessment.badgeIcon,
      badgeLabel: assessment.badgeLabel,
      badgeLabelFull: assessment.badgeLabelFull,
      traditionalBadge: false,
      // Read from the article's own words, with the sentence kept as evidence.
      atRisk: risk.atRisk,
      atRiskEvidence: risk.evidence || undefined,

      blurb: prepSummary
        ? cleanBlurb(prepSummary.slice(0, 220), name)
        : `Recorded as a dish of ${breadcrumb.join(' › ')}. How it is traditionally prepared has not been documented here yet.`,

      // The lead image of the dish's own article where the lead-image pass found
      // one; otherwise this row's picture came from a Commons name search.
      ...photoFields(row, row.leadFile ? 'article' : 'search'),

      score: assessment.score,
      breakdown: assessment.breakdown,
      views: viewsLabel(row.views),

      readableIn: row.langs,
      localNames: row.langNames,

      prepSummary,
      ingredients,
      equipment: [],
      // Never populated from an article. Prose is a description, not a method.
      steps: [],
      adaptation: null,
      popular: null,
      videos: [],

      sources: [
        {
          title: row.name,
          publisher: 'Wikipedia',
          url: row.url,
          note: prepSummary
            ? 'The preparation below is quoted from this article, not from someone cooking it in the place.'
            : 'Found in this cuisine’s category. Place and name only — no preparation is claimed.',
        },
        ...giSource(row),
      ],
      disclaimer: assessment.disclaimer,
      // The article this record's account came from, which is often not the English
      // one: a dish is described best in the language of the people who cook it. The
      // reader is told, and the translation layer is given something true to work from.
      originClaims: originClaimsFrom(row.originClaims, row.url),
      sourceLanguage: row.sourceLanguage ?? 'en',
    } satisfies Dish;
  });

/**
 * Cookbook recipes as records in their own right.
 *
 * These carry the thing the atlas most lacked — an actual preparation, with
 * ingredients and ordered steps — and their categories place them in a country. That
 * makes them records rather than a lookup table matched by name, which reached only
 * 330 of 13,000.
 *
 * **They are Modern Adaptations, and that is not a demotion.** A Cookbook page is a
 * general-audience recipe: it documents how a dish is commonly made today, written
 * for someone anywhere, which is precisely the brief's most-published version. It
 * never becomes the authentic record by default. Holding them at `adaptation` is
 * what lets the app show the modern preparation honestly beside the traditional one
 * rather than quietly passing one off as the other — the comparison the app exists
 * to make.
 */
const fromCookbook: Dish[] = (rawCookbook as CookbookRow[])
  // The country must be a real one. Wikibooks files recipes under "Category:Easy
  // recipes" and "Category:Boiled recipes" as readily as "Category:Indian recipes",
  // so a naive read of the category made "Easy" the largest cuisine in the atlas.
  // The continent map is the whitelist: anything it cannot place is not a country.
  .filter(
    (row) =>
      row.country && row.steps?.length && continentOf(row.country) !== 'Elsewhere' && isFood(cleanName(row.name)),
  )
  .map((row, index) => ({
    id: 300_000 + index,
    name: cleanName(row.name),
    category: 'Unclassified',
    cuisine: '',
    diet: {
      group: 'unclassified' as const,
      kinds: [],
      contains: [],
      basis: 'Recorded from a published recipe, which does not state a dietary classification.',
    },
    meals: { occasions: [], note: '' },
    loc: { country: canonicalCountry(row.country!), region: row.region ?? '', province: '', city: '', village: '' },
    breadcrumb: [canonicalCountry(row.country!), row.region ?? ''].filter(Boolean),

    badgeLevel: 'adaptation' as const,
    badgeIcon: '🟠',
    badgeLabel: 'Modern Adaptation',
    badgeLabelFull: 'Modern Adaptation',
    traditionalBadge: false,
    atRisk: false,

    blurb: cookbookBlurb(row),

    // The recipe's own page where enrich-recipe-images reached it; the rest came
    // from searching Commons for the recipe's name.
    ...photoFields(row, row.pageImageChecked ? 'recipe' : 'search'),

    // Adaptations are not scored: the confidence score measures evidence that a
    // preparation is the traditional one, and this record does not make that claim.
    score: null,
    breakdown: [],
    views: '',

    prepSummary: `Published method, ${row.steps.length} steps.`,
    ingredients: cleanLines(row.ingredients),
    equipment: [],
    steps: cleanLines(row.steps),
    adaptation: null,
    popular: null,
    videos: [],

    sources: [
      {
        title: row.name,
        publisher: 'Wikibooks Cookbook',
        url: row.url,
        note: nativeCookbook(row)
          ? 'A community-written recipe, from the cookbook of the country the dish is from. It records how the dish is commonly made there, which is not the same as one household s tradition.'
          : 'A community-written recipe. It documents how the dish is commonly made, not how it is made in its own place.',
      },
    ],
    disclaimer: cookbookDisclaimer(row),
    sourceLanguage: row.sourceLanguage ?? 'en',
  }));

/**
 * What an inscription evidences, dimension by dimension.
 *
 * Named once and shared by every inscription record, so the score below it cannot
 * drift away from it. See the note at `score` for what happened when it could.
 */
const UNESCO_BREAKDOWN: BreakdownRow[] = [
  ['Geographic connection', 85],
  ['Traditional ingredients', 0],
  ['Traditional technique', 0],
  ['Local source', 80],
  ['Cultural documentation', 95],
  ['Community validation', 70],
];

const meanOf = (rows: readonly BreakdownRow[]): number =>
  Math.round(rows.reduce((sum, [, value]) => sum + value, 0) / rows.length);

/** A UNESCO Intangible Cultural Heritage inscription. */
interface UnescoRow extends PhotoRow {
  reference: string;
  name: string;
  countries: string[];
  country: string;
  list: 'representative' | 'urgent-safeguarding' | 'best-practice';
  url: string;
}

/**
 * UNESCO inscriptions — the only imported records that reach Authentic.
 *
 * Everything else imported arrives Unclassified, and correctly so: nothing in
 * Wikidata or Wikipedia evidences that a preparation is the traditional one. An ICH
 * inscription is different in kind. An intergovernmental body has documented a
 * living tradition, the community that practises it, and its transmission — which
 * is the brief's "credible documentation" and its "recognised traditional
 * preparation associated with a broader region" in one.
 *
 * They are `regional` rather than `local`: an inscription recognises a tradition
 * across a country or several, not the way one village makes it.
 *
 * The Urgent Safeguarding List is a register of traditions assessed as needing
 * urgent safeguarding — a sourced, authoritative statement of decline, and the only
 * at-risk evidence in the catalogue that did not have to be hand-written.
 */
/**
 * The dish each inscription is about, keeping only the ones that name a food.
 *
 * UNESCO titles the *practice*, so the listing for ceviche is called "Practices and
 * meanings associated with the preparation and consumption of ceviche, an expression
 * of Peruvian traditional cuisine". Used as a dish name that filled the front page
 * with paragraphs — and these are the only imported records that reach Authentic —
 * Regional, so they lead every shelf on it.
 *
 * The same pass drops the inscriptions that are not food: a livestock market, a
 * seasonal cattle drive, several saints' feasts, a fishing rite, and the preservation
 * of carillon culture, which is church bells. Each was showing as authenticated food
 * at 62/100. The official title survives as the record's source, which is what the
 * reader follows to UNESCO.
 */
const inscriptions = (rawUnesco as UnescoRow[])
  .map((row) => ({ row, dish: dishFromInscription(row.name) }))
  .filter((entry): entry is { row: UnescoRow; dish: { name: string } } => 'name' in entry.dish)
  .filter((entry) => isFood(entry.dish.name));

const fromUnesco: Dish[] = inscriptions.map(({ row, dish }, index) => {
  const urgent = row.list === 'urgent-safeguarding';
  const shared = row.countries.length > 1;

  return {
    id: 500_000 + index,
    name: cleanName(dish.name),
    category: 'Unclassified',
    cuisine: '',
    diet: {
      group: 'unclassified' as const,
      kinds: [],
      contains: [],
      basis: 'An inscription documents a practice, not a recipe, so no dietary classification can be made from it.',
    },
    meals: { occasions: [], note: '' },
    loc: { country: canonicalCountry(row.country), region: '', province: '', city: '', village: '' },
    breadcrumb: [canonicalCountry(row.country)],

    badgeLevel: 'regional' as const,
    badgeIcon: '🟢',
    badgeLabel: 'Authentic — Regional',
    badgeLabelFull: 'Authentic — Regional',
    // Not set: the inscription evidences the tradition, not the absence of modern
    // substitution in any particular preparation of it.
    traditionalBadge: false,
    atRisk: urgent,
    atRiskEvidence: urgent
      ? 'Inscribed on UNESCO’s List of Intangible Cultural Heritage in Need of Urgent Safeguarding.'
      : undefined,

    blurb: shared
      ? `Inscribed by UNESCO as intangible cultural heritage, submitted jointly by ${row.countries.join(', ')}.`
      : `Inscribed by UNESCO as intangible cultural heritage of ${row.country}.`,

    // Searched on Commons behind a plausibility guard, which narrows the wrong
    // answers without turning a search into an attribution.
    ...photoFields(row, 'search'),

    /*
     * Scored on what an inscription actually evidences. Geography and cultural
     * documentation are strong; community validation is real but institutional
     * rather than the app's own three confirmations, so it is credited partially.
     * Ingredients and technique stay at zero — an inscription names a practice, it
     * does not write down the method, and inventing one is the thing the brief
     * forbids most plainly.
     *
     * The score is the mean of those six, computed rather than written down. It was
     * written down — as 62, while the dimensions printed directly beneath it averaged
     * 55 — and a reader who added up the numbers the app showed them got a different
     * answer from the one on the card. In an atlas whose argument is that its figures
     * can be checked, that is the worst kind of small error.
     */
    score: meanOf(UNESCO_BREAKDOWN),
    // A copy per record: the array is mutable by its type, and one shared instance
    // handed to thirty-seven records is a bug waiting for the first thing that sorts it.
    breakdown: [...UNESCO_BREAKDOWN],
    views: '',

    prepSummary: '',
    ingredients: [],
    equipment: [],
    steps: [],
    adaptation: null,
    popular: null,
    videos: [],

    sources: [
      {
        title: row.name,
        publisher: 'UNESCO Intangible Cultural Heritage',
        url: row.url,
        note: `Inscription ${row.reference}${urgent ? ' — List in Need of Urgent Safeguarding' : ''}.`,
      },
    ],
    disclaimer:
      `UNESCO has inscribed this as intangible cultural heritage${shared ? `, submitted jointly by ${row.countries.join(', ')}` : ''}, ` +
      'which documents the tradition, the community that practises it and how it is passed on. What the inscription ' +
      'does not do is write down the method — so the ingredients and technique checks are still open, and nobody ' +
      'here has recorded how it is actually cooked.',
    sourceLanguage: 'en',
    // Jointly-submitted inscriptions are one tradition claimed by several countries,
    // which is what the origin model exists for rather than a reason to pick one.
    originClaims: shared
      ? row.countries.slice(0, 4).map((place) => ({
          place,
          claim: 'A submitting state on this joint inscription.',
          source: {
            title: row.name,
            publisher: 'UNESCO Intangible Cultural Heritage',
            url: row.url,
            note: `Inscription ${row.reference}.`,
          },
        }))
      : undefined,
  } satisfies Dish;
});

/**
 * A protected name from the EU register that this atlas did not already hold.
 *
 * 1,519 of them, written by `scripts/ingest-eu-gi-register.mjs`. Their value is not
 * that they are numerous — it is where they are. 98 are Chinese, and the rest of the
 * non-EU entries come from Cambodia, Cameroon, Niger, Sri Lanka, Viet Nam, Thailand,
 * Mongolia, Indonesia and São Tomé and Príncipe. Those are the places the
 * encyclopaedia sources serve worst, and a register does not require anybody to have
 * written an article first.
 */
interface GiRow {
  reference: string;
  name: string;
  alsoKnownAs?: string[];
  country: string;
  designation: string;
  designationCode: string;
  category: string;
  registered: string;
  url: string;
  attribution: string;
}

const fromGiRegister: Dish[] = (rawGi as GiRow[])
  .filter((row) => isFood(cleanName(row.name)))
  .map((row, index) => {
    const country = canonicalCountry(row.country);
    const heritage = [`${row.designation}, European Union register`];

    /*
     * Scored by the same model as everything else, rather than given a badge.
     *
     * It would be easy to write "🟢 Authentic" here on the grounds that a PDO is a
     * legal guarantee of origin, and it would be wrong: the designation says where a
     * name belongs, not that anybody has recorded how the thing is made. `assess`
     * already knows the difference — a heritage designation with no ingredients and
     * no account does not reach the top badge — so asking it is both more honest and
     * one fewer place for the rules to drift apart.
     */
    const assessment = assessWith(t, {
      hasCountry: !!country,
      hasRegion: false,
      ingredients: [],
      heritage,
      hasArticle: false,
      extractLength: 0,
      hasAccount: false,
    });

    return {
      id: 700_000 + index,
      name: cleanName(row.name),
      category: 'Unclassified',
      cuisine: '',
      diet: {
        group: 'unclassified' as const,
        kinds: [],
        contains: [],
        basis: 'A register entry protects a name, and states no dietary classification.',
      },
      meals: { occasions: [], note: '' },
      loc: { country, region: '', province: '', city: '', village: '' },
      breadcrumb: [country].filter(Boolean),

      badgeLevel: assessment.level,
      badgeIcon: assessment.badgeIcon,
      badgeLabel: assessment.badgeLabel,
      badgeLabelFull: assessment.badgeLabelFull,
      traditionalBadge: false,
      atRisk: false,

      blurb: row.category
        ? `${row.designationCode || row.designation} of ${country}. ${row.category.replace(/^Class [\d.]+\.?\s*/, '')}.`
        : `${row.designationCode || row.designation} of ${country}.`,

      photo: '',
      credit: '',
      creditHref: '',
      photoOrigin: 'No photograph has been found for this record.',
      photoVerified: false,

      score: assessment.score,
      breakdown: assessment.breakdown,
      views: '',

      prepSummary: '',
      ingredients: [],
      equipment: [],
      steps: [],
      adaptation: null,
      popular: null,
      videos: [],

      // The register's own alternative spellings, which are lawful names for the same
      // product rather than translations — "Cantal / Fourme de Cantal".
      localNames: Object.fromEntries((row.alsoKnownAs ?? []).map((n, i) => [`alt${i}`, n])),

      sources: [
        {
          title: `${row.name}${row.reference ? ` — ${row.reference}` : ''}`,
          publisher: row.attribution,
          url: row.url,
          note:
            `Registered as a ${row.designation}${row.registered ? ` on ${row.registered}` : ''}. ` +
            'The register protects the name against a published specification; it does not record a method.',
        },
      ],
      disclaimer: assessment.disclaimer,
      sourceLanguage: 'en',
    } satisfies Dish;
  });

/**
 * Reconcile Cookbook methods onto records that have none.
 *
 * The method arrives as `popular` — the most-published version — rather than as the
 * record's own steps. A community recipe documents how a dish is commonly made, not
 * how it is made where it comes from, and the brief is explicit that the
 * most-published version never becomes the authentic record by default.
 */
function withCookbookMethod(dish: Dish): Dish {
  if (dish.steps.length || dish.popular) return dish;
  const recipe = cookbookByName.get(dish.name.trim().toLowerCase());
  if (!recipe) return dish;

  return {
    ...dish,
    popular: {
      label: 'The commonly published recipe',
      source: 'Wikibooks Cookbook',
      url: recipe.url,
      level: '🟠 Modern Adaptation',
      changed: [
        'Written for a general audience rather than recorded in the place the dish comes from',
        'No source here states who prepared it, or where',
      ],
    },
  };
}

/** Held back for a later enrichment run, not lost. Surfaced in the coverage stats. */
const withheld = importedRows.length - imported.length;

/**
 * Imported records go through the same invariants as curated ones. A malformed row
 * is dropped rather than taking the whole catalogue down — one bad record from an
 * upstream source should not stop the app from opening.
 */
/**
 * A Cookbook recipe that duplicates a dish already in the atlas is folded onto that
 * record as its `popular` version instead of standing alongside it — the same dish
 * appearing twice is a data bug, not a tradition and its adaptation.
 */
const cookbookDuplicates = new Set(
  [...curated, ...imported, ...fromCuisines].map((d) => d.name.trim().toLowerCase()),
);

/**
 * The same dish, once under a country and once under something that is not one.
 *
 * Wikidata's country of origin is sometimes a region or a former state, so falafel
 * arrives twice: once from the cuisine tree as Egypt, and once from the Wikidata rows
 * as "Middle Eastern empires". The reconciliation key is name-plus-country, so the two
 * never met — and the second is not a second tradition, it is the same dish with a
 * vaguer answer to the same question.
 *
 * Only ever dropped in favour of a record that has a real country. Where a broad
 * origin is all anybody recorded, the record stays exactly as it is: sixty dishes here
 * are known only that way, and "Levant" is a fact about gefilte fish, not a defect.
 */
const placedNames = new Set(
  [...curated, ...imported, ...fromCuisines]
    .filter((d) => isCountry(d.loc.country))
    .map((d) => d.name.trim().toLowerCase()),
);

const isVaguerDuplicate = (dish: Dish): boolean =>
  !isCountry(dish.loc.country) && placedNames.has(dish.name.trim().toLowerCase());

/**
 * Cuisine-tree records lead the Wikidata rows.
 *
 * Not a judgement about origin — where the same dish is recorded in two countries both
 * records stay, both origin claims stay visible, and nothing here settles which is
 * first. It is a judgement about *documentation*: a cuisine row was read from an
 * article and carries a preparation, an infobox, ingredients and usually a photograph,
 * where the Wikidata row is a label and a Q-number.
 *
 * The ordering became visible when names were sentence-cased and "pierogi" met
 * "Pierogi": the atlas held both, and the thinner of the two — filed under China, one
 * of three claims its own article lists — was the one a lookup reached first.
 */
const validImported = [...fromCuisines, ...imported]
  .filter((d) => !isVaguerDuplicate(d))
  .map(withCookbookMethod)
  .concat(fromCookbook.filter((d) => !cookbookDuplicates.has(d.name.trim().toLowerCase())))
  // UNESCO records lead the imported tier: they are the only ones carrying evidence
  // strong enough to be classified, so they should be the first thing a reader meets.
  .concat(fromUnesco)
  // Register entries come last. They carry provenance and nothing else, so a reader
  // scanning a list should meet the documented records before the bare protected
  // names — and the duplicate guard runs against everything already assembled, since
  // a protected name the atlas holds under a different source is not a second food.
  .concat(fromGiRegister.filter((d) => !alreadyPresent.has(key(d.name, d.loc.country))))
  .filter((dish) => findViolations(dish).length === 0);

  /** Everything the app can show. Curated records first, so they lead every list. */
  const catalogue: Dish[] = [...curated, ...validImported];

  const stats: CatalogueStats = {
  total: catalogue.length,
  curated: curated.length,
  imported: validImported.length,
  /** Rows on disk with nothing to show yet, awaiting enrichment. */
  withheld,
  // Countries only. An origin recorded as a region or a former state is kept on the
  // record and is not counted as a country here — see `isCountry`.
  countries: new Set(catalogue.map((d) => d.loc.country).filter(isCountry)).size,
};

  return { catalogue, stats };
}

/** The coverage figures the atlas page reports. */
export interface CatalogueStats {
  total: number;
  curated: number;
  imported: number;
  /** Rows on disk with nothing to show yet, awaiting enrichment. */
  withheld: number;
  countries: number;
}

/**
 * A contested origin, as the correction passes record it.
 *
 * `fix-origin-country.mjs` and `resolve-wikidata.mjs` both refuse to pick a winner
 * when a dish's article names several countries of origin — baklava is claimed by
 * Turkey, Greece, Iran and the Levant, and choosing between them would be inventing
 * a finding. They store every claim instead.
 *
 * Those 118 findings were written and never shown. The app has had a display for a
 * contested origin since the first curated record, and the scripts were writing a
 * plain list of country names into a field typed for sourced claims, so the build
 * dropped them silently.
 *
 * The claim text is deliberately thin. A curated origin claim carries an argument
 * and a citation; this carries only what the article stated, and says so, because
 * the alternative is writing an argument nobody made.
 */
function originClaimsFrom(countries: string[] | undefined, articleUrl: string | undefined) {
  if (!countries || countries.length < 2) return undefined;

  return countries.map((place) => ({
    place,
    claim: `Named as a country of origin by this dish's encyclopaedia entry.`,
    source: {
      title: 'Country of origin',
      publisher: 'Wikipedia / Wikidata',
      url: articleUrl ?? '',
      note: 'Recorded as one of several claims. No source here settles which is first.',
    },
  }));
}
