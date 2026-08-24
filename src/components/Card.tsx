/**
 * .card — surface-filled content cards, plus the bordered blocks the detail and
 * intake screens use for evidence panels.
 */

import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import { color, elevation, font, radius, space } from '../theme/tokens';
import { Body, T } from './Text';

/*
 * Lets the stylesheet find a card that sits inside something pressable.
 *
 * `Pressable` already tints on hover, and on a card that tint is invisible: it paints the
 * pressable's own background, and the card's opaque surface sits on top of it. So every
 * row in the app responded to a pointer and every card — the dish cards, which are the
 * main thing anybody clicks — looked dead. Measured rather than assumed: a directory row
 * picks up `rgba(233, 233, 237, 0.05)` on hover, a dish card picks up nothing visible.
 *
 * Spread rather than passed, for the reason `Photo` gives: `dataSet` is a
 * react-native-web extension React Native's own types do not carry.
 */
const surfaceHook: object = Platform.OS === 'web' ? { dataSet: { surface: 'card' } } : {};

export function Card({
  children,
  style,
  elevated,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}) {
  return (
    <View {...surfaceHook} style={[styles.card, elevated ? elevation.sm : null, style]}>
      {children}
    </View>
  );
}

/** .card-kicker — the 10px uppercase accent eyebrow. */
export const CardKicker = ({ children }: { children: React.ReactNode }) => (
  <T style={styles.kicker}>{children}</T>
);

/** .card-body — 13px at 80% opacity. */
export const CardBody = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <Body style={[styles.body, style]}>{children}</Body>
);

/**
 * A bordered block: 1px divider outline on the page ground, no surface fill. Used
 * for the popular-version panel, the source rows, the video cards and the intake
 * findings. `accent` switches the border to accent-800 for the published state.
 */
export const Block = ({
  children,
  style,
  accent,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  accent?: boolean;
}) => <View style={[styles.block, accent ? { borderColor: color.accentRamp[800] } : null, style]}>{children}</View>;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    gap: space[2],
    padding: space[3],
    borderRadius: radius.md,
    backgroundColor: color.surface,
  },
  kicker: {
    fontFamily: font.regular,
    fontSize: 10,
    letterSpacing: 0.1 * 10,
    textTransform: 'uppercase',
    color: color.accent,
  },
  body: { fontSize: 13, lineHeight: 13 * 1.5, opacity: 0.8, marginBottom: 0 },
  block: {
    borderWidth: 1,
    borderColor: color.divider,
    borderRadius: radius.md,
    padding: space[3],
  },
});
