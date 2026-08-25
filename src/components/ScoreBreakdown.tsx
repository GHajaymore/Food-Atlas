/**
 * The Authenticity Confidence panel — and the one thing on the record that nothing else
 * on the internet has.
 *
 * ## What changed and why
 *
 * It was six labelled bars in a flat list. Every number on it was true and the panel said
 * nothing: a reader saw six values between 0 and 100 and had no way to tell that three of
 * them are answerable from a library and three are not. The project's entire argument —
 * published sources cap out below the threshold, and only people can close the gap — lived
 * on `/how`, a page most readers never open, in prose.
 *
 * So the panel states it structurally instead of describing it:
 *
 * **The scale.** One 0–100 track carrying the record's score, with the documented ceiling
 * and the Authentic threshold marked on it. The distance between those two marks is the
 * gap the whole project exists to close, and it is now a thing you can see rather than a
 * sentence you have to read and believe.
 *
 * **The two groups.** The six dimensions split by who can answer them, with the split
 * coming from `answeredBy` in the domain so this panel and `/how` cannot drift. The
 * people-answered bars are drawn differently — an outlined track rather than a filled one
 * — because they are a different kind of claim, not a lower one.
 *
 * ## What it must not become
 *
 * The caveat stays, and stays first. The score states how strong the evidence is and
 * explicitly does not claim a number can settle cultural truth; a panel that got prettier
 * while quietly dropping that line would be worse than the flat list it replaced.
 *
 * And the marks are read from settings, not typed here. `/how` and `Mission` already
 * derive the same two figures from the same place, and a fourth copy of "43" hard-coded
 * into a component is how an app comes to contradict itself after somebody moves a
 * threshold in the admin console.
 *
 * `scoreStyle: 'number-only'` in app settings drops the bars and the scale, and keeps the
 * number and the caveat.
 */

import { answeredBy, scoreDimensionLabel } from '../domain/authenticity';
import { useCopy } from '../i18n';
import { StyleSheet, View } from 'react-native';
import { accentText, color, font, space } from '../theme/tokens';
import { settings } from '../data/settings';
import type { BreakdownRow } from '../domain/types';
import { Muted, T } from './Text';

/**
 * The best a record can reach on published sources alone.
 *
 * Six dimensions, three of which no document can answer, so the arithmetic caps here.
 * `/how` and `Mission` derive it the same way; all three have to move together or the app
 * contradicts itself on the page that argues its figures are checkable.
 */
const DOCUMENTED_CEILING = 43;

interface Props {
  score: number;
  breakdown: BreakdownRow[];
  showBars: boolean;
}

/** One dimension: its name, its value, and a bar drawn for who can answer it. */
function Dimension({ label, value, from }: { label: string; value: number; from: 'documents' | 'people' }) {
  const people = from === 'people';
  return (
    <View style={styles.row}>
      <T style={styles.label}>{label}</T>
      <View style={[styles.track, people ? styles.trackPeople : null]}>
        <View style={[styles.fill, people ? styles.fillPeople : null, { width: `${value}%` }]} />
      </View>
      <Muted style={styles.value}>{value}</Muted>
    </View>
  );
}

export function ScoreBreakdown({ score, breakdown, showBars }: Props) {
  const copy = useCopy();
  const { authenticAt } = settings;

  const documents = breakdown.filter(([label]) => answeredBy(label) === 'documents');
  const people = breakdown.filter(([label]) => answeredBy(label) === 'people');

  const group = (rows: BreakdownRow[], heading: string, from: 'documents' | 'people') =>
    rows.length ? (
      <View style={styles.group}>
        <Muted style={[styles.groupHeading, from === 'people' ? styles.groupHeadingPeople : null]}>{heading}</Muted>
        {rows.map(([label, value]) => (
          <Dimension key={label} label={scoreDimensionLabel(copy, label)} value={value} from={from} />
        ))}
      </View>
    ) : null;

  return (
    <View style={styles.wrap}>
      <View style={styles.headline}>
        <T style={styles.score}>{score}</T>
        <Muted style={styles.scoreUnit}>/100 · {copy.authenticityConfidence}</Muted>
      </View>

      <Muted style={styles.caveat}>{copy.scoreCannotSettle}</Muted>

      {showBars ? (
        <>
          {/*
           * The scale, and the reason this panel exists.
           *
           * Two marks on one track: where published sources stop, and where Authentic
           * begins. A reader who never opens /how still sees that there is a distance
           * between them and that this record sits somewhere along it.
           */}
          <View
            style={styles.scale}
            accessibilityLabel={copy.scoreOutOf100
              .replace('{label}', copy.authenticityConfidence)
              .replace('{value}', String(score))}
          >
            <View style={styles.scaleTrack}>
              <View style={[styles.scaleFill, { width: `${Math.max(0, Math.min(100, score))}%` }]} />
              <View style={[styles.tick, styles.tickDocs, { left: `${DOCUMENTED_CEILING}%` }]} />
              <View style={[styles.tick, styles.tickAuthentic, { left: `${authenticAt}%` }]} />
            </View>
            {/* A row each, so neither label can land on the other whichever one wraps. */}
            <View style={styles.scaleLabels}>
              <View style={styles.scaleLabelRow}>
                <View style={{ width: `${DOCUMENTED_CEILING}%` }} />
                <Muted style={styles.scaleLabel} numberOfLines={2}>
                  {DOCUMENTED_CEILING} · {copy.scaleDocumentsStop}
                </Muted>
              </View>
              <View style={styles.scaleLabelRow}>
                <View style={{ width: `${authenticAt}%` }} />
                <Muted style={[styles.scaleLabel, styles.scaleLabelAuthentic]} numberOfLines={2}>
                  {authenticAt} · {copy.scaleAuthenticBegins}
                </Muted>
              </View>
            </View>
          </View>

          {group(documents, copy.answeredByDocuments, 'documents')}
          {group(people, copy.answeredByPeople, 'people')}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 24 },
  headline: { flexDirection: 'row', alignItems: 'baseline', gap: space[2], marginBottom: 12 },
  score: { fontFamily: font.heading, fontSize: 36, lineHeight: 36 * 1.12, color: accentText },
  scoreUnit: { fontSize: 13 },
  caveat: { fontSize: 11, lineHeight: 11 * 1.45, marginTop: -6, marginBottom: 16 },

  /* Room below the track for two labels that may each take two lines on a phone. */
  scale: { marginBottom: space[8] },
  scaleTrack: { height: 10, borderRadius: 999, backgroundColor: color.neutral[900], overflow: 'visible' },
  scaleFill: { height: '100%', borderRadius: 999, backgroundColor: color.accent },
  /* Full height and a little beyond, so a mark reads as a line across the scale rather
     than as a segment of it. */
  tick: { position: 'absolute', top: -3, width: 1, height: 16 },
  tickDocs: { backgroundColor: color.neutral[500] },
  tickAuthentic: { backgroundColor: accentText },

  scaleLabels: { marginTop: 8, gap: 2 },
  /*
   * One row per label, each pushed out to its mark by a spacer rather than positioned
   * absolutely over the track.
   *
   * Three versions of this were wrong, and each was wrong in a way worth recording. The
   * marks sit at 43% and 55%, which on a real column is about twenty-five pixels apart:
   * sharing one line put the labels twenty-seven pixels into each other. Giving the
   * second one a downward offset did not fix it, because the first label wraps to two
   * lines at a readable width and its second line landed on the second label. Giving each
   * a row of a fixed height still left three pixels, because an absolutely positioned
   * label is outside its row's flow and `wideType` scales the text but not the number
   * typed into the stylesheet.
   *
   * So nothing here is a measured constant. The spacer takes the same percentage as the
   * tick, the label flows after it, and each row is exactly as tall as the label it
   * holds — at any width, in any language, at either type size.
   */
  scaleLabelRow: { flexDirection: 'row' },
  /* Running right from the mark rather than centred on it: a centred label starts left of
     the mark it names, which reads as labelling the wrong thing. */
  scaleLabel: { flexShrink: 1, fontSize: 9.5, lineHeight: 12, maxWidth: 130, paddingLeft: 4 },
  scaleLabelAuthentic: { color: accentText },

  group: { marginBottom: space[6] },
  groupHeading: {
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: space[3],
    color: color.neutral[500],
  },
  /* The half of the score that no library can supply, marked as its own kind of claim
     rather than as a weaker one. */
  groupHeadingPeople: { color: accentText },

  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: space[2] },
  label: { fontSize: 12, width: 132, flexShrink: 0 },
  track: { flex: 1, height: 6, borderRadius: 999, backgroundColor: color.neutral[800], overflow: 'hidden' },
  /* Outlined rather than filled: a different kind of evidence, drawn differently. */
  trackPeople: { backgroundColor: 'transparent', borderWidth: 1, borderColor: color.neutral[700] },
  fill: { height: '100%', borderRadius: 999, backgroundColor: color.accent },
  fillPeople: { backgroundColor: accentText },
  value: { fontSize: 12, width: 26, textAlign: 'right' },
});
