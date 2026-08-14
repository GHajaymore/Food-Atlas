/**
 * The atlas's own numbers.
 *
 * Form follows the data's job rather than reaching for charts:
 *   - headline counts are **stat tiles** — the number is the chart
 *   - each ratio is a **meter**, one hue on a recessive track
 *   - the continent and confidence breakdowns are **tables**, because seven classes
 *     carrying meaning is past the point where colour separates them
 *
 * No categorical palette is introduced. Nocturne is a mono system — "do not
 * introduce green/amber/red fills, it breaks the mono palette" — so every fill here
 * is the one accent on the neutral track, which is also the sequential treatment
 * these ratios want. Values wear text tokens, never the fill colour.
 */

import { StyleSheet, View } from 'react-native';
import type { CoverageRow, Ratio } from '../domain/metrics';
import { accentText, color, font, space } from '../theme/tokens';
import { H6, Muted, T } from './Text';

/** A headline count. The number is the chart — no one-bar bar charts. */
export function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.tile}>
      {/* Proportional figures: tabular-nums makes a large standalone number look loose. */}
      <T style={styles.tileValue}>{value}</T>
      <Muted style={styles.tileLabel}>{label}</Muted>
    </View>
  );
}

/** A single ratio against its whole, with the caveat that belongs to it. */
export function Meter({ ratio }: { ratio: Ratio }) {
  return (
    <View style={styles.meter} accessibilityLabel={`${ratio.label}: ${ratio.count} of ${ratio.total}`}>
      <View style={styles.meterHead}>
        <T style={styles.meterLabel}>{ratio.label}</T>
        <Muted style={styles.meterValue}>
          {ratio.percent}% · {ratio.count.toLocaleString()}
        </Muted>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(ratio.percent, 0.6)}%` }]} />
      </View>
      <Muted style={styles.meterNote}>{ratio.note}</Muted>
    </View>
  );
}

/** Seven-plus classes: a table, not seven colours. */
export function CoverageTable({ title, rows }: { title: string; rows: CoverageRow[] }) {
  return (
    <View style={styles.table}>
      <H6 style={styles.tableTitle}>{title}</H6>
      {rows.map((row) => (
        <View key={row.label} style={styles.row}>
          <T style={styles.rowLabel}>{row.label}</T>
          {/* Aligned columns: tabular figures belong here, unlike on the tiles. */}
          <Muted style={styles.rowCount}>{row.count.toLocaleString()}</Muted>
          <Muted style={styles.rowPercent}>{row.percent}%</Muted>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, minWidth: 96 },
  tileValue: { fontFamily: font.heading, fontSize: 28, lineHeight: 28 * 1.12, color: accentText },
  tileLabel: { fontSize: 11, lineHeight: 11 * 1.4, marginTop: 2 },

  meter: { marginBottom: 16 },
  meterHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: space[2] },
  meterLabel: { fontSize: 13, flex: 1 },
  meterValue: { fontSize: 12, fontVariant: ['tabular-nums'] },
  track: {
    height: 6,
    marginTop: 6,
    borderRadius: 999,
    backgroundColor: color.neutral[800],
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 999, backgroundColor: color.accent },
  meterNote: { fontSize: 11, lineHeight: 11 * 1.5, marginTop: 6 },

  table: { marginTop: 8 },
  tableTitle: { marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: color.divider,
  },
  rowLabel: { fontSize: 13, flex: 1 },
  rowCount: { fontSize: 12, width: 64, textAlign: 'right', fontVariant: ['tabular-nums'] },
  rowPercent: { fontSize: 12, width: 44, textAlign: 'right', fontVariant: ['tabular-nums'] },
});
