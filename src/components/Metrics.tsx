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

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import type { MetricNote } from '../domain/metricNotes';
import { percentLabel, type CoverageRow, type Ratio, type Trend } from '../domain/metrics';
import { accentText, color, font, space, TAP_TARGET } from '../theme/tokens';
import { Pressable } from './Pressable';
import { H6, Muted, T } from './Text';

/**
 * A trend line, drawn only where there is a trend.
 *
 * Two points minimum. A single snapshot is a value, not a direction, and a flat line
 * through one point would assert a stability nobody has observed.
 */
function Sparkline({ points }: { points: number[] }) {
  if (points.length < 2) return null;

  const width = 56;
  const height = 16;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;

  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / span) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <Svg width={width} height={height} style={styles.spark}>
      {/* 2px line, one hue, no axis or grid — a sparkline carries shape, not values. */}
      <Polyline points={path} fill="none" stroke={color.accent} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
}

/**
 * The method behind a figure, opened on demand.
 *
 * Closed by default because a page of numbers each carrying three paragraphs is a
 * page nobody reads, and shown in full when asked because a number whose derivation
 * is unavailable is a number the reader has to take on trust — which is the one
 * thing this app asks of nobody.
 *
 * The caveat is last and is styled no more quietly than the rest. It is where a
 * flattering figure gets contradicted, and burying it would defeat the purpose.
 */
export function Explain({ note }: { note?: MetricNote }) {
  const [open, setOpen] = useState(false);
  if (!note) return null;

  return (
    <View style={styles.explain}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`How ${note.title} is counted`}
        tint="none"
        onPress={() => setOpen(!open)}
        /*
         * Eleven of these sit on the coverage screen, and at fourteen pixels tall they
         * were the smallest controls in the app — on the screen whose entire purpose is
         * to let a sceptical reader check the numbers. Padding grows the target; the
         * negative margin keeps the line where the design put it.
         */
        style={styles.explainHit}
      >
        <Muted style={styles.explainLink}>{open ? 'Hide how this is counted' : 'How is this counted?'}</Muted>
      </Pressable>

      {open ? (
        <View style={styles.explainBody}>
          <Muted style={styles.explainPara}>{note.counts}</Muted>
          <Muted style={styles.explainPara}>{note.method}</Muted>
          <Muted style={styles.explainPara}>{note.caveat}</Muted>
        </View>
      ) : null}
    </View>
  );
}

/** A headline count, optionally with its direction. The number is the chart. */
export function StatTile({
  value,
  label,
  trend,
  note,
}: {
  value: string;
  label: string;
  trend?: Trend | null;
  note?: MetricNote;
}) {
  return (
    <View style={styles.tile}>
      {/* Proportional figures: tabular-nums makes a large standalone number look loose. */}
      <T style={styles.tileValue}>{value}</T>

      {trend ? (
        <View style={styles.trendRow}>
          <Muted style={styles.delta}>
            {trend.delta > 0 ? '+' : ''}
            {trend.delta.toLocaleString()} in {trend.span}d
          </Muted>
          <Sparkline points={trend.points} />
        </View>
      ) : null}

      <Muted style={styles.tileLabel}>{label}</Muted>
      <Explain note={note} />
    </View>
  );
}

/** A single ratio against its whole, with the caveat that belongs to it. */
export function Meter({ ratio, note }: { ratio: Ratio; note?: MetricNote }) {
  return (
    <View style={styles.meter} accessibilityLabel={`${ratio.label}: ${ratio.count} of ${ratio.total}`}>
      <View style={styles.meterHead}>
        <T style={styles.meterLabel}>{ratio.label}</T>
        <Muted style={styles.meterValue}>
          {percentLabel(ratio.count, ratio.percent)} · {ratio.count.toLocaleString()}
        </Muted>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(ratio.percent, 0.6)}%` }]} />
      </View>
      <Muted style={styles.meterNote}>{ratio.note}</Muted>
      <Explain note={note} />
    </View>
  );
}

/** Seven-plus classes: a table, not seven colours. */
export function CoverageTable({
  title,
  rows,
  note,
}: {
  title: string;
  rows: CoverageRow[];
  note?: MetricNote;
}) {
  return (
    <View style={styles.table}>
      <H6 style={styles.tableTitle}>{title}</H6>
      {rows.map((row) => (
        <View key={row.label} style={styles.row}>
          <T style={styles.rowLabel}>{row.label}</T>
          {/* Aligned columns: tabular figures belong here, unlike on the tiles. */}
          <Muted style={styles.rowCount}>{row.count.toLocaleString()}</Muted>
          <Muted style={styles.rowPercent}>{percentLabel(row.count, row.percent)}</Muted>
        </View>
      ))}
      <Explain note={note} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, minWidth: 96 },
  tileValue: { fontFamily: font.heading, fontSize: 28, lineHeight: 28 * 1.12, color: accentText },
  tileLabel: { fontSize: 11, lineHeight: 11 * 1.4, marginTop: 2 },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  delta: { fontSize: 10, fontVariant: ['tabular-nums'] },
  spark: { flexShrink: 0 },

  explain: { marginTop: 6 },
  explainHit: { justifyContent: 'center', minHeight: TAP_TARGET, marginVertical: -14 },
  explainLink: { fontSize: 11, color: accentText },
  explainBody: { gap: 6, marginTop: 6, paddingLeft: 10, borderLeftWidth: 1, borderLeftColor: color.divider },
  explainPara: { fontSize: 11, lineHeight: 11 * 1.55 },

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
