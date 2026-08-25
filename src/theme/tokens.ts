/**
 * Nocturne design tokens.
 *
 * Ported verbatim from `design-system/styles.css` in the handoff. That file is the
 * source of truth; every value here traces back to a `--token` in it. Nothing in the
 * app hard-codes a hex, a size or a radius — it comes from here.
 *
 * Two CSS features have no native equivalent and are resolved at build time:
 *   - `color-mix(in srgb, X n%, transparent)` becomes an explicit rgba() below.
 *   - the 100–900 ramps are plain maps.
 */

/** color-mix(in srgb, #e9e9ed n%, transparent) — the text colour at partial alpha. */
const textAlpha = (pct: number) => `rgba(233, 233, 237, ${pct / 100})`;

/** color-mix(in srgb, var(--color-accent) n%, transparent) — accent tints for hover/press. */
export const accentAlpha = (pct: number) => `rgba(217, 164, 65, ${pct / 100})`;

export const color = {
  bg: '#161826',
  /*
   * A card, and it has to be visible as one.
   *
   * #232532 measured 1.16:1 against the ground, which is not a surface — it is the page
   * with a hairline drawn round it. Every card in the app was held together by its 1px
   * border alone: remove the border and the card disappeared. Cards, fields, the language
   * dropdown and the feed's tinted panel all draw from this, so all four were doing it.
   *
   * #2a2d43 measures 1.30:1 — hue 233, the same blue family as the ground at lightness 21
   * against 12, so this is the surface lifted rather than tinted. Still quiet, because the
   * design's rule is that this ground stays dark and the accent does the pointing, but a
   * card is now a thing laid on a page rather than an outline of one.
   *
   * The proposal that led here first named #1f2233 and claimed 1.30:1 for it. That value
   * measures 1.12 — darker than what it replaced, so it would have made the problem worse.
   * The 1.30 belonged to a different candidate and was quoted against the wrong hex.
   */
  surface: '#2a2d43',
  text: '#e9e9ed',
  /**
   * Grain gold.
   *
   * The accent moves off Nocturne's blurple to the colour of the world's staple
   * ingredient — rice and wheat, the grains most of humanity eats daily, and the
   * allium base most cuisines start from. All three sit in the same warm amber band.
   *
   * Kept at roughly the lightness the blurple held (L≈0.75 against the #161826
   * ground) so the contrast ratios the design system documents still hold: fine for
   * icons, large text and chrome, with `accentText` below for paragraph-size copy.
   * The system's rule is unchanged — the accent is a line, a mark and a glow, never
   * a flood fill.
   */
  accent: '#d9a441',
  /** --color-divider: color-mix(in srgb, #e9e9ed 16%, transparent) */
  divider: textAlpha(16),

  /*
   * The secondary-text ladder, raised so both steps have somewhere to fall.
   *
   * It was 55% and 50%. On the page those measure 5.19 and 4.52 against a required 4.5 —
   * the second passing by two hundredths. On a card they are worse, because the ground
   * beneath the alpha is lighter: 4.83 and **4.25**, so `meta` was already failing AA
   * anywhere it sat on a surface, which is most of where card metadata lives.
   *
   * 64% and 58% measure 6.59 and 5.63 on the page, and 5.54 and 4.84 on the new card —
   * the card being the tightest ground either now lands on. Both pass everywhere with room
   * that a rounding change cannot eat.
   *
   * Two steps, not the three the proposal sketched. The third would have no consumer, and
   * a token with no consumer is the failure this file has already hosted twice: `faint`
   * lasted for months because nobody measured it, and three spacing steps sat here unused
   * while the pages kept a phone's rhythm. If a quieter role appears, add the step then,
   * with its contrast figure in the comment.
   */
  muted: textAlpha(64),
  meta: textAlpha(58),
  /*
   * `faint` — 45% alpha — was here and is gone.
   *
   * It measured 3.91 against the ground, where WCAG AA asks 4.5 for text this size, so
   * every one of its three uses was unreadable by that standard and they were the only
   * such text left in the app. Two were the free-and-staying-free promise on the front
   * page; the third was the intake rail's labels for steps not yet reached.
   *
   * Deleted rather than raised, because raising it to a passing alpha would have made it
   * identical to `meta` and the app does not need two names for one colour. If a genuinely
   * inactive control ever wants a quieter step, add it back with a contrast figure in this
   * comment — the reason this one lasted is that nobody had measured it.
   */

  neutral: {
    100: '#f3f5fe',
    200: '#e4e7f5',
    300: '#cfd3e5',
    400: '#b2b6ca',
    500: '#9397ab',
    600: '#75798c',
    700: '#595d6c',
    800: '#3f424d',
    900: '#292b31',
  },

  /**
   * The grain-gold ramp, generated on the same perceptual lightness scale as the
   * neutral ramp, so the same step of either role carries the same visual weight —
   * the property the Nocturne token sheet is built around.
   *
   * The dark steps (700–900) are the tinted fills: 800 is the filled chip, 900 the
   * step-number disc. The light steps (100–300) are the text on those tints.
   */
  accentRamp: {
    100: '#fff9ee',
    200: '#fdefd2',
    300: '#f7dda6',
    400: '#eec670',
    500: '#d9a441',
    600: '#b28230',
    700: '#866125',
    800: '#5d431b',
    900: '#3a2a11',
  },
} as const;

/**
 * The accent-to-ground pair is tuned to >=3:1 — enough for icons, large text and
 * chrome, but NOT for body copy. Paragraph-size accent text uses accent-300.
 * See design-system/readme.md, "Components".
 */
export const accentText = color.accentRamp[300];

/** --space-*, density 0.70x. Fractional px are deliberate; RN accepts them. */
export const space = {
  1: 2.8,
  2: 5.6,
  3: 8.4,
  4: 11.2,
  6: 16.8,
  8: 22.4,
  /*
   * Above the 0.70x density, and only used on a wide window.
   *
   * The scale stopped at 22.4, which is a phone's largest gap. On a 1440px page that
   * gave every section the same rhythm as every other, and it is most of what read as
   * cramped. These three are for the space *between* things a desktop has room to
   * separate — never inside a card, where the density is correct.
   */
  12: 33.6,
  16: 44.8,
  24: 67.2,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 14,
  /** .tag — calc(var(--radius-md) * 0.75) */
  tag: 6,
} as const;

/**
 * Elevation. On this dark ground elevation is "a hairline edge plus ambient
 * darkness" — the sm step is a 1px ring with no drop shadow at all, so it maps to
 * a border rather than to a native shadow.
 */
export const elevation = {
  /** --shadow-sm: 0 0 0 1px #3f424d */
  sm: { borderWidth: 1, borderColor: color.neutral[800] },
  /** --shadow-md: 0 0 0 1px #595d6c, 0 6px 18px rgba(0,0,0,0.55) */
  md: {
    borderWidth: 1,
    borderColor: color.neutral[700],
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
} as const;

export const font = {
  /**
   * The display face.
   *
   * Fraunces, at one weight. Used for anything that names or argues — headings, dish
   * names, card titles — and never for anything a reader operates. That split is the
   * point: Inter is an excellent interface face and also the most-used typeface in
   * software shipped since 2020, so an app set entirely in it reads as having had no
   * typographic opinion. An atlas is a reference work, and reference works have always
   * used serifs.
   *
   * One weight and no italic, because the design system's own rule is that headings
   * never go bolder than 500. That keeps the whole addition at 182 KB.
   */
  display: 'Fraunces_500Medium',
  regular: 'Inter_400Regular',
  /** --font-heading-weight: 500. Headings never go bolder than this. */
  heading: 'Inter_500Medium',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

/**
 * Type scale. Headings: line-height 1.12, letter-spacing -0.015em (converted to px
 * per size, since RN letterSpacing is absolute).
 */
const headingTracking = (size: number) => size * -0.015;

export const type = {
  h1: { fontFamily: font.display, fontSize: 42, lineHeight: 42 * 1.12, letterSpacing: headingTracking(42) },
  h2: { fontFamily: font.display, fontSize: 32, lineHeight: 32 * 1.12, letterSpacing: headingTracking(32) },
  h3: { fontFamily: font.display, fontSize: 25, lineHeight: 25 * 1.12, letterSpacing: headingTracking(25) },
  h4: { fontFamily: font.display, fontSize: 20, lineHeight: 20 * 1.12, letterSpacing: headingTracking(20) },
  h5: { fontFamily: font.display, fontSize: 16, lineHeight: 16 * 1.12, letterSpacing: headingTracking(16) },
  /** h6 is the uppercase eyebrow: letter-spacing 0.08em, not the heading tracking. */
  h6: {
    fontFamily: font.heading,
    fontSize: 13,
    lineHeight: 13 * 1.12,
    letterSpacing: 13 * 0.08,
    textTransform: 'uppercase' as const,
  },
  /** body — 15px/1.55 */
  body: { fontFamily: font.regular, fontSize: 15, lineHeight: 15 * 1.55 },
  /** .card-title */
  cardTitle: { fontFamily: font.display, fontSize: 17, lineHeight: 17 * 1.2 },
} as const;

/**
 * The same type scale, opened up for a window that has room.
 *
 * Multiplied rather than redefined, so there is still one scale and the phone remains
 * the source of truth. The ratios rise with the size — a headline gains far more from a
 * wide screen than a caption does — which is what turns a flat page into one with a
 * hierarchy a reader can see from across the room.
 *
 * The floor matters as much as the ceiling. Nothing renders below 12px on any screen:
 * 127 of the 442 text nodes on the front page were under that, and 9px is not a size,
 * it is an apology.
 */
export function wideType<T extends { fontSize: number; lineHeight?: number; letterSpacing?: number }>(
  style: T,
  wide: boolean,
): T {
  const size = style.fontSize;
  const factor = !wide ? 1 : size >= 40 ? 1.62 : size >= 24 ? 1.44 : size >= 19 ? 1.28 : size >= 15 ? 1.14 : 1.08;
  /*
   * The floor is lower on a phone, and that is deliberate.
   *
   * 9px is indefensible on any screen and goes everywhere. But this design was tuned at
   * 375 wide, where 10 and 11 are doing real work separating a credit line from a count
   * — lifting everything below 12 there flattens four sizes into one and crowds a screen
   * that has no room to give. A wide window has the room, so it gets the higher floor.
   */
  const next = Math.max(wide ? 12 : 11, Math.round(size * factor * 10) / 10);
  const scale = next / size;

  return {
    ...style,
    fontSize: next,
    ...(style.lineHeight === undefined ? {} : { lineHeight: style.lineHeight * scale }),
    ...(style.letterSpacing === undefined ? {} : { letterSpacing: style.letterSpacing * scale }),
  };
}

/** Horizontal page padding, constant across every screen in the design. */
export const PAGE_PADDING = 20;

/**
 * The design's frame: 390 x 844pt, an iPhone 14-class phone. The device shell the
 * prototype draws is chrome, not part of the app — but the column width is real, and
 * on a desktop browser the layout has to stop somewhere or a single dish card fills
 * the window. 430 is the widest current phone (Pro Max class), so capping here keeps
 * every real device edge-to-edge while giving the web build sane proportions.
 */
export const PHONE_WIDTH = 430;

/**
 * Minimum tap target. The prototype draws 36px icon buttons; the handoff requires
 * they be padded up to 44 in the real app (Accessibility note).
 */
export const TAP_TARGET = 44;
