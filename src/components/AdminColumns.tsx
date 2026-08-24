/**
 * The admin console's shape.
 *
 * The last screen still laid out as a phone. At 1440 it was one column running the full
 * 1,240px, which on a settings form meant a **1,160px-wide text box for a two-digit
 * number** — the single most literal example of what Ajay has been objecting to. Width
 * had been handed to the one control on the page that cannot use any.
 *
 * ## The split is by how often you touch it
 *
 * **Configuration** — three thresholds, a switch, the token, and Save. Read carefully,
 * changed rarely, and two of the numbers re-badge every record in the atlas. It is a
 * form, so it stays narrow: a form field wider than its longest plausible value invites
 * the reader to expect a longer value.
 *
 * **Operations** — the moderation queue, the refresh queue, the analytics. Looked at
 * often, mostly lists, and the part that actually benefits from room.
 *
 * Side by side they stop taking turns. The previous order buried analytics below three
 * queues and a form, which is a long way to scroll for the numbers most likely to be
 * wanted on any given visit.
 *
 * Same rule as `RecordColumns`, `SearchColumns`, `FeedOrder` and `AtlasColumns`: this
 * owns the arrangement, nothing it renders knows the window width, and the phone branch
 * is the previous sequence moved rather than rewritten.
 */

import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLayout } from '../theme/layout';
import { space } from '../theme/tokens';

/**
 * Wide enough for the longest label and its note, narrow enough that a numeric field
 * inside it never pretends to want more than two digits.
 */
const FORM_WIDTH = 420;

export interface AdminParts {
  /** What these settings change. */
  intro: React.ReactNode;
  /** The thresholds, the proposals switch, and the blast-radius preview. */
  settings: React.ReactNode;
  /** Administrator token, any message, and Save. */
  credentials: React.ReactNode;
  /** Moderation, the refresh queue, analytics. */
  panels: React.ReactNode[];
}

export function AdminColumns({ intro, settings, credentials, panels }: AdminParts) {
  const { size } = useLayout();
  const keyed = panels.map((panel, i) => <Fragment key={i}>{panel}</Fragment>);

  /*
   * One column below desktop. A 760px window split into a 420 form and what is left
   * gives the queues less room than a phone gives them, and those queues are lists of
   * dish names and reasons — the thing that suffers first when a column narrows.
   */
  if (size !== 'desktop') {
    return (
      <>
        {intro}
        {settings}
        {credentials}
        {keyed}
      </>
    );
  }

  return (
    <View style={styles.row}>
      <View style={styles.form}>
        {intro}
        {settings}
        {credentials}
      </View>
      <View style={styles.operations}>{keyed}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 48 },
  form: { width: FORM_WIDTH, flexShrink: 0 },
  /* `minWidth: 0` for the reason RecordColumns spells out: a flex child will not shrink
     below its widest unbreakable content, and one long dish name in the moderation queue
     would push the whole console sideways. */
  operations: { flex: 1, minWidth: 0, gap: space[6] },
});
