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
import { settings } from '../data/settings';
import { useCopy, useNumber } from '../i18n';
import { canConfirm } from '../domain/confirmations';
import { useLayout } from '../theme/layout';
import { canContribute } from '../domain/contribution';
import { color, font, radius, space } from '../theme/tokens';
import { Button } from './Button';
import { Disclosure } from './Disclosure';
import { H6, Muted, T } from './Text';

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

/**
 * The numbers behind the pitch, derived once and shared by every part of it.
 *
 * Lifted out when `Mission` was split, so the figures cannot be counted one way in the
 * hero and another way in the ask. Every one is derived from the catalogue rather than
 * stored, which is what stops the page quoting a total that has quietly gone stale.
 */
export function useMissionNumbers() {
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

  return {
    total,
    countries,
    documented,
    unwritten,
    authenticated,
    heritage,
    open: canContribute() || canConfirm(),
  };
}

/**
 * The best a record can score on published sources alone.
 *
 * Six dimensions, three of which no document can answer, so the arithmetic caps there.
 * /how derives the same figure the same way; both must move together or the app
 * contradicts itself on the one page that argues its figures are checkable.
 */
const DOCUMENTED_CEILING = 43;

/**
 * The headline and the sentence under it.
 *
 * Leads with what the atlas holds, not with what it lacks. An earlier headline opened
 * "57% of the food in this atlas has never been written down". The figure was correct
 * and reconciled — 7,811 documented plus 10,197 unwritten is exactly 18,008 — but as the
 * *first* sentence it framed the project by its hole, and a reader met an app that
 * sounded half empty.
 *
 * The gap is a reason to help rather than a description of the product, so it lives in
 * the ask instead. Nothing was softened: the same count appears there, in figures rather
 * than as a percentage, because "10,197 records" is a thing a reader can picture and
 * "57%" is a verdict.
 *
 * The headline deliberately counts nothing. It used to open "18,008 dishes" above a tile
 * saying 18,008, and the paragraph opened "From 157 countries" above a tile saying 157 —
 * three of four figures printed twice inside eighty pixels. The tiles are better at
 * counting, so the headline says what the atlas is *for*.
 */
export function MissionPitch() {
  const copy = useCopy();
  const n = useNumber();
  const { wide } = useLayout();

  return (
    <>
      <T style={wide ? styles.headlineWide : styles.headline}>{copy.missionHeadline}</T>

      <Muted style={[styles.stakes, wide ? styles.stakesWide : null]}>
        {copy.missionStakes}
      </Muted>
    </>
  );
}

/**
 * Five figures, in the order a reader needs them: how much there is, how far it reaches,
 * how much is written down, how much an institution has recognised, and how much people
 * have actually authenticated.
 *
 * They descend — 17,828 to 46 — and that descent is the argument. A row of numbers that
 * only grew would be a boast; this one narrows to the figure the whole project exists to
 * move, and a reader sees the gap without being told about it.
 */
export function MissionFigures() {
  const copy = useCopy();
  const n = useNumber();
  const { wide } = useLayout();
  const { total, countries, documented, heritage, authenticated } = useMissionNumbers();

  return (
    <View style={[styles.stats, wide ? styles.statsWide : null]}>
      <Stat value={n(total)} label={copy.statDishes} />
      <Stat value={String(countries)} label={copy.statCountries} />
      <Stat value={n(documented)} label={copy.statDocumented} />
      <Stat value={n(heritage)} label={copy.statRegistered} />
      {/* The accent goes on the only figure a person, rather than a source, can move. */}
      <Stat value={n(authenticated)} label={copy.statAuthentic} accent />
    </View>
  );
}

/**
 * The ask — the one thing on the screen a reader can act on.
 *
 * Keeps its tinted panel wherever it is placed: beside the pitch on a desktop, below the
 * first shelf on a phone, and in both the only bordered block on the page. Losing that
 * treatment by moving would cost it the thing that marks it out.
 */
export function MissionCallout() {
  const copy = useCopy();
  const n = useNumber();
  const { wide } = useLayout();
  const { unwritten, open } = useMissionNumbers();

  return (
    <View style={wide ? styles.heroAside : styles.callout}>
      <T style={styles.ask}>
        {copy.missionAsk.replace('{n}', n(unwritten)).replace('{people}', String(VALIDATIONS_REQUIRED))}
      </T>
      <Muted style={styles.askBody}>
        {copy.missionAskBody}
      </Muted>
      <View style={styles.actions}>
        <Button label={copy.recordADishYouKnow} onPress={() => router.push('/contribute')} />
        <Button
          label={copy.howItGetsAuthenticated}
          variant="secondary"
          onPress={() => router.push('/how')}
        />
      </View>
      {!open ? (
        <Muted style={styles.pending}>
          {copy.submissionsNotOpen}
        </Muted>
      ) : null}
    </View>
  );
}

/**
 * What the project promises, and why a source cannot settle authenticity.
 *
 * The quietest part of the pitch and the last a reader needs, which is why it is the
 * first thing to move down a phone.
 */
export function MissionFootnotes() {
  const copy = useCopy();
  const n = useNumber();
  const { authenticAt } = settings;
  const { unwritten } = useMissionNumbers();

  return (
    <>
      <Muted style={styles.free}>
        {/*
         * "No accounts" had to go, and the replacement is deliberately not softer.
         *
         * Only confirmations from a signed-in person count toward a badge, because an
         * anonymous one is a private window away from being three of them. So an account
         * is needed for exactly one act — and for nothing else. Reading, searching,
         * browsing and proposing a dish all still work with no account and no tracking,
         * which is what the sentence now says.
         *
         * The alternative was leaving four words that had stopped being true. A promise
         * this app cannot keep is worth less than a narrower one it can.
         */}
        {copy.freeAndStayingFree}
      </Muted>

      {/*
       * What this is not, said once and plainly.
       *
       * The brief asks the app to differentiate itself from social media, and the line
       * above only covers money and identity. These four are the mechanisms a reader has
       * been trained by every other food site to expect, and each is absent here for the
       * same reason rather than four different ones — a rating, a comment thread and a
       * ranking are all ways of letting volume stand in for evidence, which is the exact
       * substitution this atlas refuses.
       *
       * Stated as facts about the app rather than as a boast about it. "No algorithm
       * deciding what you see" is checkable — `shelves.ts` rotates on a date seed and
       * both browse and search default to sorting by evidence — and a reader who checks
       * will find it true, which is the only kind of claim this project is allowed to
       * make.
       *
       * The last clause is the one that needed care. The obvious line was "nothing here
       * measures your attention", and it is **false**: `events.ts` counts a dish opening.
       * What is true is narrower and worth saying exactly — the event is a dish id and a
       * date, the identity cookie is scoped to `/api/proposals` so the request carries no
       * cookie at all, and there is therefore nobody to attribute it to. Claiming the
       * stronger version on the page that argues for checkable claims would have been the
       * worst possible place to overstate one.
       */}
      <Muted style={styles.free}>
        {copy.noRatingsNoComments}
      </Muted>

      <Disclosure style={styles.disclosure} summary={copy.whyASourceCannot}>
        <Muted style={styles.body}>
          {copy.whyASourceCannotBody
            .replace('{ceiling}', String(DOCUMENTED_CEILING))
            .replace('{threshold}', String(authenticAt))}
        </Muted>
        <Muted style={[styles.body, styles.spaced]}>
          {copy.whyTheAtlasStops.replace('{n}', n(unwritten))}
        </Muted>
      </Disclosure>
    </>
  );
}

/**
 * The whole pitch, arranged as it has always been.
 *
 * Split into four exported parts so a phone can place them separately: the argument runs
 * about 780px on a 375px screen, which put the first photograph 1.44 screens down. This
 * composition is unchanged and is what every wide screen still renders.
 *
 * Two columns on a wide screen, stacked on a phone. Side by side, the argument and the
 * ask are visible together without scrolling, which is what the extra width is actually
 * good for; the measure is capped on the left rather than allowed to fill its half,
 * because a line length is a fact about reading rather than about the container.
 */
export function Mission() {
  const { wide } = useLayout();

  return (
    <View style={styles.wrap}>
      <View style={wide ? styles.heroRow : undefined}>
        <View style={wide ? styles.heroMain : undefined}>
          <MissionPitch />
          <MissionFigures />
        </View>

        <MissionCallout />
      </View>

      <MissionFootnotes />
    </View>
  );
}

/**
 * The headline's size at each width, exported so the loading skeleton can draw the same
 * shape as the thing that replaces it.
 *
 * `FeedSkeleton` states its own rule plainly — "every block is the size of the thing that
 * will land in it, so nothing jumps when the data arrives" — and it had drifted out of
 * true: it drew the headline in Inter at 25px while this file set it in Fraunces at 29,
 * and at 44 on a wide screen. Both a reflow and a typeface swap, which is precisely the
 * pair that header exists to prevent.
 *
 * Exported rather than copied, because a copied number is how it drifted in the first
 * place.
 */
export const HEADLINE_TYPE = {
  phone: { fontSize: 29, lineHeight: 35 },
  wide: { fontSize: 44, lineHeight: 50 },
} as const;

const styles = StyleSheet.create({
  wrap: { marginBottom: space[4], gap: space[3] },

  heroRow: { flexDirection: 'row', gap: 40, alignItems: 'flex-start' },
  heroMain: { flex: 1.35, minWidth: 0 },
  /* The aside keeps the callout's tinted panel — it is still the one thing on the
     screen a reader can act on, and it should not lose that by moving sideways. */
  heroAside: {
    flex: 1,
    minWidth: 320,
    borderWidth: 1,
    borderColor: color.divider,
    borderLeftWidth: 3,
    borderLeftColor: color.accent,
    borderRadius: radius.md,
    padding: space[4],
    gap: space[2],
  },
  headlineWide: {
    fontFamily: font.display,
    ...HEADLINE_TYPE.wide,
    color: color.text,
    /* Large headings need the tracking pulled in; the theme's scale stops at 42 and
       leaves anything above it looking loose. */
    letterSpacing: -0.6,
  },
  /* A ruled band rather than five numbers loose on the ground. On a wide screen the
     tiles were floating in whitespace with nothing saying they belonged together. */
  statsWide: {
    marginTop: 26,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: color.divider,
    columnGap: 36,
  },
  stakesWide: { fontSize: 15, lineHeight: 24, maxWidth: 560, marginTop: 14 },
  /*
   * 25 became 29 so the headline outranks the figures on a phone.
   *
   * The figures are 26. While they were the interface face and the headline was the
   * display face, the two did not read as competing; setting both in Fraunces made the
   * inversion plain — five numbers a point larger than the sentence they are evidence
   * for. Raising the headline rather than shrinking the figures, because the figures are
   * also the desktop's 37px band and that one is right as it is.
   */
  headline: { fontFamily: font.display, ...HEADLINE_TYPE.phone, color: color.text },
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
  /*
   * The figures take the display face.
   *
   * These are the second-largest thing on the page — 37px once the scale opens up, five
   * of them in a row — and they were the interface face, which left Fraunces carrying one
   * headline and nothing else above card size. In this app the numbers *are* the
   * argument: 17,748 recorded, most with no method. Setting them in the face reserved
   * for "anything that names or argues" is the plainest reading of the project's own
   * rule, and it gives the display face something to do between the headline and the
   * cards.
   *
   * `tabular-nums` stays. These sit in a row of fixed-width tiles and proportional digits
   * make a row of five figures ripple; if the static Fraunces cut does not carry the
   * feature the declaration is simply inert, which is the same as today.
   */
  figure: { fontFamily: font.display, fontSize: 26, lineHeight: 30, color: color.text, fontVariant: ['tabular-nums'] },
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
  ask: { fontFamily: font.display, fontSize: 16, lineHeight: 22, color: color.text },
  askBody: { fontSize: 13, lineHeight: 20 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2], marginTop: space[1] },

  /*
   * `muted`, not `faint`.
   *
   * `faint` is 45% alpha and `tokens.ts` documents it for one thing: "intake step labels
   * that have not been reached" — a disabled state. These two lines are not disabled.
   * They are the promise the project is making, and they were the only text on the front
   * page failing WCAG AA: 3.91 against a required 4.5, measured, the lowest contrast of
   * 437 nodes.
   *
   * Which is an odd thing to have done to these sentences in particular. "Free, and
   * staying free. No advertising, no tracking" is one of the few claims here a reader has
   * to take on trust, and it was set in the colour reserved for steps you have not got to
   * yet. `muted` is the token for a secondary line that is still meant to be read.
   */
  free: { fontSize: 12.5, lineHeight: 19, color: color.muted },

  body: { fontSize: 13, lineHeight: 20 },
  spaced: { marginTop: 8 },
  pending: { fontSize: 12.5, lineHeight: 19, color: color.muted, marginTop: space[1] },
  // Disclosure carries a 20px bottom margin for its usual place in a stack of
  // sections; here it is the last thing in a block that has its own.
  disclosure: { marginBottom: 0 },
});
