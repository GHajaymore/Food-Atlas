/**
 * Other dishes worth reading after this one.
 *
 * The cheapest rich content available to this project, because it is entirely made of
 * facts already on the records. A record page ended at its own sources; a reference work
 * ends by pointing somewhere, and the pointing is what makes eighteen thousand separate
 * pages into an atlas.
 *
 * Distinct from `siblingsOf` in `traditions.ts`, which is a much stronger claim: those
 * records share an explicit `traditionId` set by a person, meaning *this is the same
 * dish, recorded twice*. This file makes no such claim. It says these two records have
 * something in common, and always says what.
 *
 * ## Every suggestion carries its reason
 *
 * A list headed "related" with no explanation is a recommendation, and a recommendation
 * is a judgement this app has no basis for. "Also from Kerala" and "also uses ghee" are
 * facts a reader can check against both records in a second. That is the same rule the
 * badges follow, applied to navigation — and it is why `reason` is required rather than
 * optional.
 *
 * ## The weights are ordered by how much they narrow, not by importance
 *
 * A region is a stronger signal than a country because far fewer records share one:
 * 1,190 dishes are from India and eleven are from Kerala, so "also from Kerala" tells a
 * reader something and "also from India" barely does. Nothing here is a claim about
 * which dishes are *better* related — only about which coincidences are least likely.
 */

import type { Copy } from '../i18n/copy';
import type { Dish } from './types';

export interface Related {
  dish: Dish;
  /** Why this appeared. Shown, never omitted — see the header. */
  reason: string;
}

/** How many to offer. Enough to be useful, few enough to stay a suggestion. */
export const RELATED_LIMIT = 8;

interface Signal {
  weight: number;
  reason: string;
}

/**
 * What two records have in common, strongest first.
 *
 * Returns every match rather than the first, so the *reason* shown is the strongest one
 * rather than whichever happened to be tested earliest.
 */
function signals(copy: Copy, dish: Dish, other: Dish): Signal[] {
  const found: Signal[] = [];

  const region = dish.loc.region?.trim();
  if (region && other.loc.region?.trim() === region) {
    found.push({ weight: 6, reason: copy.relatedAlsoFrom.replace('{place}', region) });
  }

  if (dish.cuisine && other.cuisine === dish.cuisine) {
    found.push({ weight: 5, reason: copy.relatedAlsoCuisine.replace('{cuisine}', dish.cuisine) });
  }

  /*
   * Ingredients, matched case-insensitively but reported as the other record writes it.
   *
   * The atlas's rule is that an ingredient keeps its own name, so "Ghee" and "ghee" are
   * the same thing to match on and neither is rewritten to look like the other.
   */
  const mine = new Set(dish.ingredients.map((i) => i.toLowerCase()));
  const shared = other.ingredients.filter((i) => mine.has(i.toLowerCase()));
  if (shared.length) {
    found.push({
      weight: 3 + Math.min(shared.length, 3),
      reason:
        shared.length > 1
          ? copy.relatedSharesIngredients.replace('{n}', String(shared.length))
          : copy.relatedAlsoUses.replace('{ingredient}', shared[0]),
    });
  }

  if (dish.category && other.category === dish.category && dish.category !== 'Unclassified') {
    found.push({ weight: 2, reason: copy.relatedAlsoCategory.replace('{category}', dish.category.toLowerCase()) });
  }

  const country = dish.loc.country?.trim();
  if (country && other.loc.country?.trim() === country) {
    found.push({ weight: 1, reason: copy.relatedAlsoFrom.replace('{place}', country) });
  }

  return found.sort((a, b) => b.weight - a.weight);
}

/**
 * Dishes related to this one, best first.
 *
 * Ties break on evidence: where two records are equally related, the better-documented
 * one goes first. That is the same ordering the rest of the app uses, and it means a
 * reader following a suggestion is more likely to land somewhere with something on it —
 * which matters when 10,197 records have no method recorded.
 */
export function relatedTo(copy: Copy, dish: Dish, all: Dish[], limit = RELATED_LIMIT): Related[] {
  const scored: { dish: Dish; score: number; reason: string }[] = [];

  for (const other of all) {
    if (other.id === dish.id) continue;

    const matches = signals(copy, dish, other);
    if (!matches.length) continue;

    /*
     * Summed, so a record matching on three counts outranks one matching on the
     * strongest alone — two dishes from the same region that also share an ingredient
     * really are more related than two that only share the region.
     */
    scored.push({
      dish: other,
      score: matches.reduce((sum, m) => sum + m.weight, 0),
      reason: matches[0].reason,
    });
  }

  return scored
    .sort((a, b) => b.score - a.score || (b.dish.score ?? -1) - (a.dish.score ?? -1))
    .slice(0, limit)
    .map(({ dish: d, reason }) => ({ dish: d, reason }));
}

/**
 * The same dish, recorded under another country.
 *
 * The atlas holds 122 names under more than one country: pakora under India and Pakistan,
 * gulab jamun under both, pholourie under India and Guyana, kabsa under India and Yemen.
 * The first reading of that was "duplicates to merge", and it is wrong. Only six of the
 * 122 share a photograph or a source with their twin — the rest have nothing in common to
 * prove they are one record, and the sample above is not a list of mistakes. It is
 * diaspora and neighbours: a dish two food cultures genuinely make, which is the thing an
 * atlas of the world's food should be able to hold.
 *
 * So neither record is deleted and neither is corrected. What was actually wrong is that
 * each one silently asserted a single country while the atlas quietly held another answer
 * on the next page. This surfaces that, and lets a reader go and look.
 *
 * Derived, never stored — and deliberately kept out of `originClaims`, which means
 * something narrower and better evidenced: the countries a record's *own article* names as
 * its origin, each with the source that says so. Two records existing is a fact about this
 * catalogue, not a citation, and mixing the two would quietly weaken a field the record
 * page presents as sourced.
 */
export function alsoRecordedIn(dish: Dish, all: Dish[]): Dish[] {
  const key = (value: string) =>
    (value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]/g, '');

  const wanted = key(dish.name);
  if (!wanted) return [];

  const seen = new Set<string>([dish.loc.country]);
  const out: Dish[] = [];
  for (const other of all) {
    if (other.id === dish.id) continue;
    if (key(other.name) !== wanted) continue;
    if (seen.has(other.loc.country)) continue;
    seen.add(other.loc.country);
    out.push(other);
  }
  return out;
}
