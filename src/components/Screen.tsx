/**
 * The screen shell.
 *
 * The prototype draws a 390x844 device frame with a fake status bar. That shell is
 * prototype chrome, not part of the app — screens render edge-to-edge inside the
 * real safe area, with the design's constant 20px horizontal page padding, and the
 * scroll container owns vertical scrolling.
 */

import { forwardRef } from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewProps, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, PAGE_PADDING, PHONE_WIDTH } from '../theme/tokens';

interface Props extends ScrollViewProps {
  children: React.ReactNode;
  /** Bottom padding below the last element, per screen. */
  bottomPad?: number;
  contentStyle?: ViewStyle;
}

export const Screen = forwardRef<ScrollView, Props>(function Screen(
  { children, bottomPad = 40, contentStyle, ...props },
  ref,
) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.ground}>
      <ScrollView
        ref={ref}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...props}
        contentContainerStyle={[
          styles.column,
          {
            paddingTop: insets.top + 6,
            paddingBottom: bottomPad + insets.bottom,
            paddingHorizontal: PAGE_PADDING,
          },
          contentStyle,
        ]}
      >
        {children}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  ground: { flex: 1, backgroundColor: color.bg },
  /**
   * This is a phone-first design — 390pt, one column, full-bleed photographs. On a
   * desktop browser it would otherwise stretch to the window width and a single dish
   * card would fill the screen. The column is capped and centred so the proportions
   * the design specifies survive; below the cap (every phone) this does nothing.
   */
  column: { width: '100%', maxWidth: PHONE_WIDTH, alignSelf: 'center' },
});
