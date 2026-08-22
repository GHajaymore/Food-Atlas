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
    /*
     * The tap target, extended past the ink.
     *
     * A tag is 22px tall by design, and that is right: a row of six chips is the feed's
     * primary control and they have to fit across a phone. 22px is also half the 44px a
     * finger needs — so on a phone-first app the six most-used controls on the home
     * screen were the hardest to hit on it.
     *
     * Two mechanisms, because one is not enough. `hitSlop` is the idiomatic React
     * Native answer and works on the phone; **react-native-web ignores it entirely** —
     * checked, not assumed: there is no pseudo-element and no padding change on the
     * rendered button. So the target is also grown structurally, with padding on an
     * outer pressable that a negative margin gives back to the layout. The visible pill
     * is an inner view and keeps its own size, border and background.
     *
     * Eleven each side takes 22 to 44 exactly, and the chip row already sits in a 16px
     * gap above and below, so the larger target reaches neither the place selector nor
     * the Refine row beneath it.
     */
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={[styles.hit, style]}
        tint={variant === 'neutral' ? 'neutral' : 'accent'}
        hitSlop={{ top: 11, bottom: 11, left: 4, right: 4 }}
      >
        <View style={[styles.tag, styles[variant]]}>{body}</View>
      </Pressable>
    );
  }

  return <View style={[styles.tag, styles[variant], style]}>{body}</View>;
}

const styles = StyleSheet.create({
  // The touch box. Padding grows it to 44; the negative margin hands that space back
  // to the layout, so the row is laid out exactly as it was before.
  hit: {
    alignSelf: 'flex-start',
    paddingVertical: 11,
    marginVertical: -11,
    // And four each side, which takes the shortest chip — "All", 36px wide — to 44.
    // The row sets an 8px gap between chips, so two neighbouring targets meet exactly
    // and never overlap.
    paddingHorizontal: 4,
    marginHorizontal: -4,
  },
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
