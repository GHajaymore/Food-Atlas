/**
 * Detail — the full authenticity dossier for one dish.
 *
 * The section order is fixed and load-bearing. Two rules are structural here rather
 * than cosmetic:
 *
 *   - A Fusion record renders ONLY its explanation and a link to the tradition it
 *     borrows from. No score, no method, no equipment, no videos. That is the
 *     "no fusion in the authentic category" rule expressed as control flow.
 *   - The adaptation lives in its own collapsed disclosure and is labelled as an
 *     adaptation. It is never merged into the authentic ingredient list above it.
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton } from '../../src/components/Button';
import { Block, Card, CardBody, CardKicker } from '../../src/components/Card';
import { Disclosure } from '../../src/components/Disclosure';
import { BookmarkIcon, CameraIcon } from '../../src/components/icons';
import { LanguageBar } from '../../src/components/LanguageBar';
import { NavRow } from '../../src/components/NavRow';
import { Photo } from '../../src/components/Photo';
import { Pressable } from '../../src/components/Pressable';
import { ScoreBreakdown } from '../../src/components/ScoreBreakdown';
import { Screen } from '../../src/components/Screen';
import { H2, H5, H6, Muted, T } from '../../src/components/Text';
import { Tag } from '../../src/components/Tag';
import { VideoCard } from '../../src/components/VideoCard';
import { dishById } from '../../src/data/catalogue';
import { dietLabel, traceLabels } from '../../src/domain/diet';
import { MEAL_LABELS } from '../../src/domain/meals';
import { availableLanguages } from '../../src/domain/translate';
import { openAtSource } from '../../src/domain/video';
import { settings } from '../../src/state/store';
import { useTranslations } from '../../src/state/translations';
import { accentText, color, radius, space } from '../../src/theme/tokens';

export default function DishDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dish = dishById(Number(id));

  const { language, setLanguage, requestTranslation, retryTranslation, read, statusFor, errorFor, canTranslate } =
    useTranslations();

  // Real-time: picking a language translates the record straight away, rather than
  // parking the reader behind a button. No-ops when a translation already exists or
  // no provider is wired up.
  useEffect(() => {
    if (dish) void requestTranslation(dish, { auto: true });
  }, [dish, language, requestTranslation]);

  // Not an error state — an absence of records, worded in the app's voice.
  if (!dish) {
    return (
      <Screen>
        <NavRow />
        <Card>
          <CardKicker>No record</CardKicker>
          <CardBody>
            Nothing in the atlas is recorded under that reference. Absence here means no record, not no food.
          </CardBody>
          <Button label="Back to the feed" onPress={() => router.replace('/')} block />
        </Card>
      </Screen>
    );
  }

  const isFusion = dish.badgeLevel === 'fusion';
  const related = dish.relatedId ? dishById(dish.relatedId) : undefined;

  // The record resolved into the reader's language. Names, ingredients and equipment
  // come back untranslated by construction — see domain/translate.ts.
  const reading = read(dish);

  // Imported records carry a name and a place and nothing else. The sections below
  // describe a preparation, so they only render where there is one.
  const isDocumented = dish.steps.length > 0;

  return (
    <Screen bottomPad={50}>
      <NavRow
        right={
          <IconButton label="Bookmark this tradition">
            <BookmarkIcon size={18} color={color.accent} />
          </IconButton>
        }
      />

      <Photo
        uri={dish.photo}
        credit={dish.credit}
        label={dish.name}
        style={styles.hero}
        // The provenance line directly below carries the attribution in full.
        hideCredit
      />

      {/* Where the photograph itself was taken, or that the source does not record
          it. Only meaningful when there is a photograph — most imported records
          have none, and a bare "photo via" would be worse than saying nothing. */}
      <View style={styles.photoProvenance}>
        <View style={styles.cameraIcon}>
          <CameraIcon size={12} color={color.muted} />
        </View>
        <Muted style={styles.photoProvenanceText}>
          {dish.photo ? `${dish.photoOrigin} · photo via ${dish.credit}` : 'No photograph on record for this dish.'}
        </Muted>
      </View>

      <View style={styles.badges}>
        <Tag label={`${dish.badgeIcon} ${dish.badgeLabelFull}`} variant="neutral" />
        {dish.photo && !dish.photoVerified ? (
          <Tag label="Photo origin unverified" variant="outline" style={styles.unverified} />
        ) : null}
        {dish.traditionalBadge ? <Tag label="🏺 Traditional Preparation" variant="outline" /> : null}
        {dish.atRisk ? <Tag label="🕯️ At-Risk Tradition" variant="outline" /> : null}
      </View>

      <H2 style={styles.title}>{dish.name}</H2>

      <View style={styles.breadcrumb}>
        {dish.breadcrumb.map((part, i) => (
          <Muted key={part} style={styles.breadcrumbText}>
            <T style={[styles.breadcrumbText, i === dish.breadcrumb.length - 1 ? styles.deepest : styles.dim]}>
              {part}
            </T>
            {i < dish.breadcrumb.length - 1 ? ' › ' : ''}
          </Muted>
        ))}
      </View>

      {isFusion ? (
        <>
          <Card style={styles.fusionCard}>
            <CardKicker>Not eligible for authentic classification</CardKicker>
            <CardBody>{dish.fusionNote}</CardBody>
          </Card>
          {related ? (
            <>
              <Muted style={styles.fusionLead}>Looking for the tradition it borrows from?</Muted>
              <Button
                label={`View ${related.name} — Authentic`}
                variant="secondary"
                block
                onPress={() => router.replace(`/dish/${related.id}`)}
              />
            </>
          ) : null}
        </>
      ) : (
        <>
          {/* Translation is offered where there is prose worth translating. An
              undocumented record has only its one-line blurb, so the control would
              be a promise of substance the record does not have. */}
          {isDocumented ? (
            <LanguageBar
              language={language}
              onSelect={setLanguage}
              available={availableLanguages(dish)}
              reading={reading}
              status={statusFor(dish)}
              error={errorFor(dish)}
              canTranslate={canTranslate()}
              onTranslate={() => void retryTranslation(dish)}
            />
          ) : null}

          {dish.score !== null ? (
            <ScoreBreakdown
              score={dish.score}
              breakdown={dish.breakdown}
              showBars={settings.scoreStyle === 'bars'}
            />
          ) : null}

          {settings.showViewCounts && dish.views ? (
            <Muted style={styles.popularityLine}>{dish.views} · authenticity outranks popularity here</Muted>
          ) : null}

          {/* The dietary read, with what it was read from. Someone keeps halal,
              kosher or a vow on the strength of this, so it is stated with its
              basis rather than as a bare chip — and nothing here offers to adapt
              the dish to fit a preference. */}
          <Block style={styles.dietBlock}>
            <View style={styles.dietChips}>
              <Tag label={dietLabel(dish.diet)} variant="neutral" />
              {traceLabels(dish.diet).map((trace) => (
                <Tag key={trace} label={trace} variant="outline" />
              ))}
            </View>
            <Muted style={styles.dietBasis}>{dish.diet.basis}</Muted>

            {dish.meals.note ? (
              <>
                <View style={styles.mealChips}>
                  {dish.meals.occasions.map((occasion) => (
                    <Tag key={occasion} label={MEAL_LABELS[occasion]} variant="outline" />
                  ))}
                </View>
                {/* The occasion in its own terms — iftar, Þorrablót, the comida —
                    which is the part a chip cannot hold. */}
                <Muted style={styles.dietBasis}>{dish.meals.note}</Muted>
              </>
            ) : null}
          </Block>

          {/* An unassessed record has no method, no ingredients and no equipment.
              Rendering the headings anyway would promise a preparation that is not
              there — so it says what it is, and offers the way to fix it. */}
          {!isDocumented ? (
            <Card style={styles.undocumented}>
              <CardKicker>Not documented yet</CardKicker>
              <CardBody>
                Nobody has recorded how this is made. We could copy the most-published recipe from the internet and
                call it authentic, but that is the thing this atlas exists not to do — so the record stays as it is
                until someone who cooks it fills it in.
              </CardBody>
              <Button label="Record how it's made" block onPress={() => router.push('/contribute')} />
            </Card>
          ) : null}

          {isDocumented ? (
          <>
          <H5 style={styles.h5}>Authentic Version</H5>
          <Muted style={styles.prepSummary}>{reading.prepSummary}</Muted>
          <View style={styles.chipWrap}>
            {/* Never translated — these names are the identity of the food. */}
            {reading.ingredients.map((ingredient) => (
              <Tag key={ingredient} label={ingredient} variant="neutral" />
            ))}
          </View>

          <H6 style={styles.equipmentHeading}>Traditional Equipment</H6>
          <View style={[styles.chipWrap, styles.equipmentWrap]}>
            {reading.equipment.map((item) => (
              <Tag key={item} label={item} variant="outline" />
            ))}
          </View>

          <H5 style={styles.tightHeading}>How it&apos;s made</H5>
          <Muted style={styles.sectionLead}>
            The traditional method, with no modern shortcuts substituted in.
          </Muted>
          <View style={styles.steps}>
            {reading.steps.map((step, i) => (
              <View key={step} style={styles.step}>
                <View style={styles.stepNumber}>
                  <T style={styles.stepNumberText}>{i + 1}</T>
                </View>
                <T style={styles.stepText}>{step}</T>
              </View>
            ))}
          </View>

          {reading.adaptation ? (
            <Disclosure summary="If the traditional ingredient is unavailable">
              <Muted style={styles.adaptationLine}>
                <T style={styles.adaptationLabel}>Traditional: </T>
                {reading.adaptation.traditional}
              </Muted>
              <Muted style={styles.adaptationLine}>
                <T style={styles.adaptationLabel}>Common modern substitute: </T>
                {reading.adaptation.substitute}
              </Muted>
              <T style={styles.adaptationWarning}>
                This is an adaptation and should not be considered the authentic preparation.
              </T>
            </Disclosure>
          ) : null}
          </>
          ) : null}

          {dish.popular ? (
            <>
              <H5 style={styles.tightHeading}>Most popular version online</H5>
              <Muted style={styles.sectionLead}>
                What the internet mostly serves for this dish, and how it departs from the tradition above.
              </Muted>
              <Block style={styles.popularBlock}>
                <View style={styles.popularHead}>
                  <T style={styles.popularLabel}>{dish.popular.label}</T>
                  <Tag label={dish.popular.level} variant="neutral" fontSize={10} noWrap />
                </View>
                <View style={styles.changedList}>
                  {dish.popular.changed.map((change) => (
                    <View key={change} style={styles.bulletRow}>
                      <Muted style={styles.bullet}>•</Muted>
                      <Muted style={styles.changeText}>{change}</Muted>
                    </View>
                  ))}
                </View>
                <Pressable
                  accessibilityRole="link"
                  tint="none"
                  onPress={() => openAtSource(dish.popular!.url)}
                >
                  <T style={styles.sourceLink}>{dish.popular.source} ↗</T>
                </Pressable>
                <T style={styles.popularClosing}>
                  Popular, but not the authentic preparation. The version above remains the reference.
                </T>
              </Block>
            </>
          ) : null}

          {dish.videos.length ? (
            <>
              <H5 style={styles.tightHeading}>Watch it being made</H5>
              <Muted style={styles.sectionLead}>
                Real videos, ranked by how close the cook is to the tradition — not by view count.
              </Muted>
              <View style={styles.videos}>
                {dish.videos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </View>
              <Muted style={styles.videoNote}>
                Still frames are taken from the videos themselves, so the dish you see is the dish that cook made.
                Engagement figures are deliberately not shown — they don&apos;t measure authenticity.
              </Muted>
            </>
          ) : null}

          <H5 style={styles.h5}>Where the method comes from</H5>
          <View style={styles.sources}>
            {dish.sources.map((source) => (
              <Pressable
                key={source.url}
                accessibilityRole="link"
                tint="neutral"
                onPress={() => openAtSource(source.url)}
                style={styles.sourceRow}
              >
                <T style={styles.sourceTitle}>{source.title}</T>
                <Muted style={styles.sourceMeta}>
                  {source.publisher} · {source.note}
                </Muted>
              </Pressable>
            ))}
          </View>

          {/* An unassessed record cannot answer "why is this authentic?" — it has
              not been assessed. Asking the question and then not answering it would
              be the pretence of certainty the brief warns against. */}
          <H5 style={styles.h5}>
            {isDocumented ? 'Why is this considered authentic?' : 'What this record is'}
          </H5>
          <Muted style={styles.disclaimer}>{reading.disclaimer}</Muted>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { width: '100%', aspectRatio: 4 / 3, borderRadius: radius.lg, marginBottom: 16 },

  photoProvenance: { flexDirection: 'row', alignItems: 'flex-start', gap: 5, marginTop: -8, marginBottom: 14 },
  cameraIcon: { marginTop: 2 },
  photoProvenanceText: { fontSize: 11, lineHeight: 11 * 1.45, flex: 1 },

  badges: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 10 },
  unverified: { opacity: 0.75 },

  title: { marginBottom: 6 },
  breadcrumb: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 22 },
  breadcrumbText: { fontSize: 13, lineHeight: 13 * 1.5 },
  deepest: { color: accentText },
  dim: { color: color.muted },

  fusionCard: { marginBottom: 16 },
  fusionLead: { fontSize: 12, marginBottom: 8 },

  popularityLine: { fontSize: 11, marginTop: -12, marginBottom: 20 },

  undocumented: { marginBottom: 22 },
  dietBlock: { marginBottom: 20 },
  dietChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  dietBasis: { fontSize: 11, lineHeight: 11 * 1.5, marginTop: 8 },
  mealChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },

  h5: { marginBottom: space[2] },
  tightHeading: { marginBottom: 2 },
  sectionLead: { fontSize: 12, lineHeight: 12 * 1.45, marginBottom: 12 },
  prepSummary: { fontSize: 13, lineHeight: 13 * 1.5, marginBottom: 10 },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  equipmentHeading: { marginBottom: space[2] },
  equipmentWrap: { marginBottom: 18 },

  steps: { gap: 12, marginBottom: 20 },
  step: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  stepNumber: {
    width: 20,
    height: 20,
    marginTop: 1,
    borderRadius: 10,
    backgroundColor: color.accentRamp[900],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: { fontSize: 11, color: accentText },
  stepText: { flex: 1, fontSize: 13, lineHeight: 13 * 1.5 },

  adaptationLine: { fontSize: 13, lineHeight: 13 * 1.5, marginBottom: 8 },
  adaptationLabel: { fontSize: 13, color: color.text },
  adaptationWarning: { fontSize: 12, lineHeight: 12 * 1.45, color: accentText },

  popularBlock: { marginBottom: 22 },
  popularHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space[2], marginBottom: 8 },
  popularLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', flex: 1 },
  changedList: { gap: 5, marginBottom: 10 },
  bulletRow: { flexDirection: 'row', gap: 6 },
  bullet: { fontSize: 12 },
  changeText: { fontSize: 12, lineHeight: 12 * 1.45, flex: 1 },
  sourceLink: { fontSize: 12, color: accentText },
  popularClosing: { fontSize: 11, lineHeight: 11 * 1.45, color: accentText, marginTop: 10 },

  videos: { gap: 14, marginBottom: 8 },
  videoNote: { fontSize: 11, lineHeight: 11 * 1.45, marginBottom: 22 },

  sources: { gap: 10, marginBottom: 22 },
  sourceRow: { padding: 10, borderWidth: 1, borderColor: color.divider, borderRadius: radius.md },
  sourceTitle: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  sourceMeta: { fontSize: 12, lineHeight: 12 * 1.45, marginTop: 2 },

  disclaimer: { fontSize: 13, lineHeight: 13 * 1.5 },
});
