/**
 * Everything matching a filter, at a URL that can be shared.
 *
 * The destination every `FacetLink` points at, and the thing that was missing when the
 * app "behaved like an app": a reader could see a record was from Kerala, and could not
 * ask what else was. The filters existed — `feedFor` and `searchResults` have run them
 * for months — with no address to reach them at.
 *
 * ## Why a URL rather than more state
 *
 * The feed already narrows by place and badge, and keeps that in a store. That is right
 * for a phone, where narrowing is something you do and then undo. It is wrong for a
 * website, where the narrowed view is a *place* — something to link to, send to
 * somebody, keep open in a tab, and eventually let a search engine index. None of that
 * is possible while the filter lives only in memory.
 *
 * It is also what makes stage 2 reachable later: a page per country and per shelf is
 * this screen with its parameters baked in.
 *
 * ## What it shows when nothing matches
 *
 * The filters that produced the emptiness, each removable. An empty list that does not
 * say what emptied it invites the reader to conclude the atlas holds nothing — the same
 * reasoning behind `narrowingSummary` on the feed.
 */

import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../src/components/Button';
import { DishCard } from '../src/components/DishCard';
import { FacetLink } from '../src/components/FacetLink';
import { NavRow } from '../src/components/NavRow';
import { useCopy, useNumber } from '../src/i18n';
import { Screen } from '../src/components/Screen';
import { H4, Muted, T } from '../src/components/Text';
import { catalogue } from '../src/data/catalogue';
import { count } from '../src/data/events';
import { browse, describe, hrefFor, parseBrowse, type BrowseQuery } from '../src/domain/browse';
import { useLayout } from '../src/theme/layout';
import { color, font, space } from '../src/theme/tokens';

const PAGE = 36;

/** The facets on screen, so each can be lifted off again. */
const CHIPS: { key: keyof BrowseQuery; prefix?: string }[] = [
  { key: 'country' },
  { key: 'region' },
  { key: 'cuisine' },
  { key: 'category' },
  { key: 'ingredient', prefix: 'with ' },
  { key: 'level' },
  { key: 'q', prefix: '“', },
];

export default function Browse() {
  const copy = useCopy();
  const n = useNumber();
  const params = useLocalSearchParams();
  const layout = useLayout();
  const [page, setPage] = useState(1);

  const query = useMemo(
    () => parseBrowse(params as Record<string, string | string[] | undefined>),
    [JSON.stringify(params)],
  );

  const results = useMemo(() => browse(catalogue, query), [query]);
  const title = describe(copy, query);

  /* Counted as a search rather than a dish open — it is a query, and the target is the
     filter that ran. No reader is attached to it; see src/data/events.ts. */
  useMemo(() => {
    if (query.country || query.cuisine || query.ingredient) {
      count('search', query.country ?? query.cuisine ?? query.ingredient ?? '');
    }
  }, [query]);

  const visible = results.slice(0, page * PAGE);
  const active = CHIPS.filter((c) => query[c.key]);

  return (
    <Screen>
      <NavRow title={copy.browse} />

      <H4 style={styles.title}>{title}</H4>
      <Muted style={styles.count}>
        {n(results.length)} {results.length === 1 ? 'record' : 'records'}
      </Muted>

      {/*
       * Each active filter, and a way to drop it.
       *
       * Removable individually rather than only as a set, because the useful move after
       * "Kerala sweets, 4 records" is almost always to widen by one step — to all Kerala
       * food, or to sweets everywhere — and a single Clear button makes that two
       * actions and a re-navigation.
       */}
      {active.length ? (
        <View style={styles.chips}>
          {active.map(({ key, prefix }) => {
            const without = { ...query, [key]: undefined };
            return (
              <FacetLink
                key={key}
                variant="chip"
                label={`${prefix ?? ''}${query[key]}${key === 'q' ? '”' : ''} ×`}
                query={without}
                describedAs={copy.removeFilter.replace('{key}', key)}
              />
            );
          })}
        </View>
      ) : null}

      {visible.length ? (
        <>
          <View style={layout.wide ? styles.grid : undefined}>
            {visible.map((dish) => (
              <View key={dish.id} style={layout.wide ? { width: `${100 / layout.columns}%` } : undefined}>
                <DishCard dish={dish} showViews={false} />
              </View>
            ))}
          </View>

          {visible.length < results.length ? (
            <Button
              label={copy.showNMore.replace('{n}', String(Math.min(PAGE, results.length - visible.length)))}
              variant="secondary"
              block
              style={styles.more}
              onPress={() => setPage((p) => p + 1)}
            />
          ) : null}
        </>
      ) : (
        <View style={styles.empty}>
          <T style={styles.emptyHead}>{copy.nothingMatchesAll}</T>
          <Muted style={styles.emptyNote}>
            Each filter above can be lifted on its own. The atlas holds{' '}
            {n(catalogue.length)} records; this combination is not one of them.
          </Muted>
          <Button
            label={copy.startAgain}
            variant="secondary"
            style={styles.more}
            onPress={() => router.push(hrefFor({}))}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: space[2] },
  count: { fontSize: 13, marginTop: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2], marginTop: space[3] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: space[2] },
  more: { marginTop: space[6] },
  empty: { marginTop: space[6], gap: space[2] },
  emptyHead: { fontSize: 15, color: color.text, fontFamily: font.semibold },
  emptyNote: { fontSize: 13, lineHeight: 20 },
});
