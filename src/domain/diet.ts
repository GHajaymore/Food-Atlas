/**
 * Dietary classification.
 *
 * A second, independent axis alongside authenticity, place and kind of dish. It
 * answers "can I eat this?", never "how do I change this so I can eat it?" — the
 * distinction matters, because offering a substitution to make a dish fit a
 * preference is precisely the silent customization the brief forbids. The filter
 * narrows what you are shown. It never alters a record.
 *
 * Three rules this module exists to enforce:
 *
 * 1. **Classification is read from the whole traditional preparation, not the
 *    ingredient chips.** Oaxacan Mole Negro lists chiles, chocolate, sesame and
 *    plantain — and is cooked in lard and loosened with turkey broth. A dish is
 *    classified from its method as well as its ingredients, and `basis` records
 *    where the classification came from so a reader can check it.
 *
 * 2. **`unclassified` is a valid, publishable state.** Where the record does not say
 *    enough to be sure, the app says it does not know rather than guessing. Guessing
 *    wrong here is not a cosmetic error — someone keeps halal, kosher, or a vow.
 *
 * 3. **Nothing is ever relabelled to widen its audience.** A dish containing ghee is
 *    not "vegan with a substitution". The adaptation, where one exists, stays in its
 *    own labelled disclosure on the detail screen.
 */

/** The top level of the preference menu. */
export type DietGroup = 'vegan' | 'vegetarian' | 'seafood' | 'meat' | 'unclassified';

/** The sub-menu under Meat and Seafood. */
export type DietKind =
  | 'poultry'
  | 'pork'
  | 'beef'
  | 'lamb-goat'
  | 'game'
  | 'fish'
  | 'shellfish'
  | 'other-seafood';

/**
 * Animal products present in a dish that carries no meat or fish. This is what lets
 * `vegetarian` and `vegan` be told apart honestly instead of by assumption.
 */
export type DietaryTrace = 'dairy' | 'egg' | 'honey' | 'alcohol';

export interface Diet {
  group: DietGroup;
  /** Specific kinds within the group. A dish may carry more than one. */
  kinds: DietKind[];
  /** Animal products present. Recorded even for meat dishes, for completeness. */
  contains: DietaryTrace[];
  /**
   * Where the classification was read from — the ingredient, the step, or the reason
   * it could not be determined. Shown on the detail screen so the call is checkable.
   */
  basis: string;
}

export const GROUP_LABELS: Record<DietGroup, string> = {
  vegan: 'Vegan',
  vegetarian: 'Vegetarian',
  seafood: 'Seafood',
  meat: 'Non-vegetarian',
  unclassified: 'Not classified',
};

export const KIND_LABELS: Record<DietKind, string> = {
  poultry: 'Poultry',
  pork: 'Pork',
  beef: 'Beef & red meat',
  'lamb-goat': 'Lamb & goat',
  game: 'Game',
  fish: 'Fish',
  shellfish: 'Shellfish',
  'other-seafood': 'Other seafood',
};

export const TRACE_LABELS: Record<DietaryTrace, string> = {
  dairy: 'Contains dairy',
  egg: 'Contains egg',
  honey: 'Contains honey',
  alcohol: 'Contains alcohol',
};

/** The menu, as the UI renders it: a group, and the sub-menu beneath it. */
export const DIET_MENU: readonly { group: DietGroup; kinds: DietKind[] }[] = [
  { group: 'vegan', kinds: [] },
  { group: 'vegetarian', kinds: [] },
  { group: 'seafood', kinds: ['fish', 'shellfish', 'other-seafood'] },
  { group: 'meat', kinds: ['poultry', 'pork', 'beef', 'lamb-goat', 'game'] },
  { group: 'unclassified', kinds: [] },
];

export const kindsFor = (group: DietGroup): DietKind[] =>
  DIET_MENU.find((entry) => entry.group === group)?.kinds ?? [];

/**
 * Does this dish satisfy the selected preference?
 *
 * The hierarchy is deliberate: choosing Vegetarian includes vegan dishes, because
 * every vegan dish is edible by a vegetarian. It does NOT run the other way — a
 * vegan filter never returns a dish containing dairy, however small the quantity.
 *
 * No selection means no narrowing. Selecting several groups ORs them, which is what
 * a household with mixed preferences actually wants.
 */
export function matchesDiet(diet: Diet, groups: DietGroup[], kinds: DietKind[]): boolean {
  if (groups.length) {
    const satisfied = groups.some((group) => {
      if (group === 'vegetarian') return diet.group === 'vegetarian' || diet.group === 'vegan';
      return diet.group === group;
    });
    if (!satisfied) return false;
  }

  // A sub-menu selection narrows within the group: Seafood > Shellfish.
  if (kinds.length) {
    const relevant = kinds.filter((kind) => diet.kinds.length || groups.length);
    if (relevant.length && !diet.kinds.some((kind) => kinds.includes(kind))) return false;
  }

  return true;
}

/** The chip shown on a card and on the detail screen, e.g. 'Non-vegetarian · Poultry'. */
export function dietLabel(diet: Diet): string {
  const group = GROUP_LABELS[diet.group];
  if (!diet.kinds.length) return group;
  return `${group} · ${diet.kinds.map((k) => KIND_LABELS[k]).join(', ')}`;
}

/** Trace labels for the detail screen, e.g. ['Contains dairy']. */
export const traceLabels = (diet: Diet): string[] => diet.contains.map((t) => TRACE_LABELS[t]);

/** Groups that carry a sub-menu, for the UI to know when to expand. */
export const hasSubMenu = (group: DietGroup): boolean => kindsFor(group).length > 0;
