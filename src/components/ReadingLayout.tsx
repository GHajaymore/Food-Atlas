/**
 * A page that is mostly an argument, laid out as one.
 *
 * `/how` measured at 1440 as a 640px column with **nothing beside it** on a 1,661px page.
 * The measure was right — 640px lines are what makes prose readable, and widening them
 * would be a worse answer than leaving the space empty. What was wrong is that the space
 * was empty: more than half the window held nothing while the reader scrolled past the
 * page's central claim to get back to it.
 *
 * ## Why the aside holds the claim rather than a summary of it
 *
 * The obvious thing to put in a rail is a table of contents, and on a page with four
 * headings that would be furniture. What a reader of `/how` actually keeps referring back
 * to is the pair of numbers — the ceiling a document cannot pass, and the score the badge
 * starts at — because every paragraph on the page is an argument about the distance
 * between them. Keeping that in view while the prose explains it is the difference
 * between reading an argument and remembering one.
 *
 * ## `CardGrid` is separate on purpose
 *
 * Six reference cards stacked in a column is a phone shape for the same reason a
 * directory of countries was: they are peers, read by scanning rather than in order, and
 * a column makes the reader scroll to compare two things that would fit side by side.
 * That is a different question from where the prose goes, so it is a different component.
 */

import { Children } from 'react';
import { StyleSheet, View } from 'react-native';
import { READABLE, useLayout } from '../theme/layout';
import { space } from '../theme/tokens';

const ASIDE_WIDTH = 320;

export function ReadingColumns({
  /** The argument up to the point the aside belongs at on a phone. */
  before,
  aside,
  /** The rest of the argument, which on a phone follows the aside. */
  after,
}: {
  before: React.ReactNode;
  aside: React.ReactNode;
  after: React.ReactNode;
}) {
  const { size } = useLayout();

  /*
   * The prose is taken in two pieces rather than one, and that is not fussiness.
   *
   * The first version took `prose` and `aside` and rendered them in that order on a
   * phone, which quietly moved the ceiling card from the middle of the argument to the
   * end of it — measured at y=1554 on a 375 screen, after the conclusion it is supposed
   * to set up. A rail on a desktop must not reorder a phone, and a component that takes
   * one blob of prose cannot avoid doing so.
   *
   * One column below desktop for the usual reason: a 760px window split into prose and a
   * 320px rail leaves the prose narrower than the measure the split exists to protect.
   */
  if (size !== 'desktop') {
    return (
      <>
        {before}
        {aside}
        {after}
      </>
    );
  }

  return (
    <View style={styles.row}>
      <View style={styles.prose}>
        {before}
        {after}
      </View>
      <View style={styles.aside}>{aside}</View>
    </View>
  );
}

/**
 * Reference cards as a grid rather than a column.
 *
 * Two per row rather than three even on a desktop: each card carries a name, a source
 * label and a sentence, and at a third of the column the sentence wraps to four lines and
 * the grid stops being scannable — which was the whole reason to make it a grid.
 */
export function CardGrid({ children }: { children: React.ReactNode }) {
  const { wide } = useLayout();
  const items = Children.toArray(children).filter(Boolean);

  if (!wide) return <>{children}</>;

  return (
    <View style={styles.grid}>
      {items.map((child, i) => (
        <View key={i} style={styles.cell}>
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 48 },
  /*
   * Capped at the readable measure, not merely given what is left over.
   *
   * Without the cap the column came out at 792px — the shell minus the rail — which is
   * longer than the measure this page exists to protect, and would have made the split a
   * worse answer than the empty space it replaced. `minWidth: 0` for the reason
   * RecordColumns spells out: one unbreakable string would otherwise push the layout
   * sideways.
   */
  prose: { flex: 1, minWidth: 0, maxWidth: READABLE },
  aside: { width: ASIDE_WIDTH, flexShrink: 0, gap: space[4] },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[3] },
  /* Just under half, so two sit per row and the pair is not squeezed by the gap. */
  cell: { width: '48%', minWidth: 0 },
});
