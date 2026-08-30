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

import { hasMethod, methodLength } from '../../src/domain/method';
import { photoOriginLabel } from '../../src/domain/photoProvenance';
import { languageNameIn } from '../../src/domain/language';
import { placeName } from '../../src/domain/continents';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { count } from '../../src/data/events';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton } from '../../src/components/Button';
import { Block, Card, CardBody, CardKicker } from '../../src/components/Card';
import { Disclosure } from '../../src/components/Disclosure';
import { BookmarkIcon, CameraIcon } from '../../src/components/icons';
import { FacetLink } from '../../src/components/FacetLink';
import { filterKeyFor, levelLabel } from '../../src/domain/authenticity';
import { RecordColumns } from '../../src/components/RecordColumns';
import { Related } from '../../src/components/Related';
import { LocalNames } from '../../src/components/LocalNames';
import { NavRow } from '../../src/components/NavRow';
import { cardPlace } from '../../src/domain/place';
import { Photo } from '../../src/components/Photo';
import { Pressable } from '../../src/components/Pressable';
import { ScoreBreakdown } from '../../src/components/ScoreBreakdown';
import { Screen } from '../../src/components/Screen';
import { H2, H5, H6, Muted, T } from '../../src/components/Text';
import { Tag } from '../../src/components/Tag';
import { VideoCard } from '../../src/components/VideoCard';
import { catalogue, dishById, loadCookbookSteps } from '../../src/data/catalogue';
import { joinAnd, useCopy, useLocale } from '../../src/i18n';
import { atRiskNote } from '../../src/domain/atRisk';
import { alsoRecordedIn, relatedTo } from '../../src/domain/related';
import {
  confirmAsk,
  confirmStanding,
  contestedNote,
  forkedDisputes,
  originDisclaimer,
  openDisputes,
  siblingsOf,
} from '../../src/domain/traditions';
import { dietLabel, GROUP_LABELS, traceLabels } from '../../src/domain/diet';
import { MEAL_LABELS } from '../../src/domain/meals';
import { openAtSource } from '../../src/domain/video';
import { searchUrl } from '../../src/domain/videoDiscovery';
import { thresholds as scoreThresholds } from '../../src/data/settings';
import { settings } from '../../src/state/store';
import { accentText, color, font, radius, space, tapArea, TAP_TARGET } from '../../src/theme/tokens';

export default function DishDetail() {
  const copy = useCopy();
  const locale = useLocale((state) => state.locale);
  /* The language the chrome is in — what decides whether foreign prose needs naming. */
  const uiLocale = useLocale((s) => s.locale);
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

  /*
   * Wait for the method text, if it has not arrived.
   *
   * Cookbook step text is held back from the first payload and patched into the records in
   * place once it lands — 31% off the critical path, see `docs/first-paint.md`. Mutating an
   * array does not re-render a screen that is already open, so this screen asks for the
   * text and re-renders itself once it has it.
   *
   * Only this screen needs to: everywhere else asks `methodLength()`, which has been right
   * since the first frame. Already satisfied on every visit after the first, which is why
   * the state starts as whether the words are there or were never coming.
   */
  const [textReady, setTextReady] = useState(() => !dish || dish.steps.length > 0 || !methodLength(dish));
  useEffect(() => {
    if (textReady) return;
    let alive = true;
    void loadCookbookSteps().then(() => {
      if (alive) setTextReady(true);
    });
    return () => {
      alive = false;
    };
  }, [dish?.id, textReady]);


  // Not an error state — an absence of records, worded in the app's voice.
  if (!dish) {
    return (
      <Screen>
        <NavRow />
        <Card>
          <CardKicker>{copy.noRecord}</CardKicker>
          <CardBody>
            {copy.noRecordUnderThatReference}
          </CardBody>
          <Button label={copy.backToTheFeed} onPress={() => router.replace('/')} block />
        </Card>
      </Screen>
    );
  }

  const isFusion = dish.badgeLevel === 'fusion';
  const related = dish.relatedId ? dishById(dish.relatedId) : undefined;
  /* The same dish held under another country. Derived, never stored — see related.ts. */
  const alsoRecorded = alsoRecordedIn(dish, catalogue);

  /**
   * Prose the app generated, rendered in the reader's language.
   *
   * `assess()` writes the disclaimer and `build.ts` writes the diet basis, and both run
   * inside `buildCatalogue`, which happens once at load. Whatever they produce is frozen
   * at that moment — so they hand over a copy key, and it is resolved here, on every
   * render, against the language currently chosen.
   *
   * Falls back to the English they also produced: a key with no copy behind it should
   * still put a true sentence on the screen.
   */
  const fromKeys = (
    keys: string[] | undefined,
    key: string | undefined,
    english: string,
    params?: Record<string, string>,
  ) => {
    if (!keys?.length) return fromKey(key, english, params);
    const parts = keys.map((k) => fromKey(k, '', params)).filter(Boolean);
    /* All or nothing: half a composed sentence is worse than the English one. */
    return parts.length === keys.length ? parts.join(' ') : english;
  };

  const fromKey = (key: string | undefined, english: string, params?: Record<string, string>) => {
    const value = key ? (copy as unknown as Record<string, string>)[key] : undefined;
    if (!value) return english;
    return Object.entries(params ?? {}).reduce((text, [k, v]) => text.replace(`{${k}}`, v), value);
  };

  // Imported records carry a name and a place and nothing else. The sections below
  // describe a preparation, so they only render where there is one.
  const isDocumented = hasMethod(dish);

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
  const hasProse = hasMethod(dish) || Boolean(dish.prepSummary?.trim());
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
    copy,
    isDocumented,
    confirmStanding(copy, askPlace, dish.confirmations?.length ?? 0, scoreThresholds().validationsRequired),
  );

  const siblings = siblingsOf(dish, catalogue);

  /* Recomputed only when the record changes. A pass over 18,008 records is a few
     milliseconds; doing it on every render while a translation streams in is not. */
  const relatedDishes = useMemo(() => relatedTo(copy, dish, catalogue), [dish.id]);
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
          {/*
           * The credit rides on the photograph again.
           *
           * It was hidden here because the provenance sentence below carried the
           * attribution in full — which was true, and the reason that sentence had to sit
           * between the photograph and the dish's name. Measured on a 375 phone, a reader
           * met the image, then a line about how the image was matched, then two caveat
           * tags, and only at 429px the word "Pakora". Three disclaimers ahead of the name
           * of the thing.
           *
           * Letting the image carry its own credit — the overlay every other photograph in
           * the app uses — keeps the licence satisfied where the licence requires it,
           * beside the picture, and frees the sentence to move below the title.
           */}
          <Photo uri={dish.photo} credit={dish.credit} label={dish.name} style={styles.hero} width={1200} />
        </>
      ) : null}

      <H2 style={styles.title}>{dish.name}</H2>

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
          label={`${dish.badgeIcon} ${levelLabel(copy, dish.badgeLevel, 'full')}`}
          describedAs={copy.everythingClassified.replace('{what}', levelLabel(copy, dish.badgeLevel))}
          query={{ level: filterKeyFor(dish.badgeLevel) }}
        />
        {dish.photo && !dish.photoVerified ? (
          <Tag label={copy.photoOriginUnverified} variant="outline" style={styles.unverified} />
        ) : null}
        {dish.traditionalBadge ? <Tag label={copy.tagTraditionalPreparation} variant="outline" /> : null}
        {dish.atRisk ? <Tag label={copy.tagAtRiskTradition} variant="outline" /> : null}
      </View>

      {/* Directly under the name, because that is what these are about, and above
          everything else because a reader looking for their own language should not
          have to scroll past the method to find out the app knows it. The badges sit
          between the two now and cost about thirty pixels, which is not the scroll that
          rule was written against. */}
      <LocalNames names={dish.localNames} original={dish.name} />

      {/* Where the photograph itself was taken, or that the source does not record it.
          Below the record's own identity rather than above it: this is a caveat about an
          image, and it was standing in front of the name of the dish. */}
      {dish.photo ? (
        <View style={styles.photoProvenance}>
          <View style={styles.cameraIcon}>
            <CameraIcon size={12} color={color.muted} />
          </View>
          <Muted style={styles.photoProvenanceText}>
            {photoOriginLabel(copy, dish.photoOrigin)} · {copy.photoVia} {dish.credit}
          </Muted>
        </View>
      ) : null}

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

          /*
           * Displayed in the reader's language; queried in English, always.
           *
           * `DishCard` has run its breadcrumb through `placeName` since it was written
           * and this page never did, so a French reader met "India" here and "Inde" on
           * the card for the same dish. Found while checking what else stayed English on
           * a translated record.
           *
           * The query below keeps `part` untouched, and that is not an oversight: the
           * atlas is keyed on English place names — it is what the filters compare and
           * what the data stores — so translating the value as well as the label would
           * send a French reader to a country that matches nothing. `placeName` says the
           * same of itself: it translates the display of a name and nothing else.
           */
          const shown = placeName(part, copy, locale);

          return (
          <Muted key={part} style={styles.breadcrumbText}>
            <FacetLink
              label={shown}
              describedAs={copy.everythingFrom.replace('{place}', placeName(opensAt, copy, locale))}
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

      {/*
       * Where the dish is from, when that is not where it is filed.
       *
       * The breadcrumb above says "India › Kerala" because the atlas has to file every
       * record under one country to navigate by. That is a shelving decision, and a
       * reader reasonably takes it as a claim about origin — which is how Jalebi filed
       * under Egypt read as the atlas asserting jalebi is Egyptian.
       *
       * Ajay's suggestion, and it resolves a bind the old shape could not: origin is
       * frequently not a country. "Indian subcontinent", "Bengal", "Mughal Empire" are
       * the true answers, and none of them can be a filing country without dropping the
       * record out of country browsing entirely.
       *
       * Shown only when it differs from the filed country — `build.ts` drops it
       * otherwise, so this never prints "filed under India, origin India".
       */}
      {dish.origin ? (
        <View style={styles.origin}>
          <Muted style={styles.originLabel}>{copy.recordedOrigin}</Muted>
          <T style={styles.originValue}>{placeName(dish.origin, copy, locale)}</T>
          <Muted style={styles.originNote}>
            {copy.originDiffersNote.replace('{country}', placeName(dish.loc.country, copy, locale))}
          </Muted>
        </View>
      ) : null}

      {/* A record with several documented origins still has to be filed under one
          country — the atlas is navigated by place, and a record with nowhere is a
          record nobody finds. But printing that one country under the title, alone,
          states the thing the page says lower down it will not state: Pierogi read
          "China" in the largest text on the screen, above a section explaining that no
          claim here is the winner. The line below is the correction, and it is placed
          where the claim was rather than left to the reader to find. */}
      {dish.originClaims && dish.originClaims.length > 1 ? (
        <Muted style={styles.contested}>{contestedNote(copy, dish.originClaims.length)}</Muted>
      ) : null}

      {/*
       * The same dish, held again under another country.
       *
       * The atlas has 122 of these — pakora under India and Pakistan, pholourie under
       * India and Guyana. They were read as duplicates to merge, and they are not: only
       * six of the 122 share a photograph or a source with their twin, and the rest are
       * diaspora and neighbours, a dish two food cultures genuinely make.
       *
       * Nothing is merged, then, and nothing is corrected. What was actually wrong is
       * that each record asserted one country in the largest text on the screen while the
       * atlas quietly held a different answer on another page. This is the same reasoning
       * as the contested line above it, applied to a claim the catalogue makes rather than
       * one an article makes — which is why it is derived here and never written into
       * `originClaims`, where every entry carries the source that says so.
       */}
      {alsoRecorded.length ? (
        <View style={styles.alsoRecorded}>
          <Muted style={styles.contested}>
            {copy.alsoRecordedIn.replace('{list}', joinAnd(copy, alsoRecorded.map((d) => d.loc.country)))}
          </Muted>
          <View style={styles.alsoLinks}>
            {alsoRecorded.map((other) => (
              <Pressable
                key={other.id}
                accessibilityRole="link"
                accessibilityLabel={`${other.name}, ${other.loc.country}`}
                tint="neutral"
                onPress={() => router.push(`/dish/${other.id}`)}
                style={styles.alsoLink}
              >
                <T style={styles.alsoLinkLabel}>{other.loc.country} →</T>
              </Pressable>
            ))}
          </View>
          <Muted style={styles.alsoNote}>{copy.alsoRecordedNote}</Muted>
        </View>
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
          <Muted style={styles.atRiskNote}>{atRiskNote(copy)}</Muted>
        </Block>
      ) : null}
          </>
        }
        dossier={
          <>
      {isFusion ? (
        <>
          <Card style={styles.fusionCard}>
            <CardKicker>{copy.notEligibleForAuthentic}</CardKicker>
            <CardBody>{dish.fusionNote}</CardBody>
          </Card>
          {related ? (
            <>
              <Muted style={styles.fusionLead}>{copy.lookingForWhatItBorrows}</Muted>
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
          {/* An open challenge is shown, and the score is left alone. Hiding a live
              disagreement, or quietly docking the number, would be the same failure
              as claiming a certainty the evidence does not support. */}
          {open.length ? (
            <Card style={styles.disputed}>
              <CardKicker>{copy.openDisagreement}</CardKicker>
              <CardBody>
                {copy.openDisagreementBody.replace('{place}', open[0].from).replace('{differs}', open[0].differs)}
              </CardBody>
            </Card>
          ) : null}

          {/*
            * Shown only where there is something for it to measure.
            *
            * Four of the six dimensions ask how a dish is made — ingredients, technique,
            * local source, community. On a record with no method and no ingredient list
            * they are all structurally zero, and the page was printing "12/100" over
            * "0, 0, 0, 0" a few inches above a paragraph that already said, in a
            * sentence, that nobody has recorded how this is made.
            *
            * 3,175 records are in that state. The number was not wrong, it was answering
            * the wrong question: it reads as a verdict on the food — this dish is 12%
            * authentic — when the true statement is about our documentation. `assess`
            * already returns `null` for the 5,412 records that have nothing at all, and
            * those pages are the better ones. This extends the same judgement to the tier
            * that has an article and nothing else.
            *
            * The badge stays. "Unverified — insufficient evidence" is the classification
            * and it is honest; it is the *breakdown* that had nothing to break down.
            */}
          {dish.score !== null && (dish.ingredients.length > 0 || dish.steps.length > 0) ? (
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
                label={dietLabel(copy, dish.diet)}
                describedAs={copy.everythingRecordedAs.replace('{what}', copy[GROUP_LABELS[dish.diet.group]])}
                query={{ diet: dish.diet.group }}
              />
              {traceLabels(dish.diet).map((trace) => (
                <Tag key={trace} label={trace} variant="outline" />
              ))}
            </View>
            <Muted style={styles.dietBasis}>{fromKey(dish.diet.basisKey, dish.diet.basis)}</Muted>

            {dish.meals.note ? (
              <>
                <View style={styles.mealChips}>
                  {dish.meals.occasions.map((occasion) => (
                    <FacetLink
                      key={occasion}
                      variant="tag"
                      label={copy[MEAL_LABELS[occasion]]}
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
              <H5 level={2} style={styles.tightHeading}>{copy.howItsDescribed}</H5>
              <Muted style={styles.sectionLead}>
                {copy.quotedFromSource.replace('{place}', placeName(cardPlace(dish.breadcrumb, dish.loc.country), copy, locale))}
              </Muted>
              <Block style={styles.describedBlock}>
                {/*
                 * The language, said where the text is.
                 *
                 * Ajay found this on Baingan bharta: an English heading, an English
                 * lead-in, and then a paragraph of Hindi with nothing to say so. It is not
                 * a rare case — 2,222 of the 3,907 records that carry a preparation
                 * summary have one in a language other than English, across 43 languages.
                 *
                 * The atlas was already telling the reader, and telling them in the wrong
                 * place. `LanguageBar` renders `reading.note` — "shown in Hindi, the
                 * language it was documented in" — but measured on the live page that note
                 * sits 920 characters above this block, with a whole section in between.
                 * On a phone it is a screen away, which is the same as absent.
                 *
                 * This section is also the one place that reads `dish.prepSummary` raw
                 * rather than going through `readDish`, so it never carried the status the
                 * rest of the page has.
                 */}
                {dish.sourceLanguage && dish.sourceLanguage !== uiLocale ? (
                  <Muted style={styles.describedLanguage}>
                    {copy.writtenInLanguage.replace('{language}', languageNameIn(dish.sourceLanguage, uiLocale))}
                  </Muted>
                ) : null}
                <Muted style={styles.described}>{dish.prepSummary}</Muted>
              </Block>

              {dish.ingredients.length ? (
                <>
                  <H6 level={3} style={styles.equipmentHeading}>{copy.ingredientsNamedInAccount}</H6>
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
                  {copy.nobodyRecordedTechnique}
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
                {copy.nobodyHasRecorded
                  .replace('{dish}', dish.name)
                  .replace('{place}', askPlace ? copy.inPlace.replace('{place}', askPlace) : '')}
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
          <H5 level={2} style={styles.h5}>{isAdaptation ? copy.thePublishedRecipe : copy.authenticVersion}</H5>
          {isAdaptation ? (
            <Muted style={styles.sectionLead}>
              {copy.adaptationLeadIn.replace('{place}', placeName(cardPlace(dish.breadcrumb, dish.loc.country), copy, locale))}
            </Muted>
          ) : null}
          <Muted style={styles.prepSummary}>{dish.prepSummary}</Muted>
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
            {dish.ingredients.map((ingredient) => (
              <FacetLink
                key={ingredient}
                variant="chip"
                label={ingredient}
                describedAs={copy.everythingMadeWith.replace('{ingredient}', ingredient)}
                query={{ ingredient }}
              />
            ))}
          </View>

          {/* Only where there is equipment to name. Published recipes list none. */}
          {dish.equipment.length ? (
            <>
              <H6 level={3} style={styles.equipmentHeading}>{copy.traditionalEquipment}</H6>
              <View style={[styles.chipWrap, styles.equipmentWrap]}>
                {dish.equipment.map((item) => (
                  <Tag key={item} label={item} variant="outline" />
                ))}
              </View>
            </>
          ) : null}

          <H5 level={2} style={styles.tightHeading}>{copy.howItsMade}</H5>
          <Muted style={styles.sectionLead}>
            {isAdaptation
              ? copy.methodAsPublished
              : copy.methodTraditional}
          </Muted>
          <View style={styles.steps}>
            {dish.steps.map((step, i) => (
              <View key={step} style={styles.step}>
                <View style={styles.stepNumber}>
                  <T style={styles.stepNumberText}>{i + 1}</T>
                </View>
                <T style={styles.stepText}>{step}</T>
              </View>
            ))}
          </View>

          {dish.adaptation ? (
            <Disclosure summary={copy.ifIngredientUnavailable}>
              <Muted style={styles.adaptationLine}>
                <T style={styles.adaptationLabel}>{copy.traditionalLabel}</T>
                {dish.adaptation.traditional}
              </Muted>
              <Muted style={styles.adaptationLine}>
                <T style={styles.adaptationLabel}>{copy.commonModernSubstitute}</T>
                {dish.adaptation.substitute}
              </Muted>
              <T style={styles.adaptationWarning}>
                {copy.adaptationNotAuthentic}
              </T>
            </Disclosure>
          ) : null}
          </>
          ) : null}

          {dish.popular ? (
            <>
              <H5 level={2} style={styles.tightHeading}>{copy.mostPopularVersion}</H5>
              <Muted style={styles.sectionLead}>
                {copy.whatTheInternetServes}
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
                  style={styles.sourceLinkHit}
                >
                  <T style={styles.sourceLink}>{dish.popular.source} ↗</T>
                </Pressable>
                <T style={styles.popularClosing}>
                  {copy.popularNotAuthentic}
                </T>
              </Block>
            </>
          ) : null}

          {dish.videos.length ? (
            <>
              <H5 level={2} style={styles.tightHeading}>{copy.watchItBeingMade}</H5>
              <Muted style={styles.sectionLead}>
                {copy.videosRankedByCloseness}
              </Muted>
              <View style={styles.videos}>
                {dish.videos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </View>
              <Muted style={styles.videoNote}>
                {copy.stillFramesFromVideos}
                {copy.engagementNotShown}
              </Muted>
            </>
          ) : (
            /* No curated video. Rather than an empty section, offer the search —
               and say exactly what it is: a popularity-ordered starting point, not
               a video anyone has checked against the tradition. */
            <>
              <H5 level={2} style={styles.tightHeading}>{copy.watchItBeingMade}</H5>
              <Muted style={styles.sectionLead}>
                {copy.noVideoRecordedYet}
              </Muted>
              <Block style={styles.discoverBlock}>
                <Muted style={styles.discoverNote}>
                  {copy.videoSearchNote.replace('{place}', dish.breadcrumb[0])}
                </Muted>
                <Button
                  label={copy.findPreparationVideos}
                  variant="secondary"
                  block
                  onPress={() => openAtSource(searchUrl(dish))}
                />
                <Muted style={styles.discoverNote}>
                  {copy.findOneFromThePlace}
                </Muted>
              </Block>
            </>
          )}

          <H5 level={2} style={styles.h5}>{copy.whereTheMethodComesFrom}</H5>
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
              <H5 level={2} style={styles.tightHeading}>{copy.alsoMadeThisWay}</H5>
              <Muted style={styles.sectionLead}>
                {copy.siblingsNeitherIsReal}
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
                    <Muted style={styles.sourceMeta}>
                      {sibling.breadcrumb.map((step) => placeName(step, copy, locale)).join(' › ')}
                    </Muted>
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
              <H5 level={2} style={styles.tightHeading}>{copy.originAndAttribution}</H5>
              <Muted style={styles.sectionLead}>{originDisclaimer(copy)}</Muted>
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
          <H5 level={2} style={styles.h5}>
            {isAdaptation
              ? copy.whyThisIsAnAdaptation
              : isDocumented
                ? copy.whyConsideredAuthentic
                : copy.whatThisRecordIs}
          </H5>
          <Muted style={styles.disclaimer}>
            {fromKeys(dish.disclaimerKeys, dish.disclaimerKey, dish.disclaimer, dish.disclaimerParams)}
          </Muted>

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

  /* Space above, now that it follows the photograph directly rather than a line of
     provenance that was supplying the gap. */
  title: { marginTop: 14, marginBottom: 6 },
  contested: { fontSize: 11, lineHeight: 11 * 1.5, marginTop: 6, marginBottom: 2 },
  alsoRecorded: { marginTop: 4, marginBottom: 4 },
  alsoLinks: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2], marginTop: 4 },
  alsoLink: { minHeight: TAP_TARGET, justifyContent: 'center' },
  alsoLinkLabel: { fontSize: 12, color: accentText },
  alsoNote: { fontSize: 11, lineHeight: 11 * 1.5, marginTop: 2 },
  atRisk: { padding: 12, marginTop: 14 },
  atRiskTitle: { fontSize: 12, fontFamily: font.medium },
  atRiskQuote: { fontSize: 12, lineHeight: 12 * 1.55, marginTop: 6, fontStyle: 'italic' },
  atRiskNote: { fontSize: 11, lineHeight: 11 * 1.5, marginTop: 8 },
  breadcrumb: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 22 },
  /* Set apart from the breadcrumb by a rule rather than a card: it qualifies the line
     above it, and a card would read as a separate fact of its own. */
  origin: {
    marginTop: -10,
    marginBottom: 22,
    paddingTop: space[3],
    borderTopWidth: 1,
    borderTopColor: color.divider,
    gap: 2,
  },
  originLabel: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.6 },
  originValue: { fontSize: 15, color: color.neutral[100] },
  originNote: { fontSize: 12, lineHeight: 17 },
  breadcrumbText: { fontSize: 13, lineHeight: 13 * 1.5 },
  deepest: { color: accentText },
  dim: { color: color.muted },

  fusionCard: { marginBottom: 16 },
  fusionLead: { fontSize: 12, marginBottom: 8 },

  popularityLine: { fontSize: 11, marginTop: -12, marginBottom: 20 },

  undocumented: { marginBottom: 22 },
  describedBlock: { marginBottom: 16 },
  described: { fontSize: 13, lineHeight: 13 * 1.55 },
  /* Sits above the foreign-language text it labels, quiet enough not to compete with it. */
  describedLanguage: { fontSize: 11, lineHeight: 11 * 1.5, marginBottom: 6, fontFamily: font.medium },
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
  /* The pressable, not the label. An outbound link measured 316x15 — the shortest
     target on the record page. */
  sourceLinkHit: { alignSelf: 'flex-start', ...tapArea(15) },
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
