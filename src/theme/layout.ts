/**
 * How wide the window is, and what that should change.
 *
 * The app was drawn for a 390pt phone and capped at `PHONE_WIDTH`, which was the right
 * call while there was one design: without a cap a single dish card stretches to fill a
 * 2,560px monitor. But a cap is not a desktop layout. On a large screen the atlas has
 * been a 430px ribbon down the middle of an otherwise empty window — correct
 * proportions, and a fraction of the room it was given.
 *
 * ## Three sizes, not a continuum
 *
 * Named breakpoints rather than fluid scaling, because the layout genuinely changes
 * shape rather than merely stretching: one column becomes two becomes three, and the
 * navigation moves from a footer to a header. A continuum would have to interpolate
 * between shapes that do not interpolate.
 *
 *   phone    < 760    one column, footer colophon, full-bleed photographs
 *   tablet   < 1180   two columns, wider measure
 *   desktop  ≥ 1180   three columns, persistent header navigation
 *
 * The phone boundary is 760 rather than a device width on purpose. It is where two
 * columns of readable text stop fitting, which is a fact about the content rather than
 * about anybody's hardware — and it means a phone held sideways and a small window get
 * the same layout, which is what both of them want.
 *
 * ## Why the measure is capped even on desktop
 *
 * `readable` stays near 720 no matter how wide the window is. Prose is the thing this
 * app is mostly made of — an account of how a dish is made, an argument about evidence —
 * and a line of text 2,000px long is unreadable regardless of how much room there is.
 * Only the *grids* get the extra width. A record page on a large monitor should look
 * like a page, not like a spreadsheet.
 */

import { useWindowDimensions } from 'react-native';

export type Size = 'phone' | 'tablet' | 'desktop';

export const BREAKPOINT = { tablet: 760, desktop: 1180 } as const;

/**
 * The widest a column of running text should get.
 *
 * Roughly 90 characters at this type scale. Beyond that the eye loses the start of the
 * next line, which is the oldest finding in typesetting and does not stop being true
 * because a monitor is available.
 */
export const READABLE = 720;

/** How wide the page shell may grow, per size. */
export const SHELL = { phone: 430, tablet: 860, desktop: 1240 } as const;

/** Columns a card grid should use, per size. */
export const COLUMNS = { phone: 1, tablet: 2, desktop: 3 } as const;

export function sizeFor(width: number): Size {
  if (width >= BREAKPOINT.desktop) return 'desktop';
  if (width >= BREAKPOINT.tablet) return 'tablet';
  return 'phone';
}

export interface Layout {
  size: Size;
  /** True for tablet and desktop — the common "is there room" question. */
  wide: boolean;
  /** Max width of the page shell. */
  shell: number;
  /** Max width of a column of prose. */
  readable: number;
  /** Columns for a card grid. */
  columns: number;
  width: number;
}

/**
 * The one hook every responsive decision goes through.
 *
 * `useWindowDimensions` re-renders on resize and on orientation change, which native
 * `Dimensions.get` does not — a phone rotated with `Dimensions.get` keeps the portrait
 * layout until something else happens to re-render.
 */
export function useLayout(): Layout {
  const { width } = useWindowDimensions();
  const size = sizeFor(width);
  return {
    size,
    wide: size !== 'phone',
    shell: SHELL[size],
    readable: size === 'phone' ? SHELL.phone : READABLE,
    columns: COLUMNS[size],
    width,
  };
}
