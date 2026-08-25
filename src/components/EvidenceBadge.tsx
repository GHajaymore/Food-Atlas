/**
 * The score, shown as the thing that makes this atlas different.
 *
 * Ajay has asked several times for the app to differentiate itself from social media and
 * from every other food site, and the honest problem was never that the difference did
 * not exist — it was that the difference was rendered at ten pixels in grey in the
 * corner of a card, under a photograph, in the same visual register as a licence
 * attribution.
 *
 * Every food site on the internet has photographs and names. **A grid where each tile
 * carries `⚪ 12` or `🟢 58` is the differentiator**, working before anybody clicks
 * anything, and it costs nothing to show because the number was already computed.
 *
 * ## Why the number and the word, and not one or the other
 *
 * "58" alone means nothing to somebody who has not read `/how`. "Authentic" alone is the
 * unexplained assertion this project refuses everywhere else. Together they teach the
 * scale on sight: after four or five cards a reader has worked out that green is high,
 * that most things are grey, and that the number is out of a hundred — without a legend
 * and without being told.
 *
 * ## Unscored is shown, not hidden
 *
 * 10,213 records have no score at all, and they render as "Not scored" rather than
 * vanishing or borrowing a zero. A zero would be a claim about the food; the absence is
 * a claim about the evidence, and those are different sentences. It is the same reason
 * `assess` returns `null` rather than 0.
 */

import { useCopy } from '../i18n';
import { StyleSheet, View } from 'react-native';
import { accentText, color, font, radius, space } from '../theme/tokens';
import { T } from './Text';

type Size = 'card' | 'row' | 'hero';

export function EvidenceBadge({
  icon,
  label,
  score,
  size = 'card',
}: {
  icon: string;
  /** The classification, e.g. "Authentic — Local". */
  label: string;
  /** 0–100, or null where the record has not been assessed. */
  score: number | null;
  size?: Size;
}) {
  const copy = useCopy();
  const scored = score !== null;

  return (
    <View style={[styles.wrap, size === 'hero' ? styles.wrapHero : null]}>
      <T style={[styles.icon, SIZES[size].icon]}>{icon}</T>

      {scored ? (
        <>
          <T style={[styles.score, SIZES[size].score]}>{score}</T>
          {/* Deliberately quieter than the number: the denominator is context, and
              repeating "/100" at full weight on forty cards is noise. */}
          <T style={[styles.of, SIZES[size].of]}>/100</T>
        </>
      ) : (
        <T style={[styles.unscored, SIZES[size].of]}>{copy.notScored}</T>
      )}

      {size !== 'card' ? <T style={[styles.label, SIZES[size].of]}>{label}</T> : null}
    </View>
  );
}

/**
 * Three sizes, because the same fact needs different weight in three places.
 *
 * `card` is a grid tile — the number does the work and the classification is dropped,
 * because the icon already carries it and a wrapped label breaks the grid. `row` is a
 * list item, where there is width for the word. `hero` is the record itself, where this
 * is the headline finding rather than a marker.
 */
const SIZES: Record<Size, { icon: object; score: object; of: object }> = {
  card: { icon: { fontSize: 11 }, score: { fontSize: 15 }, of: { fontSize: 10 } },
  row: { icon: { fontSize: 12 }, score: { fontSize: 16 }, of: { fontSize: 11 } },
  hero: { icon: { fontSize: 16 }, score: { fontSize: 30 }, of: { fontSize: 13 } },
};

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  wrapHero: {
    alignSelf: 'flex-start',
    paddingVertical: space[2],
    paddingHorizontal: space[3],
    borderWidth: 1,
    borderColor: color.divider,
    borderRadius: radius.md,
    gap: 5,
  },
  icon: { lineHeight: 18 },
  /*
   * The figure carries the heading face and the text colour rather than the accent.
   *
   * Accent on every score would put the app's loudest colour on eighteen thousand cards
   * and leave nothing for the things a reader can act on. The classification glyph is
   * already the colour signal — that is what `badgeIcon` is for, and why the palette
   * note says classification colour is carried by the glyph only.
   */
  score: { fontFamily: font.heading, color: color.text, fontVariant: ['tabular-nums'] },
  of: { color: color.meta },
  unscored: { color: color.meta },
  label: { color: accentText },
});
