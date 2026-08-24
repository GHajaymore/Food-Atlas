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
import { count } from '../../src/data/events';
import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton } from '../../src/components/Button';
import { Block, Card, CardBody, CardKicker } from '../../src/components/Card';
import { Disclosure } from '../../src/components/Disclosure';
import { BookmarkIcon, CameraIcon } from '../../src/components/icons';
import { FacetLink } from '../../src/components/FacetLink';
import { filterKeyFor } from '../../src/domain/authenticity';
import { LanguageBar } from '../../src/components/LanguageBar';
import { RecordColumns } from '../../src/components/RecordColumns';
import { Related } from '../../src/components/Related';
import { LocalNames } from '../../src/components/LocalNames';
import { NavRow } from '../../src/components/NavRow';
import { Photo } from '../../src/components/Photo';
import { Pressable } from '../../src/components/Pressable';
import { ScoreBreakdown } from '../../src/components/ScoreBreakdown';
import { Screen } from '../../src/components/Screen';
import { H2, H5, H6, Muted, T } from '../../src/components/Text';
import { Tag } from '../../src/components/Tag';
import { VideoCard } from '../../src/components/VideoCard';
import { catalogue, dishById } from '../../src/data/catalogue';
import { useCopy } from '../../src/i18n';
import { AT_RISK_NOTE } from '../../src/domain/atRisk';
import { relatedTo } from '../../src/domain/related';
import {
  confirmAsk,
  confirmStanding,
  contestedNote,
  forkedDisputes,
  ORIGIN_DISCLAIMER,
  openDisputes,
  siblingsOf,
} from '../../src/domain/traditions';
import { dietLabel, GROUP_LABELS, traceLabels } from '../../src/domain/diet';
import { MEAL_LABELS } from '../../src/domain/meals';
import { availableLanguages } from '../../src/domain/translate';
import { openAtSource } from '../../src/domain/video';
import { searchUrl } from '../../src/domain/videoDiscovery';
import { thresholds as scoreThresholds } from '../../src/data/settings';
import { settings } from '../../src/state/store';
import { useTranslations } from '../../src/state/translations';
import { accentText, color, font, radius, space } from '../../src/theme/tokens';

export default function DishDetail() {
  const copy = useCopy();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dish = dishById(Number(id));

  /*
   * One count per record opened. The dish id and nothing else — no reader, no session,
   * no time beyond the day the server stamps. See src/data/events.ts.
   */
  useEffect(() => {
    if (dish) count('dish', dish.id);
  }, [dish?.id]);

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
          <CardKicker>{copy.noRecord}</CardKicker>
          <CardBody>
            Nothing in the atlas is recorded under that reference. Absence here means no record, not no food.
          </CardBody>
          <Button label={copy.backToTheFeed} onPress={() => router.replace('/')} block />
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

  /**
   * The finest place the record actually names, for the ask on an empty record.
   *
   * Finest rather than the country, because "nobody has recorded how this is made in
   * Kozhikode" reaches somebody, and "in India" reaches nobody in particular. Empty
   * where the record has only a country it does not deserve to name — the ask then
   * simply omits the place rather than inventing one.
   */
  const askPlace = dish.loc.city || dish.loc.province || dish.loc.region || dish.loc.country;

  /**
   * Whether there is prose here worth translating.
   *
   * Deliberately wider than `isDocumented`. An ordered method is not the only thing
   * worth reading in another language — an article's account of how a dish is made
   * is prose too, and the infobox pass gave that to well over a thousand records
   * that will never have numbered steps. Gating translation on `steps` left every
   * one of them readable only in English while the screen displayed a paragraph of
   * preparation right underneath.
   */
  const hasProse = dish.steps.length > 0 || Boolean(dish.prepSummary?.trim());
  /** An adaptation documents how a dish is made today, not how its tradition makes it. */
  const isAdaptation = dish.badgeLevel === 'adaptation';
  /*
   * What we can honestly ask this reader depends on what the record holds — and now on
   * how far this particular record is from the badge.
   *
   * The general plea was the same sentence on all 17,778 records. Naming the place and
   * counting what is missing is what the positioning brief means by an ask that is
   * specific and near: a reader from Kozhikode recognises themselves in it, and nobody
   * recognises themselves in "if you cook this where it comes from".
   */
  const ask = confirmAsk(
    isDocumented,
    confirmStanding(askPlace, dish.confirmations?.length ?? 0, scoreThresholds().validationsRequired),
  );

  const siblings = siblingsOf(dish, catalogue);

  /* Recomputed only when the record changes. A pass over 18,008 records is a few
     milliseconds; doing it on every render while a translation streams in is not. */
  const relatedDishes = useMemo(() => relatedTo(dish, catalogue), [dish.id]);
  const forked = forkedDisputes(dish);
  const open = openDisputes(dish);

  return (
    <Screen bottomPad={50}>
      <NavRow
        right={
          <IconButton label={copy.bookmarkThis}>
            <BookmarkIcon size={18} color={color.accent} />
          </IconButton>
        }
      />

      {/*
       * The page's shape lives in `RecordColumns`, not in this file.
       *
       * Everything below is written once and arranged by that component: stacked on a
       * phone, two columns on a desktop. No block here knows the window width, which is
       * the point — the previous approach put a `wide ?` branch in each component and
       * the interactions between them were what produced a dropdown rendering behind
       * the page.
       */}
      <RecordColumns
        identity={
          <>
      {/* No photograph, no hero.
          A 4:3 placeholder for a record without an image pushed the dish's own name
          385px down an 812px screen — half the first view spent on a monogram that
          says nothing. Most records have no photograph, so this was the common case,
          not the edge one. Where there is no image the record leads with what it
          actually knows: its classification and its name. */}
      {dish.photo ? (
        <>
          <Photo
            uri={dish.photo}
            credit={dish.credit}
            label={dish.name}
            style={styles.hero}
            // The provenance line directly below carries the attribution in full.
            hideCredit
          />

          {/* Where the photograph itself was taken, or that the source does not
              record it. */}
          <View style={styles.photoProvenance}>
            <View style={styles.cameraIcon}>
              <CameraIcon size={12} color={color.muted} />
            </View>
            <Muted style={styles.photoProvenanceText}>
              {dish.photoOrigin} · photo via {dish.credit}
            </Muted>
          </View>
        </>
      ) : null}

      <View style={styles.badges}>
        {/*
         * The classification is a link, and it is arguably the most useful one here.
         *
         * A reader who has just been told this dish is "Authentic — Local" and wants to
         * know what else earned that had no way to ask: the badge is the product's
         * central claim and it was the one fact on the record that led nowhere. The
         * remaining tags stay inert on purpose — "Photo origin unverified" and "At-Risk
         * Tradition" are statements about *this* record, not categories to browse.
         */}
        <FacetLink
          variant="tag"
          label={`${dish.badgeIcon} ${dish.badgeLabelFull}`}
          describedAs={`Everything classified ${dish.badgeLabel}`}
          query={{ level: filterKeyFor(dish.badgeLevel) }}
        />
        {dish.photo && !dish.photoVerified ? (
          <Tag label={copy.photoOriginUnverified} variant="outline" style={styles.unverified} />
        ) : null}
        {dish.traditionalBadge ? <Tag label="🏺 Traditional Preparation" variant="outline" /> : null}
        {dish.atRisk ? <Tag label="🕯️ At-Risk Tradition" variant="outline" /> : null}
      </View>

      <H2 style={styles.title}>{dish.name}</H2>

      {/* Directly under the name, because that is what these are about, and above
          everything else because a reader looking for their own language should not
          have to scroll past the method to find out the app knows it. */}
      <LocalNames names={dish.localNames} original={dish.name} />

      {/*
       * The breadcrumb, with every step a link to that place.
       *
       * It read as a path and behaved as decoration: a reader could see this dish is
       * from Kerala, from India, and had no way to ask what else is. Each step is a
       * query `feedFor` has been able to run all along — only the link was missing, and
       * its absence is most of what made a record page a dead end.
       *
       * The country is the second step and the region the third, matching how
       * `pathOf` reads a URL. Deeper steps — a province, a town — narrow to the region
       * they sit in, because the atlas files records at region level and a link to a
       * village would land on a page holding one record: true, and useless.
       */}
      <View style={styles.breadcrumb}>
        {dish.breadcrumb.map((part, i) => {
          /*
           * The announcement names where the link goes, not what it says.
           *
           * Found by walking the navigation rather than reading it: "Kozhikode"
           * announced itself as *"Everything from Kozhikode"* and landed on a page
           * headed "Kerala, India", because a town narrows to its region for the reason
           * above. The destination is right and the promise was not — and on the one
           * page whose whole argument is that its claims can be checked, a link that
           * says one thing and does another is the worst available small bug.
           */
          const opensAt = i === 0 ? part : dish.loc.region || part;

          return (
          <Muted key={part} style={styles.breadcrumbText}>
            <FacetLink
              label={part}
              describedAs={`Everything from ${opensAt}`}
              query={
                i === 0
                  ? { country: part }
                  : { country: dish.loc.country, region: dish.loc.region || part }
              }
            />
            {i < dish.breadcrumb.length - 1 ? ' › ' : ''}
          </Muted>
          );
        })}
      </View>

      {/* A record with several documented origins still has to be filed under one
          country — the atlas is navigated by place, and a record with nowhere is a
          record nobody finds. But printing that one country under the title, alone,
          states the thing the page says lower down it will not state: Pierogi read
          "China" in the largest text on the screen, above a section explaining that no
          claim here is the winner. The line below is the correction, and it is placed
          where the claim was rather than left to the reader to find. */}
      {dish.originClaims && dish.originClaims.length > 1 ? (
        <Muted style={styles.contested}>{contestedNote(dish.originClaims.length)}</Muted>
      ) : null}

      {/* The sentence behind the 🕯️ badge, which was never shown anywhere.
          `atRisk.ts` says every flag keeps the sentence that produced it, so "a wrong
          one is visibly wrong rather than an unexplained badge", and `types.ts` calls
          a badge without its evidence "exactly the unexplained assertion this app
          refuses to make anywhere else". The field was written, tested for arrival,
          and rendered by nothing.
          It is not a small omission: with the evidence invisible, half the flagged
          records turned out to cite sentences about a revival, or about fireplaces
          and pineapples declining, and nobody could see it — including us, until the
          data was read directly. */}
      {dish.atRisk && dish.atRiskEvidence ? (
        <Block style={styles.atRisk}>
          <T style={styles.atRiskTitle}>{copy.whyFlaggedAtRisk}</T>
          <Muted style={styles.atRiskQuote}>“{dish.atRiskEvidence}”</Muted>
          <Muted style={styles.atRiskNote}>{AT_RISK_NOTE}</Muted>
        </Block>
      ) : null}
          </>
        }
        dossier={
          <>
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
          {/* Translation is offered where there is prose worth translating — a
              method or an article's account of one. A record with only its one-line
              blurb gets no control, because that would promise a substance it does
              not have. */}
          {hasProse ? (
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

          {/* An open challenge is shown, and the score is left alone. Hiding a live
              disagreement, or quietly docking the number, would be the same failure
              as claiming a certainty the evidence does not support. */}
          {open.length ? (
            <Card style={styles.disputed}>
              <CardKicker>{copy.openDisagreement}</CardKicker>
              <CardBody>
                Someone who cooks this in {open[0].from} says it is made differently: {open[0].differs} Nothing has
                been removed while this is looked at, and the confidence below is unchanged — if both accounts hold,
                the record will split rather than one being overruled.
              </CardBody>
            </Card>
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
              {/*
               * The diet links to its group rather than to the composed label above it.
               * "Meat · Poultry" is the honest description of this record; the useful
               * question behind it is "what else is meat", and the group is the widest
               * answer that is still true.
               *
               * The traces beside it stay inert: dairy and egg are things this dish
               * contains, and the atlas has no filter for them — a link that could only
               * lead somewhere approximate is worse than a plain word.
               */}
              <FacetLink
                variant="tag"
                label={dietLabel(dish.diet)}
                describedAs={`Everything recorded as ${GROUP_LABELS[dish.diet.group]}`}
                query={{ diet: dish.diet.group }}
              />
              {traceLabels(dish.diet).map((trace) => (
                <Tag key={trace} label={trace} variant="outline" />
              ))}
            </View>
            <Muted style={styles.dietBasis}>{dish.diet.basis}</Muted>

            {dish.meals.note ? (
              <>
                <View style={styles.mealChips}>
                  {dish.meals.occasions.map((occasion) => (
                    <FacetLink
                      key={occasion}
                      variant="tag"
                      label={MEAL_LABELS[occasion]}
                      /* No `describedAs`: the labels are a mixed bag grammatically —
                         "Snack", "Celebration & feast", "Any time" — and every sentence
                         that fits one reads badly around another. "Everything eaten at
                         Snack" was the first attempt. FacetLink's default, "Snack — see
                         everything", works for all nine. */
                      query={{ meal: occasion }}
                    />
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
          {/* A described preparation is documentation, not a method. It is quoted
              from a source and labelled as such, so it never passes for the
              traditional preparation — which is still open, and still needs
              someone who cooks it. */}
          {!isDocumented && dish.prepSummary ? (
            <>
              <H5 style={styles.tightHeading}>How it&apos;s described</H5>
              <Muted style={styles.sectionLead}>
                Quoted from the source below — a general account of how the dish is made, not a record of how it is
                made in {dish.breadcrumb[dish.breadcrumb.length - 1]}.
              </Muted>
              <Block style={styles.describedBlock}>
                <Muted style={styles.described}>{dish.prepSummary}</Muted>
              </Block>

              {dish.ingredients.length ? (
                <>
                  <H6 style={styles.equipmentHeading}>{copy.ingredientsNamedInAccount}</H6>
                  <View style={[styles.chipWrap, styles.equipmentWrap]}>
                    {dish.ingredients.map((ingredient) => (
                      <Tag key={ingredient} label={ingredient} variant="neutral" />
                    ))}
                  </View>
                </>
              ) : null}

              <Card style={styles.undocumented}>
                <CardKicker>{copy.methodStillOpen}</CardKicker>
                <CardBody>
                  Nobody has recorded the technique — the timings, the vessel, the order things happen in. That is
                  what would lift this record out of Unverified, and it takes someone who cooks it.
                </CardBody>
                <Button label={copy.recordHowItsMade} block onPress={() => router.push('/contribute')} />
              </Card>
            </>
          ) : null}

          {!isDocumented && !dish.prepSummary ? (
            <Card style={styles.undocumented}>
              <CardKicker>{copy.notDocumentedYet}</CardKicker>
              {/*
               * Named, not "this".
               *
               * 10,197 records are in this state — 57% of the atlas — and a general
               * appeal across all of them converts nobody. What makes a reader stop is
               * seeing a dish they know, from a place they know, with nothing under it.
               * So the sentence says which dish and which place, and then says plainly
               * that they would be the first, because they would be.
               */}
              <CardBody>
                Nobody has recorded how {dish.name} is made
                {askPlace ? ` in ${askPlace}` : ''}. We could copy the most-published recipe from the internet and
                call it authentic, but that is the thing this atlas exists not to do — so the record stays as it is
                until someone who cooks it fills it in. If you do, you would be the first to write it down.
              </CardBody>
              <Button label={copy.recordHowItsMade} block onPress={() => router.push('/contribute')} />
            </Card>
          ) : null}

          {isDocumented ? (
          <>
          {/* The heading has to agree with the badge. A Cookbook recipe is classified
              Modern Adaptation, and calling its ingredients the "Authentic Version"
              contradicts the classification printed directly above it — which is the
              silent mislabelling the brief exists to prevent. */}
          <H5 style={styles.h5}>{isAdaptation ? 'The published recipe' : 'Authentic Version'}</H5>
          {isAdaptation ? (
            <Muted style={styles.sectionLead}>
              How this dish is commonly made today. It is not a record of how it is prepared in{' '}
              {dish.breadcrumb[dish.breadcrumb.length - 1]}, and nobody from there has confirmed it.
            </Muted>
          ) : null}
          <Muted style={styles.prepSummary}>{reading.prepSummary}</Muted>
          <View style={styles.chipWrap}>
            {/*
             * Each ingredient opens everything made with it.
             *
             * Never translated — these names are the identity of the food — and the link
             * carries the name exactly as written, so "ghee" finds ghee and does not
             * quietly become "clarified butter" on the way to the query.
             *
             * This is the richest link on the page. A reader who has just learnt that a
             * dish uses ghee, kokum or nendran banana is one tap from every other
             * tradition that does, which is the kind of thing an atlas is *for* and
             * which no amount of additional prose would have provided.
             */}
            {reading.ingredients.map((ingredient) => (
              <FacetLink
                key={ingredient}
                variant="chip"
                label={ingredient}
                describedAs={`Everything made with ${ingredient}`}
                query={{ ingredient }}
              />
            ))}
          </View>

          {/* Only where there is equipment to name. Published recipes list none. */}
          {reading.equipment.length ? (
            <>
              <H6 style={styles.equipmentHeading}>{copy.traditionalEquipment}</H6>
              <View style={[styles.chipWrap, styles.equipmentWrap]}>
                {reading.equipment.map((item) => (
                  <Tag key={item} label={item} variant="outline" />
                ))}
              </View>
            </>
          ) : null}

          <H5 style={styles.tightHeading}>How it&apos;s made</H5>
          <Muted style={styles.sectionLead}>
            {isAdaptation
              ? 'The method as published. Modern equipment and shortcuts are part of it.'
              : 'The traditional method, with no modern shortcuts substituted in.'}
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
              <H5 style={styles.tightHeading}>{copy.mostPopularVersion}</H5>
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
              <H5 style={styles.tightHeading}>{copy.watchItBeingMade}</H5>
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
          ) : (
            /* No curated video. Rather than an empty section, offer the search —
               and say exactly what it is: a popularity-ordered starting point, not
               a video anyone has checked against the tradition. */
            <>
              <H5 style={styles.tightHeading}>{copy.watchItBeingMade}</H5>
              <Muted style={styles.sectionLead}>
                No video from the tradition has been recorded for this dish yet.
              </Muted>
              <Block style={styles.discoverBlock}>
                <Muted style={styles.discoverNote}>
                  You can search for one at the source. Results come back ordered by view count, which measures
                  reach and nothing else — the cook may or may not be from {dish.breadcrumb[0]}. Nothing found this
                  way affects this record&apos;s classification.
                </Muted>
                <Button
                  label={copy.findPreparationVideos}
                  variant="secondary"
                  block
                  onPress={() => openAtSource(searchUrl(dish))}
                />
                <Muted style={styles.discoverNote}>
                  If you find one made by someone from the place, it can be added through Add a tradition — that is
                  what would give this dish a ranked video.
                </Muted>
              </Block>
            </>
          )}

          <H5 style={styles.h5}>{copy.whereTheMethodComesFrom}</H5>
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
          {/* Other traditions of this dish. Peers, never a canonical and a variant —
              the record split because both accounts were true of their own place. */}
          {siblings.length ? (
            <>
              <H5 style={styles.tightHeading}>{copy.alsoMadeThisWay}</H5>
              <Muted style={styles.sectionLead}>
                The same dish, recorded separately where it is made differently. Neither is the real one.
              </Muted>
              <View style={styles.sources}>
                {siblings.map((sibling) => (
                  <Pressable
                    key={sibling.id}
                    accessibilityRole="button"
                    accessibilityLabel={`${sibling.name}, ${sibling.breadcrumb.join(', ')}`}
                    tint="neutral"
                    onPress={() => router.replace(`/dish/${sibling.id}`)}
                    style={styles.sourceRow}
                  >
                    <T style={styles.sourceTitle}>{sibling.name}</T>
                    <Muted style={styles.sourceMeta}>{sibling.breadcrumb.join(' › ')}</Muted>
                    {forked.length ? <Muted style={styles.sourceMeta}>{forked[0].differs}</Muted> : null}
                  </Pressable>
                ))}
              </View>
            </>
          ) : null}

          {/* A contested origin is recorded, not adjudicated — and kept away from the
              score, which measures how a dish is made here, not who invented it. */}
          {dish.originClaims?.length ? (
            <>
              <H5 style={styles.tightHeading}>Origin &amp; cultural attribution</H5>
              <Muted style={styles.sectionLead}>{ORIGIN_DISCLAIMER}</Muted>
              <View style={styles.sources}>
                {dish.originClaims.map((claim) => (
                  <Pressable
                    key={claim.place}
                    accessibilityRole="link"
                    tint="neutral"
                    onPress={() => openAtSource(claim.source.url)}
                    style={styles.sourceRow}
                  >
                    <T style={styles.sourceTitle}>{claim.place}</T>
                    <Muted style={styles.sourceMeta}>{claim.claim}</Muted>
                    <Muted style={styles.sourceMeta}>
                      {claim.source.publisher} · {claim.source.title} ↗
                    </Muted>
                  </Pressable>
                ))}
              </View>
            </>
          ) : null}

          {/* An adaptation is not claiming authenticity, so it is not asked to
              justify any — the question would invite the reader to read the answer
              as a defence of a claim the record never made. */}
          <H5 style={styles.h5}>
            {isAdaptation
              ? 'Why this is an adaptation'
              : isDocumented
                ? 'Why is this considered authentic?'
                : 'What this record is'}
          </H5>
          <Muted style={styles.disclaimer}>{reading.disclaimer}</Muted>

          {/* The prompt that turns a reader into a validator. Two taps, not a form —
              correcting your own food is a far stronger motive than filling in a
              blank submission, and it is what actually feeds the pipeline. */}
          <Card style={styles.confirm}>
            <CardKicker>{ask.kicker}</CardKicker>
            <CardBody>{ask.body}</CardBody>
            {/* Named and counted, under the general case. Absent where the record has no
                place worth naming — "two more people from somewhere" is not an ask. */}
            {ask.standing ? <Muted style={styles.standing}>{ask.standing}</Muted> : null}
            <Button label={ask.yes} variant="secondary" block onPress={() => router.push('/contribute')} />
            <Button label={ask.no} block onPress={() => router.push('/contribute')} />
          </Card>
        </>
      )}

      {/*
       * Outside the documented branch, deliberately.
       *
       * A record with nothing written down is exactly the one a reader most needs a way
       * out of — it has a name, a place, and a sentence saying nobody has recorded how
       * it is made. Ending there is a dead end on the 10,197 pages where a dead end
       * costs the most, and the related list is built from the place and the name,
       * which even those records have.
       */}
      <Related items={relatedDishes} />
          </>
        }
      />
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
  contested: { fontSize: 11, lineHeight: 11 * 1.5, marginTop: 6, marginBottom: 2 },
  atRisk: { padding: 12, marginTop: 14 },
  atRiskTitle: { fontSize: 12, fontFamily: font.medium },
  atRiskQuote: { fontSize: 12, lineHeight: 12 * 1.55, marginTop: 6, fontStyle: 'italic' },
  atRiskNote: { fontSize: 11, lineHeight: 11 * 1.5, marginTop: 8 },
  breadcrumb: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 22 },
  breadcrumbText: { fontSize: 13, lineHeight: 13 * 1.5 },
  deepest: { color: accentText },
  dim: { color: color.muted },

  fusionCard: { marginBottom: 16 },
  fusionLead: { fontSize: 12, marginBottom: 8 },

  popularityLine: { fontSize: 11, marginTop: -12, marginBottom: 20 },

  undocumented: { marginBottom: 22 },
  describedBlock: { marginBottom: 16 },
  described: { fontSize: 13, lineHeight: 13 * 1.55 },
  disputed: { marginBottom: 18 },
  standing: { fontSize: 12, lineHeight: 12 * 1.5, marginTop: -2, marginBottom: 2 },
  confirm: { marginTop: 24 },
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

  discoverBlock: { marginBottom: 22, gap: 4 },
  discoverNote: { fontSize: 11, lineHeight: 11 * 1.5 },
  videos: { gap: 14, marginBottom: 8 },
  videoNote: { fontSize: 11, lineHeight: 11 * 1.45, marginBottom: 22 },

  sources: { gap: 10, marginBottom: 22 },
  sourceRow: { padding: 10, borderWidth: 1, borderColor: color.divider, borderRadius: radius.md },
  sourceTitle: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  sourceMeta: { fontSize: 12, lineHeight: 12 * 1.45, marginTop: 2 },

  disclaimer: { fontSize: 13, lineHeight: 13 * 1.5 },
});
