/**
 * The atlas on a map: every country shaded by how many traditions it holds.
 *
 * A food atlas that never showed a map was the gap a first visitor saw before anything
 * else (9 October, given a free hand to make the site better). This is that map, and it
 * says only what the catalogue says: the shade is the count of records filed under the
 * country, one hue from dim to bright gold, and a country with none is left a quiet dark
 * grey — the gaps are the most honest part of the picture, the same argument the
 * coverage figures beside it make.
 *
 * ## Built to be light
 *
 * The outlines are Natural Earth's (public domain), projected with Equal Earth by
 * `scripts/make-world-map.mjs` at build time — so this file receives finished SVG paths
 * and carries no projection code — and they load only when this page is opened: 40 KB
 * compressed for 174 outlines, plus one dot each for the 61 small states the coarse
 * outlines drop (Singapore, Malta, Bahrain, Mauritius). A food atlas cannot leave out
 * Singapore.
 *
 * ## How it is read
 *
 * Hover on a desktop, tap on a phone: the country lights and the line under the map says
 * its name and its count, with a button to its page. A tap does not navigate on its own,
 * because a thumb on a world map lands on the wrong country often enough that a jump
 * would be a trap. The directory below the map still lists every country, so nothing
 * here is reachable only by pointing.
 */

import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { catalogue, dataUrl } from '../data/catalogue';
import { isCountry, placeName } from '../domain/continents';
import { COUNTRY_CODE } from '../domain/countryCodes';
import { slugFor } from '../domain/countrySlug';
import { useCopy, useLocale, usePlural } from '../i18n';
import { color, font, radius, space } from '../theme/tokens';
import { Button } from './Button';
import { H6, Muted, T } from './Text';

interface MapData {
  width: number;
  height: number;
  countries: { a2: string; d: string }[];
  dots: { a2: string; c: [number, number] }[];
}

/* The bands, and the shade of gold each gets. One hue, brighter for more, so the map
   reads at a glance and in grey; the legend states every band. */
const BANDS: { from: number; label: string; opacity: number }[] = [
  { from: 1, label: '1–9', opacity: 0.2 },
  { from: 10, label: '10–49', opacity: 0.42 },
  { from: 50, label: '50–199', opacity: 0.68 },
  { from: 200, label: '200+', opacity: 1 },
];
const bandOf = (count: number) => [...BANDS].reverse().find((b) => count >= b.from);

const EMPTY = '#23263a';

let cached: MapData | null = null;

export function WorldMap() {
  const copy = useCopy();
  const locale = useLocale((s) => s.locale);
  const plural = usePlural();
  const [map, setMap] = useState<MapData | null>(cached);
  const [focus, setFocus] = useState<string | null>(null);

  useEffect(() => {
    if (cached) return;
    let live = true;
    fetch(dataUrl('world-map.json'))
      .then((r) => (r.ok ? r.json() : null))
      .then((data: MapData | null) => {
        if (!data || !live) return;
        cached = data;
        setMap(data);
      })
      .catch(() => {
        /* No map is a smaller page, not a broken one: the directory below lists every country. */
      });
    return () => {
      live = false;
    };
  }, []);

  /* Records per country, keyed by the ISO code the outlines carry. */
  const byCode = useMemo(() => {
    const out = new Map<string, { name: string; count: number }>();
    for (const dish of catalogue) {
      const name = dish.loc.country;
      const code = COUNTRY_CODE[name];
      if (!code || !isCountry(name)) continue;
      const entry = out.get(code) ?? { name, count: 0 };
      entry.count += 1;
      out.set(code, entry);
    }
    return out;
    // Recounted when the catalogue arrives or grows — it loads after the first render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogue.length]);

  if (!map) return null;

  const focused = focus ? byCode.get(focus) : undefined;
  const fillFor = (a2: string) => {
    const band = bandOf(byCode.get(a2)?.count ?? 0);
    return band ? color.accent : EMPTY;
  };
  const opacityFor = (a2: string) => (a2 === focus ? 1 : (bandOf(byCode.get(a2)?.count ?? 0)?.opacity ?? 1));

  return (
    <View style={styles.wrap}>
      <H6 style={styles.title}>{copy.mapTitle}</H6>

      <View style={[styles.frame, { aspectRatio: map.width / map.height }]}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${map.width} ${map.height}`} accessibilityLabel={copy.mapTitle}>
          <G>
            {map.countries.map((c) => (
              <Path
                key={c.a2 + c.d.length}
                d={c.d}
                fill={fillFor(c.a2)}
                fillOpacity={opacityFor(c.a2)}
                stroke={c.a2 === focus ? color.text : color.bg}
                strokeWidth={c.a2 === focus ? 1.2 : 0.5}
                onPress={() => setFocus(c.a2)}
                // Hover on a desktop. react-native-svg passes these through to the DOM.
                {...({ onMouseEnter: () => setFocus(c.a2) } as object)}
              />
            ))}
            {map.dots.map((dot) => (
              <G key={dot.a2}>
                <Circle
                  cx={dot.c[0]}
                  cy={dot.c[1]}
                  r={2.6}
                  fill={fillFor(dot.a2)}
                  fillOpacity={opacityFor(dot.a2)}
                  stroke={dot.a2 === focus ? color.text : color.bg}
                  strokeWidth={0.6}
                />
                {/* A larger, invisible target: a 5px dot is not something a thumb can hit. */}
                <Circle
                  cx={dot.c[0]}
                  cy={dot.c[1]}
                  r={9}
                  fill="transparent"
                  onPress={() => setFocus(dot.a2)}
                  {...({ onMouseEnter: () => setFocus(dot.a2) } as object)}
                />
              </G>
            ))}
          </G>
        </Svg>
      </View>

      <View style={styles.readout}>
        {focused ? (
          <>
            <View style={styles.readoutText}>
              <T style={styles.country}>{placeName(focused.name, copy, locale)}</T>
              <Muted style={styles.count}>{plural('oneTradition', 'nTraditions', focused.count)}</Muted>
            </View>
            <Button
              label={`${placeName(focused.name, copy, locale)} →`}
              variant="secondary"
              compact
              onPress={() => router.push(`/country/${slugFor(focused.name)}`)}
            />
          </>
        ) : focus ? (
          <Muted style={styles.count}>{copy.mapNone}</Muted>
        ) : (
          <Muted style={styles.count}>{copy.mapHint}</Muted>
        )}
      </View>

      <View style={styles.legend}>
        <Muted style={styles.legendLabel}>{copy.mapLegend}</Muted>
        {BANDS.map((band) => (
          <View key={band.label} style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: color.accent, opacity: band.opacity }]} />
            <Muted style={styles.legendText}>{band.label}</Muted>
          </View>
        ))}
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: EMPTY }]} />
          <Muted style={styles.legendText}>0</Muted>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: space[6] },
  title: { marginBottom: space[2] },
  frame: { width: '100%', maxWidth: '100%' },
  readout: {
    minHeight: 44,
    marginTop: space[2],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[3],
    flexWrap: 'wrap',
  },
  readoutText: { flexDirection: 'row', alignItems: 'baseline', gap: space[2], flexShrink: 1 },
  country: { fontFamily: font.display, fontSize: 18, color: color.text },
  count: { fontSize: 13 },
  legend: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: space[3], marginTop: space[2] },
  legendLabel: { fontSize: 11 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  swatch: { width: 12, height: 12, borderRadius: radius.sm },
  legendText: { fontSize: 11 },
});
