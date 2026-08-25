/**
 * The meal-occasion control.
 *
 * A flat chip row — occasions do not nest the way diet does. "Celebration & feast",
 * "Any time" and "Not recorded" sit alongside the meal names on purpose: they are
 * the answers that keep the filter honest for traditions that do not belong to a
 * daily timetable.
 */

import { useCopy } from '../i18n';
import { ScrollView, StyleSheet, View } from 'react-native';
import { MEAL_LABELS, MEAL_MENU, type MealOccasion } from '../domain/meals';
import { space } from '../theme/tokens';
import { Button } from './Button';
import { H6 } from './Text';
import { Tag } from './Tag';

interface Props {
  selected: MealOccasion[];
  onToggle: (meal: MealOccasion) => void;
  onClear: () => void;
  variant?: 'facet' | 'inline';
}

export function MealFilter({ selected, onToggle, onClear, variant = 'inline' }: Props) {
  const copy = useCopy();
  const chips = MEAL_MENU.map((meal) => (
    <Tag
      key={meal}
      label={MEAL_LABELS[meal]}
      noWrap
      variant={selected.includes(meal) ? 'accent' : 'outline'}
      onPress={() => onToggle(meal)}
    />
  ));

  return (
    <View style={variant === 'facet' ? undefined : styles.inlineWrap}>
      {variant === 'facet' ? (
        <>
          <H6 style={styles.label}>{copy.whenItsEaten}</H6>
          <View style={styles.wrapRow}>{chips}</View>
        </>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
          {chips}
        </ScrollView>
      )}

      {selected.length ? (
        <Button label={copy.anyOccasion} variant="ghost" fontSize={11} onPress={onClear} style={styles.clear} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inlineWrap: { marginTop: 8 },
  label: { marginBottom: space[2] },
  scrollRow: { gap: 6, paddingRight: space[3] },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  clear: { alignSelf: 'flex-start', minHeight: 30, paddingHorizontal: 0, marginTop: 2 },
});
