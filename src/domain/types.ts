/**
 * The Provenance data model.
 *
 * The shape comes from the handoff's "Data model" section. The comments record the
 * rules the brief attaches to each field — see `invariants.ts`, which enforces them,
 * and `authenticity.ts`, which classifies against them.
 */

import type { Diet } from './diet';
import type { Meals } from './meals';

/**
 * The authenticity classification. Only `local`, `regional` and `variation` qualify
 * for the primary Authentic Food discovery experience (source brief, "Authenticity
 * Levels"); `fusion` is never a version of the tradition it borrows from.
 */
export type Level = 'local' | 'regional' | 'variation' | 'adaptation' | 'fusion' | 'unverified';

/** The five geographic levels, coarse to fine. Authenticity has geographic depth. */
export type LevelKey = 'country' | 'region' | 'province' | 'city' | 'village';

/** A precise place path. Empty string where a level does not apply to the dish. */
export interface Loc {
  country: string;
  region: string;
  province: string;
  city: string;
  village: string;
}

/** One of the six evidence dimensions behind the confidence score. */
export type BreakdownRow = readonly [label: string, value: number];

/**
 * A traditional ingredient and the substitute people commonly reach for when it is
 * unavailable. The substitute NEVER enters `Dish.ingredients` — it is rendered in
 * its own disclosure, labelled as an adaptation. ("No Silent Customization".)
 */
export interface Adaptation {
  traditional: string;
  substitute: string;
}

/**
 * The most-published version found online. Classified separately, and by default as
 * an adaptation — it never becomes the authentic record.
 */
export interface PopularVersion {
  label: string;
  source: string;
  url: string;
  /** Display string carrying its own classification glyph, e.g. '🟠 Modern Adaptation'. */
  level: string;
  /** The specific ways it departs from the tradition. */
  changed: string[];
}

/**
 * A video, ranked by how close the cook is to the tradition — never by views.
 * `rank` 1 is the closest. See `VIDEO_LOCALITY_ORDER` in `authenticity.ts`.
 */
export interface Video {
  rank: number;
  creator: string;
  /** The creator's relationship to the place — the reason for the rank. */
  role: string;
  /** Provider id only. We store metadata and play at source; we never host or proxy. */
  id: string;
  short: boolean;
  /** Only when the creator actually published one. We do not invent it. */
  ingredients?: string[];
  ingredientsSource?: string;
  /**
   * The language actually spoken in the video, BCP-47. Recorded where known — it is
   * what lets the app tell the viewer honestly what a translation would be doing.
   */
  languageCode?: string;
  /**
   * Alternate audio tracks the creator published, BCP-47. Curated, never guessed:
   * the app only claims a creator-voiced translation where one actually exists.
   */
  audioTracks?: string[];
}

/**
 * A translation of one record's prose.
 *
 * What is translated: the blurb, the prep summary, the numbered method, the
 * adaptation note and the authenticity disclaimer.
 *
 * What is NEVER translated: the dish name, the traditional ingredient names and the
 * equipment names. Those carry the identity of the food — "nendran banana",
 * "chilhuacle negro", "khökhüür", "metate" — and rendering them as a generic
 * equivalent is exactly the flattening the brief forbids. Where a reader needs help,
 * `glossary` adds a gloss ALONGSIDE the original term, never in place of it.
 */
export interface DishTranslation {
  /** BCP-47 code this translation is in. */
  code: string;
  blurb: string;
  prepSummary: string;
  steps: string[];
  adaptation: Adaptation | null;
  disclaimer: string;
  /**
   * Optional plain-language gloss for preserved terms, keyed by the original term.
   * Rendered next to the original, never instead of it.
   */
  glossary?: Record<string, string>;
  /** Who produced it — a named person or organisation, or the machine that did. */
  translator: string;
  /**
   * True when no human checked this text. Machine translations are always labelled
   * as such in the UI, and the original stays one tap away.
   */
  machine: boolean;
}

/** Documentation the traditional method was taken from. Every claim stays traceable. */
export interface Source {
  title: string;
  publisher: string;
  url: string;
  note: string;
}

/**
 * What kind of disagreement was raised. The three resolve differently, which is why
 * the app asks rather than lumping them together as "disputes":
 *
 *   - `correction` — the record is simply wrong. One right answer. Amend it.
 *   - `variation`  — both accounts are true, in different places. Fork the record.
 *   - `origin`     — who the dish belongs to. Never forked, never settled by count.
 */
export type DisputeKind = 'correction' | 'variation' | 'origin';

export interface Dispute {
  id: string;
  /** Where the challenger cooks or lives. The routing turns on this. */
  from: string;
  kind: DisputeKind;
  /**
   * What specifically differs — an ingredient, a technique, a proportion. Substance
   * is the price of raising a challenge: there is no bare disagreement, and this text
   * becomes the raw material of the forked record.
   */
  differs: string;
  /** ISO date. */
  raisedAt: string;
  /** `kept` means both accounts stand and neither was declared the true one. */
  status: 'open' | 'forked' | 'amended' | 'kept';
  /** The sibling record a fork produced. */
  resultingDishId?: number;
}

/** One documented claim on a contested origin. Neutral language, always sourced. */
export interface OriginClaim {
  place: string;
  claim: string;
  source: Source;
}

export interface Dish {
  id: number;
  name: string;
  /** Sweet | Sauce | Bread & baked | Cured & fermented | Fermented drink | … */
  category: string;
  /**
   * The culinary tradition a dish belongs to — "Tamil", "Sichuan", "Levantine".
   *
   * Deliberately separate from `loc.country`, because a cuisine is not a country:
   * Tamil, Sichuan, Cantonese and Punjabi sit inside one, and Levantine and Kurdish
   * span several. Collapsing the two would erase exactly the distinctions this atlas
   * exists to record. Empty where the record's tradition is not established.
   */
  cuisine?: string;
  /**
   * Dietary classification, read from the whole traditional preparation — method
   * included, not just the ingredient list. Narrows what a reader is shown; never
   * a licence to substitute an ingredient so a dish fits a preference.
   */
  diet: Diet;
  /**
   * When the dish is eaten, in its own place — not mapped onto a foreign meal
   * timetable. Empty occasions mean it has not been recorded, never "probably dinner".
   */
  meals: Meals;
  loc: Loc;
  /** Display path, coarse to fine. */
  breadcrumb: string[];

  badgeLevel: Level;
  badgeLabel: string;
  badgeLabelFull: string;
  /** 🟢 🟡 🟠 🔴 ⚪ — classification colour is carried by the glyph only. */
  badgeIcon: string;
  /** 🏺 — set only where no modern substitutions have been identified. */
  traditionalBadge: boolean;
  /** 🕯️ — the tradition is at risk of being lost. */
  atRisk: boolean;

  blurb: string;
  photo: string;
  credit: string;
  creditHref: string;
  /** Where the photograph itself was taken, or that the source does not record it. */
  photoOrigin: string;
  photoVerified: boolean;

  /** Evidence strength, 0-100. `null` for fusion — fusion is not scored. */
  score: number | null;
  breakdown: BreakdownRow[];
  /**
   * Popularity. Deliberately a display string, and deliberately a separate field
   * from `score`: the two are never combined into one ranking.
   */
  views: string;

  prepSummary: string;
  /** Traditional only. Never contains a substitute. */
  ingredients: string[];
  /** Traditional only. Not converted to modern appliances. */
  equipment: string[];
  /** The traditional method, with real durations and hand techniques preserved. */
  steps: string[];

  adaptation: Adaptation | null;
  popular: PopularVersion | null;
  videos: Video[];
  sources: Source[];
  /** Why this is considered authentic. Says so plainly where evidence is weak. */
  disclaimer: string;

  /**
   * The language the record's prose was written in, BCP-47. Every record states it,
   * so a reader always knows whether they are reading an original or a translation.
   */
  sourceLanguage: string;
  /**
   * Translations, keyed by BCP-47 code. A missing key is not an error — the app says
   * no translation has been recorded yet, in the same voice it uses for missing
   * records, rather than machine-translating behind the reader's back.
   */
  translations?: Record<string, DishTranslation>;

  /**
   * Groups sibling records that are the same dish as made in different places or by
   * different communities. Records sharing a `traditionId` are peers: none of them is
   * the canonical one, which is the whole point of "Multiple Authentic Traditions".
   */
  traditionId?: string;
  /** Open or resolved challenges to this record. */
  disputes?: Dispute[];
  /**
   * Competing documented claims about where the dish originates. Present only on
   * dishes whose origin is genuinely contested — and deliberately separate from the
   * authenticity score, which is about how a dish is prepared in a place, not who
   * invented it.
   */
  originClaims?: OriginClaim[];

  /** Fusion records only. */
  fusionNote?: string;
  /** The authentic tradition a fusion record borrows from. */
  relatedId?: number;
}

/** The authenticity chip row on the Feed. */
export type FilterKey = 'authentic' | 'variation' | 'adaptation' | 'fusion' | 'unverified' | 'all';

/** Search result ordering. Popularity is offered, but is never the default. */
export type SortKey = 'authenticity' | 'popularity' | 'atrisk';

/** One step of the geographic drill-down. */
export interface PathStep {
  level: LevelKey;
  value: string;
}
