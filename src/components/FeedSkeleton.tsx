/**
 * What a reader looks at while sixteen megabytes arrive.
 *
 * It was a bare spinner and one line of text, held over the whole wait, and before that a
 * blank dark rectangle while the fonts loaded — two sequential holds with two different
 * appearances, then the entire page at once. On a phone connection that is the most
 * static thing the app does, and it is the first thing anybody sees.
 *
 * ## The parts that need no data render for real
 *
 * The wordmark, the tagline and the headline sentence depend on nothing being downloaded.
 * They are not placeholders here — they are the actual components, arriving immediately
 * and then simply staying. Only the figures, the lead photograph and the rails are
 * skeleton, because only those need the catalogue.
 *
 * That is what turns a blank hold into a page assembling itself, and it costs nothing: a
 * reader has something true to read within a few hundred milliseconds instead of a
 * spinner for several seconds.
 *
 * ## Nothing here claims progress
 *
 * No bar, no percentage, no "almost there". The app does not know how far along it is —
 * five files are in flight and a fetch reports nothing until it completes — so any
 * progress indicator would be an animation pretending to be a measurement. The pulse says
 * the page is waiting, which is exactly what is known.
 *
 * ## The shapes match what replaces them
 *
 * Every block is the size of the thing that will land in it, so nothing jumps when the
 * data arrives. A skeleton that reflows is worse than no skeleton: it turns one wait into
 * a wait plus a lurch.
 */

import { useCopy } from '../i18n';
import { Platform, StyleSheet, View } from 'react-native';
import { BRAND } from '../brand';
import { useLayout } from '../theme/layout';
import { color, PAGE_PADDING, radius, space } from '../theme/tokens';
import { Muted, T } from './Text';
import { Wordmark } from './Wordmark';

/* Spread rather than passed: dataSet is a react-native-web extension the RN types do not
   carry. Same resolution Photo.tsx uses for its blend. */
const pulse: object = Platform.OS === 'web' ? { dataSet: { motion: 'pulse' } } : {};

function Block({ style }: { style: object }) {
  return <View {...pulse} style={[styles.block, style]} />;
}

export function FeedSkeleton({
  /**
   * Whether the typefaces have arrived.
   *
   * Text drawn before Inter lands would swap face mid-wait, which is a worse flicker than
   * the one this is replacing — the type scale is meaningless in a fallback font. So the
   * first moments show shapes only, and the real words appear the instant they can be set
   * properly. One continuous appearance rather than blank, then spinner, then page.
   */
  fonts,
}: {
  fonts: boolean;
}) {
  const copy = useCopy();
  const layout = useLayout();
  const card = layout.card;

  return (
    <View style={styles.ground}>
      <View style={[styles.column, { maxWidth: layout.shell }]}>
        <View style={styles.header}>
          {fonts ? <Wordmark size={20} /> : <Block style={styles.wordmarkBar} />}
          {fonts ? null : <Block style={styles.controlBar} />}
        </View>

        {fonts ? (
          <Muted style={styles.tagline}>{BRAND.tagline}</Muted>
        ) : (
          <Block style={styles.taglineBar} />
        )}

        {/*
         * The headline is real from the moment it can be set. It is the sentence that says
         * what the atlas is, it needs nothing downloaded, and it is the reason a reader
         * waiting is not staring at furniture.
         */}
        {fonts ? (
          <T style={styles.headline}>{copy.missionHeadline}</T>
        ) : (
          <>
            <Block style={styles.headlineBar} />
            <Block style={styles.headlineBarShort} />
          </>
        )}

        {/* The lead photograph, at the aspect ratio the real one uses. */}
        {layout.wide ? null : <Block style={styles.lead} />}

        {/* A rail of cards at the exact size they will be, so the row does not resize. */}
        <View style={styles.rail}>
          {[0, 1, 2, 3, 4, 5].slice(0, layout.wide ? 6 : 3).map((i) => (
            <View key={i} style={styles.cardWrap}>
              <Block style={{ width: card, height: card, borderRadius: radius.md }} />
              <Block style={{ ...styles.line, width: card * 0.8 }} />
              <Block style={{ ...styles.line, width: card * 0.5 }} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ground: { flex: 1, backgroundColor: color.bg },
  column: { width: '100%', alignSelf: 'center', paddingHorizontal: PAGE_PADDING, paddingTop: 34 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  /* neutral[900] is the same tone the missing-photograph monogram uses, so an absent
     image and an unarrived one look like the same kind of nothing. */
  block: { backgroundColor: color.neutral[900], borderRadius: radius.sm },

  wordmarkBar: { width: 118, height: 20 },
  controlBar: { width: 92, height: 20 },
  taglineBar: { width: 190, height: 11, marginTop: 8 },
  tagline: { fontSize: 11, marginTop: 6 },

  headline: { fontFamily: 'Inter_700Bold', fontSize: 25, lineHeight: 31, color: color.text, marginTop: 26 },
  headlineBar: { width: '86%', height: 25, marginTop: 26 },
  headlineBarShort: { width: '54%', height: 25, marginTop: 8 },

  lead: { width: '100%', aspectRatio: 16 / 10, borderRadius: radius.lg, marginTop: space[6] },

  rail: { flexDirection: 'row', gap: 10, marginTop: space[8] },
  cardWrap: { gap: 6 },
  line: { height: 10 },
});
