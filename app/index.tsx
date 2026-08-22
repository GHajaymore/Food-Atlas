/**
 * Feed — home.
 *
 * The order of this screen is the argument the product makes, and it is deliberate:
 * the place selector is the primary control and sits directly under the title, and
 * the popularity rail is demoted to the very bottom, below a divider, labelled
 * "by views only".
 */

import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { BRAND } from '../src/brand';
import { Button, IconButton } from '../src/components/Button';
import { Card, CardBody, CardKicker } from '../src/components/Card';
import { DietFilter } from '../src/components/DietFilter';
import { DishCard } from '../src/components/DishCard';
import { MealFilter } from '../src/components/MealFilter';
import { Refine } from '../src/components/Refine';
import { Shelf } from '../src/components/Shelf';
import { MapPinIcon, SearchIcon } from '../src/components/icons';
import { Photo } from '../src/components/Photo';
import { Pressable } from '../src/components/Pressable';
import { FadingScrollRow } from '../src/components/ScrollEdge';
import { Screen } from '../src/components/Screen';
import { H4, H6, Muted, T } from '../src/components/Text';
import { Tag } from '../src/components/Tag';
import { catalogue as dishes } from '../src/data/catalogue';
import { FILTERS, filterDef } from '../src/domain/authenticity';
import { GROUP_LABELS, KIND_LABELS } from '../src/domain/diet';
import { MEAL_LABELS } from '../src/domain/meals';
import { feedFor, mostPopular, narrowingSummary, nextLevel, placeChoiceHint } from '../src/domain/queries';
import { buildShelves, shelfMatch, shelfTitle } from '../src/domain/shelves';
import { settings, useApp } from '../src/state/store';

/** Dish cards rendered per page of the feed. */
const PAGE_SIZE = 30;
import { accentText, color, elevation, radius, space } from '../src/theme/tokens';

export default function Feed() {
  const {
    activeFilter,
    path,
    setFilter,
    truncatePath,
    resetFilters,
    dietGroups,
    dietKinds,
    toggleDietGroup,
    toggleDietKind,
    clearDiet,
    meals,
    toggleMeal,
    clearMeals,
  } = useApp();

  const diet = { groups: dietGroups, kinds: dietKinds };

  /**
   * `null` while the reader is browsing shelves; a shelf id (or 'all') once they
   * have opened one. Any real narrowing — place, filter, diet, occasion — also
   * counts as asking for a list, because someone who has picked a country is past
   * being offered somewhere to start.
   */
  const [shelfView, setShelfView] = useState<string | null>(null);
  const hasNarrowed =
    path.length > 0 || activeFilter !== settings.defaultFilter || dietGroups.length > 0 || meals.length > 0;
  const isBrowsing = shelfView === null && !hasNarrowed;

  // The shelf narrows the same feed everything else narrows, so its list obeys the
  // reader's diet and place exactly as the unshelved one does.
  const shelfPredicate = shelfMatch(shelfView);
  const scope = shelfPredicate ? dishes.filter(shelfPredicate) : dishes;
  const feed = feedFor(scope, activeFilter, path, diet, meals);

  const shelves = useMemo(() => (isBrowsing ? buildShelves(dishes) : []), [isBrowsing, dishes]);

  const [page, setPage] = useState(1);
  const visible = feed.slice(0, page * PAGE_SIZE);
  const assessed = visible.filter((d) => d.badgeLevel !== 'unverified');
  const unassessed = visible.filter((d) => d.badgeLevel === 'unverified');

  // Any change to what is being asked for starts the paging over, so a narrowed
  // list never opens halfway down someone else's scroll position.
  useEffect(() => {
    setPage(1);
  }, [activeFilter, path, dietGroups, dietKinds, meals, shelfView]);
  // Place counts follow the same narrowing, so a place never promises a record the
  // reader's dietary preference would hide.
  const next = nextLevel(path, feed);
  const popular = mostPopular(dishes);
  const showViews = settings.showViewCounts;

  const place = path.length ? path[path.length - 1].value : 'Worldwide';
  const placeHint = next
    ? path.length
      ? `Narrow to a ${next.label} · ${next.options.length} recorded`
      : placeChoiceHint(next.options)
    : 'Deepest level recorded here';

  // Says what the list is, in the reader's own terms: the shelf they opened, or the
  // place they narrowed to, so a long list is never unexplained.
  const openShelf = shelfTitle(shelfView);
  const resultSummary = `${feed.length.toLocaleString()} ${feed.length === 1 ? 'tradition' : 'traditions'}${
    path.length ? ` in ${place}` : openShelf ? '' : ' worldwide'
  }${openShelf ? ` · ${openShelf}` : ''}`;

  // 'World' plus each chosen level; tapping any of them truncates the path there.
  const crumbs = [{ label: 'World' }, ...path.map((p) => ({ label: p.value }))];

  // The empty state names every choice that narrowed the list, so the reader can see
  // which of them emptied it rather than guessing — and, more importantly, so the
  // sentence is not a false statement about the atlas. See `narrowingSummary`.
  const dietNames = [
    ...dietGroups.map((g) => GROUP_LABELS[g].toLowerCase()),
    ...dietKinds.map((k) => KIND_LABELS[k].toLowerCase()),
  ];

  // What the collapsed Refine row says, so an active constraint stays visible even
  // when its controls are folded away.
  const refineSummary = [...dietNames, ...meals.map((m) => MEAL_LABELS[m].toLowerCase())].join(' · ');

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <H4>{BRAND.name}</H4>
          <Muted style={styles.tagline}>{BRAND.tagline}</Muted>
        </View>
        <IconButton label="Search" onPress={() => router.push('/search')} style={styles.searchButton}>
          <SearchIcon size={18} color={color.accent} />
        </IconButton>
      </View>

      {/* The primary control. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Place: ${place}. ${placeHint}`}
        onPress={() => (next ? router.push('/place') : undefined)}
        tint={next ? 'neutral' : 'none'}
        style={styles.placeSelector}
      >
        <MapPinIcon size={18} color={color.accent} />
        <View style={styles.placeText}>
          <T style={styles.placeTitle}>{place}</T>
          <Muted style={styles.placeHint}>{placeHint}</Muted>
        </View>
        <Muted style={styles.chevron}>›</Muted>
      </Pressable>

      {path.length > 0 ? (
        <View style={styles.crumbs}>
          {crumbs.map((crumb, i) => (
            <View key={`${crumb.label}-${i}`} style={styles.crumb}>
              <Pressable accessibilityRole="button" tint="none" onPress={() => truncatePath(i)}>
                <T style={[styles.crumbText, i === crumbs.length - 1 ? styles.crumbActive : styles.crumbMuted]}>
                  {crumb.label}
                </T>
              </Pressable>
              {i < crumbs.length - 1 ? <Muted style={styles.crumbText}> › </Muted> : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* The chips overflow every phone and most desktop windows, and the row was
          cut off mid-chip with nothing to say it continued. The fade at the right
          edge is the only affordance added — no scrollbar, no arrows, neither of
          which the design uses anywhere else. */}
      <FadingScrollRow style={styles.chipScroller} contentContainerStyle={styles.chipRow}>
        {FILTERS.map((f) => (
          <Tag
            key={f.key}
            label={f.label}
            noWrap
            variant={f.key === activeFilter ? 'accent' : 'outline'}
            onPress={() => setFilter(f.key)}
          />
        ))}
      </FadingScrollRow>

      <Refine summary={refineSummary} count={dietNames.length + meals.length}>
        <DietFilter
          groups={dietGroups}
          kinds={dietKinds}
          onToggleGroup={toggleDietGroup}
          onToggleKind={toggleDietKind}
          onClear={clearDiet}
        />
        <MealFilter selected={meals} onToggle={toggleMeal} onClear={clearMeals} />
      </Refine>

      {/* Nothing narrowed yet: show doorways rather than 13,855 rows. A reader who
          has not asked for anything specific is browsing, and a dump of whatever
          loaded first is not browsing. The moment they narrow — a place, a filter, a
          diet — the list is what they want, and it takes over. */}
      {isBrowsing ? (
        <>
          {shelves.map((shelf) => (
            <Shelf
              key={shelf.id}
              shelf={shelf}
              onOpenDish={(id) => router.push(`/dish/${id}`)}
              onOpenAll={(s) => setShelfView(s.id)}
            />
          ))}

          <Button
            label={`Browse all ${feed.length.toLocaleString()} traditions`}
            variant="secondary"
            block
            onPress={() => setShelfView('all')}
            style={styles.browseAll}
          />
        </>
      ) : null}

      {!isBrowsing ? (
        <View style={styles.listHead}>
          <Muted style={styles.resultCount}>{resultSummary}</Muted>
          {/* The way back out of a list. Without it a shelf is a one-way door. */}
          {shelfView !== null ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to the shelves"
              tint="none"
              onPress={() => setShelfView(null)}
            >
              <Muted style={styles.backLink}>← Shelves</Muted>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {feed.length === 0 ? (
        <Card style={styles.emptyCard}>
          <CardKicker>Nothing recorded here yet</CardKicker>
          <CardBody>
            {narrowingSummary(filterDef(activeFilter).label, activeFilter === settings.defaultFilter, [
              ...dietNames,
              ...meals.map((m) => MEAL_LABELS[m].toLowerCase()),
            ])}
            {path.length ? ` in ${place}` : ' anywhere in the atlas'}. That is an absence of records, not an absence
            of food — we&apos;d rather say we don&apos;t know.
          </CardBody>
          {/* The shelf is one of the things narrowing this list, so a reset that left
              it in place would look like a button that does nothing. */}
          <Button
            label="Reset the filters"
            onPress={() => {
              setShelfView(null);
              resetFilters();
            }}
            block
          />
        </Card>
      ) : null}

      {/* Curated records lead as full cards; imported ones follow as rows, because a
          full card would dress an absence of evidence up as content. */}
      {/* A photo card needs a photo. Without one the card is a monogram block with
          a caption, which takes a card's worth of space to say a row's worth of
          thing — and most records have no image. */}
      <View style={styles.cards}>
        {!isBrowsing
          ? assessed.map((dish) => (
              <DishCard key={dish.id} dish={dish} showViews={showViews} compact={!dish.photo} />
            ))
          : null}
      </View>

      {!isBrowsing && unassessed.length ? (
        <View style={styles.unassessed}>
          {assessed.length ? (
            <>
              <H6 style={styles.unassessedHeading}>Recorded, not yet assessed</H6>
              <Muted style={styles.unassessedNote}>
                These are in the atlas by name and place only. Nobody has documented how they are made, so they carry
                no method and no score.
              </Muted>
            </>
          ) : null}
          {unassessed.map((dish) => (
            <DishCard key={dish.id} dish={dish} showViews={showViews} compact />
          ))}
        </View>
      ) : null}

      {/* The atlas runs to thousands of records, so the feed pages rather than
          rendering everything. The count above always states the true total. */}
      {!isBrowsing && feed.length > visible.length ? (
        <Button
          label={`Show more — ${feed.length - visible.length} left`}
          variant="secondary"
          block
          onPress={() => setPage((p) => p + 1)}
          style={styles.showMore}
        />
      ) : null}

      {/* Readership, demoted to the bottom and labelled for what it is. Absent
          entirely when nothing has a real count — an empty rail under a confident
          heading is how the fabricated version looked.

          Also absent once the reader has narrowed, for the reason the shelves are:
          this rail is an offer of somewhere to start, and someone who has chosen
          Fusion is past being offered. It read worse than useless there — the feed
          said "1 tradition worldwide" and the rail underneath showed four dishes that
          were not fusion, because it is computed from the whole catalogue and never
          saw the filter. Narrowing it instead would empty it, which is the wrong
          answer for a rail that measures readership rather than the reader's query. */}
      {isBrowsing && popular.length ? (
      <View style={styles.popularSection}>
        <View style={styles.popularHeader}>
          <H6>Most looked up</H6>
          <Muted style={styles.byViews}>Wikipedia readers</Muted>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.popularRail}
        >
          {popular.map((dish) => (
            <Pressable
              key={dish.id}
              accessibilityRole="button"
              tint="none"
              onPress={() => router.push(`/dish/${dish.id}`)}
              style={styles.popularCard}
            >
              <Photo
                uri={dish.photo}
                credit={dish.credit}
                label={dish.name}
                style={styles.popularPhoto}
              />
              <T style={styles.popularName}>{dish.name}</T>
              <Muted style={styles.popularClass}>
                {dish.badgeIcon} {dish.badgeLabel}
              </Muted>
              <Muted style={styles.popularViews}>{dish.views}</Muted>
            </Pressable>
          ))}
        </ScrollView>

        <Muted style={styles.popularNote}>
          How many people read about each dish on English Wikipedia over the last year. That is interest, not
          authenticity and not how widely a dish is eaten — and it favours what English speakers look up. Tap
          through for each one&apos;s classification.
        </Muted>
      </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingTop: space[2] },
  headerText: { flex: 1 },
  tagline: { fontSize: 12, marginTop: 2 },
  searchButton: { marginRight: -10 },

  placeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    marginTop: 16,
    padding: space[3],
    minHeight: 56,
    backgroundColor: color.surface,
    borderRadius: radius.md,
    ...elevation.sm,
    borderColor: color.divider,
  },
  placeText: { flex: 1, minWidth: 0 },
  placeTitle: { fontFamily: 'Inter_500Medium', fontSize: 17, lineHeight: 17 * 1.2 },
  placeHint: { fontSize: 11, marginTop: 2 },
  chevron: { fontSize: 16 },

  crumbs: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', paddingTop: 10 },
  crumb: { flexDirection: 'row', alignItems: 'center' },
  crumbText: { fontSize: 11 },
  crumbActive: { color: accentText },
  crumbMuted: { color: color.muted },

  chipScroller: { marginTop: 16, marginBottom: 4, flexGrow: 0 },
  chipRow: { gap: 8, paddingRight: space[3] },

  resultCount: { fontSize: 11, marginTop: 10, marginBottom: 2 },

  emptyCard: { marginTop: 14 },
  cards: { gap: 16, marginTop: 8 },
  browseAll: { marginTop: 26 },
  listHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  backLink: { color: accentText },
  unassessed: { marginTop: 18 },
  unassessedHeading: { marginBottom: 4 },
  unassessedNote: { fontSize: 11, lineHeight: 11 * 1.5, marginBottom: 6 },
  showMore: { marginTop: 16 },

  popularSection: { marginTop: 30, paddingTop: 22, borderTopWidth: 1, borderTopColor: color.divider },
  popularHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: space[2] },
  byViews: { fontSize: 10 },
  popularRail: { gap: 10, paddingTop: 10, paddingBottom: 4, paddingRight: space[3] },
  popularCard: { width: 132 },
  popularPhoto: { width: 132, height: 132, borderRadius: radius.md },
  popularName: { fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 12 * 1.3, marginTop: 6 },
  popularClass: { fontSize: 11 },
  popularViews: { fontSize: 10 },
  popularNote: { fontSize: 11, lineHeight: 11 * 1.45, marginTop: 2 },
});
