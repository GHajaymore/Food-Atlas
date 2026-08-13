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
 * validation pipeline.
 */

import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Block, Card, CardBody, CardKicker } from '../src/components/Card';
import { Field, Input } from '../src/components/Field';
import { NavRow } from '../src/components/NavRow';
import { Screen } from '../src/components/Screen';
import { H5, Muted, T } from '../src/components/Text';
import { Tag } from '../src/components/Tag';
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
    <Screen bottomPad={50}>
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

          <Field label="Dish, in its own language if possible" style={styles.field}>
            <Input defaultValue="Kaipola" />
          </Field>
          <Field label="Where is it made this way?" style={styles.field}>
            <Input defaultValue="India › Kerala › Malabar › Kozhikode" />
          </Field>
          <Field label="Who prepares it" style={styles.field}>
            <Input defaultValue="Malabar households, made for iftar and family occasions" />
          </Field>
          <Field label="Traditional ingredients and equipment" style={styles.field}>
            <Input
              multiline
              defaultValue="Ripe nendran banana, eggs, ghee, sugar, cashews, raisins; cooked in a heavy pan over low charcoal or gas flame, covered with a lid weighted with embers"
            />
          </Field>
          <Field label="Your connection to the place" style={styles.fieldLast}>
            <Input defaultValue="Born and cooking in Kozhikode" />
          </Field>

          <Muted style={styles.walkthroughNote}>Fields are filled in for this walkthrough.</Muted>
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
              Published with its evidence visible, its open checks named, and every claim traceable to who said it.
            </Muted>
          </Block>

          {/* Deterministic rather than a history pop: the label promises the atlas,
              and the flow can be entered from Search as well as from the Atlas. */}
          <Button label="Back to the atlas" block onPress={() => router.replace('/atlas')} />
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
  fieldLast: { marginBottom: 16 },
  walkthroughNote: { fontSize: 11, marginBottom: 14 },

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
