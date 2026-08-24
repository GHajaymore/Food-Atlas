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
@media (prefers-reduced-motion: no-preference) {
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
   * Photographs fade up as they arrive. The fade is on an overlay above the image, never
   * on the image itself — these are composited with mix-blend-mode: lighten, and giving
   * a blended node its own opacity transition creates a compositing context, which
   * silently changes what it blends against. The design's core photographic treatment
   * would break in a way that is hard to see and harder to diagnose.
   */
  [data-motion="photo-veil"] { transition: opacity 260ms ease; }

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
