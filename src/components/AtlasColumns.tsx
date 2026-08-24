/**
 * The Food Atlas page's shape.
 *
 * Same rule as `RecordColumns` and `FeedOrder`: this takes finished pieces and decides
 * only where they go, so no piece below it contains a `wide ? a : b`. The phone branch
 * returns today's sequence literally, which is what makes it checkable against the
 * previous file and what stops a desktop change reaching a phone.
 *
 * ## What the desktop shape is for
 *
 * The page does two jobs at once and a single column made them take turns: it is the way
 * into a country, and it is the atlas's own account of how incomplete it is. Stacked,
 * the second job was a thousand pixels below the first and most readers never met it.
 *
 * So on a wide screen the directory takes the main column with the two asks in a rail
 * beside it — a reader browsing to a country passes the invitation to add one without
 * being interrupted by it — and the coverage figures then get the full width beneath,
 * where the meters and the two tables can sit two-up instead of in a thin ribbon.
 *
 * The asks are a fixed 320 rather than a fraction, for the reason `RecordColumns` gives:
 * a card of running text should hold its proportions on a 1280 monitor and on a 2560 one.
 */

import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLayout } from '../theme/layout';
import { color, space } from '../theme/tokens';

const ASKS_WIDTH = 320;

export interface AtlasParts {
  /** Back row, title, and the coverage sentence. */
  intro: React.ReactNode;
  /** Every continent and country. */
  directory: React.ReactNode;
  /** The "How complete is this atlas?" heading, the three tiles, the concentration note. */
  figures: React.ReactNode;
  /** The five completeness meters. */
  meters: React.ReactNode[];
  /** Where the records are; confidence. */
  tables: React.ReactNode[];
  /** Grow the atlas; keeping it free. */
  asks: React.ReactNode[];
}

export function AtlasColumns({ intro, directory, figures, meters, tables, asks }: AtlasParts) {
  const { size } = useLayout();
  const keyed = (nodes: React.ReactNode[]) => nodes.map((node, i) => <Fragment key={i}>{node}</Fragment>);

  /*
   * One column below desktop, for the reason `RecordColumns` records: a 760px window
   * split into a directory and a 320px rail leaves both worse than stacked. The tablet
   * gets the wider shell and one column, which is the honest answer for that width.
   */
  if (size !== 'desktop') {
    return (
      <>
        {intro}
        {directory}
        <View style={styles.statsBlock}>
          {figures}
          {keyed(meters)}
          {keyed(tables)}
        </View>
        {keyed(asks)}
      </>
    );
  }

  return (
    <>
      {intro}

      <View style={styles.row}>
        <View style={styles.directory}>{directory}</View>
        <View style={styles.asks}>{keyed(asks)}</View>
      </View>

      <View style={styles.statsBlock}>
        {figures}
        {/* Meters and tables two-up. Each is a label, a bar and a number — a shape that
            gains nothing from 1,240px and reads better paired. */}
        <View style={styles.pairs}>
          {meters.map((meter, i) => (
            <View key={i} style={styles.pair}>
              {meter}
            </View>
          ))}
        </View>
        <View style={styles.pairs}>
          {tables.map((table, i) => (
            <View key={i} style={styles.pair}>
              {table}
            </View>
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 48 },
  /* `minWidth: 0` for the reason spelled out in RecordColumns: a flex child refuses to
     shrink below its widest unbreakable content, and one long country name would push
     the whole layout sideways. */
  directory: { flex: 1, minWidth: 0 },
  asks: { width: ASKS_WIDTH, flexShrink: 0, gap: space[4] },

  statsBlock: { marginTop: 30, paddingTop: 22, borderTopWidth: 1, borderTopColor: color.divider },
  pairs: { flexDirection: 'row', flexWrap: 'wrap', gap: space[6] },
  /* Just under half, so two sit per row and the third wraps rather than three being
     squeezed onto one. */
  pair: { width: '47%', minWidth: 0 },
});
