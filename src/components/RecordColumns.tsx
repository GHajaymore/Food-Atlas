/**
 * The record page's shape, which is different on a desktop rather than wider.
 *
 * Ajay, repeatedly and correctly: the desktop was a phone layout that had been
 * stretched, and the symptom that gave it away was things rendering behind each other.
 * That is what happens when a component is asked to be two designs at once — every
 * `wide ? a : b` is a decision made in the wrong place, and the interactions between a
 * dozen of them are what nobody can hold in their head.
 *
 * So this component owns the arrangement and nothing else. It takes two finished pieces
 * of a record and decides where they go. Neither piece knows the window width, neither
 * has a branch in it, and adding a third layout later means adding a case here rather
 * than editing forty components.
 *
 * ## The split is by what a reader is doing, not by what fits
 *
 * **Identity** — the photograph, the name, the place, the badges — answers *what is
 * this*. It is short, it is looked at once, and it is what a reader needs kept in view
 * while reading the rest.
 *
 * **The dossier** — the method, the evidence, the sources, the confirmations — answers
 * *how do you know*. It is long, it is read in order, and it is the reason the page
 * exists.
 *
 * On a phone those stack, in that order, because there is one column and the question
 * "what is this" comes first. On a desktop they sit side by side, which is not a
 * space-filling exercise: it means the score breakdown stays visible while a reader
 * works down the method it describes, and those two things arguing with each other is
 * precisely what this atlas is about.
 *
 * The identity column is fixed at 360 rather than a fraction, so it holds its
 * proportions on a 1280 screen and on a 2560 one. Only the dossier grows, which is
 * right — it is the part made of sentences.
 */

import { StyleSheet, View, Platform, type ViewStyle } from 'react-native';
import { useLayout } from '../theme/layout';
import { space } from '../theme/tokens';

const IDENTITY_WIDTH = 360;

export function RecordColumns({
  identity,
  dossier,
}: {
  identity: React.ReactNode;
  dossier: React.ReactNode;
}) {
  const { size } = useLayout();

  /*
   * Two columns only at desktop, not at tablet.
   *
   * A 760px window split into 360 and 400 leaves the dossier narrower than a phone's,
   * which is worse than stacking. The tablet gets the wider shell and one column, which
   * is the honest answer for that width rather than a compromise between two designs.
   */
  if (size !== 'desktop') {
    return (
      <>
        {identity}
        {dossier}
      </>
    );
  }

  return (
    <View style={styles.row}>
      <View style={[styles.identity, STICKY]}>{identity}</View>
      <View style={styles.dossier}>{dossier}</View>
    </View>
  );
}

/*
 * The identity column stays in view while the dossier scrolls — approved by Ajay from a
 * mockup on 9 October. On a long record the photograph, name and badge scrolled away
 * after the first screen and left a 360px empty column beside the method for the rest
 * of the page. Capped at the window and scrollable on its own, so a record with a long
 * identity column can still be read to the end of it. Web only: a native screen stacks.
 */
const STICKY =
  Platform.OS === 'web'
    ? ({ position: 'sticky', top: 24, maxHeight: 'calc(100vh - 48px)', overflowY: 'auto' } as unknown as ViewStyle)
    : null;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 48 },
  identity: { width: IDENTITY_WIDTH, flexShrink: 0 },
  /*
   * `minWidth: 0` is not optional.
   *
   * A flex child defaults to `min-width: auto`, which means it refuses to shrink below
   * its widest unbreakable content — one long ingredient name or an unwrapped URL in a
   * source row then pushes the whole column wider than its share and the layout spills
   * sideways. This is the single most common way a flex row breaks.
   */
  dossier: { flex: 1, minWidth: 0 },
});
