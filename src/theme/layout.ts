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

/**
 * How wide a dish card is, per size.
 *
 * One number, because it was two and they could drift: `Shelf` declared its own and
 * `app/index.tsx` hard-coded 132 for the popularity rail, so changing a card meant
 * remembering an unrelated file or leaving one rail visibly out of step with the others.
 *
 * The phone value rises from 132 to 152. At 375 wide with 20px page padding,
 * 152 + 10 + 152 = 314 leaves about twenty pixels of a third card showing — enough to
 * say the row scrolls, while giving each photograph 45% of the screen instead of 35%.
 * The atlas holds 3,055 photographs and was showing them at roughly the size of a
 * favicon.
 *
 * Tablet and desktop follow the same rule, applied to the width they actually get. The
 * desktop content column measures 1,160px, and 176 fitted six cards across it with a
 * seventh peeking — a contact sheet, not an atlas. Five across at 220 leaves the same
 * ~20px of the next card, and each photograph gains a quarter of its width.
 *
 *   desktop  (1160 - 4 gaps x 10 - 20 sliver) / 5 = 220
 *   tablet   ( 820 - 3 gaps x 10 - 20 sliver) / 4 = 192
 *
 * The count is the thing being chosen, not the pixel value: pick how many photographs a
 * row should hold at that width, and the arithmetic gives the card.
 */
export const CARD_WIDTH = { phone: 152, tablet: 192, desktop: 220 } as const;

/**
 * Type on a dish card, per size — because the card is per size.
 *
 * The cards grew from 176 to 220 on a desktop and their type did not move, which is how a
 * card ends up looking like a thumbnail with a caption. Measured on the front page at
 * 1440: 68 dish names at 13px and 160 card labels at 12px, on cards a quarter wider than
 * the ones those sizes were chosen for.
 *
 * The name also takes the display face here, which is not a new direction — `tokens.ts`
 * already says Fraunces is for "anything that names or argues — headings, dish names",
 * `CardTitle` exists for exactly this, and the grid's `DishCard` already does it. The
 * rails were the one place that named a dish in the interface face, and the rails are
 * most of what the front page is.
 *
 * These are declared sizes. `wideType` scales them again on a wide screen, so a desktop
 * card's name renders near 15 rather than the 14 written here — which is why the desktop
 * step is small: the two multiply.
 */
export const CARD_TYPE = {
  phone: { name: 13, place: 11 },
  tablet: { name: 13, place: 11 },
  desktop: { name: 14, place: 12 },
} as const;

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
  /** Width of a dish card at this size. */
  card: number;
  /** Type sizes on a dish card at this size. */
  cardType: (typeof CARD_TYPE)[Size];
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
    card: CARD_WIDTH[size],
    cardType: CARD_TYPE[size],
    width,
  };
}
