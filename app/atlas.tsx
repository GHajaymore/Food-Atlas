/**
 * Food Atlas — coverage, stated honestly, and the way into contributing.
 *
 * The coverage line is the point of this screen: a country absent here has nothing
 * recorded yet, not nothing to record. Tapping a country returns to the Feed with
 * that country as the path and the filter opened to All, so the row never lands on
 * an empty feed just because the record is classified as an adaptation.
 */

import { router } from 'expo-router';
import { useState } from 'react';
import { LayoutAnimation, StyleSheet, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Card, CardBody, CardKicker } from '../src/components/Card';
import { NavRow } from '../src/components/NavRow';
import { Pressable } from '../src/components/Pressable';
import { Screen } from '../src/components/Screen';
import { H6, Muted, T } from '../src/components/Text';
import { catalogue as dishes } from '../src/data/catalogue';
import { CaretDownIcon } from '../src/components/icons';
import { CoverageTable, Explain, Meter, StatTile } from '../src/components/Metrics';
import { metricNote } from '../src/domain/metricNotes';
import rawHistory from '../src/data/metrics-history.json';
import { catalogueMetrics, trendFor, type Snapshot } from '../src/domain/metrics';
import { atlasCoverage, buildAtlas } from '../src/domain/queries';
import { useApp } from '../src/state/store';
import { accentText, color, space } from '../src/theme/tokens';

export default function Atlas() {
  const setCountry = useApp((s) => s.setCountry);
  const atlas = buildAtlas(dishes);
  const metrics = catalogueMetrics(dishes);
  const [expanded, setExpanded] = useState<string | null>(null);
  // Appended by scripts/snapshot-metrics.mjs. Empty until the first run, and the
  // tiles simply show no direction rather than inventing one.
  const history = rawHistory as Snapshot[];

  const openCountry = (name: string) => {
    setCountry(name);
    // Unwind to the Feed rather than stacking another copy of it. Opened directly
    // there is nothing to unwind, so fall back to replacing the route.
    if (router.canGoBack()) router.dismissTo('/');
    else router.replace('/');
  };

  return (
    <Screen bottomPad={50}>
      <NavRow title="Food Atlas" />
      <Muted style={styles.coverage}>{atlasCoverage(dishes)}</Muted>

      {/* Collapsed by continent. At 268 countries a flat list buries everything
          below it — including the coverage numbers, which are the point of the
          screen. Each header states its own count, so the shape of the atlas is
          legible without opening anything. */}
      <View style={styles.groups}>
        {atlas.map((group) => {
          const open = expanded === group.label;
          const dishCount = group.countries.reduce((sum, c) => sum + c.count, 0);

          return (
            <View key={group.label}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: open }}
                accessibilityLabel={`${group.label}, ${group.countries.length} countries, ${dishCount} traditions`}
                tint="neutral"
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  // One open at a time: the list is long enough that several open
                  // continents is the same problem in a different shape.
                  setExpanded(open ? null : group.label);
                }}
                style={[styles.groupHeader, open ? styles.groupHeaderOpen : null]}
              >
                <H6 style={[styles.groupLabel, open ? styles.groupLabelOpen : null]}>{group.label}</H6>
                {/* Both numbers named. "36 countries · 297" left the reader to
                    guess what 297 counted. */}
                <Muted style={styles.groupCount}>
                  {group.countries.length} countries · {dishCount.toLocaleString()} traditions
                </Muted>
                <View style={open ? styles.caretOpen : undefined}>
                  <CaretDownIcon size={14} color={open ? color.accent : color.neutral[400]} />
                </View>
              </Pressable>

              {/* The children sit inside a rule that runs the length of the group, so
                  an expanded continent reads as one block rather than as more rows
                  in the same list as the headers above it. */}
              {open ? (
                <View style={styles.groupBody}>
                  {group.countries.map((country) => (
                    <Pressable
                      key={country.name}
                      accessibilityRole="button"
                      accessibilityLabel={`${country.name}, ${country.detail}`}
                      tint="neutral"
                      onPress={() => openCountry(country.name)}
                      style={styles.row}
                    >
                      <T style={styles.country}>{country.name}</T>
                      <Muted style={styles.detail}>{country.detail}</Muted>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      {/* The atlas's own numbers, computed from the catalogue — nothing here
          observes a reader, so it costs nothing and needs no consent banner.
          They are deliberately the uncomfortable ones: a record that shows its
          gaps is doing what the confidence score does for a single dish. */}
      <View style={styles.stats}>
        <H6 style={styles.statsTitle}>How complete is this atlas?</H6>

        <View style={styles.tiles}>
          {/* "Traditions", not "dishes" — the unit of this atlas is a way of making
              a food in a place, and the same dish can hold several of them. */}
          <StatTile
            value={metrics.total.toLocaleString()}
            label="traditions recorded"
            trend={trendFor(history, 'total')}
            note={metricNote('total')}
          />
          <StatTile
            value={String(metrics.countries)}
            label="countries"
            trend={trendFor(history, 'countries')}
            note={metricNote('countries')}
          />
          <StatTile value={String(metrics.atRisk)} label="at-risk traditions" note={metricNote('atRisk')} />
        </View>

        <Muted style={styles.concentration}>
          {metrics.concentration.percent}% of the catalogue comes from {metrics.concentration.country} alone. That
          reflects which countries have been catalogued in the open sources this is built from — not where the
          world&apos;s food is.
        </Muted>
        <Explain note={metricNote('concentration')} />

        <Meter ratio={metrics.documented} note={metricNote('documented')} />
        <Meter ratio={metrics.located} note={metricNote('located')} />
        <Meter ratio={metrics.assessed} note={metricNote('assessed')} />
        <Meter ratio={metrics.illustrated} note={metricNote('illustrated')} />
        <Meter ratio={metrics.filmed} note={metricNote('filmed')} />

        <CoverageTable title="Where the records are" rows={metrics.byContinent} note={metricNote('byContinent')} />
        <CoverageTable title="Confidence" rows={metrics.confidence} note={metricNote('confidence')} />
      </View>

      <Card style={styles.grow}>
        <CardKicker>Grow the atlas</CardKicker>
        <CardBody>
          For each dish the atlas first pulls the most widely published recipe on the internet and classifies it.
          Where nothing exists online, a submission from the community becomes the record.
        </CardBody>
        <Button label="Add a tradition from your area" block onPress={() => router.push('/contribute')} />
      </Card>

      {/* Placed under the coverage figures on purpose. The honest argument for
          supporting this is the gap the numbers above have just shown, so the ask
          reads as a consequence of them rather than an interruption. */}
      <Card style={styles.grow}>
        <CardKicker>Keeping it free</CardKicker>
        <CardBody>
          Everything here is built from sources that cost nothing and stay that way. One thing does cost money, and
          it is switched off until it can be paid for.
        </CardBody>
        <Button label="What it costs to run" variant="secondary" block onPress={() => router.push('/support')} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  coverage: { fontSize: 13, lineHeight: 13 * 1.5, marginTop: 4, marginBottom: 22 },
  groups: { gap: 24 },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingVertical: 12,
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: color.divider,
  },
  // Open: the header stops being a list row and becomes a section heading — the
  // rule under it goes accent, and the label follows.
  groupHeaderOpen: { borderBottomColor: color.accent },
  groupLabel: { flex: 1 },
  groupLabelOpen: { color: accentText },
  groupCount: { fontSize: 11, fontVariant: ['tabular-nums'] },
  caretOpen: { transform: [{ rotate: '180deg' }] },

  // Children are indented behind a hairline that spans the whole group, so their
  // relationship to the header is structural rather than something you infer.
  groupBody: {
    marginLeft: space[2],
    paddingLeft: space[4],
    borderLeftWidth: 1,
    borderLeftColor: color.divider,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
    paddingVertical: 11,
    paddingHorizontal: 2,
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: color.divider,
  },
  country: { fontSize: 14, flexShrink: 0 },
  detail: { fontSize: 12, textAlign: 'right', flex: 1, marginLeft: space[2] },
  stats: { marginTop: 30, paddingTop: 22, borderTopWidth: 1, borderTopColor: color.divider },
  statsTitle: { marginBottom: 12 },
  tiles: { flexDirection: 'row', gap: space[4], marginBottom: 14 },
  concentration: { fontSize: 11, lineHeight: 11 * 1.5, marginBottom: 18 },
  grow: { marginTop: 26 },
});
