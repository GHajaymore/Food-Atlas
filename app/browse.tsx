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
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../src/components/Button';
import { FacetLink } from '../src/components/FacetLink';
import { NavRow } from '../src/components/NavRow';
import { useCopy, useNumber, usePlural } from '../src/i18n';
import { Screen } from '../src/components/Screen';
import { H4, Muted, T } from '../src/components/Text';
import { catalogue } from '../src/data/catalogue';
import { count } from '../src/data/events';
import { browse, describe, hrefFor, levelOf, parseBrowse, type BrowseQuery } from '../src/domain/browse';
import { filterLabel } from '../src/domain/authenticity';
import { color, font, space } from '../src/theme/tokens';
import { RecordGrid } from '../src/components/RecordGrid';


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
  const plural = usePlural();
  const params = useLocalSearchParams();

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

  const active = CHIPS.filter((c) => query[c.key]);

  return (
    <Screen>
      <NavRow title={copy.browse} />

      <H4 style={styles.title}>{title}</H4>
      <Muted style={styles.count}>
        {plural('oneTradition', 'nTraditions', results.length)}
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
            /*
             * The chip says what the filter is, in words — the same words as the heading.
             *
             * It printed the raw value: "variation ×" under a heading reading "Traditional
             * Variations", "unverified ×" beside "Unverified". And a level the URL named
             * but nothing recognises showed a chip for a filter that was not applied. The
             * screen reader heard worse — "Remove the q filter", "Remove the level filter"
             * — the internal names of the query parameters. Both now use what is shown.
             */
            const level = key === 'level' ? levelOf(query) : null;
            if (level === 'all') return null;
            const shown = level ? filterLabel(copy, level) : `${prefix ?? ''}${query[key]}${key === 'q' ? '”' : ''}`;
            return (
              <FacetLink
                key={key}
                variant="chip"
                label={`${shown} ×`}
                query={without}
                describedAs={copy.removeFilter.replace('{key}', shown)}
              />
            );
          })}
        </View>
      ) : null}

      {results.length ? (
        /* Photographed records as cards, the rest as rows beneath — see RecordGrid. Keyed
           on the query, so a new filter starts from its first page. */
        <RecordGrid key={JSON.stringify(query)} records={results} />
      ) : (
        <View style={styles.empty}>
          <T style={styles.emptyHead}>{copy.nothingMatchesAll}</T>
          <Muted style={styles.emptyNote}>
            {/* Was English in every language, and its second half repeated the heading
                above it. What is left is the one thing a reader can do about it. */}
            {copy.filtersLiftOneByOne}
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
  more: { marginTop: space[6] },
  empty: { marginTop: space[6], gap: space[2] },
  emptyHead: { fontSize: 15, color: color.text, fontFamily: font.semibold },
  emptyNote: { fontSize: 13, lineHeight: 20 },
});
