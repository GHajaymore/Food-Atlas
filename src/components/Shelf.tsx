/**
 * A shelf — one horizontal rail of dishes.
 *
 * The form is the one the design already uses for its "Most popular worldwide" rail,
 * reused because it works: a photo, a name, one line of context, scrolled sideways.
 * A rail shows a handful and costs one screen-height, where a vertical list of the
 * same records costs twelve.
 *
 * Each rail ends in a card that opens the full filtered list, so a shelf is a
 * doorway rather than a dead end.
 */

import { ScrollView, StyleSheet, View } from 'react-native';
import type { Shelf as ShelfData } from '../domain/shelves';
import { accentText, color, font, radius, space } from '../theme/tokens';
import { Photo } from './Photo';
import { Pressable } from './Pressable';
import { H6, Muted, T } from './Text';

interface Props {
  shelf: ShelfData;
  onOpenDish: (id: number) => void;
  /** Opens the whole shelf as a filtered list. */
  onOpenAll: (shelf: ShelfData) => void;
}

export function Shelf({ shelf, onOpenDish, onOpenAll }: Props) {
  const remaining = shelf.total - shelf.dishes.length;

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <H6 style={styles.title}>{shelf.title}</H6>
        <Muted style={styles.count}>{shelf.total.toLocaleString()}</Muted>
      </View>
      <Muted style={styles.note}>{shelf.note}</Muted>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
        {shelf.dishes.map((dish) => (
          <Pressable
            key={dish.id}
            accessibilityRole="button"
            accessibilityLabel={`${dish.name}, ${dish.badgeLabel}`}
            tint="none"
            onPress={() => onOpenDish(dish.id)}
            style={styles.card}
          >
            <Photo uri={dish.photo} credit={dish.credit} label={dish.name} style={styles.photo} />
            <T style={styles.name} numberOfLines={2}>
              {dish.name}
            </T>
            <Muted style={styles.place} numberOfLines={1}>
              {dish.breadcrumb.slice(-1)[0] ?? dish.loc.country}
            </Muted>
            <Muted style={styles.badge} numberOfLines={1}>
              {dish.badgeIcon} {dish.score !== null ? `${dish.score}/100` : dish.badgeLabel}
            </Muted>
          </Pressable>
        ))}

        {remaining > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`See all ${shelf.total} in ${shelf.title}`}
            tint="accent"
            onPress={() => onOpenAll(shelf)}
            style={styles.more}
          >
            <T style={styles.moreLabel}>See all</T>
            <Muted style={styles.moreCount}>{shelf.total.toLocaleString()}</Muted>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}

const CARD = 132;

const styles = StyleSheet.create({
  wrap: { marginTop: 26 },
  header: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: space[2] },
  title: { flex: 1 },
  count: { fontSize: 11, fontVariant: ['tabular-nums'] },
  note: { fontSize: 11, lineHeight: 11 * 1.5, marginTop: 2 },

  rail: { gap: 10, paddingTop: 10, paddingBottom: 4, paddingRight: space[3] },
  card: { width: CARD },
  photo: { width: CARD, height: CARD, borderRadius: radius.md },
  name: { fontFamily: font.medium, fontSize: 12, lineHeight: 12 * 1.3, marginTop: 6 },
  place: { fontSize: 11 },
  badge: { fontSize: 10 },

  // The doorway at the end of the rail.
  more: {
    width: CARD,
    height: CARD,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  moreLabel: { fontFamily: font.heading, fontSize: 13, color: accentText },
  moreCount: { fontSize: 11, fontVariant: ['tabular-nums'] },
});
