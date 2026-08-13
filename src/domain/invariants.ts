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
 * Gate a set of records. Throws on the first violating record so a bad seed or a bad
 * API response fails loudly at load rather than quietly mislabelling a tradition.
 */
export function assertDishes(dishes: Dish[]): Dish[] {
  const problems = dishes.flatMap(findViolations);
  if (problems.length) {
    throw new AuthenticityViolation(
      { id: 0, name: 'catalogue' },
      'record integrity',
      `\n  - ${problems.join('\n  - ')}`,
    );
  }
  return dishes;
}
