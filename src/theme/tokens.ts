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
export const accentAlpha = (pct: number) => `rgba(145, 132, 217, ${pct / 100})`;

export const color = {
  bg: '#161826',
  surface: '#232532',
  text: '#e9e9ed',
  accent: '#9184d9',
  /** --color-divider: color-mix(in srgb, #e9e9ed 16%, transparent) */
  divider: textAlpha(16),

  /** .text-muted — 55% alpha. Used for every secondary line in the design. */
  muted: textAlpha(55),
  /** .card-meta — 50% alpha, one step quieter than muted. */
  meta: textAlpha(50),
  /** intake step labels that have not been reached — 45% alpha. */
  faint: textAlpha(45),

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

  accentRamp: {
    100: '#f5f4ff',
    200: '#e7e5fe',
    300: '#d2cefd',
    400: '#b5abfc',
    500: '#968ae0',
    600: '#796cbf',
    700: '#5d5294',
    800: '#423a6a',
    900: '#2b2741',
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
  h1: { fontFamily: font.heading, fontSize: 42, lineHeight: 42 * 1.12, letterSpacing: headingTracking(42) },
  h2: { fontFamily: font.heading, fontSize: 32, lineHeight: 32 * 1.12, letterSpacing: headingTracking(32) },
  h3: { fontFamily: font.heading, fontSize: 25, lineHeight: 25 * 1.12, letterSpacing: headingTracking(25) },
  h4: { fontFamily: font.heading, fontSize: 20, lineHeight: 20 * 1.12, letterSpacing: headingTracking(20) },
  h5: { fontFamily: font.heading, fontSize: 16, lineHeight: 16 * 1.12, letterSpacing: headingTracking(16) },
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
  cardTitle: { fontFamily: font.heading, fontSize: 17, lineHeight: 17 * 1.2 },
} as const;

/** Horizontal page padding, constant across every screen in the design. */
export const PAGE_PADDING = 20;

/**
 * Minimum tap target. The prototype draws 36px icon buttons; the handoff requires
 * they be padded up to 44 in the real app (Accessibility note).
 */
export const TAP_TARGET = 44;
