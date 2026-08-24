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
import { SiteFooter } from './SiteFooter';

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
  /**
   * Suppress the site footer.
   *
   * For a screen that is a step in a flow rather than a page — the admin console, a form
   * mid-submission — where offering the whole site map at the bottom invites a reader to
   * navigate away from something they are in the middle of.
   */
  footer?: false;
}

export const Screen = forwardRef<ScrollView, Props>(function Screen(
  { children, bottomPad = 40, contentStyle, measure, footer, ...props },
  ref,
) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();

  /** The design's constant page padding, doubled where there is room for it. */
  const pagePad = { paddingHorizontal: layout.wide ? PAGE_PADDING * 2 : PAGE_PADDING };

  return (
    <View style={styles.ground}>
      <ScrollView
        ref={ref}
        keyboardShouldPersistTaps="handled"
        /*
         * Hidden on a phone, shown on anything wider.
         *
         * A hidden scrollbar is a phone convention and it is right there: the gesture is
         * direct, the bar would cover content, and every phone reader already knows a
         * list scrolls. On a desktop it is the opposite — the bar is the only thing that
         * says how much more there is, and the only way to drag straight to the bottom.
         * Hiding it made a long page look like a short one that had stopped.
         */
        showsVerticalScrollIndicator={layout.wide}
        {...props}
        /*
         * The scroll container is full width and the *columns inside it* are capped.
         *
         * It used to be the container itself, which is simpler and made the footer a
         * child of the reading measure: on `/support` that gave the whole site map 640px
         * and wrapped it into an orphaned column. A page whose article is narrow still
         * has a full-width foot — that is true of every publication — and it cannot be
         * expressed while one cap governs everything on the page.
         */
        contentContainerStyle={[
          { paddingTop: insets.top + 6, paddingBottom: bottomPad + insets.bottom },
          contentStyle,
        ]}
      >
        <View style={[styles.column, { maxWidth: measure ? layout.readable : layout.shell }, pagePad]}>
          {children}
        </View>
        {/*
         * Every page, from one place.
         *
         * Put here rather than added to twelve screens because a footer that is missing
         * from one page is worse than no footer — it reads as that page having failed to
         * finish. It renders nothing on a phone, where `SiteNav` is the colophon.
         *
         * Inside the scroll container, not below it: a foot that floats above the
         * content permanently is a toolbar, and it would eat vertical space on every
         * screen to say something a reader wants once, at the end.
         */}
        {footer === false ? null : (
          <View style={[styles.column, { maxWidth: layout.shell }, pagePad]}>
            <SiteFooter />
          </View>
        )}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  ground: { flex: 1, backgroundColor: color.bg },
  column: { width: '100%', alignSelf: 'center' },
});
