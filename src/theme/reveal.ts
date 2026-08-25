/**
 * Show a section when a reader actually reaches it.
 *
 * The rails already had an entrance — a 320ms rise, staggered six deep. Measured on the
 * front page at 1440, all five finished while four of them were still below the fold:
 * tops at 1,966, 3,051, 4,135 and 5,213 against a fold at 839. CSS animations fire on
 * mount, so every rail past the first performed its arrival to nobody and was sitting
 * still by the time anyone scrolled to it.
 *
 * ## Why this is written defensively
 *
 * Anything that hides content and waits for an event to show it again is the most
 * dangerous pattern in this codebase, and not hypothetically — it has shipped twice.
 * `Photo` gated on `onLoad` and a cached image completed before the handler was attached,
 * leaving all 63 photographs downloaded, decoded and at opacity zero. The fix for that
 * then reintroduced it with `animation-fill-mode: both`, which applies the first keyframe
 * before the animation starts and pins an element that never animates.
 *
 * So the rules here are:
 *
 *   1. **Nothing is hidden unless something that will reveal it exists already.** The
 *      failsafe timer is created in the same statement that arms the element, so there is
 *      no window in which one exists without the other.
 *   2. **No support, no hiding.** Without `IntersectionObserver` the element is simply
 *      visible and never animates, which is the correct degradation — the animation is a
 *      nicety and the content is the point.
 *   3. **The armed state moves an element, it never hides one.** A section waiting to be
 *      revealed sits ten pixels low and fully opaque. So the worst this can do — observer
 *      silent, timer cleared, timeline stopped, all at once — is leave a section slightly
 *      out of position, which no reader will ever notice and no reader loses anything to.
 *      That is also what makes rule 1's timer a belt rather than the only brace.
 *   4. **The armed state lives behind `prefers-reduced-motion: no-preference`**, in the
 *      stylesheet rather than here. A reader who asked for less movement gets the section
 *      immediately and unanimated, which is the honest reading of that preference — and
 *      it means the arming attribute is inert for them rather than special-cased.
 *
 * The failsafe is three seconds. It should never fire; if it does, a reader gets the
 * content without its animation, which is the failure this whole file is shaped to
 * guarantee.
 */

import { useCallback, useRef } from 'react';
import { Platform } from 'react-native';

/** Web-only, and only where the browser can tell us what is on screen. */
const SUPPORTED = Platform.OS === 'web' && typeof IntersectionObserver !== 'undefined';

/** Longest an armed section may stay hidden if the observer never reports. */
const FAILSAFE_MS = 3000;

/**
 * Props to spread onto the section that should reveal.
 *
 * Returns `{}` on native and on any browser without `IntersectionObserver`, so a caller
 * needs no platform branch of its own.
 */
export function useReveal(): { ref?: (node: unknown) => void } {
  /* Undoes whatever the previous node set up — a ref callback runs again with null on
     unmount and with a new node if the element is replaced. */
  const teardown = useRef<(() => void) | null>(null);

  const ref = useCallback((node: unknown) => {
    teardown.current?.();
    teardown.current = null;

    if (!SUPPORTED || !node) return;
    /* react-native-web hands back the DOM node; anything else is not ours to touch. */
    const el = node as HTMLElement;
    if (typeof el.getBoundingClientRect !== 'function' || !el.dataset) return;

    const reveal = () => {
      el.dataset.reveal = 'in';
    };

    /*
     * Everything is armed, including whatever is already on screen.
     *
     * The first version measured `getBoundingClientRect().top` here and skipped the gate
     * for anything above the fold. It skipped it for everything: a ref callback runs
     * before layout, so all five rails reported a top of roughly zero and revealed at
     * once — the mount-time behaviour this file exists to replace, wearing a new
     * attribute. Measured, or it would have shipped looking finished.
     *
     * Arming unconditionally and letting the observer answer is both simpler and correct:
     * it reports on anything already intersecting within a frame or two, so a visible
     * section still animates immediately. This is only safe because the armed state is a
     * ten-pixel offset rather than a hidden element — with opacity it would be a flash of
     * nothing on every load.
     */
    el.dataset.reveal = 'armed';

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        reveal();
        observer.disconnect();
      },
      /* A little inside the fold, so the rise finishes as the section settles rather than
         starting the moment its first pixel appears. */
      { rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);

    // Armed and failsafe in the same breath — see rule 1 above.
    const timer = setTimeout(() => {
      reveal();
      observer.disconnect();
    }, FAILSAFE_MS);

    /*
     * One frame later, reveal anything that is already on screen without waiting to be
     * told.
     *
     * The observer is the right instrument and it is not always a working one: in an
     * embedded browser view it reported nothing at all, and every section sat armed until
     * the three-second failsafe caught it — including the one the reader was looking at.
     * A position check cannot be the primary mechanism (it answers once, and a reader
     * scrolls), but it makes the visible part of the page independent of whether the
     * observer ever speaks.
     *
     * After a frame rather than immediately, because a ref callback runs before layout:
     * measured there, every section reports a top of roughly zero and the check passes for
     * all of them, which is how the first attempt at this quietly reverted the whole file
     * to revealing everything on mount.
     */
    const frame = requestAnimationFrame(() => {
      if (el.getBoundingClientRect().top >= (window.innerHeight || 0)) return;
      reveal();
      observer.disconnect();
      clearTimeout(timer);
    });

    teardown.current = () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return SUPPORTED ? { ref } : {};
}
