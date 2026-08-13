/**
 * Typography primitives — the Nocturne type scale as components.
 *
 * The design system's rule is that nothing hard-codes a font size; every piece of
 * text picks a role from here or passes an explicit size for the small interface
 * labels the scale does not name (11px/12px meta lines).
 */

import { Text as RNText, StyleSheet, type TextProps, type TextStyle } from 'react-native';
import { color, font, type } from '../theme/tokens';

type Props = TextProps & { children?: React.ReactNode };

const base: TextStyle = { color: color.text };

export const H2 = ({ style, ...p }: Props) => <RNText {...p} style={[base, type.h2, style]} />;
export const H4 = ({ style, ...p }: Props) => <RNText {...p} style={[base, type.h4, style]} />;
export const H5 = ({ style, ...p }: Props) => <RNText {...p} style={[base, type.h5, style]} />;

/** The uppercase eyebrow. Always neutral-400 in this design. */
export const H6 = ({ style, ...p }: Props) => (
  <RNText {...p} style={[base, type.h6, { color: color.neutral[400] }, style]} />
);

export const Body = ({ style, ...p }: Props) => <RNText {...p} style={[base, type.body, style]} />;

/** .text-muted — the 55%-alpha secondary line that carries most of this design. */
export const Muted = ({ style, ...p }: Props) => (
  <RNText {...p} style={[{ fontFamily: font.regular, color: color.muted }, style]} />
);

/** Plain text at the body font, for one-off interface labels. */
export const T = ({ style, ...p }: Props) => (
  <RNText {...p} style={[{ fontFamily: font.regular, color: color.text }, style]} />
);

/** .card-title — heading font at 17px. */
export const CardTitle = ({ style, ...p }: Props) => (
  <RNText {...p} style={[base, type.cardTitle, style]} />
);

export const styles = StyleSheet.create({
  /** 500-weight interface text, e.g. a search result name or a video creator. */
  medium: { fontFamily: font.medium },
});
