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
import { Pressable } from '../src/components/Pressable';
import { Screen } from '../src/components/Screen';
import { H6, Muted, T } from '../src/components/Text';
import { catalogue as dishes } from '../src/data/catalogue';
import { feedFor, nextLevel, placeGroups } from '../src/domain/queries';
import { useApp } from '../src/state/store';
import { accentText, color, space } from '../src/theme/tokens';

export default function PlacePicker() {
  const { activeFilter, path, placeQuery, setPlaceQuery, pushPlace } = useApp();

  const matching = feedFor(dishes, activeFilter, path);
  const next = nextLevel(path, matching);
  const groups = placeGroups(next, placeQuery, path.length === 0);
  const noMatch = groups.every((g) => g.options.length === 0);

  const levelLabel = next?.label ?? 'place';
  const contextLine = path.length ? `Within ${path.map((p) => p.value).join(' › ')}` : 'Worldwide';

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
      <NavRow title={`Choose a ${levelLabel}`} />
      <Muted style={styles.context}>{contextLine}</Muted>

      <Input
        placeholder={`Type to search ${levelLabel}…`}
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
        <T style={styles.anywhere}>Anywhere</T>
        <Muted style={styles.count}>{matching.length}</Muted>
      </Pressable>

      {groups.map((group, i) => (
        <View key={group.label || `group-${i}`} style={styles.group}>
          {group.showLabel ? <H6 style={styles.groupLabel}>{group.label}</H6> : null}
          {group.options.map((option) => (
            <Pressable
              key={option.label}
              accessibilityRole="button"
              accessibilityLabel={`${option.label}, ${option.count} recorded`}
              tint="neutral"
              onPress={() => choose(option.label)}
              style={styles.row}
            >
              <T style={styles.optionLabel}>{option.label}</T>
              <Muted style={styles.count}>{option.count}</Muted>
            </Pressable>
          ))}
        </View>
      ))}

      {noMatch ? (
        <Muted style={styles.noMatch}>
          No {levelLabel} recorded under that name yet. Absence here means no record, not no food.
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

  group: { marginTop: 18 },
  groupLabel: { marginBottom: 6 },

  noMatch: { fontSize: 12, lineHeight: 12 * 1.45, marginTop: 18 },
});
