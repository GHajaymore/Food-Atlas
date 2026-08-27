/**
 * Place picker — choose the next geographic level.
 *
 * Counts respect the active authenticity filter, so a tap never promises a record
 * the current filter cannot show. At country level the list groups by continent —
 * the structure that has to hold every country on earth; deeper levels are one
 * alphabetical list.
 */

import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Input } from '../src/components/Field';
import { NavRow } from '../src/components/NavRow';
import { PlaceOptions } from '../src/components/PlaceOptions';
import { Pressable } from '../src/components/Pressable';
import { Screen } from '../src/components/Screen';
import { H6, Muted, T } from '../src/components/Text';
import { catalogue as dishes } from '../src/data/catalogue';
import { continentLabel, placeKind, placeName } from '../src/domain/continents';
import { feedFor, nextLevel, placeGroups } from '../src/domain/queries';
import { useApp } from '../src/state/store';
import { accentText, color, space } from '../src/theme/tokens';
import { chooseLevel } from '../src/domain/authenticity';
import { useCopy, useLocale } from '../src/i18n';

export default function PlacePicker() {
  const copy = useCopy();
  const locale = useLocale((state) => state.locale);
  const { activeFilter, path, placeQuery, setPlaceQuery, pushPlace } = useApp();

  const matching = feedFor(dishes, activeFilter, path);
  const next = nextLevel(path, matching);
  const groups = placeGroups(next, placeQuery, path.length === 0);
  const noMatch = groups.every((g) => g.options.length === 0);

  const levelNoun = next ? copy[next.labelKey] : copy.geoPlace;
  const contextLine = path.length
    ? copy.within.replace('{path}', path.map((p) => p.value).join(' › '))
    : copy.worldwide;

  // Selecting a place returns to the Feed. Opened directly — a deep link, or a
  // refresh on the web build — there is no history to pop, so a bare router.back()
  // would apply the choice and then strand the reader on the picker.
  const toFeed = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const choose = (value: string) => {
    if (!next) return;
    pushPlace(next.key, value);
    toFeed();
  };

  return (
    <Screen bottomPad={50}>
      <NavRow title={next ? chooseLevel(copy, next.key) : copy.chooseCountry} />
      <Muted style={styles.context}>{contextLine}</Muted>

      <Input
        placeholder={copy.typeToSearchLevel}
        value={placeQuery}
        onChangeText={setPlaceQuery}
        autoCorrect={false}
        style={styles.search}
      />

      <Pressable
        accessibilityRole="button"
        tint="neutral"
        onPress={() => {
          setPlaceQuery('');
          toFeed();
        }}
        style={styles.row}
      >
        <T style={styles.anywhere}>{copy.anywhere}</T>
        <Muted style={styles.count}>{matching.length}</Muted>
      </Pressable>

      {/*
       * The options own their own arrangement — rows on a phone, columns on a desktop.
       * See `PlaceOptions`: this was 201 stacked rows on a 9,578px page at 1440.
       */}
      <PlaceOptions
        groups={groups.map((group) => ({
          /* The picker groups by continent, so its headings are continent names too. */
          label: continentLabel(group.label, copy),
          showLabel: group.showLabel,
          options: group.options.map((option) => ({
            label: option.label,
            display: placeName(option.label, copy, locale),
            count: option.count,
            /*
             * Some of these are not countries, and the list should say so.
             *
             * "Ancient Greece", "Byzantine Empire", "Kievan Rus'" and "Soviet Union" sit
             * between Albania and Austria under a heading that reads "Choose a country".
             * They belong here — a dish recorded as Ottoman has to be reachable, and it
             * is no less placed for having outlived its state — but presented as peers of
             * Austria they read as an error in the data.
             *
             * Only at country level. Deeper down the options are regions and cities,
             * where the question does not arise.
             */
            note: next?.key === 'country' ? placeKind(option.label, copy) : '',
          })),
        }))}
        onPick={choose}
      />

      {noMatch ? (
        <Muted style={styles.noMatch}>
          {copy.noLevelRecorded.replace('{level}', levelNoun)}
        </Muted>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  context: { fontSize: 12, marginTop: 4, marginBottom: 14 },
  search: { marginBottom: 14 },

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
  anywhere: { fontSize: 13, color: accentText },
  optionLabel: { fontSize: 14, flex: 1 },
  count: { fontSize: 12 },
  // Sits between the name and the count, quiet enough to read as a note rather than
  // as part of the place name.
  kind: { fontSize: 10, flexShrink: 0, marginRight: space[2], opacity: 0.75 },

  group: { marginTop: 18 },
  groupLabel: { marginBottom: 6 },

  noMatch: { fontSize: 12, lineHeight: 12 * 1.45, marginTop: 18 },
});
