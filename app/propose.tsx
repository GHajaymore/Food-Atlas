/**
 * Proposing a dish the atlas does not have.
 *
 * The one screen in this app where somebody creates a record rather than reading one,
 * which makes it the screen where the atlas is most easily damaged. Three things are
 * doing the protecting, and none of them is a rule about how good the writing has to be:
 *
 * **The duplicate check runs while they type, not after they submit.** A submitter who
 * has spent ten minutes describing a dish and is then told it already exists has been
 * wasted, and will reasonably conclude the app is broken. Shown early it is useful
 * information — *this is already here, and confirming it is what moves it* — which is
 * usually the more valuable action anyway. See `possibleDuplicates`: it reports, and the
 * submitter decides. Two genuinely different dishes can share a name across two
 * countries, and a string comparison is not entitled to that call.
 *
 * **Required fields are the four that make it evidence**, not the four that make it look
 * complete. A name, a place, who is saying it and their connection. Ingredients and
 * method are wanted and optional, because somebody who knows a dish exists and where it
 * is from has already told us something no source in this atlas holds, and demanding a
 * full recipe up front loses exactly the people worth hearing from.
 *
 * **It says what happens next, before they start.** A proposal is not published by
 * submitting it; three people who know the dish have to confirm it. Saying so up front
 * is the difference between a considered contribution and a disappointed one — and it is
 * the same honesty the rest of the app applies to its own scores.
 */

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Block, Card, CardBody, CardKicker } from '../src/components/Card';
import { Field, Input } from '../src/components/Field';
import { NavRow } from '../src/components/NavRow';
import { Pressable } from '../src/components/Pressable';
import { Screen } from '../src/components/Screen';
import { Tag } from '../src/components/Tag';
import { H5, Muted, T } from '../src/components/Text';
import { catalogue } from '../src/data/catalogue';
import { submitProposal } from '../src/data/proposals';
import {
  PROPOSAL_CONFIRMATIONS,
  canPropose,
  missingFrom,
  possibleDuplicates,
  type Proposal,
} from '../src/domain/proposals';
import { tidyCountry, tidyLines, tidyName, tidyPlace, tidyText } from '../src/domain/entry';
import { color, font, space } from '../src/theme/tokens';

/** Split a textarea into lines, dropping the blanks people leave while typing. */
const lines = (text: string): string[] =>
  text
    .split('\n')
    .map((line) => line.replace(/^[-*•\d.)\s]+/, '').trim())
    .filter(Boolean);

export default function Propose() {
  const [form, setForm] = useState({
    name: '',
    country: '',
    region: '',
    cooks: '',
    ingredients: '',
    steps: '',
    submitter: '',
    connection: '',
  });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* Recomputed as they type. 18,008 folded comparisons is cheap; a wasted submission
   * is not. Only once the name is worth checking — one letter matches half the atlas. */
  const duplicates = useMemo(
    () => (form.name.trim().length >= 3 ? possibleDuplicates(catalogue, form.name) : []),
    [form.name],
  );

  /*
   * Tidied the same way the import tidies a row it reads, rather than merely trimmed.
   *
   * Trimming alone left "kozhikode halwa" from "india" sitting in the same list as
   * "Kozhikode Halwa" from "India" — and a country the atlas does not file anything
   * under is worse than untidy, because every count, list and breadcrumb keys on the
   * canonical name. See `domain/entry.ts`.
   */
  const entry = (): Partial<Proposal> => ({
    name: tidyName(form.name),
    country: tidyCountry(form.country),
    region: tidyPlace(form.region),
    cooks: tidyText(form.cooks),
    ingredients: tidyLines(form.ingredients),
    steps: tidyLines(form.steps),
    submitter: tidyText(form.submitter),
    connection: tidyText(form.connection),
    photo: '',
  });

  if (sent) {
    return (
      <Screen measure>
        <NavRow title="Proposed" />
        <Block accent style={styles.done}>
          <H5>{form.name} is now open for confirmation.</H5>
          <CardBody>
            {PROPOSAL_CONFIRMATIONS} people who know the dish have to confirm it before it enters the
            atlas. Anyone can see it and confirm it from now on — including people you tell about it,
            which is usually how a dish nobody has written down gets confirmed.
          </CardBody>
          <Button label="See open proposals" block style={styles.cta} onPress={() => router.replace('/proposals')} />
        </Block>
      </Screen>
    );
  }

  return (
    <Screen measure>
      <NavRow title="Propose a dish" />

      <Card style={styles.intro}>
        <CardKicker>Before you start</CardKicker>
        <CardBody>
          This is for food the atlas does not have — usually because nobody has written it down. You do
          not need a full recipe. A name, where it is from, and your connection to the place is enough
          to open it for confirmation.
        </CardBody>
        <T style={styles.introNote}>
          It is not published by sending it. {PROPOSAL_CONFIRMATIONS} people who know the dish confirm
          it first, and it enters the atlas at whatever its evidence earns — the same way every other
          record here is judged.
        </T>
      </Card>

      <Field label="The dish" style={styles.field}>
        <Input
          value={form.name}
          onChangeText={(v) => set('name', v)}
          placeholder="Written the way you write it"
          accessibilityLabel="The dish"
        />
      </Field>

      {duplicates.length ? (
        <Block style={styles.dupes}>
          <T style={styles.dupeHead}>The atlas may already have this</T>
          <Muted style={styles.dupeNote}>
            If one of these is your dish, confirming it is what moves it — that is worth more than a
            second record. If none of them is, carry on; two dishes can share a name.
          </Muted>
          {duplicates.map((dish) => (
            <Pressable
              key={dish.id}
              accessibilityRole="link"
              accessibilityLabel={`Open ${dish.name}`}
              tint="neutral"
              onPress={() => router.push(`/dish/${dish.id}`)}
              style={styles.dupe}
            >
              <T style={styles.dupeName}>{dish.name}</T>
              <Tag label={dish.loc.country || 'Unplaced'} fontSize={10} noWrap />
            </Pressable>
          ))}
        </Block>
      ) : null}

      <Field label="Country" style={styles.field}>
        <Input value={form.country} onChangeText={(v) => set('country', v)} accessibilityLabel="Country" />
      </Field>

      <Field label="Region, district or town" style={styles.field}>
        <Input
          value={form.region}
          onChangeText={(v) => set('region', v)}
          placeholder="Often the whole point — optional"
          accessibilityLabel="Region, district or town"
        />
      </Field>

      <Field label="Who makes it, and when" style={styles.field}>
        <Input
          value={form.cooks}
          onChangeText={(v) => set('cooks', v)}
          placeholder="Made at home for Eid, by the grandmothers — optional"
          multiline
          numberOfLines={2}
          accessibilityLabel="Who makes it, and when"
        />
      </Field>

      <Field label="Ingredients — one per line" style={styles.field}>
        <Input
          value={form.ingredients}
          onChangeText={(v) => set('ingredients', v)}
          multiline
          numberOfLines={4}
          placeholder={'ripe plantain\negg\nghee'}
          accessibilityLabel="Ingredients, one per line"
        />
      </Field>

      <Field label="How it is made — one step per line" style={styles.field}>
        <Input
          value={form.steps}
          onChangeText={(v) => set('steps', v)}
          multiline
          numberOfLines={5}
          placeholder={'Mash the plantain.\nFold through beaten egg.'}
          accessibilityLabel="How it is made, one step per line"
        />
      </Field>

      <View style={styles.divider} />

      <Field label="Your name" style={styles.field}>
        <Input
          value={form.submitter}
          onChangeText={(v) => set('submitter', v)}
          placeholder="Shown on the proposal"
          accessibilityLabel="Your name"
        />
      </Field>

      <Field label="Your connection to the place" style={styles.field}>
        <Input
          value={form.connection}
          onChangeText={(v) => set('connection', v)}
          placeholder="Grew up in Malabar"
          accessibilityLabel="Your connection to the place"
        />
      </Field>
      <Muted style={styles.why}>
        Required, and displayed. It is the whole difference between this and a recipe copied off the
        internet — which the atlas already refuses to hold.
      </Muted>

      {error ? <T style={styles.error}>{error}</T> : null}

      {canPropose() ? (
        <Button
          label={busy ? 'Sending…' : 'Propose this dish'}
          block
          style={styles.cta}
          onPress={async () => {
            if (busy) return;
            const missing = missingFrom(entry());
            if (missing.length) {
              setError(`Still needed: ${missing.join(', ')}.`);
              return;
            }
            setError('');
            setBusy(true);
            const result = await submitProposal(entry());
            setBusy(false);
            if (result.ok) setSent(true);
            else setError(result.error);
          }}
        />
      ) : (
        <Block style={styles.closed}>
          <T style={styles.closedHead}>Proposals are not open yet</T>
          <Muted style={styles.dupeNote}>
            This needs somewhere to store what people send, and that is not set up. Nothing you type here
            would go anywhere, so the app is saying so rather than taking it.
          </Muted>
        </Block>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { padding: space[4], gap: space[2], marginBottom: space[2] },
  introNote: { fontSize: 13, lineHeight: 19, color: color.accent },
  field: { marginTop: space[3] },
  divider: { height: 1, backgroundColor: color.divider, marginTop: space[6] },
  dupes: { padding: space[3], gap: space[1], marginTop: space[2] },
  dupeHead: { fontSize: 13, color: color.accent, fontFamily: font.semibold },
  dupeNote: { fontSize: 12, lineHeight: 17 },
  dupe: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[2],
    minHeight: 44,
  },
  dupeName: { flex: 1, fontSize: 14, color: color.text },
  why: { fontSize: 12, lineHeight: 17, marginTop: space[2] },
  error: { fontSize: 12, color: color.accent, marginTop: space[3] },
  cta: { marginTop: space[6] },
  closed: { padding: space[4], gap: space[1], marginTop: space[6] },
  closedHead: { fontSize: 14, color: color.text, fontFamily: font.semibold },
  done: { padding: space[4], gap: space[2] },
});
