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
import { useCopy, type Copy } from '../src/i18n';
import { Screen } from '../src/components/Screen';
import { H5, Muted, T } from '../src/components/Text';
import { Tag } from '../src/components/Tag';
import {
  canContribute,
  contributionUrl,
  missingFrom,
  REQUIRED_LABELS,
  type Contribution,
} from '../src/domain/contribution';
import { levelLabel } from '../src/domain/authenticity';
import { COMMONS_UPLOAD_URL, isRejection, parsePhotoReference } from '../src/domain/photoSubmission';
import { stillNeeded, tidyText } from '../src/domain/entry';
import { openAtSource } from '../src/domain/video';
import { accentText, color, font, space } from '../src/theme/tokens';

/**
 * Built per render rather than once at import.
 *
 * A module-level array is evaluated before any locale is known, so it would hold
 * whichever language happened to be current when the module first loaded and never
 * change again. Everything on this screen that names something takes `copy` for the
 * same reason.
 */
const stepLabelsFor = (copy: Copy): string[] => [
  copy.stepSubmit,
  copy.stepWhatExists,
  copy.stepAssessment,
  copy.stepValidation,
];

const findingsFor = (copy: Copy): { title: string; tag: string; note: string }[] => [
  { title: copy.findingAggregatorTitle, tag: copy.findingAggregatorTag, note: copy.findingAggregatorNote },
  { title: copy.findingVideoTitle, tag: copy.findingVideoTag, note: copy.findingVideoNote },
  { title: copy.findingGapTitle, tag: copy.findingGapTag, note: copy.findingGapNote },
];

const checksFor = (copy: Copy): { mark: string; label: string; note: string }[] => [
  { mark: '✓', label: copy.checkOriginLabel, note: copy.checkOriginNote },
  { mark: '✓', label: copy.checkLocalPrepLabel, note: copy.checkLocalPrepNote },
  { mark: '✓', label: copy.checkIngredientsLabel, note: copy.checkIngredientsNote },
  { mark: '✓', label: copy.checkTechniqueLabel, note: copy.checkTechniqueNote },
  { mark: '~', label: copy.checkDocumentationLabel, note: copy.checkDocumentationNote },
  { mark: '✓', label: copy.checkLocalSourceLabel, note: copy.checkLocalSourceNote },
  { mark: '✗', label: copy.checkCommunityLabel, note: copy.checkCommunityNote },
];

const validatorsFor = (copy: Copy): { mark: string; who: string; said: string }[] => [
  { mark: '✓', who: copy.validatorHomeCook, said: copy.validatorHomeCookSaid },
  { mark: '✓', who: copy.validatorBakery, said: copy.validatorBakerySaid },
  { mark: '✓', who: copy.validatorWriter, said: copy.validatorWriterSaid },
  { mark: '·', who: copy.validatorPending, said: copy.validatorPendingSaid },
];

export default function Contribute() {
  const copy = useCopy();
  const [step, setStep] = useState(1);

  // Judged as it is typed, so someone pasting an Instagram link learns immediately
  // that the photograph is theirs to publish rather than after submitting the form.
  const [photoInput, setPhotoInput] = useState('');
  const photoResult = photoInput.trim() ? parsePhotoReference(copy, photoInput) : null;

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
      <NavRow title={copy.addATraditionShort} onBack={back} />

      <View style={styles.rail}>
        {stepLabelsFor(copy).map((label, i) => (
          <View key={label} style={styles.railSegment}>
            <View style={[styles.bar, { backgroundColor: i <= step - 1 ? color.accent : color.neutral[800] }]} />
            <T style={[styles.railLabel, { color: i === step - 1 ? accentText : color.faint }]}>{label}</T>
          </View>
        ))}
      </View>

      {step === 1 ? (
        <>
          <Muted style={styles.lead}>
            {copy.contributeLead}
          </Muted>

          {/* Said before the fields rather than after, because the instinct to tidy a
              name is strongest while typing it. */}
          <Block style={styles.ruleBlock}>
            <T style={styles.ruleTitle}>{copy.writeItTheWayYouWriteIt}</T>
            <Muted style={styles.ruleNote}>{copy.editorialRuleBody}</Muted>
          </Block>

          {/* The food and the place it is made that way are one answer. See `FieldPair`. */}
          <FieldPair>
            <Field label={copy.dishInItsOwnLanguage} style={styles.field}>
              <Input value={entry.dish} onChangeText={set('dish')} placeholder="Kaipola" />
            </Field>
            <Field label={copy.whereIsItMadeThisWay} style={styles.field}>
              <Input value={entry.place} onChangeText={set('place')} placeholder="India › Kerala › Malabar › Kozhikode" />
            </Field>
          </FieldPair>
          {/* Who makes it, and the connection that makes the account evidence rather
              than a recipe copied off the internet. One answer, so one line. */}
          <FieldPair>
            <Field label={copy.whoPreparesIt} style={styles.field}>
              <Input value={entry.cooks} onChangeText={set('cooks')} placeholder={copy.examplePreparedBy} />
            </Field>
            <Field label={copy.yourConnectionToThePlace} style={styles.field}>
              <Input value={entry.connection} onChangeText={set('connection')} placeholder={copy.exampleConnection} />
            </Field>
          </FieldPair>
          <Field label={copy.traditionalIngredientsAndEquipment} style={styles.field}>
            <Input
              multiline
              value={entry.ingredients}
              onChangeText={set('ingredients')}
              placeholder={copy.exampleIngredients}
            />
          </Field>

          {/* A photograph is the one contribution the automated sources cannot make:
              they only reach food someone has already documented, and the food this
              app most wants to show is the food nobody has. */}
          <Block style={styles.photoBlock}>
            <T style={styles.photoTitle}>{copy.photographTitle}</T>
            <Muted style={styles.photoNote}>
              {copy.photographBody}
            </Muted>

            <Button
              label={copy.publishAPhotographOnCommons}
              variant="secondary"
              block
              onPress={() => openAtSource(COMMONS_UPLOAD_URL)}
              style={styles.photoButton}
            />

            <Field label={copy.commonsFileNameOrLink} style={styles.photoField}>
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
                    {copy.photoCheckedNote}
                  </Muted>
                </View>
              )
            ) : null}
          </Block>

          <Muted style={styles.walkthroughNote}>{copy.walkthroughNoteBody}</Muted>
          <Button label={copy.checkWhatExistsOnline} block onPress={() => setStep(2)} />
        </>
      ) : null}

      {step === 2 ? (
        <>
          <H5 style={styles.stepHeading}>{copy.whatTheInternetAlreadyHas}</H5>
          <Muted style={styles.lead}>
            {copy.mostPublishedNote}
          </Muted>
          <View style={styles.list}>
            {findingsFor(copy).map((finding) => (
              <Block key={finding.title} style={styles.findingBlock}>
                <View style={styles.findingHead}>
                  <T style={styles.findingTitle}>{finding.title}</T>
                  <Tag label={finding.tag} variant="neutral" fontSize={10} noWrap />
                </View>
                <Muted style={styles.findingNote}>{finding.note}</Muted>
              </Block>
            ))}
          </View>
          <Button label={copy.runTheEvidenceAssessment} block onPress={() => setStep(3)} />
        </>
      ) : null}

      {step === 3 ? (
        <>
          <H5 style={styles.stepHeading}>{copy.evidenceAssessment}</H5>
          <Muted style={styles.lead}>
            {copy.sevenChecksNote}
          </Muted>
          <View style={styles.checks}>
            {checksFor(copy).map((check) => (
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
              <Muted style={styles.draftUnit}>{copy.draftConfidence}</Muted>
            </View>
            <Tag
              label={copy.unverifiedPendingTag}
              variant="neutral"
              fontSize={10}
              style={styles.draftTag}
            />
            <Muted style={styles.draftNote}>
              {copy.oneSubmitterNote}
            </Muted>
          </Block>

          <Button label={copy.sendForCommunityValidation} block onPress={() => setStep(4)} />
        </>
      ) : null}

      {step === 4 ? (
        <>
          <H5 style={styles.stepHeading}>{copy.communityValidation}</H5>
          <Muted style={styles.lead}>
            {copy.threeConfirmationsNote}
          </Muted>
          <View style={styles.list}>
            {validatorsFor(copy).map((validator) => (
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
            <CardKicker>{copy.ifTheyDisagree}</CardKicker>
            <CardBody>
              {copy.conflictingAccountsNote}
            </CardBody>
          </Card>

          <Block accent style={styles.publishedBlock}>
            {/* The badge this example would end up carrying, built the way a real one is.
                It was typed out in English, so a reader in any other language met the one
                badge in the app that had not been translated — inside the screen that
                explains what the badges mean. */}
            <Tag label={`🟢 ${levelLabel(copy, 'local')} · 78/100`} variant="neutral" fontSize={10} />
            <Muted style={styles.publishedNote}>
              {copy.whereTheExampleEndsUp}
            </Muted>
          </Block>

          {/* The real thing, at the end of the explanation of it. Until this the flow
              finished by describing a published record, which a reader who had just
              filled the form in could fairly read as their own. */}
          {canContribute() ? (
            <Card style={styles.sendCard}>
              <CardKicker>{copy.nowSendYours}</CardKicker>
              <CardBody>
                {missing.length
                  ? `${stillNeeded(copy, missing.map((f) => REQUIRED_LABELS[f as keyof typeof REQUIRED_LABELS]))} ` +
                    copy.nothingElseRequired
                  : copy.opensTheFormPrefilled}
              </CardBody>
              <Button
                label={copy.sendThisTradition}
                block
                onPress={() => openAtSource(contributionUrl(tidied()))}
              />
            </Card>
          ) : (
            /* No destination, no button — the rule the donate page follows. A control
               that goes nowhere spends a reader's goodwill on a dead link, and this
               reader has just typed out a recipe. */
            <Card style={styles.sendCard}>
              <CardKicker>{copy.submissionsNotOpenYet}</CardKicker>
              <CardBody>
                {copy.nowhereToSendNote}
              </CardBody>
            </Card>
          )}

          {/* Deterministic rather than a history pop: the label promises the atlas,
              and the flow can be entered from Search as well as from the Atlas. */}
          <Button
            label={copy.backToTheAtlas}
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
