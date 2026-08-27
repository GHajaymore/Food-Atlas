/**
 * Typography primitives — the Nocturne type scale as components.
 *
 * The design system's rule is that nothing hard-codes a font size; every piece of
 * text picks a role from here or passes an explicit size for the small interface
 * labels the scale does not name (11px/12px meta lines).
 *
 * ## Why every primitive flattens its style
 *
 * The scale in `tokens.ts` is the phone scale, and `wideType` opens it up for a window
 * with room. Applying that to the role styles alone would miss most of the page: the
 * measured problem was not the headings, it was that 84% of the text on a 1440px screen
 * rendered below 14px, and almost all of that came from call sites passing an explicit
 * `{ fontSize: 9 }` or `{ fontSize: 11 }` for a meta line.
 *
 * So each primitive resolves its whole style — role plus whatever the call site added —
 * and scales the result. That reaches the 9px credit line and the 11px count without
 * touching the two hundred places that set them, and it means the floor (nothing below
 * 12px, anywhere) is a property of this file rather than a convention two hundred files
 * are trusted to keep.
 */

import { Text as RNText, StyleSheet, type TextProps, type TextStyle } from 'react-native';
import { color, font, type, wideType } from '../theme/tokens';
import { useWideType } from '../theme/typeScale';

type Props = TextProps & { children?: React.ReactNode };

const base: TextStyle = { color: color.text };

/**
 * Resolve a style array and scale it for the window.
 *
 * `StyleSheet.flatten` rather than passing the array through, because the call site's
 * `fontSize` has to be visible to `wideType` — the whole point is to catch the sizes the
 * scale never named. A style with no `fontSize` is returned untouched, so `Muted` used
 * without one still inherits normally.
 */
function scaled(parts: (TextStyle | undefined | null | false)[], wide: boolean): TextStyle {
  const flat = StyleSheet.flatten(parts) as TextStyle;
  return typeof flat.fontSize === 'number' ? wideType(flat as TextStyle & { fontSize: number }, wide) : flat;
}

/**
 * The headings, and why they announce themselves.
 *
 * These set a size and nothing else until now, so every visual heading in the app rendered
 * as a plain div. Audited on the live site: **zero headings and zero landmarks** on the
 * home page, against 96 correctly-named focusable controls — the keyboard story was in good
 * shape and the screen-reader story was not.

 * That gap is not cosmetic. Heading navigation is the main way somebody using a screen
 * reader scans a page: jump heading to heading, decide what to read. With no headings the
 * atlas is one undifferentiated run of text, and "Food Atlas", "From United States" and
 * every dish name carry no more structure than a caption.
 *
 * `accessibilityRole="header"` gives react-native-web `role="heading"`, and the level says
 * how the page nests. Levels do not match the component names, and that is on purpose: `H2` is used in
 * exactly two places and both are the page's own title — the record's name, and NavRow's
 * heading — so it is level 1. The rest step down from there, which is the hierarchy the
 * design already draws rather than the one the names imply.
 */
export const H2 = ({ style, ...p }: Props) => {
  const wide = useWideType();
  return <RNText accessibilityRole="header" aria-level={1} {...p} style={scaled([base, type.h2, style as TextStyle], wide)} />;
};

export const H4 = ({ style, ...p }: Props) => {
  const wide = useWideType();
  return <RNText accessibilityRole="header" aria-level={2} {...p} style={scaled([base, type.h4, style as TextStyle], wide)} />;
};

export const H5 = ({ style, ...p }: Props) => {
  const wide = useWideType();
  return <RNText accessibilityRole="header" aria-level={3} {...p} style={scaled([base, type.h5, style as TextStyle], wide)} />;
};

/**
 * The uppercase eyebrow. Always neutral-400 in this design.
 *
 * Stays on Inter while the other headings move to the display face: this is a 13px
 * uppercase label with 0.08em tracking, and a serif at that size and treatment reads
 * worse rather than better. It is a signpost, not a heading.
 */
export const H6 = ({ style, ...p }: Props) => {
  const wide = useWideType();
  return <RNText accessibilityRole="header" aria-level={4} {...p} style={scaled([base, type.h6, { color: color.neutral[400] }, style as TextStyle], wide)} />;
};

export const Body = ({ style, ...p }: Props) => {
  const wide = useWideType();
  return <RNText {...p} style={scaled([base, type.body, style as TextStyle], wide)} />;
};

/** .text-muted — the 55%-alpha secondary line that carries most of this design. */
export const Muted = ({ style, ...p }: Props) => {
  const wide = useWideType();
  return <RNText {...p} style={scaled([{ fontFamily: font.regular, color: color.muted }, style as TextStyle], wide)} />;
};

/** Plain text at the body font, for one-off interface labels. */
export const T = ({ style, ...p }: Props) => {
  const wide = useWideType();
  return <RNText {...p} style={scaled([{ fontFamily: font.regular, color: color.text }, style as TextStyle], wide)} />;
};

/** .card-title — the display face at 17px. */
export const CardTitle = ({ style, ...p }: Props) => {
  const wide = useWideType();
  return <RNText {...p} style={scaled([base, type.cardTitle, style as TextStyle], wide)} />;
};

export const styles = StyleSheet.create({
  /** 500-weight interface text, e.g. a search result name or a video creator. */
  medium: { fontFamily: font.medium },
});
