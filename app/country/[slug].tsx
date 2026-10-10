/**
 * Everything the atlas holds from one country, at an address of its own.
 *
 * `browse.tsx` predicted this screen in its own header: "a page per country and per shelf
 * is this screen with its parameters baked in". The reason to bake them in is that
 * `/browse?country=Morocco` is a query string, and a query string is not a page — every
 * one of them is served the same `index.html`, carries the same canonical and cannot be
 * prerendered. 196 countries had no landing page between them, which for an atlas
 * organised by place is the one hierarchy a reader and a search engine would both expect.
 *
 * ## What it says, and what it refuses to say
 *
 * The country's own name, the number of traditions recorded, and the records. No claim
 * about the country's cuisine, no editorial line about its food — the atlas has not earned
 * one, and `AtlasDirectory` already states the rule this page inherits: a country absent
 * here has nothing recorded yet, not nothing to record.
 *
 * ## An unknown slug is not a page
 *
 * `/country/narnia` answers 200 with the app shell, like every unmatched path. The screen
 * says so and marks itself `noindex`, the same treatment `dish/[id]` gives a record id
 * that matches nothing.
 */

import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { DishCard } from '../../src/components/DishCard';
import { NavRow } from '../../src/components/NavRow';
import { Screen } from '../../src/components/Screen';
import { H4, Muted, T } from '../../src/components/Text';
import { catalogue } from '../../src/data/catalogue';
import { count } from '../../src/data/events';
import { hrefFor } from '../../src/domain/browse';
import { isCountry, placeName } from '../../src/domain/continents';
import { countryFor } from '../../src/domain/countrySlug';
import { catalogueMetrics } from '../../src/domain/metrics';
import { useNoIndex } from '../../src/domain/noindex';
import { useDocumentTitle } from '../../src/domain/pageTitle';
import { BRAND } from '../../src/brand';
import { useCopy, useLocale, useNumber, usePlural } from '../../src/i18n';
import { useLayout } from '../../src/theme/layout';
import { color, font, space } from '../../src/theme/tokens';

const PAGE = 36;

export default function Country() {
  const copy = useCopy();
  const locale = useLocale((state) => state.locale);
  const n = useNumber();
  const plural = usePlural();
  const layout = useLayout();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  /* The atlas's own two figures, so this page cannot quote a different pair from the
     screen a reader just came from — it counts origins that are countries, not every
     value the import carries. */
  const metrics = useMemo(() => catalogueMetrics(copy, catalogue), [copy]);
  const [page, setPage] = useState(1);

  const country = useMemo(
    () =>
      countryFor(
        String(slug ?? ''),
        /* Countries only, by the atlas's own test — the same filter decides which pages
           were written, so a slug that resolves here is a slug with a file. */
        catalogue.map((dish) => dish.loc.country).filter((name) => Boolean(name) && isCountry(name)),
      ),
    [slug],
  );

  /* Best documented first, then by name — the same order the prerendered page lists them
     in, so the static HTML and the app do not disagree about what comes first. */
  const records = useMemo(() => {
    if (!country) return [];
    const documented = (dish: (typeof catalogue)[number]) =>
      dish.steps.length ? 2 : dish.ingredients.length ? 1 : 0;
    return catalogue
      .filter((dish) => dish.loc.country === country)
      .sort((a, b) => documented(b) - documented(a) || a.name.localeCompare(b.name));
  }, [country]);

  useNoIndex(!country);
  const named = country ? placeName(country, copy, locale) : '';
  useDocumentTitle(country ? `${named} · ${BRAND.name}` : BRAND.name);

  /* A country page is a query that ran, the same as a facet link — see browse.tsx. */
  useMemo(() => {
    if (country) count('search', country);
  }, [country]);

  if (!country) {
    return (
      <Screen>
        <NavRow title={copy.foodAtlas} />
        <View style={styles.empty}>
          {/* The same words /dish/9999 and any other unmatched address get: this is a
              page that does not exist, not a country with no food. */}
          <T style={styles.emptyHead}>{copy.pageNotFound}</T>
          {/* The atlas's own coverage sentence, which is exactly the thing a reader
              who typed a country we do not hold needs to be told. */}
          <Muted style={styles.emptyNote}>
            {copy.atlasCoverageLine
              .replace('{n}', n(metrics.total))
              .replace('{c}', n(metrics.countries))}
          </Muted>
          <Button
            label={copy.foodAtlas}
            variant="secondary"
            style={styles.more}
            onPress={() => router.push('/atlas')}
          />
        </View>
      </Screen>
    );
  }

  const visible = records.slice(0, page * PAGE);

  return (
    <Screen>
      <NavRow title={copy.foodAtlas} />

      {/* The country's own name, never translated away — rule 1 on the atlas screen. */}
      <H4 style={styles.title}>{named}</H4>
      <Muted style={styles.count}>
        {/* Through the plural rules, not a number beside a plural noun: Eritrea, whose one
            record came back on 9 October, read "1 traditions recorded". */}
        {plural('oneTradition', 'nTraditions', records.length)}
      </Muted>

      <View style={layout.wide ? styles.grid : undefined}>
        {visible.map((dish) => (
          <View key={dish.id} style={layout.wide ? { width: `${100 / layout.columns}%` } : styles.stacked}>
            <DishCard dish={dish} showViews={false} compact={!dish.photo} />
          </View>
        ))}
      </View>

      {visible.length < records.length ? (
        <Button
          label={copy.showNMore.replace('{n}', String(Math.min(PAGE, records.length - visible.length)))}
          variant="secondary"
          block
          style={styles.more}
          onPress={() => setPage((p) => p + 1)}
        />
      ) : null}

      {/* The way to narrow it: the same records, with every other facet available. */}
      <Button
        label={copy.browse}
        variant="secondary"
        block
        style={styles.more}
        onPress={() => router.push(hrefFor({ country }))}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: space[2] },
  count: { fontSize: 13, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: space[2] },
  /* The same 2px-apart stack /browse had on a phone. */
  stacked: { marginBottom: space[3] },
  more: { marginTop: space[6] },
  empty: { marginTop: space[6], gap: space[2] },
  emptyHead: { fontSize: 15, color: color.text, fontFamily: font.semibold },
  emptyNote: { fontSize: 13, lineHeight: 20 },
});
