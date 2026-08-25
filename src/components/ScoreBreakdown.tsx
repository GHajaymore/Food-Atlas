/**
 * The Authenticity Confidence panel.
 *
 * The caveat line is not decoration: the score states how strong the evidence is,
 * and explicitly does not claim that a number can settle cultural truth. It renders
 * whenever the score does.
 *
 * `scoreStyle: 'number-only'` in app settings drops the bars and keeps the number.
 */

import { scoreDimensionLabel } from '../domain/authenticity';
import { useCopy } from '../i18n';
import { StyleSheet, View } from 'react-native';
import { accentText, color, font, space } from '../theme/tokens';
import type { BreakdownRow } from '../domain/types';
import { Muted, T } from './Text';

interface Props {
  score: number;
  breakdown: BreakdownRow[];
  showBars: boolean;
}

export function ScoreBreakdown({ score, breakdown, showBars }: Props) {
  const copy = useCopy();
  return (
    <View style={styles.wrap}>
      <View style={styles.headline}>
        <T style={styles.score}>{score}</T>
        <Muted style={styles.scoreUnit}>/100 · {copy.authenticityConfidence}</Muted>
      </View>

      <Muted style={styles.caveat}>
        {copy.scoreCannotSettle}
      </Muted>

      {showBars ? (
        <View style={styles.rows}>
          {breakdown.map(([label, value]) => (
            <View
              key={label}
              style={styles.row}
              accessibilityLabel={copy.scoreOutOf100
                .replace('{label}', scoreDimensionLabel(copy, label))
                .replace('{value}', String(value))}
            >
              <T style={styles.label}>{scoreDimensionLabel(copy, label)}</T>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${value}%` }]} />
              </View>
              <Muted style={styles.value}>{value}</Muted>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 24 },
  headline: { flexDirection: 'row', alignItems: 'baseline', gap: space[2], marginBottom: 12 },
  score: { fontFamily: font.heading, fontSize: 36, lineHeight: 36 * 1.12, color: accentText },
  scoreUnit: { fontSize: 13 },
  caveat: { fontSize: 11, lineHeight: 11 * 1.45, marginTop: -6, marginBottom: 12 },

  rows: { gap: space[2] },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { fontSize: 12, width: 132, flexShrink: 0 },
  track: { flex: 1, height: 6, borderRadius: 999, backgroundColor: color.neutral[800], overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999, backgroundColor: color.accent },
  value: { fontSize: 12, width: 26, textAlign: 'right' },
});
