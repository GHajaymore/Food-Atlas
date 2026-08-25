/**
 * Web-only style shims.
 *
 * Two Nocturne behaviours have no react-native-web style equivalent, so they are
 * injected as real CSS on web and expressed as native style props elsewhere:
 *
 *   - `mix-blend-mode: lighten` on photographs (the `.lighten` treatment). RNW's
 *     style resolver drops `mixBlendMode`, so the Image carries `data-lighten` and
 *     the rule below does the work. It blends against whatever the page paints
 *     behind it — the card surface, or the page ground — exactly as the design does.
 *   - The document ground. The app's screens paint `--color-bg`, but the page behind
 *     them is transparent by default, which shows through as white around the app
 *     and, more importantly, is the backdrop the blend above composites against.
 */

import { Platform } from 'react-native';
import { color } from './tokens';

const CSS = `
html, body, #root { background-color: ${color.bg}; }
body { margin: 0; overscroll-behavior: none; }
[data-lighten="true"] { mix-blend-mode: lighten; }
/*
 * Scrollbars: hidden on a phone, present and styled on anything wider.
 *
 * The blanket rule this replaces hid every scrollbar at every size, which is right for
 * the phone design — the gesture is direct, a bar would cover content, and the shelves
 * are meant to look like rails rather than like scrolling panes. It also silently
 * overrode ScrollView's own showsVerticalScrollIndicator, so setting that prop on
 * desktop did nothing at all and the page looked like a short one that had stopped.
 *
 * On a desktop the bar is the only thing that says how much more there is, and the only
 * way to drag to the bottom of eighteen thousand records. So it comes back above the
 * tablet breakpoint — painted to match the ground rather than left as the browser's
 * default grey slab on a dark page.
 *
 * Horizontal bars stay hidden at every size: the rails they belong to become grids on
 * wide screens anyway, so a horizontal bar on a desktop is always something that has
 * gone wrong rather than something to look at.
 */
@media (max-width: 759px) {
  ::-webkit-scrollbar { display: none; }
  * { scrollbar-width: none; }
}
@media (min-width: 760px) {
  * { scrollbar-width: thin; scrollbar-color: ${color.neutral[700]} transparent; }
  ::-webkit-scrollbar { width: 10px; height: 0; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: ${color.neutral[700]};
    border-radius: 5px;
    border: 2px solid ${color.bg};
  }
  ::-webkit-scrollbar-thumb:hover { background: ${color.neutral[600]}; }
}
/*
 * Motion, delivered as CSS because the app's only motion API does not work here.
 *
 * The three accordions call LayoutAnimation.Presets.easeInEaseOut, and
 * react-native-web does not implement LayoutAnimation at all — so the build that
 * actually gets deployed has, and has always had, no motion whatsoever. Hover tints
 * snapped, carets flipped instantly, panels appeared fully formed. That is most of what
 * makes a page feel like a document rather than an application.
 *
 * Done in CSS rather than with Animated for two reasons. It costs no JavaScript on a
 * page carrying sixty-three photographs and eighteen thousand records in memory; and it
 * needs no new dependency, which matters on a project that is deliberately lean —
 * reanimated and moti are not installed and should not be.
 *
 * Delivered through dataSet, the same channel Photo.tsx already uses for the
 * lighten blend. React Native has no concept of a CSS transition, so a component asks
 * for one by tagging itself and the rule below finds it.
 *
 * Everything sits inside prefers-reduced-motion: no-preference. A reader who has asked
 * their system for less movement gets exactly what they have today, which is none.
 */
/*
 * A card answers the pointer.
 *
 * Outside the reduced-motion guard on purpose: a hover state is not motion. Somebody who
 * has asked for less movement still needs to know what is clickable — what they should
 * not get is the easing and the lift, and those are the parts that stay inside it below.
 *
 * An outline rather than a border, because a border would change the box and shift the
 * layout by a pixel on hover; an outline is painted outside the box and moves nothing.
 * The transparent default is declared so the colour has something to interpolate from —
 * a browser cannot animate from an absent outline, the same trap the caret rotation hit.
 */
[data-surface="card"] { outline: 1px solid transparent; outline-offset: 0; }
[data-motion="tap"]:hover [data-surface="card"] { outline-color: rgba(217, 164, 65, 0.45); }

@media (prefers-reduced-motion: no-preference) {
  [data-surface="card"] { transition: outline-color 140ms ease, transform 160ms ease; }
  /* Two pixels. Enough to read as the card coming forward, small enough that a grid of
     six does not look like it is bouncing when a pointer crosses it. */
  [data-motion="tap"]:hover [data-surface="card"] { transform: translateY(-2px); }

  /* Every interactive element in the app, from one rule: Pressable tags itself. */
  [data-motion="tap"] {
    transition: background-color 140ms ease, border-color 140ms ease, opacity 140ms ease;
  }

  /*
   * Both states are declared, rather than relying on none → rotate(). A browser cannot
   * interpolate from an absent transform, so leaving the closed state unset gives a jump
   * in one direction and a glide in the other.
   */
  /* The rotation itself is an ordinary React Native transform, so it works on both
     platforms and this only has to say how long it should take. A companion rule setting
     the rotated state in CSS was removed: the inline style wins on specificity anyway, so
     it was a selector that could never take effect. */
  [data-motion="caret"] { transition: transform 180ms ease; }

  /*
   * Photographs fade up as they arrive, and the fade is on the image itself.
   *
   * This comment previously said the opposite — that the fade had to go on an overlay,
   * because a blended node given its own opacity creates a compositing context and would
   * silently change what it blends against. Half right, and the wrong half was the part
   * that dictated the design.
   *
   * Opacity on the blended node does not move its backdrop; the element still blends
   * with the same group it always did. What DOES break the treatment is opacity on an
   * ANCESTOR of it, which opens a new isolation group and leaves the photograph blending
   * against that instead of against the card or the page ground.
   *
   * Checked rather than reasoned about: every photograph set to opacity 0.999 — enough
   * to force a compositing context, far too little to see — renders identically to 1.
   * So fade the image, and never the frame around it.
   */
  /*
   * On mount, not on a state change.
   *
   * A transition needs something to transition *from*, which meant JS holding the image
   * at zero until a load event arrived — and a cached image can finish before that event
   * is ever attached. An animation needs no event at all: it runs when the element
   * mounts, and Photo keys the image on its URL so a new photograph is a new mount.
   *
   * No fill mode, and that is the whole safeguard: with backwards fill the element sits at
   * the first keyframe — opacity 0 — until the animation starts, so anything that stops
   * it from starting leaves the photograph invisible. That is the exact failure this
   * change exists to remove. Without fill the natural state is visible and the animation
   * only plays over it.
   */
  @keyframes photo-veil { from { opacity: 0; } to { opacity: 1; } }
  [data-motion="photo-veil"] { animation: photo-veil 260ms ease; }

  /*
   * A short staggered rise as the page assembles. CSS animations fire on mount rather
   * than on re-render, so this runs once per page load and not every time state changes —
   * which is exactly the distinction a JS implementation would have to be careful about
   * and this gets for free.
   *
   * Capped at six steps: beyond that a reader is waiting for the page to finish arriving,
   * which is the opposite of the point.
   */
  @keyframes wf-rise {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  /*
   * The skeleton breathes while the atlas downloads.
   *
   * Deliberately slow and shallow — 1.6s between 1 and 0.55. A fast or high-contrast
   * pulse reads as a progress indicator and implies something is nearly finished, which
   * on a 16 MB payload would be a claim nobody can support. This says only that the page
   * is waiting, which is the whole of what is known.
   */
  @keyframes wf-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.55; }
  }
  [data-motion="pulse"] { animation: wf-pulse 1600ms ease-in-out infinite; }
  [data-enter] { animation: wf-rise 320ms ease both; }
  [data-enter="2"] { animation-delay: 60ms; }
  [data-enter="3"] { animation-delay: 120ms; }
  [data-enter="4"] { animation-delay: 180ms; }
  [data-enter="5"] { animation-delay: 240ms; }
  [data-enter="6"] { animation-delay: 300ms; }
}

`;

let injected = false;

export function installWebStyles(): void {
  if (Platform.OS !== 'web' || injected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.setAttribute('data-nocturne', 'true');
  style.textContent = CSS;
  document.head.appendChild(style);
  injected = true;
}
