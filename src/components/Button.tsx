/**
 * .btn — actions.
 *
 * Nocturne's rule: buttons are outlined, never solid-filled. The primary is a 1px
 * accent border on transparent with accent text.
 */

import { StyleSheet, View, type ViewStyle } from 'react-native';
import { color, font, radius, space, TAP_TARGET } from '../theme/tokens';
import { Pressable } from './Pressable';
import { T } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  /** .btn-block — full width with a top margin. */
  block?: boolean;
  style?: ViewStyle;
  /** Override the 14px .btn type, for the small inline ▶ Video button. */
  fontSize?: number;
  compact?: boolean;
}

export function Button({ label, onPress, variant = 'primary', block, style, fontSize, compact }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      tint={variant === 'secondary' ? 'neutral' : 'accent'}
      style={[styles.btn, compact ? styles.compact : null, styles[variant], block ? styles.block : null, style]}
    >
      <T style={[styles.label, styles[`${variant}Label`], fontSize ? { fontSize } : null]}>{label}</T>
    </Pressable>
  );
}

/** A 44px icon button. The prototype draws 36px; accessibility requires 44 here. */
export function IconButton({
  onPress,
  children,
  label,
  style,
  accessibilityState,
}: {
  onPress?: () => void;
  children: React.ReactNode;
  label: string;
  style?: ViewStyle;
  /* For the icon buttons that disclose something rather than go somewhere. Without it a
     screen reader announces the phone menu control as a plain button and never says
     whether the panel it opens is currently open. */
  accessibilityState?: { expanded?: boolean; selected?: boolean };
}) {
  const content = <View style={styles.iconInner}>{children}</View>;
  if (!onPress) {
    return (
      <View accessibilityLabel={label} style={[styles.icon, style]}>
        {content}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={accessibilityState}
      onPress={onPress}
      style={[styles.icon, style]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: TAP_TARGET,
    paddingVertical: space[2],
    paddingHorizontal: space[3] * 1.2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  /*
   * Compact shrinks the type and the horizontal padding. It used to shrink the touch
   * target too — `minHeight: 0` — which made the "▶ Video" button beside a search result
   * 64x29 on a phone, against the 44 the handoff's accessibility note requires.
   *
   * The height stays. `Tag` solves the same problem by keeping a small pill inside a large
   * pressable, and that is the better answer where the pill has a border and a background
   * of its own; here the pressable *is* the pill, so separating them would mean restyling
   * every button in the app to catch three compact ones. A slightly taller small button is
   * the cheaper trade, and on a phone it is the right one anyway.
   */
  compact: { minHeight: TAP_TARGET, paddingVertical: 5, paddingHorizontal: 9, justifyContent: 'center' },
  label: { fontFamily: font.heading, fontSize: 14, lineHeight: 14 * 1.2 },

  primary: { borderColor: color.accent },
  primaryLabel: { color: color.accent },

  secondary: { borderColor: color.divider },
  secondaryLabel: { color: color.text },

  ghost: { borderColor: 'transparent', paddingHorizontal: space[1] },
  ghostLabel: { color: color.accent },

  block: { width: '100%', marginTop: space[2] },

  icon: {
    width: TAP_TARGET,
    height: TAP_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  iconInner: { alignItems: 'center', justifyContent: 'center' },
});
