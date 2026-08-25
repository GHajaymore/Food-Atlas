/**
 * Food Atlas — coverage, stated honestly, and the way into contributing.
 *
 * The coverage line is the point of this screen: a country absent here has nothing
 * recorded yet, not nothing to record. Tapping a country returns to the Feed with
 * that country as the path and the filter opened to All, so the row never lands on
 * an empty feed just because the record is classified as an adaptation.
 *
 * The screen builds the pieces; `AtlasColumns` decides where they go and
 * `AtlasDirectory` decides what shape the country list takes. Nothing here reads the
 * window width, which is the rule the desktop pass is built on.
 */

import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AtlasColumns } from '../src/components/AtlasColumns';
import { AtlasDirectory } from '../src/components/AtlasDirectory';
import { Button } from '../src/components/Button';
import { Card, CardBody, CardKicker } from '../src/components/Card';
import { NavRow } from '../src/components/NavRow';
import { Screen } from '../src/components/Screen';
import { H6, Muted } from '../src/components/Text';
import { catalogue as dishes } from '../src/data/catalogue';
import { useCopy } from '../src/i18n';
import { CoverageTable, Explain, Meter, StatTile } from '../src/components/Metrics';
import { metricNote } from '../src/domain/metricNotes';
import rawHistory from '../src/data/metrics-history.json';
import { catalogueMetrics, trendFor, type Snapshot } from '../src/domain/metrics';
import { buildAtlas } from '../src/domain/queries';
import { useApp } from '../src/state/store';
import { space } from '../src/theme/tokens';

export default function Atlas() {
  const copy = useCopy();
  const setCountry = useApp((s) => s.setCountry);
  const atlas = buildAtlas(dishes);
  const metrics = catalogueMetrics(copy, dishes);
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

  const intro = (
    <>
      <NavRow title={copy.foodAtlas} />
      {/* Built from the copy rather than from `atlasCoverage`, so the sentence reads in
          the chosen language while the two figures stay exactly what the domain counted. */}
      <Muted style={styles.coverage}>
        {copy.atlasCoverageLine
          .replace('{n}', metrics.total.toLocaleString())
          .replace('{c}', String(metrics.countries))}
      </Muted>
    </>
  );

  /* The atlas's own numbers, computed from the catalogue — nothing here observes a
     reader, so it costs nothing and needs no consent banner. They are deliberately the
     uncomfortable ones: a record that shows its gaps is doing what the confidence score
     does for a single dish. */
  const figures = (
    <>
      <H6 style={styles.statsTitle}>{copy.howComplete}</H6>

      <View style={styles.tiles}>
        {/* "Traditions", not "dishes" — the unit of this atlas is a way of making a food
            in a place, and the same dish can hold several of them. */}
        <StatTile
          value={metrics.total.toLocaleString()}
          label={copy.traditionsRecorded}
          trend={trendFor(history, 'total')}
          note={metricNote('total')}
        />
        <StatTile
          value={String(metrics.countries)}
          label={copy.countries}
          trend={trendFor(history, 'countries')}
          note={metricNote('countries')}
        />
        <StatTile value={String(metrics.atRisk)} label={copy.atRiskTraditions} note={metricNote('atRisk')} />
      </View>

      {/* The country's own name is passed through, never translated — rule 1. */}
      <Muted style={styles.concentration}>
        {copy.concentrationNote
          .replace('{p}', String(metrics.concentration.percent))
          .replace('{country}', metrics.concentration.country)}
      </Muted>
      <Explain note={metricNote('concentration')} />
    </>
  );

  const asks = [
    <Card key="grow" style={styles.grow}>
      <CardKicker>{copy.growTheAtlas}</CardKicker>
      <CardBody>{copy.growTheAtlasBody}</CardBody>
      <Button label={copy.addATradition} block onPress={() => router.push('/contribute')} />
    </Card>,
    /* Placed under the coverage figures on a phone, and beside them on a desktop. Either
       way the honest argument for supporting this is the gap the numbers have just
       shown, so the ask reads as a consequence of them rather than an interruption. */
    <Card key="free" style={styles.grow}>
      <CardKicker>{copy.keepingItFree}</CardKicker>
      <CardBody>{copy.keepingItFreeBody}</CardBody>
      <Button label={copy.whatItCostsToRun} variant="secondary" block onPress={() => router.push('/support')} />
    </Card>,
  ];

  return (
    <Screen bottomPad={50}>
      <AtlasColumns
        intro={intro}
        directory={<AtlasDirectory groups={atlas} onPick={openCountry} />}
        figures={figures}
        /* The words come from the copy layer, the share from the domain — so a meter's
           label and its number can never drift apart. See `prose-3` in the i18n work. */
        meters={[
          <Meter
            key="documented"
            ratio={{ ...metrics.documented, label: copy.meterDocumented, note: copy.meterDocumentedNote }}
            note={metricNote('documented')}
          />,
          <Meter
            key="located"
            ratio={{ ...metrics.located, label: copy.meterLocated, note: copy.meterLocatedNote }}
            note={metricNote('located')}
          />,
          <Meter
            key="assessed"
            ratio={{ ...metrics.assessed, label: copy.meterAssessed, note: copy.meterAssessedNote }}
            note={metricNote('assessed')}
          />,
          <Meter
            key="illustrated"
            ratio={{ ...metrics.illustrated, label: copy.meterIllustrated, note: copy.meterIllustratedNote }}
            note={metricNote('illustrated')}
          />,
          <Meter
            key="filmed"
            ratio={{ ...metrics.filmed, label: copy.meterFilmed, note: copy.meterFilmedNote }}
            note={metricNote('filmed')}
          />,
        ]}
        tables={[
          <CoverageTable key="where" title={copy.whereTheRecordsAre} rows={metrics.byContinent} note={metricNote('byContinent')} />,
          <CoverageTable key="confidence" title={copy.confidence} rows={metrics.confidence} note={metricNote('confidence')} />,
        ]}
        asks={asks}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  coverage: { fontSize: 13, lineHeight: 13 * 1.5, marginTop: 4, marginBottom: 22 },
  statsTitle: { marginBottom: 12 },
  tiles: { flexDirection: 'row', gap: space[4], marginBottom: 14 },
  concentration: { fontSize: 11, lineHeight: 11 * 1.5, marginBottom: 18 },
  grow: { marginTop: 26 },
});
