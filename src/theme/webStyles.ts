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

/*
 * Somewhere to be, for anybody navigating by keyboard.
 *
 * The app had no focus style of its own: 75 focusable elements on the front page and not
 * one rule anywhere naming them. Meanwhile the shipped stylesheet contains
 *
 *     .r-1ny4l3l { outline-style: none; }
 *
 * which is react-native-web's focus-ring reset. RNW suppresses the browser's ring on the
 * views it makes pressable, on the assumption that the application supplies its own. This
 * one never did.
 *
 * The accent, because it is the colour this app already uses to mean "this is the thing",
 * and at 7.83:1 against the ground it clears the 3:1 a focus indicator must reach. Every
 * other colour here is measured; the one a keyboard reader depends on should not be the
 * exception. focus-visible rather than focus, so it answers the keyboard and leaves a
 * mouse alone. Offset outward, which inside a card with overflow hidden costs a pixel or
 * two of ring — slightly clipped beats absent.
 *
 * ## !important, and the honest reason for it
 *
 * RNW's reset is a class, specificity 0-1-0, and focus-visible is also 0-1-0. Equal
 * specificity means document order decides, and the order in which RNW's sheet and this
 * injected one land is not something this file controls. !important removes the question.
 *
 * ## What could not be verified, and should be
 *
 * None of the above was confirmed in a browser. Three attempts, three dead ends: calling
 * .focus() from JavaScript does not match focus-visible in Chrome, so it measures the
 * unfocused state; the available preview pane will not take a real Tab keypress; and a
 * probe injecting the same declaration under :focus computed "none" both with and without
 * !important on an element that was genuinely focused, which means the pane was not
 * reflecting injected styles at all.
 *
 * So this rests on reading the shipped CSS, and it wants ten seconds of a real keyboard in
 * a real browser before anyone treats it as done. Recorded in docs/queue.md as such.
 *
 * On the way there this comment twice asserted things the measurements did not support —
 * first that RNW sets outline:none inline, then that nothing suppresses the ring at all.
 * The second retraction was itself wrong. When an instrument is this unreliable, the
 * temptation is to keep re-reading it until it says something; the answer is to stop and
 * write down which parts are actually known.
 *
 * Written first with backticks around the selector names, which closed this file's
 * template literal and reported the error twenty lines away in unrelated code. Third time
 * this session, in the one file that already carries a note saying not to.
 */
:focus-visible {
  outline: 2px solid #d9a441 !important;
  outline-offset: 2px;
}

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
   * No fill mode, which removes one failure: with backwards fill the element sits at the
   * first keyframe — opacity 0 — before the animation starts, so anything delaying the
   * start leaves the photograph invisible.
   *
   * It does not remove all of them, and the previous version of this note claimed it did.
   * "Without fill the natural state is visible" is wrong while the animation is *running*:
   * a running animation renders its own value, so at currentTime 0 that is still opacity
   * 0. Measured in an embedded browser view whose document.timeline never advanced — every
   * animation on the page reported playState "running" at currentTime 0, and all 63
   * photographs were invisible with no fill mode anywhere in sight.
   *
   * Left as it is, because that view is not a real tab and a real browser advances the
   * timeline whether or not the tab is focused. But it is the reason the section reveal
   * below animates transform and never opacity: where a fade is the point, this risk is
   * the price; where movement is the point, there is no reason to pay it.
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
  /*
   * Movement only. No opacity, deliberately, and this is the third time this file has had
   * to learn it.
   *
   * A running animation renders its own value, not the element's — so an animation whose
   * first keyframe is opacity 0 shows nothing for as long as it fails to progress. That is
   * not theoretical: measured in an embedded browser view where document.timeline never
   * started, every animation sat at currentTime 0 and the whole page was invisible. Fill
   * mode had nothing to do with it, which is what the earlier note here got wrong.
   *
   * A translate cannot fail that way. If the timeline never runs, or the observer never
   * reports, or a browser throttles the tab into next week, the worst case is a section
   * resting ten pixels low — which nobody can see and nobody loses anything to.
   */
  @keyframes wf-rise {
    from { transform: translateY(10px); }
    to   { transform: translateY(0); }
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

  /*
   * The rise, driven by arrival on screen rather than by page load.
   *
   * It used to be [data-enter] with a six-step stagger, which fired on mount. Measured at
   * 1440: all five rails finished while four were still below the fold, so every rail past
   * the first performed its entrance to an empty room. The stagger went with it — sections
   * now arrive one at a time as a reader reaches them, and staggering things that are
   * already separated in time only delays them.
   *
   * "armed" matches the animation's first keyframe exactly, so the swap to "in" is
   * seamless rather than a flash of the finished state. It carries no fill mode: an
   * element that somehow gets "in" without running the animation is visible, which is the
   * failure this is allowed to have. theme/reveal.ts explains the rest, including why
   * nothing here may hide content without a timer already holding the other end.
   *
   * No backticks in this comment, and none anywhere in this file: the whole stylesheet is
   * a template literal, so one closes it and the error lands three lines further on in
   * something that looks fine. Cost twenty minutes once already.
   *
   * Both rules live inside the reduced-motion guard, so for a reader who asked for less
   * movement the arming attribute does nothing at all and the section is simply there.
   */
  [data-reveal="armed"] { transform: translateY(10px); }
  [data-reveal="in"] { animation: wf-rise 320ms ease; }
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
