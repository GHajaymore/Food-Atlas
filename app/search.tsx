/**
 * Search — find a particular dish across the whole catalogue.
 *
 * This is the structure that has to scale to a global dataset: a live query plus
 * four facet groups, multi-select within a group and AND across groups. The default
 * sort is authenticity confidence; popularity is offered as an explicit choice and
 * never blended into the default ordering.
 */

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Card, CardBody, CardKicker } from '../src/components/Card';
import { DietFilter } from '../src/components/DietFilter';
import { MealFilter } from '../src/components/MealFilter';
import { Refine } from '../src/components/Refine';
import { Input } from '../src/components/Field';
import { NavRow } from '../src/components/NavRow';
import { Photo } from '../src/components/Photo';
import { Pressable } from '../src/components/Pressable';
import { Screen } from '../src/components/Screen';
import { H6, Muted, T } from '../src/components/Text';
import { Tag } from '../src/components/Tag';
import { catalogue as dishes } from '../src/data/catalogue';
import { CLASSIFICATIONS } from '../src/domain/authenticity';
import { MEAL_LABELS } from '../src/domain/meals';
import { allCategories, allCuisines, allIngredients, randomAtRisk, searchResults } from '../src/domain/queries';
import { canRequest, requestUrl } from '../src/domain/requests';
import type { Level, SortKey } from '../src/domain/types';
import { openAtSource, topVideo, watchUrl } from '../src/domain/video';
import { useApp } from '../src/state/store';
import { color, radius, space } from '../src/theme/tokens';

const LEVEL_FACETS: Level[] = ['local', 'regional', 'variation', 'adaptation', 'fusion'];

/** Result rows rendered per page. */
const PAGE_SIZE = 30;

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'authenticity', label: 'Authenticity confidence' },
  { key: 'popularity', label: 'Popularity (views)' },
  { key: 'atrisk', label: 'At risk first' },
];

export default function Search() {
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

  const [page, setPage] = useState(1);
  const visible = results.slice(0, page * PAGE_SIZE);

  // Any change to the query or the facets starts the paging over.
  useEffect(() => {
    setPage(1);
  }, [query, facetLevels, facetCategories, facetIngredients, facetCuisines, sortBy, dietGroups, dietKinds, meals]);

  const active = [
    ...facetLevels.map((v) => ({ label: CLASSIFICATIONS[v as Level].label, remove: () => toggleFacet('facetLevels', v) })),
    ...facetCategories.map((v) => ({ label: v, remove: () => toggleFacet('facetCategories', v) })),
    ...facetIngredients.map((v) => ({ label: v, remove: () => toggleFacet('facetIngredients', v) })),
    ...facetCuisines.map((v) => ({ label: v, remove: () => toggleFacet('facetCuisines', v) })),
  ];

  const activeSummary = [
    ...active.map((f) => f.label),
    ...meals.map((m) => MEAL_LABELS[m]),
    ...(sortBy === 'authenticity' ? [] : [SORTS.find((s) => s.key === sortBy)!.label]),
  ].join(' · ');

  const surprise = () => {
    const pick = randomAtRisk(dishes);
    if (pick) router.push(`/dish/${pick.id}`);
  };

  return (
    <Screen bottomPad={50}>
      <NavRow title="Search" />

      <Input
        placeholder="Dish, country, region, city or ingredient"
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
        returnKeyType="search"
        style={styles.queryField}
      />

      {active.length ? (
        <View style={styles.activeFacets}>
          {active.map((facet) => (
            <Tag key={facet.label} label={`${facet.label} ✕`} variant="accent" onPress={facet.remove} />
          ))}
          <Button label="Clear all" variant="ghost" fontSize={11} onPress={clearFacets} style={styles.clearAll} />
        </View>
      ) : null}

      {/* Five facet groups is a wall of chips ahead of the first result once the
          catalogue is global. Collapsed by default, with what is applied stated on
          the row, so the screen opens on results rather than on controls. */}
      <Refine
        label="Filters"
        emptyLabel="None"
        summary={activeSummary}
        count={active.length + meals.length + (sortBy === 'authenticity' ? 0 : 1)}
      >
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

        <FacetGroup label="Authenticity level">
          {LEVEL_FACETS.map((level) => (
            <Tag
              key={level}
              label={`${CLASSIFICATIONS[level].icon} ${CLASSIFICATIONS[level].label}`}
              variant={facetLevels.includes(level) ? 'accent' : 'outline'}
              onPress={() => toggleFacet('facetLevels', level)}
            />
          ))}
        </FacetGroup>

        {/* Cuisine sits above "kind of dish" because it is how people actually
            arrive — "I want Thai food" — and it is not the same as the place
            filter: Tamil and Sichuan are inside a country, Levantine spans several. */}
        <FacetGroup label="Cuisine">
          {allCuisines(dishes).map((cuisine) => (
            <Tag
              key={cuisine}
              label={cuisine}
              variant={facetCuisines.includes(cuisine) ? 'accent' : 'outline'}
              onPress={() => toggleFacet('facetCuisines', cuisine)}
            />
          ))}
        </FacetGroup>

        <FacetGroup label="Kind of dish">
          {allCategories(dishes).map((category) => (
            <Tag
              key={category}
              label={category}
              variant={facetCategories.includes(category) ? 'accent' : 'outline'}
              onPress={() => toggleFacet('facetCategories', category)}
            />
          ))}
        </FacetGroup>

        <FacetGroup label="Traditional ingredient">
          {allIngredients(dishes).map((ingredient) => (
            <Tag
              key={ingredient}
              label={ingredient}
              variant={facetIngredients.includes(ingredient) ? 'accent' : 'outline'}
              onPress={() => toggleFacet('facetIngredients', ingredient)}
            />
          ))}
        </FacetGroup>

        <FacetGroup label="Sort results by">
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
      </Refine>

      <View style={styles.resultsHeader}>
        <H6>Results</H6>
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
                  <Muted style={styles.resultPlace}>{dish.breadcrumb.join(' › ')}</Muted>
                  <Muted style={styles.resultClass}>
                    {dish.badgeIcon} {dish.badgeLabel} · {dish.score == null ? 'Not classified' : `${dish.score}/100`}
                  </Muted>
                </View>
              </Pressable>
              {video ? (
                <Button
                  label="▶ Video"
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
          label={`Show more — ${results.length - visible.length} left`}
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
          <CardKicker>No match</CardKicker>
          <CardBody>
            Nothing in the atlas matches {query.trim() ? `“${query.trim()}”` : 'that'} yet. Absence here means no
            record, not no food — we&apos;d rather say we don&apos;t know than guess.
          </CardBody>
          <Button label="I know how it's made — record it" onPress={() => router.push('/contribute')} block />

          {canRequest() ? (
            <Button
              label="Ask for it instead"
              variant="secondary"
              block
              onPress={() => openAtSource(requestUrl(query, ''))}
            />
          ) : (
            <Muted style={styles.requestNote}>
              Requests aren&apos;t open yet, so the only way a dish enters the atlas is someone recording it.
            </Muted>
          )}
        </Card>
      ) : null}

      <View style={styles.footer}>
        <Button label="Browse the world atlas" variant="secondary" block onPress={() => router.push('/atlas')} />
        <Button label="Surprise me with an at-risk tradition" variant="ghost" block onPress={surprise} />
      </View>
    </Screen>
  );
}

function FacetGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View>
      <H6 style={styles.facetLabel}>{label}</H6>
      <View style={styles.facetChips}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
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
