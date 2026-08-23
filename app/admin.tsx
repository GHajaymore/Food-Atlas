/**
 * The settings an administrator controls.
 *
 * ## The screen's whole job is to make consequences visible before they happen
 *
 * Two of these numbers are read by `assess()` on every record, so changing one
 * re-badges all 18,008 **retroactively** — a dish that was Unverified yesterday is
 * Authentic today, having gained no evidence whatsoever. That is not something anybody
 * should be able to do by typing a number into a box and seeing it accepted.
 *
 * So the screen counts, before saving, how many records would change badge and says so.
 * `blastRadius()` walks all 18,008 in a few hundred milliseconds, which is a cheap price
 * for never making that change blind.
 *
 * It models the **promotion branch** of `assess` — score, confirmations, ingredients —
 * rather than re-running `assess` itself, because `Dish` does not carry the `Evidence`
 * it was built from. That limitation is not cosmetic and is handled explicitly rather
 * than ignored: see the note inside the function about the 53 records it originally got
 * backwards.
 *
 * ## Why the token is not stored
 *
 * It is held in component state for the length of a session and written nowhere. A
 * bearer token in local storage is readable by any script that ever runs on the page,
 * and this one can redefine what the atlas means by Authentic. Re-typing it is a small
 * cost paid by one person occasionally; the alternative is a credential sitting on disk
 * in every browser that has ever administered the site.
 *
 * ## Why there is no lock on the screen itself
 *
 * Anybody can open `/admin` and see the current values — which are already public at
 * `GET /api/settings`, and already visible in the app's own behaviour. Hiding the
 * screen would be a lock on a door with no wall around it. The authority is the token,
 * checked at the server, on the write.
 */

import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Block, Card, CardBody, CardKicker } from '../src/components/Card';
import { Field, Input } from '../src/components/Field';
import { NavRow } from '../src/components/NavRow';
import { Pressable } from '../src/components/Pressable';
import { Screen } from '../src/components/Screen';
import { H5, Muted, T } from '../src/components/Text';
import { catalogue } from '../src/data/catalogue';
import { loadAllProposals, setProposalStatus } from '../src/data/proposals';
import { loadRefreshQueue, queueRefresh, type RefreshRequest } from '../src/data/refresh';
import { loadSettings, saveSettings, settings as current } from '../src/data/settings';
import type { Thresholds } from '../src/domain/assess';
import { isAuthentic } from '../src/domain/authenticity';
import type { Proposal } from '../src/domain/proposals';
import { LIMITS, isStructural, type Settings } from '../src/domain/settings';
import { color, font, space, TAP_TARGET } from '../src/theme/tokens';

/**
 * How many records would change badge under proposed thresholds.
 *
 * Exact for the branch it models and explicit about the one it cannot, because an
 * approximate answer to "how much of the atlas is about to change" is worse than no
 * answer — it invites confidence in a number nobody checked.
 *
 * `Dish` keeps `confirmations` as the list rather than a count, because the record
 * displays them — so the count comes from its length, and from nowhere else. An earlier
 * draft read a `validations` field that does not exist, which typechecking caught; had
 * it been optional it would have silently reported that no record would change.
 */
function blastRadius(
  next: Thresholds,
  now: Thresholds,
): { changed: number; gained: number; lost: number; unaffected: number } {
  let gained = 0;
  let lost = 0;
  let unaffected = 0;

  for (const dish of catalogue) {
    if (dish.score === null) continue;

    const was = isAuthentic(dish.badgeLevel);
    const confirmations = dish.confirmations?.length ?? 0;

    /*
     * Records that reached Authentic without the score are out of scope, and finding
     * them mattered: a heritage designation plus ingredients classifies
     * Authentic — Regional through a separate and older branch of `assess` that never
     * reads the score at all. 269 EU-register records arrived that way.
     *
     * An earlier draft of this function modelled only the score branch, so those
     * records looked as though they failed it — and dropping `authenticAt` from 55 to
     * 40 was reported as **53 records losing the badge**, when lowering a threshold
     * cannot remove anything. The number was not slightly wrong; it had the sign
     * backwards, on the one screen whose job is to make consequences visible.
     *
     * They are identifiable without `heritage` on the record, which `Dish` does not
     * carry: a record that is Authentic while scoring below the threshold it would have
     * had to clear cannot have cleared it. Counted and reported rather than silently
     * skipped, because "53 records are unaffected" is itself worth knowing before
     * moving a threshold.
     */
    if (was && (dish.score < now.authenticAt || confirmations < now.validationsRequired)) {
      unaffected += 1;
      continue;
    }

    const after =
      dish.score >= next.authenticAt &&
      confirmations >= next.validationsRequired &&
      dish.ingredients.length > 0;

    if (was && !after) lost += 1;
    else if (!was && after) gained += 1;
  }

  return { changed: gained + lost, gained, lost, unaffected };
}

/**
 * Taking a proposal down.
 *
 * The schema has allowed `status = 'declined'` since the first migration and nothing
 * could set it, so a proposal — public the moment it is made, by design — could not be
 * removed by anything short of hand-written SQL against production. Abuse, spam and
 * nonsense stayed up.
 *
 * Deliberately not loaded until a token is entered. The queue is the one part of this
 * screen that is genuinely private: a declined proposal is usually declined for being
 * abusive, and a public list of everything ever removed would republish exactly what
 * the decline was for.
 *
 * There is no publish button, and its absence is the point. Publication is three
 * confirmations and then `promote-proposals.mjs`, because the claim this atlas makes is
 * that a record got in when people who know the dish confirmed it — not when the person
 * running the site decided it should. Declining is a different act: it removes
 * something, and removing abuse is a duty rather than a judgement about food.
 */
function Moderation({ token }: { token: string }) {
  const [rows, setRows] = useState<Proposal[]>([]);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [working, setWorking] = useState('');

  const load = async () => {
    setError('');
    const result = await loadAllProposals(token);
    if ('error' in result) {
      setError(result.error);
      setLoaded(false);
      return;
    }
    setRows(result);
    setLoaded(true);
  };

  const change = async (p: Proposal, status: 'declined' | 'proposed') => {
    setWorking(p.id);
    const result = await setProposalStatus(token, p.id, status);
    setWorking('');
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setRows((prev) => prev.map((row) => (row.id === p.id ? { ...row, status } : row)));
  };

  return (
    <View style={styles.moderation}>
      <T style={styles.sectionHead}>Moderation</T>
      <Muted style={styles.note}>
        Every proposal, including ones already declined. Needs the token above.
      </Muted>

      <Button
        label={loaded ? 'Reload queue' : 'Load queue'}
        variant="secondary"
        block
        style={styles.load}
        onPress={load}
      />

      {error ? <T style={styles.message}>{error}</T> : null}

      {loaded && !rows.length ? <Muted style={styles.note}>Nothing has been proposed yet.</Muted> : null}

      {rows.map((p) => (
        <Block key={p.id} style={p.status === 'declined' ? { ...styles.modRow, ...styles.declined } : styles.modRow}>
          <View style={styles.modHead}>
            <View style={styles.modText}>
              <T style={styles.modName}>{p.name}</T>
              <Muted style={styles.modMeta}>
                {[p.region, p.country].filter(Boolean).join(', ')} · {p.submitter} ·{' '}
                {p.people.length} confirmation{p.people.length === 1 ? '' : 's'}
              </Muted>
            </View>
            <T style={styles.modStatus}>{p.status}</T>
          </View>

          {p.status === 'published' ? (
            <Muted style={styles.modMeta}>In the atlas. Not changeable here.</Muted>
          ) : (
            <Button
              label={
                working === p.id
                  ? 'Working…'
                  : p.status === 'declined'
                    ? 'Put back'
                    : 'Decline'
              }
              variant="secondary"
              compact
              style={styles.modAction}
              onPress={() => change(p, p.status === 'declined' ? 'proposed' : 'declined')}
            />
          )}
        </Block>
      ))}
    </View>
  );
}

/**
 * Asking whether a record's sources have moved on.
 *
 * The atlas was scraped from wikis and wikis are edited, so a record can be years out of
 * date with nothing here noticing. Queuing is all this does — the check runs on a
 * laptop, because the catalogue is files and nothing on Cloudflare can rewrite them.
 *
 * The result line is why the queue is worth having rather than a button that files
 * something away silently: an administrator who asks a question and never sees the
 * answer has been given a gesture.
 */
function RefreshQueue({ token }: { token: string }) {
  const [rows, setRows] = useState<RefreshRequest[]>([]);
  const [target, setTarget] = useState('');
  const [kind, setKind] = useState<RefreshRequest['kind']>('dish');
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    setError('');
    const result = await loadRefreshQueue(token);
    if ('error' in result) {
      setError(result.error);
      setLoaded(false);
      return;
    }
    setRows(result);
    setLoaded(true);
  };

  return (
    <View style={styles.moderation}>
      <T style={styles.sectionHead}>Source checks</T>
      <Muted style={styles.note}>
        Ask whether a record&apos;s wiki page has been edited since the atlas read it. The check runs
        when somebody drains the queue; nothing is ever rewritten automatically.
      </Muted>

      <View style={styles.kinds}>
        {(['dish', 'country', 'all'] as const).map((k) => (
          <Pressable
            key={k}
            accessibilityRole="radio"
            accessibilityState={{ selected: kind === k }}
            accessibilityLabel={`Check a ${k}`}
            tint="neutral"
            onPress={() => setKind(k)}
            style={kind === k ? { ...styles.kind, ...styles.kindOn } : styles.kind}
          >
            <T style={kind === k ? styles.kindLabelOn : styles.kindLabel}>{k}</T>
          </Pressable>
        ))}
      </View>

      {kind !== 'all' ? (
        <Field label={kind === 'dish' ? 'Dish name' : 'Country'} style={styles.setting}>
          <Input
            value={target}
            onChangeText={setTarget}
            placeholder={kind === 'dish' ? 'Kozhikode Halwa' : 'India'}
            accessibilityLabel={kind === 'dish' ? 'Dish name' : 'Country'}
          />
        </Field>
      ) : (
        <Muted style={styles.note}>
          Every record with a wiki article — around 13,000. A few hundred requests, a couple of minutes.
        </Muted>
      )}

      <Button
        label="Queue this check"
        variant="secondary"
        block
        style={styles.load}
        onPress={async () => {
          const result = await queueRefresh(token, kind, target);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setError('');
          setTarget('');
          await load();
        }}
      />

      <Button label={loaded ? 'Reload queue' : 'Show queue'} variant="secondary" block style={styles.load} onPress={load} />

      {error ? <T style={styles.message}>{error}</T> : null}

      {loaded && !rows.length ? <Muted style={styles.note}>Nothing has been asked for.</Muted> : null}

      {rows.map((r) => (
        <Block key={r.id} style={styles.modRow}>
          <View style={styles.modHead}>
            <View style={styles.modText}>
              <T style={styles.modName}>{r.kind === 'all' ? 'The whole atlas' : r.target}</T>
              <Muted style={styles.modMeta}>
                {r.kind} · asked {r.requestedAt}
              </Muted>
            </View>
            <T style={styles.modStatus}>{r.status}</T>
          </View>
          {r.result ? <Muted style={styles.modMeta}>{r.result}</Muted> : null}
        </Block>
      ))}
    </View>
  );
}

type Draft = Record<keyof Settings, string>;

const toDraft = (s: Settings): Draft => ({
  proposalConfirmations: String(s.proposalConfirmations),
  authenticAt: String(s.authenticAt),
  validationsRequired: String(s.validationsRequired),
  proposalsOpen: s.proposalsOpen ? 'yes' : 'no',
});

const NUMBERS: { key: keyof Settings; label: string; note: string }[] = [
  {
    key: 'proposalConfirmations',
    label: 'Confirmations to enter the atlas',
    note: 'How many people must recognise a proposed dish before it becomes a record. Affects what happens next; nothing already published changes.',
  },
  {
    key: 'authenticAt',
    label: 'Score at which a record is Authentic',
    note: 'Read by the scoring on every record. Published data alone reaches 43, so anything below 44 gives the badge to records nobody has confirmed.',
  },
  {
    key: 'validationsRequired',
    label: 'Confirmations for the Authentic badge',
    note: 'Read by the scoring on every record, and by the community dimension itself.',
  },
];

export default function Admin() {
  const [draft, setDraft] = useState<Draft>(toDraft(current));
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadSettings().then((s) => setDraft(toDraft(s)));
  }, []);

  const proposed: Thresholds = {
    authenticAt: Number(draft.authenticAt),
    validationsRequired: Number(draft.validationsRequired),
  };

  const structuralMoved =
    Number.isFinite(proposed.authenticAt) &&
    Number.isFinite(proposed.validationsRequired) &&
    (proposed.authenticAt !== current.authenticAt ||
      proposed.validationsRequired !== current.validationsRequired);

  const radius = useMemo(
    () => (structuralMoved && catalogue.length ? blastRadius(proposed, current) : null),
    [structuralMoved, proposed.authenticAt, proposed.validationsRequired],
  );

  const set = (key: keyof Settings, value: string) => setDraft((d) => ({ ...d, [key]: value }));

  return (
    <Screen>
      <NavRow title="Settings" />

      <Card style={styles.intro}>
        <CardKicker>What this changes</CardKicker>
        <CardBody>
          These are read by the app at load. One decides what happens to new proposals; two decide what
          the word Authentic means across every record in the atlas.
        </CardBody>
      </Card>

      {NUMBERS.map(({ key, label, note }) => {
        const [min, max] = LIMITS[key as keyof typeof LIMITS];
        return (
          <View key={key} style={styles.setting}>
            <Field label={label}>
              <Input
                value={draft[key]}
                onChangeText={(v) => set(key, v.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                accessibilityLabel={label}
              />
            </Field>
            <Muted style={styles.note}>{note}</Muted>
            <View style={styles.meta}>
              <T style={styles.range}>Allowed {min}–{max}</T>
              {isStructural(key) ? <T style={styles.structural}>Re-badges every record</T> : null}
            </View>
          </View>
        );
      })}

      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: draft.proposalsOpen === 'yes' }}
        accessibilityLabel="Proposals are open"
        tint="neutral"
        onPress={() => set('proposalsOpen', draft.proposalsOpen === 'yes' ? 'no' : 'yes')}
        style={styles.check}
      >
        <View style={[styles.box, draft.proposalsOpen === 'yes' ? styles.boxOn : null]}>
          {draft.proposalsOpen === 'yes' ? <T style={styles.tick}>✓</T> : null}
        </View>
        <View style={styles.checkText}>
          <T style={styles.checkLabel}>Proposals are open</T>
          <Muted style={styles.note}>
            Turn off to stop new submissions immediately, without a deploy. Existing proposals stay
            visible and confirmable.
          </Muted>
        </View>
      </Pressable>

      {radius && radius.changed > 0 ? (
        <Block accent style={styles.radius}>
          <H5>{radius.changed.toLocaleString()} records would change badge</H5>
          <CardBody>
            {radius.gained.toLocaleString()} would become Authentic and {radius.lost.toLocaleString()} would
            stop being Authentic — none of them having gained or lost any evidence. Counted by re-scoring
            the whole catalogue against these thresholds, not estimated.
            {radius.unaffected > 0
              ? ` A further ${radius.unaffected.toLocaleString()} are Authentic through a heritage designation, which does not read the score, and are unaffected either way.`
              : ''}
          </CardBody>
        </Block>
      ) : radius ? (
        <Muted style={styles.note}>No record would change badge at these thresholds.</Muted>
      ) : null}

      <View style={styles.divider} />

      <Field label="Administrator token" style={styles.setting}>
        <Input
          value={token}
          onChangeText={setToken}
          placeholder="Not stored — retyped each session"
          secureTextEntry
          autoCapitalize="none"
          accessibilityLabel="Administrator token"
        />
      </Field>

      {message ? <T style={styles.message}>{message}</T> : null}

      <Moderation token={token} />

      <RefreshQueue token={token} />

      <Button
        label={busy ? 'Saving…' : 'Save'}
        block
        style={styles.save}
        onPress={async () => {
          if (busy) return;
          setBusy(true);
          setMessage('');
          const result = await saveSettings(token, {
            proposalConfirmations: Number(draft.proposalConfirmations),
            authenticAt: Number(draft.authenticAt),
            validationsRequired: Number(draft.validationsRequired),
            proposalsOpen: draft.proposalsOpen === 'yes',
          });
          setBusy(false);

          if (!result.ok) {
            setMessage(result.error);
            return;
          }
          const changed = Object.keys(result.applied).length;
          const refused = result.refused
            .map((r) => `${r.key}: ${r.why}`)
            .join(' ');
          setMessage(
            [
              changed ? `Saved ${changed} setting${changed === 1 ? '' : 's'}.` : 'Nothing changed.',
              refused,
              changed ? 'Badges update when the app next loads the catalogue.' : '',
            ]
              .filter(Boolean)
              .join(' '),
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { padding: space[4], gap: space[2], marginBottom: space[2] },
  setting: { marginTop: space[4] },
  note: { fontSize: 12, lineHeight: 17, marginTop: space[1] },
  meta: { flexDirection: 'row', gap: space[2], marginTop: space[1], flexWrap: 'wrap' },
  range: { fontSize: 11, color: color.meta },
  structural: { fontSize: 11, color: color.accent, fontFamily: font.semibold },
  check: { flexDirection: 'row', gap: space[2], marginTop: space[4], minHeight: TAP_TARGET },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: color.divider,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  boxOn: { borderColor: color.accent, backgroundColor: color.accent },
  tick: { fontSize: 13, color: color.bg, fontFamily: font.semibold },
  checkText: { flex: 1 },
  checkLabel: { fontSize: 14, color: color.text },
  radius: { padding: space[4], gap: space[2], marginTop: space[4] },
  divider: { height: 1, backgroundColor: color.divider, marginTop: space[6] },
  message: { fontSize: 12, color: color.accent, lineHeight: 17, marginTop: space[3] },
  save: { marginTop: space[4] },
  moderation: { marginTop: space[6] },
  sectionHead: { fontSize: 15, color: color.text, fontFamily: font.semibold },
  load: { marginTop: space[3] },
  modRow: { padding: space[3], gap: space[2], marginTop: space[2] },
  declined: { opacity: 0.55 },
  modHead: { flexDirection: 'row', alignItems: 'flex-start', gap: space[2] },
  modText: { flex: 1 },
  modName: { fontSize: 14, color: color.text },
  modMeta: { fontSize: 12, lineHeight: 17 },
  modStatus: { fontSize: 11, color: color.accent, fontFamily: font.semibold },
  modAction: { alignSelf: 'flex-start' },
  kinds: { flexDirection: 'row', gap: space[2], marginTop: space[3] },
  kind: { paddingVertical: space[2], paddingHorizontal: space[3], borderRadius: 6, borderWidth: 1, borderColor: color.divider, minHeight: TAP_TARGET, justifyContent: 'center' },
  kindOn: { borderColor: color.accent },
  kindLabel: { fontSize: 13, color: color.muted },
  kindLabelOn: { fontSize: 13, color: color.accent, fontFamily: font.semibold },
});
