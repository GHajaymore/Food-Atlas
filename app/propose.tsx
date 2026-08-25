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
import { FieldPair, FormColumns } from '../src/components/FormLayout';
import { NavRow } from '../src/components/NavRow';
import { useCopy } from '../src/i18n';
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
  REQUIRED_LABELS,
  possibleDuplicates,
  type Proposal,
} from '../src/domain/proposals';
import { stillNeeded, tidyCountry, tidyLines, tidyName, tidyPlace, tidyText } from '../src/domain/entry';
import { color, font, space } from '../src/theme/tokens';

/** Split a textarea into lines, dropping the blanks people leave while typing. */
const lines = (text: string): string[] =>
  text
    .split('\n')
    .map((line) => line.replace(/^[-*•\d.)\s]+/, '').trim())
    .filter(Boolean);

export default function Propose() {
  const copy = useCopy();
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
        <NavRow title={copy.proposed} />
        <Block accent style={styles.done}>
          <H5>{form.name} is now open for confirmation.</H5>
          <CardBody>
            {PROPOSAL_CONFIRMATIONS} people who know the dish have to confirm it before it enters the
            atlas. Anyone can see it and confirm it from now on — including people you tell about it,
            which is usually how a dish nobody has written down gets confirmed.
          </CardBody>
          <Button label={copy.seeOpenProposals} block style={styles.cta} onPress={() => router.replace('/proposals')} />
        </Block>
      </Screen>
    );
  }

  return (
    <Screen>
      <NavRow title={copy.proposeADish} />

      {/*
       * The guidance sits beside the fields on a desktop rather than on top of them.
       *
       * It is the right first thing to read on a phone and the wrong thing to put above
       * eight form fields on a 1440 screen, where it pushed every one of them below the
       * fold to say something a contributor wants *while* typing. `FormColumns` keeps the
       * phone order exactly and only changes where it goes when there is room.
       */}
      <FormColumns
        aside={
          <>
            <Card style={styles.intro}>
              <CardKicker>{copy.beforeYouStart}</CardKicker>
              <CardBody>{copy.beforeYouStartBody}</CardBody>
              <T style={styles.introNote}>
                {copy.notPublishedBySending.replace('{n}', String(PROPOSAL_CONFIRMATIONS))}
              </T>
            </Card>
          </>
        }
        fields={
          <>
            <Field label={copy.theDish} style={styles.field}>
              <Input
                value={form.name}
                onChangeText={(v) => set('name', v)}
                placeholder={copy.writtenTheWayYouWriteIt}
                accessibilityLabel={copy.theDish}
              />
            </Field>

            {duplicates.length ? (
              <Block style={styles.dupes}>
                <T style={styles.dupeHead}>{copy.atlasMayAlreadyHaveThis}</T>
                <Muted style={styles.dupeNote}>{copy.duplicateNote}</Muted>
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

            {/* One question asked twice, so one line. See `FieldPair`. */}
            <FieldPair>
              <Field label={copy.country} style={styles.field}>
                <Input value={form.country} onChangeText={(v) => set('country', v)} accessibilityLabel={copy.country} />
              </Field>

              <Field label={copy.regionDistrictOrTown} style={styles.field}>
                <Input
                  value={form.region}
                  onChangeText={(v) => set('region', v)}
                  placeholder={copy.oftenTheWholePoint}
                  accessibilityLabel={copy.regionDistrictOrTown}
                />
              </Field>
            </FieldPair>

            <Field label={copy.whoMakesItAndWhen} style={styles.field}>
              <Input
                value={form.cooks}
                onChangeText={(v) => set('cooks', v)}
                placeholder={copy.exampleWhoMakesIt}
                multiline
                numberOfLines={2}
                accessibilityLabel={copy.whoMakesItAndWhen}
              />
            </Field>

            <Field label={copy.ingredientsOnePerLine} style={styles.field}>
              <Input
                value={form.ingredients}
                onChangeText={(v) => set('ingredients', v)}
                multiline
                numberOfLines={4}
                placeholder={copy.exampleIngredientLines}
                accessibilityLabel={copy.ingredientsOnePerLine}
              />
            </Field>

            <Field label={copy.howItIsMadeOnePerLine} style={styles.field}>
              <Input
                value={form.steps}
                onChangeText={(v) => set('steps', v)}
                multiline
                numberOfLines={5}
                placeholder={copy.exampleMethodLines}
                accessibilityLabel={copy.howItIsMadeOnePerLine}
              />
            </Field>

            <View style={styles.divider} />

            {/* A name is only evidence with the connection beside it — they are one answer. */}
            <FieldPair>
              <Field label={copy.yourName} style={styles.field}>
                <Input
                  value={form.submitter}
                  onChangeText={(v) => set('submitter', v)}
                  placeholder={copy.shownOnTheProposal}
                  accessibilityLabel={copy.yourName}
                />
              </Field>

              <Field label={copy.yourConnectionToThePlace} style={styles.field}>
                <Input
                  value={form.connection}
                  onChangeText={(v) => set('connection', v)}
                  placeholder={copy.grewUpInMalabar}
                  accessibilityLabel={copy.yourConnectionToThePlace}
                />
              </Field>
            </FieldPair>
            <Muted style={styles.why}>
              {copy.connectionRequiredNote}
            </Muted>

            {error ? <T style={styles.error}>{error}</T> : null}

            {canPropose() ? (
              <Button
                label={busy ? copy.sending : copy.proposeThisDish}
                block
                style={styles.cta}
                onPress={async () => {
                  if (busy) return;
                  const missing = missingFrom(entry());
                  if (missing.length) {
                    setError(stillNeeded(missing.map((f) => REQUIRED_LABELS[f as keyof typeof REQUIRED_LABELS])));
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
                <T style={styles.closedHead}>{copy.proposalsNotOpenYet}</T>
                <Muted style={styles.dupeNote}>{copy.proposeClosedNote}</Muted>
              </Block>
            )}
          </>
        }
      />
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
