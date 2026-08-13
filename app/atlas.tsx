/**
 * Food Atlas — coverage, stated honestly, and the way into contributing.
 *
 * The coverage line is the point of this screen: a country absent here has nothing
 * recorded yet, not nothing to record. Tapping a country returns to the Feed with
 * that country as the path and the filter opened to All, so the row never lands on
 * an empty feed just because the record is classified as an adaptation.
 */

import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Card, CardBody, CardKicker } from '../src/components/Card';
import { NavRow } from '../src/components/NavRow';
import { Pressable } from '../src/components/Pressable';
import { Screen } from '../src/components/Screen';
import { H6, Muted, T } from '../src/components/Text';
import { catalogue as dishes } from '../src/data/catalogue';
import { atlasCoverage, buildAtlas } from '../src/domain/queries';
import { useApp } from '../src/state/store';
import { color, space } from '../src/theme/tokens';

export default function Atlas() {
  const setCountry = useApp((s) => s.setCountry);
  const atlas = buildAtlas(dishes);

  const openCountry = (name: string) => {
    setCountry(name);
    router.dismissTo('/');
  };

  return (
    <Screen bottomPad={50}>
      <NavRow title="Food Atlas" />
      <Muted style={styles.coverage}>{atlasCoverage(dishes)}</Muted>

      <View style={styles.groups}>
        {atlas.map((group) => (
          <View key={group.label}>
            <H6 style={styles.groupLabel}>{group.label}</H6>
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
        ))}
      </View>

      <Card style={styles.grow}>
        <CardKicker>Grow the atlas</CardKicker>
        <CardBody>
          For each dish the atlas first pulls the most widely published recipe on the internet and classifies it.
          Where nothing exists online, a submission from the community becomes the record.
        </CardBody>
        <Button label="Add a tradition from your area" block onPress={() => router.push('/contribute')} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  coverage: { fontSize: 13, lineHeight: 13 * 1.5, marginTop: 4, marginBottom: 22 },
  groups: { gap: 24 },
  groupLabel: { marginBottom: 10 },
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
  grow: { marginTop: 26 },
});
