/**
 * .card — surface-filled content cards, plus the bordered blocks the detail and
 * intake screens use for evidence panels.
 */

import { StyleSheet, View, type ViewStyle } from 'react-native';
import { color, elevation, font, radius, space } from '../theme/tokens';
import { Body, T } from './Text';

export function Card({
  children,
  style,
  elevated,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}) {
  return <View style={[styles.card, elevated ? elevation.sm : null, style]}>{children}</View>;
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
