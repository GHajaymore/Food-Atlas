/**
 * The hard rules, enforced.
 *
 * The handoff is explicit that these belong in the data layer, not only in the UI:
 * "Hard rules the schema encodes — enforce them in the API, not just the UI."
 *
 * There is no server yet, so this module is the boundary every dish crosses before
 * the app will show it (see `data/seed.ts`). When the pipeline described in the
 * handoff is built, the same function runs on ingest and a violation is a rejected
 * record, not a rendering bug.
 */

import { isAuthentic, SCORE_DIMENSIONS } from './authenticity';
import type { Dish } from './types';

export class AuthenticityViolation extends Error {
  constructor(dish: Pick<Dish, 'id' | 'name'>, rule: string, detail: string) {
    super(`Dish ${dish.id} (${dish.name}) violates "${rule}": ${detail}`);
    this.name = 'AuthenticityViolation';
  }
}

/**
 * Check one dish against the brief's structural rules. Returns the list of
 * violations rather than throwing, so callers can report all of them at once.
 */
export function findViolations(dish: Dish): string[] {
  const problems: string[] = [];
  const fail = (rule: string, detail: string) =>
    problems.push(new AuthenticityViolation(dish, rule, detail).message);

  // Rule 1 — Traditional Ingredient Protection. `ingredients` describes the
  // traditional preparation only; the substitute lives in `adaptation` and is
  // rendered separately and labelled. A substitute leaking into the authentic
  // ingredient list is exactly the silent customization the brief forbids.
  if (dish.adaptation) {
    const substitute = dish.adaptation.substitute.toLowerCase();
    const leaked = dish.ingredients.find((i) => substitute.includes(i.toLowerCase()) && i.length > 3);
    if (leaked) {
      fail(
        'No Silent Customization',
        `"${leaked}" appears in both the traditional ingredient list and the modern substitute. ` +
          `Substitutes must never be merged into the authentic preparation.`,
      );
    }
  }

  // Rule 2 — No Fusion in the Authentic Category. Fusion records carry no score, no
  // traditional method and no equipment; they render only their explanation and a
  // link to the tradition they derive from.
  if (dish.badgeLevel === 'fusion') {
    if (dish.score !== null) fail('No Fusion in the Authentic Category', 'fusion records are not scored');
    if (dish.steps.length) fail('No Fusion in the Authentic Category', 'fusion records carry no traditional method');
    if (dish.equipment.length)
      fail('No Fusion in the Authentic Category', 'fusion records carry no traditional equipment');
    if (!dish.fusionNote) fail('No Fusion in the Authentic Category', 'fusion records must explain the classification');
    if (dish.relatedId === undefined)
      fail(
        'No Fusion in the Authentic Category',
        'fusion records must link to the tradition they borrow from, so the reader can reach it',
      );
  } else {
    if (dish.fusionNote) fail('Classification integrity', 'only fusion records carry a fusionNote');
  }

  // Rule 3 — Authenticity vs Popularity. The two measurements stay independent.
  // A scored record must break its score down, so the number is always answerable.
  if (isAuthentic(dish.badgeLevel) || dish.badgeLevel === 'variation') {
    if (dish.score === null) fail('Authenticity Evidence', 'an authentic record must carry a confidence score');
    if (dish.breakdown.length !== SCORE_DIMENSIONS.length) {
      fail(
        'Authenticity Evidence',
        `score must break down into all ${SCORE_DIMENSIONS.length} evidence dimensions, found ${dish.breakdown.length}`,
      );
    }
    const expected = new Set<string>(SCORE_DIMENSIONS);
    for (const [label] of dish.breakdown) {
      if (!expected.has(label)) fail('Authenticity Evidence', `unknown evidence dimension "${label}"`);
    }
    // Rule 5 — where evidence is thin the app says so rather than implying certainty.
    if (!dish.disclaimer.trim())
      fail('Authenticity Disclaimer', 'every published record explains why it is considered authentic');
    if (!dish.sources.length)
      fail('Attribution', 'every published claim keeps a traceable source; this record cites none');
  }

  // Rule 4 — Local-First Video Ranking. Ranks express closeness to the tradition and
  // must be a clean 1..n; view counts play no part and are deliberately never stored.
  dish.videos.forEach((v, i) => {
    if (v.rank !== i + 1) {
      fail('Local-First Video Ranking', `videos must be ordered by locality rank 1..n, found rank ${v.rank} at ${i}`);
    }
    if (!v.role.trim()) {
      fail('Local-First Video Ranking', `video ${v.rank} must state the creator's relationship to the place`);
    }
  });

  // The 🏺 badge appears only where the platform has sufficient evidence — meaning no
  // modern substitutions were identified and the record is actually authentic.
  if (dish.traditionalBadge && !isAuthentic(dish.badgeLevel)) {
    fail('"No Changes" Badge', 'the Traditional Preparation badge belongs only to authentic records');
  }

  // Dietary classification must be checkable and must not overclaim.
  // Someone keeps halal, kosher, or a vow on the strength of this field, so a wrong
  // answer here is not cosmetic. `unclassified` is always available and always fine.
  const { diet } = dish;
  if (!diet.basis.trim()) {
    fail('Dietary classification', 'every classification records what it was read from');
  }
  if (diet.group === 'vegan' && diet.contains.length) {
    fail(
      'Dietary classification',
      `classified vegan but records animal products (${diet.contains.join(', ')}). ` +
        `A dish with dairy is vegetarian, never "vegan with a substitution".`,
    );
  }
  if ((diet.group === 'vegan' || diet.group === 'vegetarian') && diet.kinds.length) {
    fail('Dietary classification', 'a meatless dish carries no meat or seafood kind');
  }
  if ((diet.group === 'meat' || diet.group === 'seafood') && !diet.kinds.length) {
    fail('Dietary classification', `a ${diet.group} dish must say which kind, so the sub-menu can place it`);
  }

  // A challenge must carry substance. "Substance is the price of entry" is not a
  // nicety: a bare downvote cannot become a forked record, and a dispute with nothing
  // in it is indistinguishable from brigading.
  for (const dispute of dish.disputes ?? []) {
    if (!dispute.differs.trim()) {
      fail('Cultural Disputes', `dispute ${dispute.id} states no substance — what differs must be named`);
    }
    if (!dispute.from.trim()) {
      fail('Cultural Disputes', `dispute ${dispute.id} names no place — routing depends on where the challenger cooks`);
    }
    if (dispute.status === 'forked' && dispute.resultingDishId === undefined) {
      fail('Multiple Authentic Traditions', `dispute ${dispute.id} is marked forked but points at no sibling record`);
    }
  }

  // Every origin claim is sourced. The platform records claims; it does not repeat
  // assertions, and it never picks a winner between them.
  for (const claim of dish.originClaims ?? []) {
    if (!claim.source?.url?.trim()) {
      fail('Origin & Cultural Attribution', `the claim from ${claim.place} carries no source`);
    }
  }
  if (dish.originClaims && dish.originClaims.length === 1) {
    fail(
      'Origin & Cultural Attribution',
      'a single origin claim is not a dispute — record it in the disclaimer rather than as a contested origin',
    );
  }

  // Authenticity has geographic depth: the display breadcrumb must match the path.
  const locPath = [dish.loc.country, dish.loc.region, dish.loc.province, dish.loc.city, dish.loc.village].filter(
    Boolean,
  );
  if (locPath.join('›') !== dish.breadcrumb.join('›')) {
    fail('Authenticity Has Geographic Depth', `breadcrumb ${dish.breadcrumb.join(' › ')} does not match loc`);
  }

  return problems;
}

/**
 * Rules that span records rather than sitting inside one.
 *
 * A tradition can hold any number of peers — the brief's "Region A, Region B,
 * Region C, Community D" — so nothing here caps the count. What it does enforce is
 * that each peer speaks for a *different* place. Two records claiming to be how the
 * dish is made in the same town are not multiple traditions; they are one
 * disagreement that was forked when it should have been adjudicated, and leaving
 * both standing would present a genuine conflict as a settled plurality.
 */
export function findCatalogueViolations(dishes: Dish[]): string[] {
  const problems: string[] = [];
  const traditions = new Map<string, Dish[]>();

  for (const dish of dishes) {
    if (!dish.traditionId) continue;
    traditions.set(dish.traditionId, [...(traditions.get(dish.traditionId) ?? []), dish]);
  }

  for (const [traditionId, peers] of traditions) {
    const seen = new Map<string, string>();
    for (const dish of peers) {
      // The deepest recorded level is what a peer speaks for.
      const place = [dish.loc.village, dish.loc.city, dish.loc.province, dish.loc.region, dish.loc.country]
        .find(Boolean)!
        .toLowerCase();
      const taken = seen.get(place);
      if (taken) {
        problems.push(
          `Tradition "${traditionId}": ${dish.name} and ${taken} both claim ${place}. ` +
            `Peers must each speak for a different place — same-place conflicts are adjudicated, not forked.`,
        );
      }
      seen.set(place, dish.name);
    }
  }

  problems.push(...findRawMarkup(dishes));
  problems.push(...findUnaddedScores(dishes));
  problems.push(...findSelfContradictions(dishes));

  return problems;
}

/**
 * Records that contradict themselves on screen.
 *
 * The prose on a record is assembled separately from the fields it describes, so the
 * two can disagree — and when they do the reader sees both at once. This project has
 * already shipped a record printing "Nothing documents how this is made" directly
 * above 899 characters of its own method.
 *
 * Each rule below is a promise the app makes somewhere in its own comments, checked
 * against what the records actually hold rather than trusted to stay true.
 */
function findSelfContradictions(dishes: Dish[]): string[] {
  const problems: string[] = [];

  for (const dish of dishes) {
    // `atRiskEvidence` exists because "a badge without its evidence is exactly the
    // unexplained assertion this app refuses to make anywhere else".
    if (dish.atRisk && !dish.atRiskEvidence?.trim()) {
      problems.push(`${dish.name}: flagged at-risk with no sentence saying why.`);
    }

    /*
     * There is deliberately no rule here pairing 🏺 against `adaptation`.
     *
     * The type calls the badge "set only where no modern substitutions have been
     * identified", which reads as though the two cannot coexist. They can, and on four
     * of the seven curated records they do: the badge describes *this record's*
     * preparation, which uses nothing modern, while `adaptation` names what other
     * people substitute when an ingredient is unavailable — kept deliberately out of
     * `ingredients` and shown in its own disclosure, labelled as not the authentic
     * version. A rule flagging the pair would have "found" Kozhikode Halwa, Neapolitan
     * Pizza Margherita and Hákarl, and the fix would have been to delete true and
     * useful content. The comment was wrong, not the records; it now says so.
     *
     * The real constraint — the badge belongs only to authentic records — is checked in
     * `findViolations` above.
     */

    // The disclaimer for an empty record says so in as many words. If the record then
    // has a method, one of the two is lying to the reader.
    const claimsNothingRecorded = /only the name and the place are recorded|nothing documents how this is made/i;
    if (claimsNothingRecorded.test(dish.disclaimer) && (dish.steps.length > 0 || dish.prepSummary.trim())) {
      problems.push(
        `${dish.name}: says nothing is recorded about how it is made, directly above ` +
          `${dish.steps.length} steps and ${dish.prepSummary.trim().length} characters of preparation.`,
      );
    }
  }

  return problems;
}

/**
 * A score that does not equal its own breakdown.
 *
 * The confidence figure is shown directly above the six dimensions it is made of, and
 * the app's whole claim is that its numbers can be checked. A reader who adds up the
 * dimensions and divides by six should get the number printed above them — and on the
 * UNESCO records they got 55 while the card said 62, because that score was written by
 * hand and the breakdown beside it was written separately.
 *
 * Rounding is allowed a point of slack, since `assess` rounds once at the end.
 */
function findUnaddedScores(dishes: Dish[]): string[] {
  const problems: string[] = [];
  for (const dish of dishes) {
    if (dish.score === null || !dish.breakdown.length) continue;
    const mean = dish.breakdown.reduce((sum, [, value]) => sum + value, 0) / dish.breakdown.length;
    if (Math.abs(mean - dish.score) > 1) {
      problems.push(
        `${dish.name}: shows ${dish.score}/100 above a breakdown that averages ${Math.round(mean)}. ` +
          `A reader who adds these up gets a different number from the one on the card.`,
      );
    }
  }
  return problems;
}

/**
 * Wiki markup that reached a reader.
 *
 * Every account in this atlas is lifted from a wiki, so every one of them passes
 * through a stripper, and when a stripper misses a case the result is not a crash —
 * it is a record whose opening sentence reads "right|thumb|300px|" and then some
 * Hindi. 312 records shipped like that, because the File namespace is called Berkas
 * in Indonesian and Tập tin in Vietnamese and the prefix list only had the editions
 * somebody thought of.
 *
 * So the check is on the output rather than on the stripper: no reader-facing prose
 * may contain image parameters or link syntax, whatever produced them.
 */
const MARKUP_IN_PROSE = /\b\d{2,4}(x\d{2,4})?px\b|\bthumb\b\||\bjmpl\b\||\[\[|\{\{/;

function findRawMarkup(dishes: Dish[]): string[] {
  const problems: string[] = [];
  const flag = (dish: Dish, field: string, value: string) =>
    problems.push(
      `${dish.name}: ${field} still contains wiki markup — "${value.slice(0, 60)}". ` +
        `A stripper missed a case, and this is what the reader sees.`,
    );

  for (const dish of dishes) {
    for (const [field, value] of [
      ['blurb', dish.blurb],
      ['prepSummary', dish.prepSummary],
    ] as const) {
      if (value && MARKUP_IN_PROSE.test(value)) flag(dish, field, value);
    }

    // The recipe itself, which is the product. Checked separately because these are
    // lists, and because the first version of this check looked only at prose — while
    // 1,158 recipes carried "thumb|Overwhipped cream" inside their *steps*.
    for (const [field, values] of [
      ['ingredients', dish.ingredients],
      ['steps', dish.steps],
      ['equipment', dish.equipment],
    ] as const) {
      for (const value of values ?? []) {
        if (MARKUP_IN_PROSE.test(value)) flag(dish, field, value);
      }
    }
  }
  return problems;
}

/**
 * Gate a set of records. Throws on the first violating record so a bad seed or a bad
 * API response fails loudly at load rather than quietly mislabelling a tradition.
 */
export function assertDishes(dishes: Dish[]): Dish[] {
  const problems = [...dishes.flatMap(findViolations), ...findCatalogueViolations(dishes)];
  if (problems.length) {
    throw new AuthenticityViolation(
      { id: 0, name: 'catalogue' },
      'record integrity',
      `\n  - ${problems.join('\n  - ')}`,
    );
  }
  return dishes;
}
