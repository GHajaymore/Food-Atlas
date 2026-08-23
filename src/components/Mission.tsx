/**
 * The front door — the pitch, not a statement of scope.
 *
 * ## The hook was in the data all along
 *
 * Earlier drafts opened with what the atlas holds: 18,008 dishes, 157 countries, a
 * definition list of coverage. All true, and it asks nothing of anybody. The arresting
 * fact was sitting in the same numbers the whole time and being reported as a
 * percentage: **10,197 records — more than half — have nothing written down about how
 * they are made, in any language, anywhere a machine can reach.** That is not a
 * shortfall to apologise for. It is the reason the project exists, and it is the
 * sentence that makes a reader care.
 *
 * So the headline is the gap, the second paragraph is the stakes, and the ask follows
 * immediately while the reader is still holding the fact.
 *
 * ## Why it can ask without dishonesty
 *
 * The ask is a *rule*, not a claim: three people from a place can authenticate a dish,
 * and nothing else can. That is true today and enforced in the arithmetic — published
 * documentation cannot pass 43 and the badge starts at 55. Saying it recruits without
 * ever pretending anybody has turned up yet.
 *
 * ## The buttons go somewhere real
 *
 * `/contribute` is a working screen that explains what happens to a submission and
 * says plainly at the end that there is nowhere to send it yet. That is a destination,
 * so the control is honest. What the app refuses — see the donate button and
 * `requests.ts` — is a control that goes *nowhere*, and this is not one.
 *
 * ## Every figure is computed
 *
 * A pitch quoting numbers that quietly go stale is the same failure as a confidence
 * score that does not match its own breakdown, and this project has already fixed one
 * of those.
 */

import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { catalogue, catalogueStats } from '../data/catalogue';
import { isAuthentic, VALIDATIONS_REQUIRED } from '../domain/authenticity';
import { canConfirm } from '../domain/confirmations';
import { canContribute } from '../domain/contribution';
import { color, font, radius, space } from '../theme/tokens';
import { Button } from './Button';
import { Disclosure } from './Disclosure';
import { H6, Muted, T } from './Text';

const n = (value: number) => value.toLocaleString();

function Stat({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <View style={styles.stat}>
      <T style={[styles.figure, accent ? styles.figureAccent : null]}>{value}</T>
      <H6 style={styles.statLabel} numberOfLines={2}>
        {label}
      </H6>
    </View>
  );
}

export function Mission() {
  const { total, countries } = catalogueStats;

  const documented = catalogue.filter((d) => d.steps.length || d.prepSummary.trim()).length;
  const unwritten = total - documented;
  const authenticated = catalogue.filter((d) => isAuthentic(d.badgeLevel)).length;

  /*
   * Records carrying an institutional designation — the EU geographical-indications
   * register, a UNESCO inscription, or Italy's register of traditional products.
   * Counted from the sources actually on each record rather than from a flag, so the
   * figure cannot drift away from what a reader can click through and check.
   */
  const heritage = catalogue.filter((d) =>
    d.sources.some((src) => /eAmbrosia|UNESCO|Prodotti/.test(`${src.publisher} ${src.title}`)),
  ).length;

  const open = canContribute() || canConfirm();

  return (
    <View style={styles.wrap}>
      {/*
       * Leads with what the atlas holds, not with what it lacks.
       *
       * An earlier headline opened "57% of the food in this atlas has never been
       * written down". The figure was correct and reconciled — 7,811 documented plus
       * 10,197 unwritten is exactly 18,008 — but as the *first* sentence it framed the
       * project by its hole, and a reader met an app that sounded half empty.
       *
       * The gap is a reason to help rather than a description of the product, so it
       * moved down into the ask, where it does that job instead. Nothing was softened:
       * the same count appears below, in figures rather than as a percentage, because
       * "10,197 records" is a thing a reader can picture and "57%" is a verdict.
       */}
      <T style={styles.headline}>{n(total)} dishes, and the evidence behind every one.</T>

      <Muted style={styles.stakes}>
        From {countries} countries — each record showing where it came from, who says so, and how
        much has actually been established. {n(heritage)} carry a protected designation or a
        heritage listing.
      </Muted>

      <View style={styles.stats}>
        <Stat value={n(total)} label="dishes" />
        <Stat value={String(countries)} label="countries" />
        <Stat value={n(documented)} label="documented" />
        {/* The accent goes on the only figure a person, rather than a source, can move. */}
        <Stat value={n(authenticated)} label="authentic" accent />
      </View>

      <View style={styles.callout}>
        <T style={styles.ask}>
          {n(unwritten)} of these have no method recorded. {VALIDATIONS_REQUIRED} people from a
          place can fix one for good.
        </T>
        <Muted style={styles.askBody}>
          Nobody has set down how they are made — not in English, not in any language, nowhere a
          machine can reach. No archive, no encyclopaedia and nothing automatic can authenticate
          them instead; that is arithmetic in the scoring, not a policy. If you cook one, you are
          the only person who can.
        </Muted>
        <View style={styles.actions}>
          <Button label="Record a dish you know" onPress={() => router.push('/contribute')} />
          <Button
            label="How it gets authenticated"
            variant="secondary"
            onPress={() => router.push('/atlas')}
          />
        </View>
        {!open ? (
          <Muted style={styles.pending}>
            Submissions are not open yet — there is nowhere to send them. The route above explains
            what happens when they are.
          </Muted>
        ) : null}
      </View>

      <Muted style={styles.free}>
        Free, and staying free. No advertising, no accounts, no tracking, no money collected.
      </Muted>

      <Disclosure style={styles.disclosure} summary="Why a source cannot authenticate a dish">
        <Muted style={styles.body}>
          Published documentation cannot score above 43 here, and a record becomes Authentic at 55.
          The gap is closable only by people connected to the place. The six figures behind every
          score are printed on the record, so a reader who doubts the number can add it up.
        </Muted>
        <Muted style={[styles.body, styles.spaced]}>
          It is also why the atlas stops where it does. Every free source has been read —
          encyclopaedias, cookbooks, heritage registers, gazetteers — and {n(unwritten)} records
          still have nothing recorded about how they are made. What is left was never written down.
        </Muted>
      </Disclosure>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: space[4], gap: space[3] },

  headline: { fontFamily: font.heading, fontSize: 25, lineHeight: 31, color: color.text },
  stakes: { fontSize: 14, lineHeight: 21 },

  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: space[4],
    rowGap: space[3],
    marginTop: space[1],
  },
  // Four across on one line is the whole point of the row: wrapped 3+1 it strands the
  // accented figure on its own and reads as a layout fault. The labels were shortened
  // and the gap tightened until the widest case fits.
  stat: { minWidth: 70 },
  figure: { fontFamily: font.heading, fontSize: 23, lineHeight: 27, color: color.text },
  figureAccent: { color: color.accent },
  statLabel: { marginTop: 3, marginBottom: 0 },

  /* The ask gets the only tinted panel on the screen. It is the one thing here a
     reader can act on, and it should not look like another paragraph. */
  callout: {
    borderWidth: 1,
    borderColor: color.divider,
    borderLeftWidth: 3,
    borderLeftColor: color.accent,
    borderRadius: radius.md,
    padding: space[3],
    gap: space[2],
    marginTop: space[1],
  },
  ask: { fontFamily: font.heading, fontSize: 16, lineHeight: 22, color: color.text },
  askBody: { fontSize: 13, lineHeight: 20 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2], marginTop: space[1] },

  free: { fontSize: 12.5, lineHeight: 19, color: color.faint },

  body: { fontSize: 13, lineHeight: 20 },
  spaced: { marginTop: 8 },
  pending: { fontSize: 12.5, lineHeight: 19, color: color.faint, marginTop: space[1] },
  // Disclosure carries a 20px bottom margin for its usual place in a stack of
  // sections; here it is the last thing in a block that has its own.
  disclosure: { marginBottom: 0 },
});
