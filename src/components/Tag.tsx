/**
 * .tag — the small labels that carry classification throughout the app.
 *
 * Classification colour is carried by the emoji glyph only (🟢🟡🟠🔴⚪); the chip
 * itself stays neutral or accent. Introducing green/amber/red fills would break the
 * mono palette, so the label text always accompanies the glyph — that is also what
 * makes the classification readable without relying on colour.
 */

import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { color, font, radius } from '../theme/tokens';
import { Pressable } from './Pressable';
import { T } from './Text';

type Variant = 'neutral' | 'accent' | 'outline';

interface Props {
  label: string;
  variant?: Variant;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  fontSize?: number;
  /** Chips in a horizontal scroller must not wrap their text. */
  noWrap?: boolean;
}

export function Tag({ label, variant = 'neutral', onPress, style, fontSize = 11, noWrap }: Props) {
  const body = (
    <T
      style={[styles.label, styles[`${variant}Label`], { fontSize }, noWrap ? styles.noWrap : null]}
      numberOfLines={noWrap ? 1 : undefined}
    >
      {label}
    </T>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={[styles.tag, styles[variant], style]}
        tint={variant === 'neutral' ? 'neutral' : 'accent'}
      >
        {body}
      </Pressable>
    );
  }

  return <View style={[styles.tag, styles[variant], style]}>{body}</View>;
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: radius.tag,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  label: { fontFamily: font.regular, letterSpacing: 0.02 * 11 },
  noWrap: { flexShrink: 0 },

  neutral: { backgroundColor: color.neutral[800] },
  neutralLabel: { color: color.neutral[100] },

  accent: { backgroundColor: color.accentRamp[800] },
  accentLabel: { color: color.accentRamp[100] },

  outline: { borderColor: color.accent },
  outlineLabel: { color: color.accent },
});
