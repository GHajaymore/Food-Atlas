/**
 * Search's shape: filters beside the results on a desktop, folded away on a phone.
 *
 * Like `RecordColumns`, this owns the arrangement and the screen owns the content.
 * Neither the facet groups nor the result list knows the window width.
 *
 * ## The collapse is a phone affordance, and it should not survive the journey
 *
 * On a phone the facets are wrapped in `Refine` and closed by default, for a good
 * reason recorded on that call site: five groups of chips is a wall of controls standing
 * between a reader and their first result on a 390px screen.
 *
 * On a desktop that reasoning inverts. There is room for the filters *and* the results
 * at the same time, and hiding them behind a disclosure means a reader cannot see what
 * they are filtering by while reading what they got — which is most of what a filtered
 * search is for. Worse, it hides the state: a reader who narrowed to three results
 * yesterday comes back to a closed row and an inexplicably short list.
 *
 * So the desktop shows them open, always, in a column of their own. That is not the
 * phone design with more space; it is the answer for a screen where both fit.
 *
 * ## Why the sidebar is narrow and fixed
 *
 * Filters are chips and short labels — they do not get better with width, they just get
 * further apart. 260 holds two chips per row at this type scale, and everything left
 * over goes to the results, which is the part a reader came for.
 */

import { StyleSheet, View } from 'react-native';
import { useLayout } from '../theme/layout';
import { Refine } from './Refine';

const SIDEBAR = 260;

export function SearchColumns({
  filters,
  results,
  /** What the collapsed row says on a phone. Unused on desktop, where nothing collapses. */
  summary,
  count,
  label,
  emptyLabel,
}: {
  filters: React.ReactNode;
  results: React.ReactNode;
  summary: string;
  count: number;
  label: string;
  emptyLabel: string;
}) {
  const { size } = useLayout();

  /*
   * One column below desktop, including tablet. A 760px window split into 260 and 460
   * leaves the results narrower than a phone's, and the results are the point.
   */
  if (size !== 'desktop') {
    return (
      <>
        <Refine label={label} emptyLabel={emptyLabel} summary={summary} count={count}>
          {filters}
        </Refine>
        {results}
      </>
    );
  }

  return (
    <View style={styles.row}>
      <View style={styles.sidebar}>{filters}</View>
      <View style={styles.results}>{results}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 40, marginTop: 16 },
  sidebar: { width: SIDEBAR, flexShrink: 0 },
  /* `minWidth: 0` so one long dish name cannot push the column past its share and spill
     the row sideways — the commonest way a flex layout breaks. */
  results: { flex: 1, minWidth: 0 },
});
