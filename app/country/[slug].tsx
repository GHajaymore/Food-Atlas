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
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { RecordGrid } from '../../src/components/RecordGrid';
import { NavRow } from '../../src/components/NavRow';
import { Screen } from '../../src/components/Screen';
import { H6, Muted, T } from '../../src/components/Text';
import { CountryLocator } from '../../src/components/CountryLocator';
import { FacetLink } from '../../src/components/FacetLink';
import { COUNTRY_CODE } from '../../src/domain/countryCodes';
import { countryOrder } from '../../src/domain/countryOrder';
import { levelLabel } from '../../src/domain/authenticity';
import type { Level } from '../../src/domain/types';
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

  /* Traditions before published recipes — see countryOrder.ts. The prerendered page
     lists them in the same order, so the static HTML and the app agree on what comes
     first. */
  const records = useMemo(
    () => (country ? countryOrder(catalogue.filter((dish) => dish.loc.country === country)) : []),
    [country],
  );

  /*
   * Where in the country the records come from — the way a cook thinks about Italy or
   * India. Only regions holding three or more, because thirty one-record regions are
   * noise, and none at all unless at least two qualify.
   */
  const regions = useMemo(() => {
    const tally = new Map<string, number>();
    for (const dish of records) {
      const region = dish.loc.region;
      if (region && region !== country) tally.set(region, (tally.get(region) ?? 0) + 1);
    }
    const top = [...tally].filter(([, k]) => k >= 3).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    return top.length >= 2 ? top.slice(0, 10) : [];
  }, [records, country]);

  /* The records by classification, strongest first — `records` is already in that order. */
  const kinds = useMemo(() => {
    const out: { level: Level; icon: string; k: number }[] = [];
    for (const dish of records) {
      const last = out[out.length - 1];
      if (last?.level === dish.badgeLevel) last.k += 1;
      else out.push({ level: dish.badgeLevel, icon: dish.badgeIcon, k: 1 });
    }
    return out;
  }, [records]);

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

  return (
    <Screen>
      {/* The country's own name is the page's title — it was a smaller line under a
          large "Food Atlas", so the biggest words on India's page were not "India". */}
      <NavRow title={named} />

      <View style={layout.wide ? styles.heroWide : styles.hero}>
        <View style={styles.heroText}>
          <Muted style={styles.count}>
            {/* Through the plural rules, not a number beside a plural noun: Eritrea, whose one
                record came back on 9 October, read "1 traditions recorded". */}
            {plural('oneTradition', 'nTraditions', records.length)}
          </Muted>
          {/* What kind of record the count is made of. Brazil's 188 are 8 traditional
              variations and 161 published recipes, and a reader deserves to know that
              before scrolling, not after. */}
          <View style={styles.kinds}>
            {kinds.map(({ level, icon, k }) => (
              <View key={level} style={styles.kind}>
                <T style={styles.kindIcon}>{icon}</T>
                <T style={styles.kindLabel}>{levelLabel(copy, level)}</T>
                <Muted style={styles.kindCount}>{n(k)}</Muted>
              </View>
            ))}
          </View>
          {regions.length ? (
            <View style={styles.regions}>
              <H6 style={styles.regionsTitle}>{copy.countryRegions}</H6>
              <View style={styles.chips}>
                {regions.map(([region, k]) => (
                  <FacetLink key={region} variant="chip" label={`${placeName(region, copy, locale)} · ${n(k)}`} query={{ country, region }} />
                ))}
              </View>
            </View>
          ) : null}
        </View>
        <CountryLocator code={COUNTRY_CODE[country]} style={layout.wide ? styles.mapWide : styles.map} />
      </View>

      <RecordGrid records={records} />

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
  hero: { gap: space[3], marginBottom: space[4] },
  heroWide: { flexDirection: 'row', alignItems: 'flex-start', gap: space[6], marginBottom: space[6] },
  heroText: { flex: 1, minWidth: 0 },
  /* Wider than the desktop frame, so on a phone the map does not push the dishes a screen down. */
  map: { width: '100%', aspectRatio: 2.4 },
  mapWide: { width: 380 },
  kinds: { marginTop: space[3], gap: 6 },
  kind: { flexDirection: 'row', alignItems: 'baseline', gap: space[2] },
  kindIcon: { fontSize: 12, width: 16 },
  kindLabel: { fontSize: 14, color: color.text },
  kindCount: { fontSize: 13, fontVariant: ['tabular-nums'] },
  regions: { marginTop: space[6] },
  regionsTitle: { marginBottom: space[2] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  count: { fontSize: 13 },
  more: { marginTop: space[6] },
  empty: { marginTop: space[6], gap: space[2] },
  emptyHead: { fontSize: 15, color: color.text, fontFamily: font.semibold },
  emptyNote: { fontSize: 13, lineHeight: 20 },
});
