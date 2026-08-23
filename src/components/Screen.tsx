/**
 * The screen shell.
 *
 * The prototype draws a 390x844 device frame with a fake status bar. That shell is
 * prototype chrome, not part of the app — screens render edge-to-edge inside the
 * real safe area, with the design's constant 20px horizontal page padding, and the
 * scroll container owns vertical scrolling.
 *
 * ## Wide screens
 *
 * The column was capped at `PHONE_WIDTH` and centred, which stopped a single dish card
 * filling a 2,560px monitor and did nothing else — so on a desktop the atlas was a
 * 430px ribbon down the middle of an empty window. Correct proportions, and a fraction
 * of the room it had.
 *
 * The cap now comes from `useLayout`, so the shell grows in three steps while every
 * phone keeps exactly the layout it had. A screen that holds prose can opt back down to
 * `readable` with `measure`, because width is only useful to a grid: a line of text
 * 1,200px long is worse than one at 700 no matter how much monitor is available.
 */

import { forwardRef } from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewProps, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLayout } from '../theme/layout';
import { color, PAGE_PADDING } from '../theme/tokens';

interface Props extends ScrollViewProps {
  children: React.ReactNode;
  /** Bottom padding below the last element, per screen. */
  bottomPad?: number;
  contentStyle?: ViewStyle;
  /**
   * Cap the column at a readable measure instead of the full shell.
   *
   * For screens that are mostly running text — a record, the atlas page, support. A
   * grid of dish cards wants the width; an argument about evidence does not.
   */
  measure?: boolean;
}

export const Screen = forwardRef<ScrollView, Props>(function Screen(
  { children, bottomPad = 40, contentStyle, measure, ...props },
  ref,
) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();

  return (
    <View style={styles.ground}>
      <ScrollView
        ref={ref}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...props}
        contentContainerStyle={[
          styles.column,
          { maxWidth: measure ? layout.readable : layout.shell },
          {
            paddingTop: insets.top + 6,
            paddingBottom: bottomPad + insets.bottom,
            paddingHorizontal: layout.wide ? PAGE_PADDING * 2 : PAGE_PADDING,
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
  column: { width: '100%', alignSelf: 'center' },
});
