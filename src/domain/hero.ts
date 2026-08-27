/**
 * The photograph at the top of the home screen.
 *
 * Ajay: *"we also need to keep refreshing landing page hero recipe and not to just keep one
 * static. Also hero recipe should be good recipe with good picture."* Both halves were
 * real, and the second was the more serious of the two.
 *
 * ## What it used to be
 *
 * `shelves[0].dishes[0]` — the first card of the first shelf, which is **Disappearing**,
 * and that shelf carries `urgentFirst: true`. It orders the *least* documented record
 * first, on purpose: a declining tradition nobody has written down is the one that
 * actually goes, and on that shelf the weakest record is the most urgent.
 *
 * That is right for the shelf and exactly wrong for a hero. The front page was leading
 * with the thinnest record in the atlas — a name, a place, no method — as the single
 * largest photograph on the screen.
 *
 * ## What "a good recipe" can honestly mean here
 *
 * Measured before choosing, because the obvious answer does not survive contact with the
 * data. Of 21,688 records, 7,927 carry a photograph; requiring a *method* as well leaves
 * 1,394 — and **1,391 of those are Modern Adaptations**, published cookbook recipes. Only
 * three traditions in the whole atlas have a photograph, a method and an ingredient list,
 * and they are the curated seed.
 *
 * So requiring a method would mean the front page always led with a published recipe,
 * labelled as not being how the tradition is made. That contradicts the atlas on its own
 * first screen, and it would rotate between three records or none.
 *
 * The honest criteria are what a *card* needs in order to be worth looking at: a
 * photograph, an ingredient list, and a line worth reading under the name. That is 1,474
 * records across 91 countries — enough to be different every visit, and every one of them
 * a real tradition rather than an adaptation.
 *
 * ## Strongest first, then rotated
 *
 * The pool is ordered by evidence and the rotation runs over the top of it, so the hero is
 * always drawn from the best of what the atlas holds rather than from anything that passes
 * the filter. Same shape as `rotate` in `shelves.ts`, and the same reasoning: variety
 * bought by showing the second-best of everything is not worth having.
 */

import { isAuthentic } from './authenticity';
import { methodLength } from './method';
import type { Dish, Level } from './types';

/** How many of the strongest records the hero rotates between. */
const POOL = 120;

/** Ordering, strongest first. Mirrors `CLASS_RANK` in shelves.ts. */
const RANK: Record<Level, number> = {
  local: 5,
  regional: 4,
  variation: 3,
  adaptation: 2,
  unverified: 1,
  fusion: 0,
};

/**
 * Whether a record can carry the largest photograph on the page.
 *
 * An adaptation is excluded because the hero speaks for the atlas, and a published recipe
 * is explicitly not what this atlas is about; a fusion record is excluded for the reason
 * `shelves.ts` gives — it is the one thing somebody opening an atlas of traditions did not
 * come for.
 */
export const heroWorthy = (dish: Dish): boolean =>
  Boolean(dish.photo) &&
  dish.badgeLevel !== 'adaptation' &&
  dish.badgeLevel !== 'fusion' &&
  dish.ingredients.length >= 3 &&
  Boolean(dish.blurb) &&
  dish.blurb.length > 20;

/**
 * The record to lead with, for this visit.
 *
 * `turn` is chosen once per app load rather than per render or per day. Per render would
 * change the photograph under a reader mid-scroll; per day is what the shelves use, and is
 * right for them — a rail is a stable object you scan — but the ask here was explicitly for
 * a front page that does not show the same dish every time you open it.
 */
export const heroDish = (dishes: Dish[], turn: number): Dish | undefined => {
  const pool = dishes
    .filter(heroWorthy)
    .sort(
      (a, b) =>
        RANK[b.badgeLevel] - RANK[a.badgeLevel] ||
        (b.score ?? 0) - (a.score ?? 0) ||
        /* A record that says more about itself makes a better opening card. */
        methodLength(b) + b.ingredients.length - (methodLength(a) + a.ingredients.length) ||
        b.breadcrumb.length - a.breadcrumb.length,
    )
    .slice(0, POOL);

  if (!pool.length) return undefined;
  return pool[((turn % pool.length) + pool.length) % pool.length];
};

/** Whether the hero is one the atlas can be proud of, for the test that guards this. */
export const heroIsAuthentic = (dish: Dish): boolean => isAuthentic(dish.badgeLevel);
