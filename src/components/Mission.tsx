/**
 * The front door: what this atlas holds, what it asks, and what it costs.
 *
 * The feed opened straight onto shelves of dishes, which is right for somebody who
 * already knows what this is and wrong for everybody else. A first-time reader met a
 * food app with no way to learn that the records carry evidence, that most of them are
 * unfinished, or that the only thing which can finish them is a person who cooks.
 *
 * ## Set as a statement of scope, not as marketing
 *
 * An earlier draft asked the reader questions — "Cook one of these?", "Recognise
 * one?" — which reads as a landing page. This is an atlas, and an atlas states its
 * coverage the way a reference work does: labelled figures, declarative sentences, no
 * exclamation in the voice. The tone is a museum wall label, not a call to action.
 *
 * The figures are laid out as a definition list because that is what they are, and
 * because it lets a reader scan for the one number they care about instead of reading
 * a paragraph to find it.
 *
 * ## Every number is computed, not written
 *
 * The counts come from the catalogue at render time. A statement of scope quoting
 * figures that quietly go stale is the same failure as a confidence score that does
 * not match its own breakdown, and this project has already fixed one of those.
 *
 * ## It states what is not open
 *
 * Two of the things it asks for cannot be done yet — no contribution form is
 * configured and no confirmations endpoint exists. Asking for them over controls that
 * go nowhere is the dead-link problem `/contribute` and the donate button both already
 * refuse, so this reads the same switches and says which doors are shut. That is not
 * an apology: a reader told what is missing and why is being treated as somebody who
 * might fix it.
 */

import { StyleSheet, View } from 'react-native';
import { catalogue, catalogueStats } from '../data/catalogue';
import { isAuthentic, VALIDATIONS_REQUIRED } from '../domain/authenticity';
import { canConfirm } from '../domain/confirmations';
import { canContribute } from '../domain/contribution';
import { color, radius, space } from '../theme/tokens';
import { Disclosure } from './Disclosure';
import { H6, Muted, T } from './Text';

const n = (value: number) => value.toLocaleString();

/** One labelled figure. The label is the question; the value is the answer. */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <H6 style={styles.label} numberOfLines={1}>
        {label}
      </H6>
      <T style={styles.value}>{children}</T>
    </View>
  );
}

export function Mission() {
  const { total, countries } = catalogueStats;

  const documented = catalogue.filter((d) => d.steps.length || d.prepSummary.trim()).length;
  const authenticated = catalogue.filter((d) => isAuthentic(d.badgeLevel)).length;
  const share = Math.round((documented / Math.max(1, total)) * 100);
  const open = canContribute() || canConfirm();

  return (
    <View style={styles.wrap}>
      <H6 style={styles.eyebrow}>About this atlas</H6>

      <T style={styles.lead}>
        A record of how the world actually cooks — where each dish comes from, how it is made, and
        how much anybody has actually established about it.
      </T>

      <View style={styles.table}>
        <Row label="Coverage">
          {n(total)} dishes · {countries} countries
        </Row>
        <Row label="Method">
          {n(documented)} carry a written method — {share}% of the atlas
        </Row>
        <Row label="Authentic">
          {n(authenticated)}, each against evidence shown on the record
        </Row>
        <Row label="Cost">Free. No advertising, no accounts, no tracking, no funding.</Row>
      </View>

      <View style={styles.asks}>
        <H6 style={styles.eyebrow}>What the atlas asks</H6>
        <Muted style={styles.body}>
          Record how a dish is made where you live, in the words you use for it. Confirm one you
          know to be right. {VALIDATIONS_REQUIRED} confirmations from people connected to a place
          is the only route to Authentic — no source, however good, substitutes for them.
        </Muted>
      </View>

      <Disclosure summary="Why a source cannot do it instead">
        <Muted style={styles.body}>
          Published documentation cannot score above 43 here, and a record becomes Authentic at 55.
          The gap is closable only by people from the place. That is arithmetic in the scoring
          rather than a policy, and the six figures behind every score are printed on the record so
          it can be checked.
        </Muted>
        <Muted style={[styles.body, styles.spaced]}>
          It is also why the atlas stops where it does. Every free source has been read — encyclopaedias,
          cookbooks, heritage registers, gazetteers — and {n(total - documented)} records still have
          nothing recorded about how they are made. What is left was never written down.
        </Muted>
        {!open ? (
          <Muted style={[styles.body, styles.spaced, styles.pending]}>
            Neither route is open yet: there is nowhere to send a submission and nowhere to record a
            confirmation. Both are built and waiting on somewhere to put them.
          </Muted>
        ) : null}
      </Disclosure>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderColor: color.divider,
    borderRadius: radius.lg,
    padding: space[3],
    marginBottom: space[4],
    gap: space[3],
  },
  eyebrow: { marginBottom: 6 },
  lead: { fontSize: 14, lineHeight: 21, color: color.text },
  table: { gap: 7 },
  row: { flexDirection: 'row', alignItems: 'baseline', gap: space[2] },
  // Wide enough for the longest label without wrapping. "AUTHENTICATED" broke to two
  // lines at 104 and looked like a rendering fault; the labels were shortened and the
  // column widened, and numberOfLines makes the failure impossible rather than unlikely.
  label: { width: 92, marginBottom: 0 },
  value: { flex: 1, fontSize: 13, lineHeight: 19, color: color.muted },
  asks: { gap: 0 },
  body: { fontSize: 13, lineHeight: 20 },
  spaced: { marginTop: 8 },
  pending: { color: color.faint },
});
