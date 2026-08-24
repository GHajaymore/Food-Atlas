/**
 * Press feedback.
 *
 * The design system requires themed interaction states, never platform defaults:
 * "every interactive element gets an accent-derived tint on hover and one ramp step
 * further on press". React Native has no hover on touch, so the press tint is the
 * one that matters; on web, react-native-web maps `hovered` too.
 */

import { Platform, Pressable as RNPressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { accentAlpha } from '../theme/tokens';

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** Rows and list items tint from the text colour instead — see .btn-secondary. */
  tint?: 'accent' | 'neutral' | 'none';
  children?: React.ReactNode;
};

/*
 * Asks the injected stylesheet for a transition, so a tint eases rather than snaps.
 *
 * Web only, and spread rather than passed as a prop because `dataSet` is a
 * react-native-web extension that React Native's own types do not carry —
 * `Photo.tsx` resolves the same problem the same way for its blend.
 *
 * One tag here covers every interactive element in the app, because they all come
 * through this component. On native nothing changes: the press tint is instant by
 * platform convention and correct that way.
 */
const motionProps: object = Platform.OS === 'web' ? { dataSet: { motion: 'tap' } } : {};

const TINTS = {
  accent: { hover: accentAlpha(12), press: accentAlpha(22) },
  neutral: { hover: 'rgba(233, 233, 237, 0.05)', press: 'rgba(233, 233, 237, 0.10)' },
} as const;

export function Pressable({ style, tint = 'accent', children, ...props }: Props) {
  return (
    <RNPressable
      {...motionProps}
      {...props}
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => [
        style,
        tint !== 'none' && pressed && { backgroundColor: TINTS[tint].press },
        tint !== 'none' && hovered && !pressed && { backgroundColor: TINTS[tint].hover },
      ]}
    >
      {children}
    </RNPressable>
  );
}
