/**
 * Press feedback.
 *
 * The design system requires themed interaction states, never platform defaults:
 * "every interactive element gets an accent-derived tint on hover and one ramp step
 * further on press". React Native has no hover on touch, so the press tint is the
 * one that matters; on web, react-native-web maps `hovered` too.
 */

import { Pressable as RNPressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { accentAlpha } from '../theme/tokens';

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** Rows and list items tint from the text colour instead — see .btn-secondary. */
  tint?: 'accent' | 'neutral' | 'none';
  children?: React.ReactNode;
};

const TINTS = {
  accent: { hover: accentAlpha(12), press: accentAlpha(22) },
  neutral: { hover: 'rgba(233, 233, 237, 0.05)', press: 'rgba(233, 233, 237, 0.10)' },
} as const;

export function Pressable({ style, tint = 'accent', children, ...props }: Props) {
  return (
    <RNPressable
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
