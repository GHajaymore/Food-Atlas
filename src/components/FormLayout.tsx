/**
 * The shape of a form, which is not the shape of a record.
 *
 * Measured at 1440 before this existed: `/propose` was eight fields each 640px wide,
 * stacked, with nothing beside any of them; `/contribute` was six. That is a phone form
 * that has been widened, and it is what Ajay meant by screens still behaving like mobile.
 *
 * ## Two column-shaped problems, two different answers
 *
 * **A form is one job with related parts**, unlike a record — where `RecordColumns` splits
 * identity from dossier because those are two jobs a reader does separately. So the
 * answer here is not a second column of fields: filling one column then jumping back up
 * to another is worse than scrolling, and every study of forms since the 1990s says so.
 *
 * What is wrong is narrower. A country and a region are **one question asked twice**, and
 * so are a name and the connection that qualifies it. Those belong on a line together;
 * everything else — the dish, the method, the ingredients — is a single answer that wants
 * its own width. Hence `FieldPair` for the first kind and nothing at all for the second.
 *
 * **The guidance should not be stacked on top of the work.** Both forms open with a card
 * explaining what happens to a submission, which on a phone is right — it is the first
 * thing to read — and on a desktop pushes every field below the fold to say something a
 * contributor wants *while* typing, not before. `FormColumns` puts it in a rail beside
 * them, which is the ordinary shape of a form on a website and costs nothing on a phone,
 * where the branch is the previous order exactly.
 */

import { Children } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLayout } from '../theme/layout';
import { space } from '../theme/tokens';

const ASIDE_WIDTH = 300;
const FIELDS_WIDTH = 620;

/**
 * Two fields that answer one question, side by side where there is room.
 *
 * Each child is given an equal share rather than its natural width, so a short label and
 * a long one still line up — a form whose boxes are different widths for no reason reads
 * as an accident.
 */
export function FieldPair({ children }: { children: React.ReactNode }) {
  const { wide } = useLayout();
  const items = Children.toArray(children).filter(Boolean);

  if (!wide || items.length < 2) return <>{children}</>;

  return (
    <View style={styles.pair}>
      {items.map((child, i) => (
        <View key={i} style={styles.half}>
          {child}
        </View>
      ))}
    </View>
  );
}

/**
 * The fields, and the explanation of what happens to them.
 *
 * `aside` is deliberately not a general slot for anything left over. It holds what a
 * contributor benefits from having in view while they type — what the form does, what is
 * required, what happens next — and nothing that belongs in the flow of answering.
 */
export function FormColumns({ fields, aside }: { fields: React.ReactNode; aside: React.ReactNode }) {
  const { size } = useLayout();

  /*
   * One column below desktop, for the reason `RecordColumns` records: a 760px window
   * split into fields and a 300px rail leaves the fields narrower than a phone gives
   * them, which is worse than stacking. On a phone the aside comes first, because there
   * it is an introduction rather than a companion.
   */
  if (size !== 'desktop') {
    return (
      <>
        {aside}
        {fields}
      </>
    );
  }

  return (
    <View style={styles.row}>
      <View style={styles.fields}>{fields}</View>
      <View style={styles.aside}>{aside}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  pair: { flexDirection: 'row', gap: space[4], alignItems: 'flex-start' },
  /* `minWidth: 0` for the reason RecordColumns spells out: without it a flex child
     refuses to shrink below its content and one long placeholder pushes the pair wider
     than the column it sits in. */
  half: { flex: 1, minWidth: 0 },

  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 48 },
  /* Capped rather than flexible. A text field wider than about 620 invites an answer
     nobody wants to type and nobody wants to read back. */
  fields: { flex: 1, minWidth: 0, maxWidth: FIELDS_WIDTH },
  aside: { width: ASIDE_WIDTH, flexShrink: 0, gap: space[4] },
});
