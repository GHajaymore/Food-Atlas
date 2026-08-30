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
 * ## Why there is a lock on the screen now
 *
 * There did not used to be one, and the reasoning was sound for what the screen then
 * was: the settings are public at `GET /api/settings`, so hiding them would have been a
 * lock on a door with no wall around it.
 *
 * Two things changed. The screen grew analytics — deliberately not public, because the
 * top-searched terms are a live map of what readers cannot find — and authority stopped
 * being a shared string. With roles there is a real answer to "may this person be here",
 * so the screen asks it, and an ordinary reader who wanders in is told what the page is
 * rather than shown a console full of controls that will refuse them.
 *
 * The lock is still not the security boundary. Every write is checked at the server
 * against the session's role, and would be checked identically if this screen were
 * deleted. What the gate buys is that the refusal happens once, in a sentence, instead of
 * four times as failed requests.
 */

import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Block, Card, CardBody, CardKicker } from '../src/components/Card';
import { Field, Input } from '../src/components/Field';
import { AdminColumns } from '../src/components/AdminColumns';
import { NavRow } from '../src/components/NavRow';
import { useCopy, useNumber } from '../src/i18n';
import { Pressable } from '../src/components/Pressable';
import { Screen } from '../src/components/Screen';
import { H5, Muted, T } from '../src/components/Text';
import { catalogue } from '../src/data/catalogue';
import { loadAnalytics, type Analytics as AnalyticsData, type Tally } from '../src/data/analytics';
import { loadAllProposals, setProposalStatus } from '../src/data/proposals';
import { loadRefreshQueue, queueRefresh, type RefreshRequest } from '../src/data/refresh';
import { loadSettings, saveSettings, settings as current } from '../src/data/settings';
import { loadSession, signInUrl, type Session, NO_SESSION } from '../src/data/auth';
import { appointAdmin, claimOwner, loadRoster, removeAdmin, type Roster } from '../src/data/roles';
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
  const copy = useCopy();
  const n = useNumber();
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
        label={copy.queueThisCheck}
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

/**
 * What the atlas is being used for.
 *
 * Every figure here counts *events*. None counts people, and the labels say so —
 * "opens" rather than "visits", "events" rather than "users" — because a heading is
 * where an honest number becomes a dishonest one without anybody editing the number.
 *
 * The app tells readers in four places that it does not track them, and this screen has
 * to be readable by somebody who has just read that sentence and come to check. So it
 * says plainly what it cannot answer, rather than leaving the absence to be noticed.
 */
function Analytics({ token }: { token: string }) {
  const copy = useCopy();
  const n = useNumber();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState('');
  const [days, setDays] = useState(30);

  const load = async (over = days) => {
    setError('');
    const result = await loadAnalytics(token, over);
    if ('error' in result) {
      setError(result.error);
      setData(null);
      return;
    }
    setData(result);
  };

  const dishName = (id: string) => catalogue.find((d) => String(d.id) === id)?.name ?? `#${id}`;
  const busiest = data?.byDay.reduce((most, d) => (d.n > most.n ? d : most), { day: '', n: 0 });

  const List = ({ title, rows, label }: { title: string; rows: Tally[]; label?: (t: string) => string }) =>
    rows.length ? (
      <View style={styles.list}>
        <T style={styles.listHead}>{title}</T>
        {rows.slice(0, 10).map((row) => (
          <View key={row.target} style={styles.tally}>
            <T style={styles.tallyName} numberOfLines={1}>
              {label ? label(row.target) : row.target || '(none)'}
            </T>
            <T style={styles.tallyCount}>{n(row.n)}</T>
          </View>
        ))}
      </View>
    ) : null;

  return (
    <View style={styles.moderation}>
      <T style={styles.sectionHead}>Analytics</T>
      <Muted style={styles.note}>
        Counts of what happened, over the last {days} days. Nothing here is a count of people — see
        the note at the foot.
      </Muted>

      <View style={styles.kinds}>
        {[7, 30, 90].map((d) => (
          <Pressable
            key={d}
            accessibilityRole="radio"
            accessibilityState={{ selected: days === d }}
            accessibilityLabel={`Last ${d} days`}
            tint="neutral"
            onPress={() => {
              setDays(d);
              void load(d);
            }}
            style={days === d ? { ...styles.kind, ...styles.kindOn } : styles.kind}
          >
            <T style={days === d ? styles.kindLabelOn : styles.kindLabel}>{d} days</T>
          </Pressable>
        ))}
      </View>

      <Button label={copy.loadAnalytics} variant="secondary" block style={styles.load} onPress={() => load()} />

      {error ? <T style={styles.message}>{error}</T> : null}

      {data ? (
        <>
          <View style={styles.totals}>
            {data.totals.length ? (
              data.totals.map((t) => (
                <View key={t.kind} style={styles.total}>
                  <T style={styles.totalFigure}>{n(t.n)}</T>
                  <Muted style={styles.totalLabel}>
                    {t.kind === 'dish' ? 'dish opens' : t.kind === 'screen' ? 'screen views' : t.kind}
                  </Muted>
                </View>
              ))
            ) : (
              <Muted style={styles.note}>
                Nothing counted yet. Events start arriving once the site is deployed and read.
              </Muted>
            )}
          </View>

          {busiest?.day ? (
            <Muted style={styles.note}>
              Busiest day: {busiest.day} with {n(busiest.n)} events.
            </Muted>
          ) : null}

          <List title={copy.mostOpenedDishes} rows={data.topDishes} label={dishName} />
          <List title={copy.mostSearchedFor} rows={data.topSearches} />
          <List title={copy.mostUsedShelves} rows={data.topShelves} />
          <List title={copy.screens} rows={data.topScreens} />

          <Block style={styles.modRow}>
            <T style={styles.modName}>What this cannot tell you</T>
            <Muted style={styles.modMeta}>
              How many people came, or whether the same person came twice. Answering either needs a
              way to tell one reader from another, which is the thing the front page promises not to
              do. Cloudflare Web Analytics answers it honestly — at the edge, no cookie, free, and
              it never hands this app the data.
            </Muted>
          </Block>
        </>
      ) : null}
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

/**
 * Who runs this site, and the controls to change that.
 *
 * Shown to anybody who may use the console; the appointment controls only to the owner,
 * on `mayAppoint` from the server rather than on a role compared here. A client that
 * decided for itself who may appoint would be a second copy of the rule, and the copy
 * that drifts is always the one nobody thought was authoritative.
 *
 * ## The account id is the whole interface
 *
 * There is no email address in this system — the app asks Google for `openid` and
 * nothing else — so the only handle somebody can be appointed by is the salted hash of
 * their subject id. They sign in, read it off this screen, and send it over. Clumsy, and
 * the alternative is a database that can identify people it was never asked to.
 */
function Access({ token, session }: { token: string; session: Session }) {
  const [roster, setRoster] = useState<Roster | null>(null);
  const [error, setError] = useState('');
  const [candidate, setCandidate] = useState('');
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    setError('');
    const result = await loadRoster(token);
    setLoaded(true);
    if ('error' in result) {
      setRoster(null);
      setError(result.error);
      return;
    }
    setRoster(result.data);
  };

  /* Every mutation re-reads rather than patching what is on screen. The server decides
     the outcome — an appointment can be refused for a reason this screen does not model
     — so the list after a change should be the server's list, not this one's guess. */
  const act = async (run: () => Promise<{ error: string } | object>) => {
    /* Guarded here rather than with a disabled prop: `Button` has no disabled state, and
       a control that looks live and does nothing is worse than one that is simply not
       clickable twice. */
    if (busy) return;
    setBusy(true);
    const result = await run();
    setBusy(false);
    if (result && 'error' in result) {
      setError((result as { error: string }).error);
      return;
    }
    setCandidate('');
    await load();
  };

  const claim = roster && roster.people.length === 0;

  return (
    <View style={styles.panel}>
      <H5>Who runs this site</H5>
      <Muted style={styles.panelNote}>
        The owner appoints administrators and can remove them. An administrator can use everything on
        this screen and cannot pass the role on. Everybody else is a reader, which is not a record —
        no row is written for anyone until they are given a role.
      </Muted>

      {session.account ? (
        <View style={styles.identity}>
          <Muted style={styles.identityLabel}>Your account id</Muted>
          <T style={styles.identityValue} selectable>
            {session.account}
          </T>
          <Muted style={styles.note}>
            Send this to the owner if you need access. It identifies you here and nowhere else.
          </Muted>
        </View>
      ) : null}

      {!loaded ? (
        <Button label="Show who has access" variant="secondary" block onPress={load} />
      ) : null}

      {error ? <T style={styles.message}>{error}</T> : null}

      {claim ? (
        <View style={styles.identity}>
          <Muted style={styles.note}>
            Nobody owns this site yet. Claiming it makes the account you are signed in as the owner —
            the token proves the authority, the sign-in says who is claiming it, and both are needed.
          </Muted>
          <Button
            label="Claim the owner seat"
            block
            onPress={() => act(() => claimOwner(token))}
            style={styles.claim}
          />
        </View>
      ) : null}

      {roster?.people.map((person) => (
        <View key={person.id} style={styles.person}>
          <View style={styles.personWho}>
            <T style={styles.personId}>{person.id.slice(0, 12)}</T>
            <Muted style={styles.personMeta}>
              {person.role === 'owner' ? 'Owner' : 'Administrator'}
              {person.id === roster.you ? ' — you' : ''}
            </Muted>
          </View>
          {roster.mayAppoint && person.role === 'admin' ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={'Remove administrator ' + person.id.slice(0, 12)}
              onPress={() => act(() => removeAdmin(token, person.id))}
              style={styles.remove}
            >
              <T style={styles.removeText}>Remove</T>
            </Pressable>
          ) : null}
        </View>
      ))}

      {roster?.mayAppoint ? (
        <>
          <Field label="Appoint an administrator" style={styles.setting}>
            <Input
              value={candidate}
              onChangeText={setCandidate}
              placeholder="Their account id"
              autoCapitalize="none"
              accessibilityLabel="Account id to appoint"
            />
          </Field>
          <Button
            label="Appoint"
            variant="secondary"
            block
            onPress={() => {
              if (candidate.trim()) act(() => appointAdmin(token, candidate));
            }}
          />
        </>
      ) : null}

      {loaded && roster && !roster.mayAppoint ? (
        <Muted style={styles.note}>Only the owner can appoint or remove administrators.</Muted>
      ) : null}
    </View>
  );
}

export default function Admin() {
  const copy = useCopy();
  const n = useNumber();
  const [draft, setDraft] = useState<Draft>(toDraft(current));
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [session, setSession] = useState<Session>(NO_SESSION);
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    loadSettings().then((s) => setDraft(toDraft(s)));
    loadSession().then((s) => {
      setSession(s);
      setAsked(true);
    });
  }, []);

  /*
   * A typed token still opens the screen, and that is not a hole.
   *
   * It is the same credential the server will check, so showing the controls to somebody
   * holding it reveals nothing they could not obtain by using it. It is also the only way
   * in on a database with no owner yet, and the way back if the owner account is lost —
   * see the header of `migrations/0008_roles.sql`.
   */
  const mayAdminister = session.role !== 'user' || token.trim().length > 0;

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

  const intro = (
    <>
      <NavRow title={copy.settingsTitle} />

      <Card style={styles.intro}>
        <CardKicker>{copy.whatThisChanges}</CardKicker>
        <CardBody>
          These are read by the app at load. One decides what happens to new proposals; two decide what
          the word Authentic means across every record in the atlas.
        </CardBody>
      </Card>
    </>
  );

  const settings = (
    <>
      {NUMBERS.map(({ key, label, note }) => {
        const [min, max] = LIMITS[key as keyof typeof LIMITS];
        return (
          <View key={key} style={styles.setting}>
            <Field label={label}>
              {/* Sized to what it holds. Every one of these is one or two digits, and a
                  field stretched to the width of its column quietly tells the reader a
                  longer answer is expected. */}
              <Input
                value={draft[key]}
                onChangeText={(v) => set(key, v.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                accessibilityLabel={label}
                style={styles.number}
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
          <H5>{n(radius.changed)} records would change badge</H5>
          <CardBody>
            {n(radius.gained)} would become Authentic and {n(radius.lost)} would
            stop being Authentic — none of them having gained or lost any evidence. Counted by re-scoring
            the whole catalogue against these thresholds, not estimated.
            {radius.unaffected > 0
              ? ` A further ${n(radius.unaffected)} are Authentic through a heritage designation, which does not read the score, and are unaffected either way.`
              : ''}
          </CardBody>
        </Block>
      ) : radius ? (
        <Muted style={styles.note}>No record would change badge at these thresholds.</Muted>
      ) : null}
    </>
  );

  const credentials = (
    <>
      <View style={styles.divider} />

      <Field label={copy.administratorToken} style={styles.setting}>
        <Input
          value={token}
          onChangeText={setToken}
          placeholder={copy.tokenNotStored}
          secureTextEntry
          autoCapitalize="none"
          accessibilityLabel={copy.administratorToken}
        />
      </Field>

      {message ? <T style={styles.message}>{message}</T> : null}

      {/*
       * Save sits with the form it saves.
       *
       * It used to come after the moderation queue, the refresh queue and the analytics
       * — so changing a threshold meant scrolling past three unrelated panels to commit
       * it, and on a desktop those are now in a different column entirely, which would
       * have left the button orphaned from everything it acts on. This is the one place
       * the phone order deliberately changes rather than merely moving.
       */}
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
    </>
  );

  /*
   * Told, rather than shown a console that will refuse them.
   *
   * Held until the session answer arrives — rendering the locked state first and then
   * replacing it would flash "you cannot be here" at the person who runs the site, on
   * every single load.
   */
  if (asked && !mayAdminister) {
    return (
      <Screen measure footer={false}>
        <NavRow title={copy.settingsTitle} />
        <Card style={styles.locked}>
          <CardKicker>Administrators only</CardKicker>
          <CardBody>
            This screen sets what the atlas counts as Authentic, moderates proposals, and shows what
            readers are searching for. It is kept to the people who run the site.
          </CardBody>
        </Card>

        {/*
          * Two ways in, labelled as two.
          *
          * They used to be one unbroken column: a primary "Sign in" button, then the
          * token field directly under it with nothing between. Ajay went to test the
          * token, read the button as the only way forward, clicked it and was sent to
          * Google — the wrong door, and the field he wanted was below it looking like
          * part of the same step.
          *
          * A button and a field stacked with no separation read as one flow. These are
          * alternatives, so they are drawn as alternatives.
          */}
        {session.available && !session.signedIn ? (
          <View style={styles.route}>
            <Muted style={styles.routeLabel}>If you run this site</Muted>
            <Button
              label="Sign in"
              block
              onPress={() => {
                window.location.href = signInUrl();
              }}
              style={styles.lockedAction}
            />
          </View>
        ) : null}

        {session.signedIn ? (
          <View style={styles.identity}>
            <Muted style={styles.identityLabel}>Your account id</Muted>
            <T style={styles.identityValue} selectable>
              {session.account}
            </T>
            <Muted style={styles.note}>
              Send this to the owner if you need access. It identifies you here and nowhere else.
            </Muted>
          </View>
        ) : null}

        <View style={styles.route}>
          <View style={styles.routeRule} />
          <Muted style={styles.routeLabel}>Or open it with the administrator token</Muted>
          <Field label={copy.administratorToken} style={styles.setting}>
            <Input
              value={token}
              onChangeText={setToken}
              placeholder={copy.tokenNotStored}
              secureTextEntry
              autoCapitalize="none"
              accessibilityLabel={copy.administratorToken}
            />
          </Field>
          {/*
            * Said here because there is nowhere else it could be said.
            *
            * Without it the field is a box with no stated effect: somebody holding the
            * token has no way to know that typing it opens the screen, and the person
            * setting the site up for the first time has no way to discover that the
            * owner seat is claimed from inside rather than from a command line.
            */}
          <Muted style={styles.note}>
            Entering it opens this screen. It is the way in for whoever holds the token rather than
            an account — and, on a site nobody owns yet, the way the owner seat is first claimed.
          </Muted>
        </View>
      </Screen>
    );
  }

  return (
    <Screen footer={false}>
      <AdminColumns
        intro={intro}
        settings={settings}
        credentials={credentials}
        panels={[
          <Moderation key="moderation" token={token} />,
          <RefreshQueue key="refresh" token={token} />,
          <Analytics key="analytics" token={token} />,
          <Access key="access" token={token} session={session} />,
        ]}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { padding: space[4], gap: space[2], marginBottom: space[2] },
  locked: { padding: space[4], gap: space[2], marginTop: space[4] },
  lockedAction: { marginTop: space[2] },
  route: { marginTop: space[6] },
  routeRule: { height: 1, backgroundColor: color.divider, marginBottom: space[4] },
  /* Small, uppercase and quiet: it names which of the two routes follows without
     competing with the control underneath it for the eye. */
  routeLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: space[2] },
  panel: { marginTop: space[6], gap: space[3] },
  panelNote: { fontSize: 12, lineHeight: 18 },
  /* A monospaced 32-character hash, meant to be selected and sent to somebody. It gets a
     surface of its own so it reads as a value to copy rather than as prose. */
  identity: {
    marginTop: space[3],
    padding: space[3],
    gap: space[1],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color.divider,
  },
  identityLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6 },
  identityValue: { fontFamily: font.regular, fontSize: 12, lineHeight: 18, letterSpacing: 0.8, color: color.neutral[100] },
  claim: { marginTop: space[2] },
  person: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[3],
    paddingVertical: space[3],
    borderTopWidth: 1,
    borderTopColor: color.divider,
    minHeight: TAP_TARGET,
  },
  personWho: { flex: 1, gap: 2 },
  personId: { fontFamily: font.regular, fontSize: 12, letterSpacing: 0.8, color: color.neutral[100] },
  personMeta: { fontSize: 11 },
  remove: { paddingHorizontal: space[3], justifyContent: 'center', minHeight: TAP_TARGET },
  removeText: { fontSize: 12, color: color.accent },
  setting: { marginTop: space[4] },
  number: { width: 110 },
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
  totals: { flexDirection: 'row', flexWrap: 'wrap', columnGap: space[6], rowGap: space[3], marginTop: space[4] },
  total: { minWidth: 80 },
  totalFigure: { fontFamily: font.heading, fontSize: 21, color: color.text },
  totalLabel: { fontSize: 11, marginTop: 2 },
  list: { marginTop: space[4], gap: 2 },
  listHead: { fontSize: 11, color: color.accent, fontFamily: font.semibold, letterSpacing: 0.6 },
  tally: { flexDirection: 'row', justifyContent: 'space-between', gap: space[3], paddingVertical: 3 },
  tallyName: { flex: 1, fontSize: 13, color: color.text },
  tallyCount: { fontSize: 13, color: color.muted, fontVariant: ['tabular-nums'] },
  kindLabelOn: { fontSize: 13, color: color.accent, fontFamily: font.semibold },
});
