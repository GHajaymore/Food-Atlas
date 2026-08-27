/**
 * Search — find a particular dish across the whole catalogue.
 *
 * This is the structure that has to scale to a global dataset: a live query plus
 * four facet groups, multi-select within a group and AND across groups. The default
 * sort is authenticity confidence; popularity is offered as an explicit choice and
 * never blended into the default ordering.
 */

import { router } from 'expo-router';
import { placeName } from '../src/domain/continents';
import { Children, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Card, CardBody, CardKicker } from '../src/components/Card';
import { DietFilter } from '../src/components/DietFilter';
import { MealFilter } from '../src/components/MealFilter';
import { SearchColumns } from '../src/components/SearchColumns';
import { Input } from '../src/components/Field';
import { NavRow } from '../src/components/NavRow';
import { Photo } from '../src/components/Photo';
import { Pressable } from '../src/components/Pressable';
import { Screen } from '../src/components/Screen';
import { H6, Muted, T } from '../src/components/Text';
import { Tag } from '../src/components/Tag';
import { catalogue as dishes, shareWithoutIngredients } from '../src/data/catalogue';
import { CLASSIFICATIONS, levelLabel } from '../src/domain/authenticity';
import { MEAL_LABELS } from '../src/domain/meals';
import { cookWith, parsePantry } from '../src/domain/pantry';
import { cardPlace } from '../src/domain/place';
import { STAPLES } from '../src/domain/staples';
import { allCategories, allCuisines, randomAtRisk, searchResults } from '../src/domain/queries';
import { canRequest, requestUrl } from '../src/domain/requests';
import type { Level, SortKey } from '../src/domain/types';
import { openAtSource, topVideo, watchUrl } from '../src/domain/video';
import { joinOr, useCopy, type Copy, useNumber } from '../src/i18n';
import { useApp } from '../src/state/store';
import { color, radius, space } from '../src/theme/tokens';

const LEVEL_FACETS: Level[] = ['local', 'regional', 'variation', 'adaptation', 'fusion'];

/**
 * Starting points for the pantry, drawn from the staple vocabulary rather than from a
 * list I guessed at.
 *
 * One per group — a grain, a root, a pulse, a dairy, a meat, an aromatic — so the first
 * thing a reader sees spans the world's kitchens instead of one of them. Every staple in
 * that vocabulary was checked against the catalogue and matches real records, so none of
 * these chips can return nothing.
 */
const PANTRY_SUGGESTIONS = ['rice', 'cassava', 'lentil', 'paneer', 'chicken', 'tofu', 'coconut', 'aubergine'].map(
  (key) => STAPLES.find((s) => s.key === key)!,
);

/** Result rows rendered per page. */
const PAGE_SIZE = 30;

/**
 * Built from the chrome rather than declared as a constant, because the labels are
 * translated and a module-level array would freeze them at whatever language the
 * module was first evaluated in. The keys are not translated: they are state.
 */
const sortsFor = (copy: Copy): { key: SortKey; label: string }[] => [
  { key: 'authenticity', label: copy.authenticityConfidence },
  { key: 'popularity', label: 'Popularity (views)' },
  { key: 'atrisk', label: copy.atRiskFirst },
];

export default function Search() {
  const copy = useCopy();
  const n = useNumber();
  const SORTS = sortsFor(copy);
  const {
    query,
    facetLevels,
    facetCategories,
    facetIngredients,
    facetCuisines,
    sortBy,
    setQuery,
    toggleFacet,
    setSortBy,
    clearFacets,
    dietGroups,
    dietKinds,
    toggleDietGroup,
    toggleDietKind,
    clearDiet,
    meals,
    toggleMeal,
    clearMeals,
  } = useApp();

  const results = searchResults(dishes, {
    query,
    levels: facetLevels,
    categories: facetCategories,
    ingredients: facetIngredients,
    sortBy,
    dietGroups,
    dietKinds,
    meals,
    cuisines: facetCuisines,
  });

  const [mode, setMode] = useState<'find' | 'pantry'>('find');
  const [pantryInput, setPantryInput] = useState('');
  const pantryTerms = useMemo(() => parsePantry(pantryInput), [pantryInput]);
  const pantry = useMemo(() => cookWith(dishes, pantryTerms), [pantryTerms]);

  const [page, setPage] = useState(1);
  const visible = results.slice(0, page * PAGE_SIZE);

  // Any change to the query or the facets starts the paging over.
  useEffect(() => {
    setPage(1);
  }, [query, facetLevels, facetCategories, facetIngredients, facetCuisines, sortBy, dietGroups, dietKinds, meals]);

  const active = [
    ...facetLevels.map((v) => ({ label: levelLabel(copy, v as Level), remove: () => toggleFacet('facetLevels', v) })),
    ...facetCategories.map((v) => ({ label: v, remove: () => toggleFacet('facetCategories', v) })),
    ...facetIngredients.map((v) => ({ label: v, remove: () => toggleFacet('facetIngredients', v) })),
    ...facetCuisines.map((v) => ({ label: v, remove: () => toggleFacet('facetCuisines', v) })),
  ];

  const activeSummary = [
    ...active.map((f) => f.label),
    ...meals.map((m) => copy[MEAL_LABELS[m]]),
    ...(sortBy === 'authenticity' ? [] : [SORTS.find((s) => s.key === sortBy)!.label]),
  ].join(' · ');

  const surprise = () => {
    const pick = randomAtRisk(dishes);
    if (pick) router.push(`/dish/${pick.id}`);
  };

  return (
    <Screen bottomPad={50}>
      <NavRow title={copy.search} />

      {/*
       * Two questions, one screen.
       *
       * *Find a dish* asks where the thing I am thinking of is. *Cook with what I have*
       * asks what I can do with what is in front of me. They want opposite behaviour —
       * the first matches a dish's name, and the second must never, or "chicken" returns
       * Chicken Tikka Masala whether or not the reader has a single one of its
       * ingredients.
       *
       * Built first as its own screen and moved here at Ajay's call, which was right:
       * both are somebody looking for a dish, and a reader who finds nothing under one
       * should be one tap from trying the other rather than having to know a second
       * page exists.
       */}
      <View style={styles.modes}>
        {(
          [
            ['find', copy.searchModeFind],
            ['pantry', copy.searchModePantry],
          ] as const
        ).map(([key, label]) => (
          <Tag
            key={key}
            label={label}
            variant={mode === key ? 'accent' : 'outline'}
            onPress={() => setMode(key)}
          />
        ))}
      </View>

      <Input
        placeholder={mode === 'pantry' ? 'chicken, tomatoes, rice' : copy.searchPlaceholder}
        value={mode === 'pantry' ? pantryInput : query}
        onChangeText={mode === 'pantry' ? setPantryInput : setQuery}
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel={mode === 'pantry' ? copy.ingredientsYouHave : copy.search}
        style={styles.queryField}
      />

      {/*
       * The pantry branch renders on its own, with no facet sidebar.
       *
       * The facets narrow `searchResults`, and this does not use `searchResults` — it
       * uses `cookWith`, which ranks by how much of the reader's list a dish uses.
       * Showing controls that would silently do nothing is worse than not showing them.
       */}
      {mode === 'pantry' ? (
        <>
          <View style={styles.suggestions}>
            {PANTRY_SUGGESTIONS.map((staple) => (
              <Tag
                key={staple.key}
                label={`+ ${copy[staple.label]}`}
                variant="outline"
                onPress={() =>
                  setPantryInput((was) => (was.trim() ? `${was.trim()}, ${staple.key}` : staple.key))
                }
              />
            ))}
          </View>

          {pantryTerms.length ? (
            <>
              {/*
               * This paragraph was typed out in English inside a translated screen, and
               * the figure in it was guessed: it said "about half" where the count is
               * 10,426 of 17,748, or 59%. Counted from the catalogue now, because a note
               * whose whole job is to say how little has been recorded cannot itself be
               * estimating — and because the figure moves whenever a pass adds
               * ingredients, so a number typed here would drift out of date silently.
               */}
              {pantry.missing.length ? (
                <Muted style={styles.pantryNote}>
                  {copy.pantryNothingUses
                    .replace('{list}', joinOr(copy, pantry.missing))
                    .replace('{p}', String(shareWithoutIngredients()))}
                </Muted>
              ) : null}

              <View style={styles.resultsHeader}>
                <H6>{pantry.matches.length ? copy.nTraditions.replace('{n}', n(pantry.matches.length)) : copy.nothingYet}</H6>
                {pantry.matches.length ? (
                  <Muted style={styles.resultCount}>{copy.mostOfYourListFirst}</Muted>
                ) : null}
              </View>

              {pantry.matches.map(({ dish, used }) => (
                <Pressable
                  key={dish.id}
                  accessibilityRole="link"
                  accessibilityLabel={`${dish.name}. Uses ${used.join(', ')}. ${levelLabel(copy, dish.badgeLevel)}`}
                  tint="neutral"
                  onPress={() => router.push(`/dish/${dish.id}`)}
                  style={styles.pantryRow}
                >
                  {dish.photo ? (
                    <Photo uri={dish.photo} credit={dish.credit} label={dish.name} style={styles.pantryPhoto} />
                  ) : null}
                  <View style={styles.pantryText}>
                    <T style={styles.pantryName} numberOfLines={2}>
                      {dish.name}
                    </T>
                    <Muted style={styles.pantryPlace} numberOfLines={1}>
                      {placeName(cardPlace(dish.breadcrumb, dish.loc.country), copy)}
                    </Muted>
                    {/* Named rather than counted: "uses chicken, rice" is checkable
                        against the record in a second; "3 matches" is a number to trust. */}
                    <T style={styles.pantryUsed} numberOfLines={1}>
                      uses {used.join(', ')}
                    </T>
                    <Muted style={styles.pantryBadge} numberOfLines={1}>
                      {dish.badgeIcon} {dish.score !== null ? `${dish.score}/100` : levelLabel(copy, dish.badgeLevel)}
                      {dish.steps.length ? copy.methodRecorded : copy.noMethodYet}
                    </Muted>
                  </View>
                </Pressable>
              ))}

              {!pantry.matches.length ? (
                <Muted style={styles.pantryNote}>{copy.pantryNoMatches}</Muted>
              ) : null}
            </>
          ) : (
            <Muted style={styles.pantryNote}>{copy.pantryPrompt}</Muted>
          )}
        </>
      ) : (
        <>
      {active.length ? (
        <View style={styles.activeFacets}>
          {active.map((facet) => (
            <Tag key={facet.label} label={`${facet.label} ✕`} variant="accent" onPress={facet.remove} />
          ))}
          <Button label={copy.clearAll} variant="ghost" fontSize={11} onPress={clearFacets} style={styles.clearAll} />
        </View>
      ) : null}

      {/* Five facet groups is a wall of chips ahead of the first result once the
          catalogue is global. Collapsed by default, with what is applied stated on
          the row, so the screen opens on results rather than on controls. */}
      {/*
       * The arrangement lives in `SearchColumns`: a sidebar on a desktop, folded away
       * behind `Refine` on a phone. Neither the facets below nor the results after them
       * know the window width — same rule as the record page, and for the same reason.
       */}
      <SearchColumns
        label={copy.filters}
        emptyLabel={copy.none}
        summary={activeSummary}
        count={active.length + meals.length + (sortBy === 'authenticity' ? 0 : 1)}
        filters={
      <View style={styles.facetGroups}>
        <DietFilter
          variant="facet"
          groups={dietGroups}
          kinds={dietKinds}
          onToggleGroup={toggleDietGroup}
          onToggleKind={toggleDietKind}
          onClear={clearDiet}
        />

        <MealFilter variant="facet" selected={meals} onToggle={toggleMeal} onClear={clearMeals} />

        <FacetGroup label={copy.authenticityLevel}>
          {LEVEL_FACETS.map((level) => (
            <Tag
              key={level}
              label={`${CLASSIFICATIONS[level].icon} ${levelLabel(copy, level)}`}
              variant={facetLevels.includes(level) ? 'accent' : 'outline'}
              onPress={() => toggleFacet('facetLevels', level)}
            />
          ))}
        </FacetGroup>

        {/* Cuisine sits above "kind of dish" because it is how people actually
            arrive — "I want Thai food" — and it is not the same as the place
            filter: Tamil and Sichuan are inside a country, Levantine spans several. */}
        <FacetGroup label={copy.cuisine}>
          {allCuisines(dishes).map((cuisine) => (
            <Tag
              key={cuisine}
              label={cuisine}
              variant={facetCuisines.includes(cuisine) ? 'accent' : 'outline'}
              onPress={() => toggleFacet('facetCuisines', cuisine)}
            />
          ))}
        </FacetGroup>

        <FacetGroup label={copy.kindOfDish}>
          {allCategories(dishes).map((category) => (
            <Tag
              key={category}
              label={category}
              variant={facetCategories.includes(category) ? 'accent' : 'outline'}
              onPress={() => toggleFacet('facetCategories', category)}
            />
          ))}
        </FacetGroup>

        {/*
         * The ingredient facet is gone, and it was worse than crowded.
         *
         * There are 27,036 distinct ingredient strings across 17,828 records — more
         * values than the atlas has dishes. `allIngredients` capped that at ten and
         * sorted **alphabetically**, so the control offered ten arbitrary strings out of
         * twenty-seven thousand and called it a filter.
         *
         * The values are not clean either: "Salt" and "salt" count separately, "Sal" is
         * Spanish, "Salt to taste" is a quantity. And the commonest are salt, sugar and
         * water — which every cuisine on earth uses, so they discriminate nothing.
         *
         * Ingredients are still filterable, and reached better: every ingredient on a
         * record is a `FacetLink` that opens everything made with it. Arriving at
         * "everything with ghee" from a dish that uses ghee is a real journey; picking
         * ghee out of a list of 27,036 never was. `facetIngredients` stays in the store
         * and in `searchResults`, so those links keep working.
         *
         * The facet worth having here is cuisine — it is how people actually arrive —
         * and it is already below. It renders nothing today because `d.cuisine` is
         * populated on zero records; see docs/queue.md.
         */}

        <FacetGroup label={copy.sortResultsBy}>
          {SORTS.map((sort) => (
            <Tag
              key={sort.key}
              label={sort.label}
              variant={sortBy === sort.key ? 'accent' : 'outline'}
              onPress={() => setSortBy(sort.key)}
            />
          ))}
        </FacetGroup>
      </View>
        }
        results={
          <>
      <View style={styles.resultsHeader}>
        <H6>{copy.results}</H6>
        <Muted style={styles.resultCount}>
          {results.length} {results.length === 1 ? 'match' : 'matches'}
        </Muted>
      </View>

      <View>
        {visible.map((dish) => {
          const video = topVideo(dish.videos);
          return (
            <View key={dish.id} style={styles.resultRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={dish.name}
                tint="none"
                onPress={() => router.push(`/dish/${dish.id}`)}
                style={styles.resultMain}
              >
                <Photo uri={dish.photo} credit={dish.credit} label={dish.name} style={styles.thumb} hideCredit />
                <View style={styles.resultText}>
                  <T style={styles.resultName}>{dish.name}</T>
                  <Muted style={styles.resultPlace}>{dish.breadcrumb.map((step) => placeName(step, copy)).join(' › ')}</Muted>
                  <Muted style={styles.resultClass}>
                    {dish.badgeIcon} {levelLabel(copy, dish.badgeLevel)} · {dish.score == null ? copy.notClassified : `${dish.score}/100`}
                  </Muted>
                </View>
              </Pressable>
              {video ? (
                <Button
                  label={copy.video}
                  fontSize={11}
                  compact
                  onPress={() => openAtSource(watchUrl(video))}
                  style={styles.videoButton}
                />
              ) : null}
            </View>
          );
        })}
      </View>

      {/* The catalogue runs to thousands of matches; the count above states the true
          total, and the list grows on request rather than all at once. */}
      {results.length > visible.length ? (
        <Button
          label={copy.showMoreLeft.replace('{n}', String(results.length - visible.length))}
          variant="secondary"
          block
          onPress={() => setPage((p) => p + 1)}
          style={styles.showMore}
        />
      ) : null}

      {/* The absence is the recruiting moment, and the dish name is already typed.
          Most people asking for a missing dish know how it is made, so the first
          option is to record it — asking is the fallback, not the default. */}
      {results.length === 0 ? (
        <Card style={styles.emptyCard}>
          <CardKicker>{copy.noMatch}</CardKicker>
          <CardBody>
            Nothing in the atlas matches {query.trim() ? `“${query.trim()}”` : 'that'} yet. Absence here means no
            record, not no food — we&apos;d rather say we don&apos;t know than guess.
          </CardBody>
          {/* The name travels with them. It is already typed, and asking someone to
              type it a second time is the friction that kills this kind of capture —
              the reasoning `requests.ts` writes down for asking, applied to recording,
              which is the path this screen actually leads with. */}
          <Button
            label={copy.iKnowHowItsMade}
            onPress={() => router.push({ pathname: '/contribute', params: { dish: query.trim() } })}
            block
          />

          {canRequest() ? (
            <Button
              label={copy.askForItInstead}
              variant="secondary"
              block
              onPress={() => openAtSource(requestUrl(query, ''))}
            />
          ) : (
            <Muted style={styles.requestNote}>{copy.requestsNotOpenNote}</Muted>
          )}
        </Card>
      ) : null}

          </>
        }
      />
        </>
      )}

      <View style={styles.footer}>
        <Button label={copy.browseTheAtlas} variant="secondary" block onPress={() => router.push('/atlas')} />
        <Button label={copy.surpriseMe} variant="ghost" block onPress={surprise} />
      </View>
    </Screen>
  );
}

/**
 * A facet group renders only when it has options.
 *
 * Cuisine, for one, is empty until the ingest has recorded a tradition for a record,
 * and a heading with nothing under it is the same empty promise the detail screen
 * was cleaned of — it reads as broken rather than as "not yet".
 */
function FacetGroup({ label, children }: { label: string; children: React.ReactNode }) {
  if (Children.count(children) === 0) return null;
  return (
    <View>
      <H6 style={styles.facetLabel}>{label}</H6>
      <View style={styles.facetChips}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  modes: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2], marginTop: space[3] },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2], marginTop: space[3] },
  pantryNote: { fontSize: 13, lineHeight: 20, marginTop: space[4] },
  pantryRow: { flexDirection: 'row', gap: space[3], paddingVertical: space[2], alignItems: 'center' },
  pantryPhoto: { width: 64, height: 64, borderRadius: radius.md },
  pantryText: { flex: 1, minWidth: 0 },
  pantryName: { fontSize: 14, lineHeight: 19 },
  pantryPlace: { fontSize: 12 },
  pantryUsed: { fontSize: 12, color: color.accent, marginTop: 2 },
  pantryBadge: { fontSize: 11, marginTop: 1 },
  queryField: { marginBottom: 12 },

  activeFacets: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginBottom: 14 },
  clearAll: { minHeight: 28, paddingHorizontal: 6 },

  facetGroups: { gap: 16, marginBottom: 20 },
  facetLabel: { marginBottom: space[2] },
  facetChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },

  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: space[2],
    marginBottom: space[2],
  },
  resultCount: { fontSize: 11 },

  resultRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: color.divider,
  },
  resultMain: { flexDirection: 'row', gap: 10, alignItems: 'center', flex: 1, minWidth: 0 },
  thumb: { width: 56, height: 56, borderRadius: radius.sm },
  resultText: { flex: 1, minWidth: 0 },
  resultName: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  resultPlace: { fontSize: 11, lineHeight: 11 * 1.4 },
  resultClass: { fontSize: 11, lineHeight: 11 * 1.4 },
  videoButton: { flexShrink: 0 },

  showMore: { marginTop: 16 },
  emptyCard: { marginTop: 16 },
  requestNote: { fontSize: 11, lineHeight: 11 * 1.5, marginTop: 6 },
  footer: { gap: space[2], marginTop: 22 },
});
