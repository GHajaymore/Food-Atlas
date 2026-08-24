/**
 * Add a tradition — the contribution and validation pipeline, expressed as UI.
 *
 * Four steps: Submit, What exists, Assessment, Validation. The flow is the argument:
 * nothing is published from the form alone, the most-published version online becomes
 * the popular candidate rather than the record, open evidence checks lower confidence
 * instead of being filled in by assumption, and a record stays Unverified until
 * people from the place confirm it.
 *
 * The findings, checks and validators shown from step 2 on are the walkthrough's
 * fixture content, as in the design. In production they come from the discovery and
 * validation pipeline — and until they do, the app says so on the screen rather than
 * only here: a worked example presented as a result is the same untruth as a score
 * that does not match its own breakdown.
 *
 * Step one's fields were `defaultValue` demonstrations filled in with Kaipola, and
 * nothing typed into them was read by anything. They are real inputs now, and the last
 * step offers a real destination — or says plainly that there is not one yet. The
 * atlas has exhausted what it can scrape, so this form is how it grows from here.
 */

import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Block, Card, CardBody, CardKicker } from '../src/components/Card';
import { Field, Input } from '../src/components/Field';
import { FieldPair } from '../src/components/FormLayout';
import { NavRow } from '../src/components/NavRow';
import { Screen } from '../src/components/Screen';
import { H5, Muted, T } from '../src/components/Text';
import { Tag } from '../src/components/Tag';
import {
  canContribute,
  contributionUrl,
  missingFrom,
  REQUIRED_LABELS,
  WALKTHROUGH_NOTE,
  type Contribution,
} from '../src/domain/contribution';
import { EDITORIAL_RULE } from '../src/domain/editorial';
import { COMMONS_UPLOAD_URL, isRejection, parsePhotoReference } from '../src/domain/photoSubmission';
import { stillNeeded, tidyText } from '../src/domain/entry';
import { openAtSource } from '../src/domain/video';
import { accentText, color, font, space } from '../src/theme/tokens';

const STEP_LABELS = ['Submit', 'What exists', 'Assessment', 'Validation'];

const FINDINGS = [
  {
    title: 'Recipe aggregator page',
    tag: 'Popular candidate',
    note: 'Highest-ranked result. Author gives no connection to Malabar; uses butter in place of ghee.',
  },
  {
    title: 'Malayalam cooking channel video',
    tag: 'Local source',
    note: 'Filmed in Kerala, spoken in Malayalam, ghee and nendran banana as described.',
  },
  {
    title: 'No village-level record found',
    tag: 'Gap',
    note: 'Nothing documents how it is made in Kozhikode specifically. This submission would be the first.',
  },
];

const CHECKS = [
  {
    mark: '✓',
    label: 'Geographic origin',
    note: 'Malabar, Kozhikode — stated by the submitter and consistent with the video source.',
  },
  { mark: '✓', label: 'Local preparation', note: 'Described as household cooking for iftar and family occasions.' },
  {
    mark: '✓',
    label: 'Traditional ingredients',
    note: 'Nendran banana, eggs, ghee — matches the local-source video.',
  },
  { mark: '✓', label: 'Traditional technique', note: 'Low flame, lid weighted with embers.' },
  {
    mark: '~',
    label: 'Historical or cultural documentation',
    note: 'Thin. No scholarship or archive record located.',
  },
  { mark: '✓', label: 'Local source', note: 'Submitter reports being born and cooking in Kozhikode.' },
  {
    mark: '✗',
    label: 'Community validation',
    note: 'Not yet sought. This is why the record cannot be called authentic yet.',
  },
];

const VALIDATORS = [
  { mark: '✓', who: 'Home cook, Kozhikode', said: 'Confirmed the ingredients and the embers-on-the-lid method.' },
  { mark: '✓', who: 'Bakery owner, Thalassery', said: 'Confirmed, notes their version adds less sugar.' },
  {
    mark: '✓',
    who: 'Food writer, Kerala',
    said: 'Confirmed as a Malabar household dish; documentation is genuinely scarce.',
  },
  { mark: '·', who: 'Two more reviewers invited', said: 'Awaiting response — the record publishes without them.' },
];

export default function Contribute() {
  const [step, setStep] = useState(1);

  // Judged as it is typed, so someone pasting an Instagram link learns immediately
  // that the photograph is theirs to publish rather than after submitting the form.
  const [photoInput, setPhotoInput] = useState('');
  const photoResult = photoInput.trim() ? parsePhotoReference(photoInput) : null;

  /** The dish a fruitless search was for, where the reader arrived from one. */
  const { dish: askedFor } = useLocalSearchParams<{ dish?: string }>();

  /**
   * What the reader actually typed.
   *
   * These were `defaultValue` demonstrations — the form was filled in with Kaipola and
   * nothing it held was ever read. The examples moved to placeholders so the fields
   * still show what a good answer looks like while starting empty, because a form that
   * submits its own sample data is worse than one that submits nothing.
   */
  const [entry, setEntry] = useState<Contribution>({
    // Seeded from the search that found nothing. Somebody who has just been told the
    // atlas does not have their food should not then be asked to type its name again.
    dish: typeof askedFor === 'string' ? askedFor : '',
    place: '',
    cooks: '',
    ingredients: '',
    connection: '',
    photo: '',
  });
  const set = (field: keyof Contribution) => (value: string) =>
    setEntry((current) => ({ ...current, [field]: value }));

  /**
   * Whitespace only, and deliberately less than the other two forms do.
   *
   * `Contribution.dish` says it in its own type: *"written the way they write it. Never
   * corrected on the way in."* That decision stands. What is safe — and what nobody
   * means to type — is a trailing space or a double space in the middle, which travels
   * into a URL parameter and out the other side as a different value.
   *
   * So this fixes what a keyboard produced and nothing a person chose. `/propose` casing
   * its dish name is not an inconsistency with this: a proposal becomes a record that
   * sits beside imported ones and gets the import's treatment, while this prefills a
   * form a human then reads.
   */
  const tidied = (): Contribution => ({
    dish: tidyText(entry.dish),
    place: tidyText(entry.place),
    cooks: tidyText(entry.cooks),
    ingredients: tidyText(entry.ingredients),
    connection: tidyText(entry.connection),
    photo: tidyText(photoInput),
  });

  const missing = missingFrom({ ...entry, photo: photoInput });

  // Back steps through the flow first, and only then out to the Atlas.
  // The fallback matters: opened directly — a deep link, or a refresh on the web
  // build — there is no history to pop, and a bare router.back() would leave the
  // reader stuck on the form with a dead control.
  const back = () => {
    if (step > 1) {
      setStep(step - 1);
      return;
    }
    if (router.canGoBack()) router.back();
    else router.replace('/atlas');
  };

  return (
    <Screen measure bottomPad={50}>
      <NavRow title="Add a tradition" onBack={back} />

      <View style={styles.rail}>
        {STEP_LABELS.map((label, i) => (
          <View key={label} style={styles.railSegment}>
            <View style={[styles.bar, { backgroundColor: i <= step - 1 ? color.accent : color.neutral[800] }]} />
            <T style={[styles.railLabel, { color: i === step - 1 ? accentText : color.faint }]}>{label}</T>
          </View>
        ))}
      </View>

      {step === 1 ? (
        <>
          <Muted style={styles.lead}>
            Record it as it is made where you are. Nothing is published from this form alone — it goes through
            assessment and community validation first.
          </Muted>

          {/* Said before the fields rather than after, because the instinct to tidy a
              name is strongest while typing it. */}
          <Block style={styles.ruleBlock}>
            <T style={styles.ruleTitle}>Write the food&apos;s name the way you write it</T>
            <Muted style={styles.ruleNote}>{EDITORIAL_RULE}</Muted>
          </Block>

          {/* The food and the place it is made that way are one answer. See `FieldPair`. */}
          <FieldPair>
            <Field label="Dish, in its own language if possible" style={styles.field}>
              <Input value={entry.dish} onChangeText={set('dish')} placeholder="Kaipola" />
            </Field>
            <Field label="Where is it made this way?" style={styles.field}>
              <Input value={entry.place} onChangeText={set('place')} placeholder="India › Kerala › Malabar › Kozhikode" />
            </Field>
          </FieldPair>
          {/* Who makes it, and the connection that makes the account evidence rather
              than a recipe copied off the internet. One answer, so one line. */}
          <FieldPair>
            <Field label="Who prepares it" style={styles.field}>
              <Input value={entry.cooks} onChangeText={set('cooks')} placeholder="Malabar households, made for iftar and family occasions" />
            </Field>
            <Field label="Your connection to the place" style={styles.field}>
              <Input value={entry.connection} onChangeText={set('connection')} placeholder="Born and cooking in Kozhikode" />
            </Field>
          </FieldPair>
          <Field label="Traditional ingredients and equipment" style={styles.field}>
            <Input
              multiline
              value={entry.ingredients}
              onChangeText={set('ingredients')}
              placeholder="Ripe nendran banana, eggs, ghee, sugar, cashews, raisins; cooked in a heavy pan over low charcoal or gas flame, covered with a lid weighted with embers"
            />
          </Field>

          {/* A photograph is the one contribution the automated sources cannot make:
              they only reach food someone has already documented, and the food this
              app most wants to show is the food nobody has. */}
          <Block style={styles.photoBlock}>
            <T style={styles.photoTitle}>A photograph of it, if you have one</T>
            <Muted style={styles.photoNote}>
              Publish your own photograph to Wikimedia Commons, then paste its file name here. It stays yours, you
              are credited everywhere it appears, and it costs neither of us anything. We cannot take one from
              Instagram or TikTok — a photograph there is its author&apos;s copyright, and a credit line is not
              permission.
            </Muted>

            <Button
              label="Publish a photograph on Commons"
              variant="secondary"
              block
              onPress={() => openAtSource(COMMONS_UPLOAD_URL)}
              style={styles.photoButton}
            />

            <Field label="Commons file name or link" style={styles.photoField}>
              <Input value={photoInput} onChangeText={setPhotoInput} placeholder="Kaipola.jpg" />
            </Field>

            {photoResult ? (
              isRejection(photoResult) ? (
                <View style={styles.photoFeedback}>
                  <T style={styles.photoBad}>{photoResult.reason}</T>
                  <Muted style={styles.photoFix}>{photoResult.fix}</Muted>
                </View>
              ) : (
                <View style={styles.photoFeedback}>
                  <T style={styles.photoGood}>{photoResult.file}</T>
                  <Muted style={styles.photoFix}>
                    Checked against Commons when the record is submitted, and shown with its photographer and
                    licence. It stays Unverified until the community confirms it, exactly as the method does.
                  </Muted>
                </View>
              )
            ) : null}
          </Block>

          <Muted style={styles.walkthroughNote}>{WALKTHROUGH_NOTE}</Muted>
          <Button label="Check what already exists online" block onPress={() => setStep(2)} />
        </>
      ) : null}

      {step === 2 ? (
        <>
          <H5 style={styles.stepHeading}>What the internet already has</H5>
          <Muted style={styles.lead}>
            The most-published version is taken as the popular candidate. It does not become the authentic record.
          </Muted>
          <View style={styles.list}>
            {FINDINGS.map((finding) => (
              <Block key={finding.title} style={styles.findingBlock}>
                <View style={styles.findingHead}>
                  <T style={styles.findingTitle}>{finding.title}</T>
                  <Tag label={finding.tag} variant="neutral" fontSize={10} noWrap />
                </View>
                <Muted style={styles.findingNote}>{finding.note}</Muted>
              </Block>
            ))}
          </View>
          <Button label="Run the evidence assessment" block onPress={() => setStep(3)} />
        </>
      ) : null}

      {step === 3 ? (
        <>
          <H5 style={styles.stepHeading}>Evidence assessment</H5>
          <Muted style={styles.lead}>
            Seven checks, each answered or left open. Open checks lower confidence — they are never filled in by
            assumption.
          </Muted>
          <View style={styles.checks}>
            {CHECKS.map((check) => (
              <View key={check.label} style={styles.checkRow}>
                <T style={styles.mark}>{check.mark}</T>
                <View style={styles.checkText}>
                  <T style={styles.checkLabel}>{check.label}</T>
                  <Muted style={styles.checkNote}>{check.note}</Muted>
                </View>
              </View>
            ))}
          </View>

          <Block style={styles.draftBlock}>
            <View style={styles.draftHead}>
              <T style={styles.draftScore}>61</T>
              <Muted style={styles.draftUnit}>/100 draft confidence</Muted>
            </View>
            <Tag
              label="⚪ Unverified — pending community validation"
              variant="neutral"
              fontSize={10}
              style={styles.draftTag}
            />
            <Muted style={styles.draftNote}>
              One submitter from the place is evidence, not proof. The record stays Unverified until people from the
              community confirm it.
            </Muted>
          </Block>

          <Button label="Send for community validation" block onPress={() => setStep(4)} />
        </>
      ) : null}

      {step === 4 ? (
        <>
          <H5 style={styles.stepHeading}>Community validation</H5>
          <Muted style={styles.lead}>
            Three confirmations from people who live or cook in the place lift a record out of Unverified.
          </Muted>
          <View style={styles.list}>
            {VALIDATORS.map((validator) => (
              <Block key={validator.who} style={styles.validatorBlock}>
                <T style={styles.validatorMark}>{validator.mark}</T>
                <View style={styles.checkText}>
                  <T style={styles.checkLabel}>{validator.who}</T>
                  <Muted style={styles.checkNote}>{validator.said}</Muted>
                </View>
              </Block>
            ))}
          </View>

          <Card style={styles.disagreeCard}>
            <CardKicker>If they disagree</CardKicker>
            <CardBody>
              Conflicting accounts are both kept. The record splits into the traditions people actually described —
              one per region or community — and no version is declared the true one.
            </CardBody>
          </Card>

          <Block accent style={styles.publishedBlock}>
            <Tag label="🟢 Authentic — Local · 78/100" variant="neutral" fontSize={10} />
            <Muted style={styles.publishedNote}>
              That is where the example record ends up: published with its evidence visible, its open checks named,
              and every claim traceable to who said it.
            </Muted>
          </Block>

          {/* The real thing, at the end of the explanation of it. Until this the flow
              finished by describing a published record, which a reader who had just
              filled the form in could fairly read as their own. */}
          {canContribute() ? (
            <Card style={styles.sendCard}>
              <CardKicker>Now send yours</CardKicker>
              <CardBody>
                {missing.length
                  ? `${stillNeeded(missing.map((f) => REQUIRED_LABELS[f as keyof typeof REQUIRED_LABELS]))} ` +
                    `Everything else is welcome and none of it is required — ` +
                    `knowing where a food is from and that nobody has written it down is already more than any ` +
                    `source here holds.`
                  : `It opens the form at its source with what you have written already filled in. Nothing about ` +
                    `you is collected by this app, and nothing is published until people from the place confirm it.`}
              </CardBody>
              <Button
                label="Send this tradition"
                block
                onPress={() => openAtSource(contributionUrl(tidied()))}
              />
            </Card>
          ) : (
            /* No destination, no button — the rule the donate page follows. A control
               that goes nowhere spends a reader's goodwill on a dead link, and this
               reader has just typed out a recipe. */
            <Card style={styles.sendCard}>
              <CardKicker>Submissions are not open yet</CardKicker>
              <CardBody>
                There is nowhere to send this to. The atlas has read everything the free sources hold, so what is
                missing now is food nobody has written down — which means this form is how it grows, and it will be
                switched on as soon as there is somewhere for it to go.
              </CardBody>
            </Card>
          )}

          {/* Deterministic rather than a history pop: the label promises the atlas,
              and the flow can be entered from Search as well as from the Atlas. */}
          <Button
            label="Back to the atlas"
            variant="secondary"
            block
            onPress={() => router.replace('/atlas')}
            style={styles.backToAtlas}
          />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  rail: { flexDirection: 'row', gap: 6, marginTop: 6, marginBottom: 18 },
  railSegment: { flex: 1 },
  bar: { height: 3, borderRadius: 2 },
  railLabel: { fontFamily: font.regular, fontSize: 10, marginTop: 6 },

  lead: { fontSize: 12, lineHeight: 12 * 1.5, marginBottom: 16 },
  stepHeading: { marginBottom: 4 },

  field: { marginBottom: 12 },
  walkthroughNote: { fontSize: 11, marginBottom: 14 },

  ruleBlock: { padding: 12, marginBottom: 16 },
  ruleTitle: { fontSize: 13, fontFamily: font.medium },
  ruleNote: { fontSize: 11, lineHeight: 11 * 1.55, marginTop: 6 },

  photoBlock: { padding: 12, marginBottom: 16 },
  photoTitle: { fontSize: 13, fontFamily: font.medium },
  photoNote: { fontSize: 11, lineHeight: 11 * 1.55, marginTop: 6 },
  photoButton: { marginTop: 12 },
  sendCard: { marginTop: 20 },
  backToAtlas: { marginTop: 12 },
  photoField: { marginTop: 12 },
  photoFeedback: { marginTop: 10 },
  photoGood: { fontSize: 12, fontFamily: font.medium, color: accentText },
  photoBad: { fontSize: 12, fontFamily: font.medium },
  photoFix: { fontSize: 11, lineHeight: 11 * 1.55, marginTop: 4 },

  list: { gap: 10, marginBottom: 16 },
  findingBlock: { padding: 10 },
  findingHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space[2] },
  findingTitle: { fontSize: 13, fontFamily: font.medium, flex: 1 },
  findingNote: { fontSize: 12, lineHeight: 12 * 1.45, marginTop: 4 },

  checks: { gap: space[2], marginBottom: 16 },
  checkRow: { flexDirection: 'row', gap: space[2], alignItems: 'flex-start' },
  mark: { fontSize: 12, width: 14, flexShrink: 0 },
  checkText: { flex: 1 },
  checkLabel: { fontSize: 13 },
  checkNote: { fontSize: 11, lineHeight: 11 * 1.5 },

  draftBlock: { marginBottom: 16 },
  draftHead: { flexDirection: 'row', alignItems: 'baseline', gap: space[2] },
  draftScore: { fontFamily: font.heading, fontSize: 28, color: accentText },
  draftUnit: { fontSize: 12 },
  draftTag: { marginTop: space[2] },
  draftNote: { fontSize: 11, lineHeight: 11 * 1.5, marginTop: 10 },

  validatorBlock: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10 },
  validatorMark: { fontSize: 13, flexShrink: 0 },

  disagreeCard: { marginBottom: 16 },
  publishedBlock: { marginBottom: 16 },
  publishedNote: { fontSize: 12, lineHeight: 12 * 1.45, marginTop: 10 },
});
