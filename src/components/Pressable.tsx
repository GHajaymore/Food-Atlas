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
  /**
   * This control leads to the page you are already on.
   *
   * Rendered as `aria-current="page"`, which is the attribute for exactly this and is
   * not the same as `aria-selected` — that one is for tabs and listbox options, and a
   * screen reader treats it differently.
   */
  current?: boolean;
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

/**
 * Turn React Native's accessibility state into the DOM attributes a browser understands.
 *
 * This version of react-native-web drops `accessibilityState` on the floor. Verified in
 * the deployed app rather than assumed: every `[role="button"]` and `[role="link"]` on a
 * phone screen carried `aria-label` and **nothing else** — no `aria-current`, no
 * `aria-expanded` — even though `TopBar` has been passing `accessibilityState` since the
 * masthead was built. So the visual mark said which section you were in and the
 * accessibility tree never did.
 *
 * Done here rather than at each call site so the fix reaches every control in the app at
 * once; everything interactive comes through this component, which is the same reason
 * the press transition is attached here.
 *
 * Spread as `object` because these are DOM attributes React Native's own prop types do
 * not carry — the same escape hatch `dataSet` above already uses.
 */
const ariaProps = (
  current?: boolean,
  state?: { expanded?: boolean; selected?: boolean; disabled?: boolean },
): object => {
  if (Platform.OS !== 'web') return {};
  const out: Record<string, unknown> = {};
  /* Only when true. `aria-current="false"` is valid and means "not current", which is
     noise on the fifty controls that were never candidates. */
  if (current) out['aria-current'] = 'page';
  if (state?.expanded !== undefined) out['aria-expanded'] = state.expanded;
  if (state?.selected !== undefined) out['aria-selected'] = state.selected;
  if (state?.disabled !== undefined) out['aria-disabled'] = state.disabled;
  return out;
};

const TINTS = {
  accent: { hover: accentAlpha(12), press: accentAlpha(22) },
  neutral: { hover: 'rgba(233, 233, 237, 0.05)', press: 'rgba(233, 233, 237, 0.10)' },
} as const;

export function Pressable({ style, tint = 'accent', current, children, ...props }: Props) {
  return (
    <RNPressable
      {...motionProps}
      {...props}
      {...ariaProps(current, props.accessibilityState)}
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
