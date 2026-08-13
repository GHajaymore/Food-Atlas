/**
 * The dietary preference control — a two-level menu.
 *
 * Top-level groups sit in a scrollable chip row. Selecting one that has a sub-menu
 * (Seafood, Non-vegetarian) reveals its kinds beneath, so "non-veg → poultry" is two
 * taps and the sub-menu never occupies space until it is relevant.
 *
 * The control narrows what is shown. It never offers to adapt a dish to fit the
 * preference — that would be the substitution the brief forbids, and this app's
 * answer to "there is nothing here you can eat" is to say so.
 */

import { ScrollView, StyleSheet, View } from 'react-native';
import { DIET_MENU, GROUP_LABELS, KIND_LABELS, kindsFor, type DietGroup, type DietKind } from '../domain/diet';
import { space } from '../theme/tokens';
import { Button } from './Button';
import { H6, Muted } from './Text';
import { Tag } from './Tag';

interface Props {
  groups: DietGroup[];
  kinds: DietKind[];
  onToggleGroup: (group: DietGroup) => void;
  onToggleKind: (kind: DietKind) => void;
  onClear: () => void;
  /** Search renders a labelled facet group; the Feed renders a bare chip row. */
  variant?: 'facet' | 'inline';
}

export function DietFilter({ groups, kinds, onToggleGroup, onToggleKind, onClear, variant = 'inline' }: Props) {
  // Only the sub-menus of currently selected groups are shown.
  const openKinds = groups.flatMap(kindsFor);

  const chips = (
    <>
      {DIET_MENU.map(({ group }) => (
        <Tag
          key={group}
          label={GROUP_LABELS[group]}
          noWrap
          variant={groups.includes(group) ? 'accent' : 'outline'}
          onPress={() => onToggleGroup(group)}
        />
      ))}
    </>
  );

  return (
    <View style={variant === 'facet' ? undefined : styles.inlineWrap}>
      {variant === 'facet' ? (
        <>
          <H6 style={styles.label}>Dietary preference</H6>
          <View style={styles.wrapRow}>{chips}</View>
        </>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
          {chips}
        </ScrollView>
      )}

      {openKinds.length ? (
        <View style={styles.subMenu}>
          <Muted style={styles.subLabel}>Narrow it down</Muted>
          <View style={styles.wrapRow}>
            {openKinds.map((kind) => (
              <Tag
                key={kind}
                label={KIND_LABELS[kind]}
                noWrap
                variant={kinds.includes(kind) ? 'accent' : 'outline'}
                onPress={() => onToggleKind(kind)}
              />
            ))}
          </View>
        </View>
      ) : null}

      {groups.length || kinds.length ? (
        <Button
          label="Any diet"
          variant="ghost"
          fontSize={11}
          onPress={onClear}
          style={styles.clear}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inlineWrap: { marginTop: 10 },
  label: { marginBottom: space[2] },
  scrollRow: { gap: 6, paddingRight: space[3] },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  subMenu: { marginTop: 8 },
  subLabel: { fontSize: 10, marginBottom: 6 },
  clear: { alignSelf: 'flex-start', minHeight: 30, paddingHorizontal: 0, marginTop: 2 },
});
