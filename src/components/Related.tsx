/**
 * Where to go after this record.
 *
 * A record page used to end at its own sources, which is where an app ends and not
 * where a reference work does. This is the thing that turns eighteen thousand separate
 * pages into an atlas: every one of them points somewhere, and the pointing is made
 * entirely of facts the records already carry.
 *
 * ## The reason is not decoration
 *
 * Each suggestion says why it is there — "Also from Kerala", "Shares 3 ingredients" —
 * and that line is the difference between a related list and a recommendation. A
 * recommendation is a judgement about what a reader would enjoy, which this project has
 * no basis for making and no way to check. A stated overlap is a fact, verifiable
 * against both records in about a second.
 *
 * It also makes the list useful rather than decorative: a reader can tell at a glance
 * whether "also from Kerala" is the connection they wanted, or whether they were really
 * following the ghee.
 */

import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import type { Related as RelatedDish } from '../domain/related';
import { useLayout } from '../theme/layout';
import { color, font, radius, space } from '../theme/tokens';
import { Photo } from './Photo';
import { Pressable } from './Pressable';
import { H6, Muted, T } from './Text';

export function Related({ items }: { items: RelatedDish[] }) {
  const layout = useLayout();
  if (!items.length) return null;

  return (
    <View style={styles.wrap}>
      <H6>Related traditions</H6>
      <Muted style={styles.note}>
        Records sharing a place, a tradition or an ingredient with this one. Each says which.
      </Muted>

      <View style={styles.grid}>
        {items.map(({ dish, reason }) => (
          <Pressable
            key={dish.id}
            accessibilityRole="link"
            accessibilityLabel={`${dish.name}. ${reason}. ${dish.badgeLabel}`}
            tint="neutral"
            onPress={() => router.push(`/dish/${dish.id}`)}
            style={{ ...styles.card, width: layout.wide ? 168 : 132 }}
          >
            {/*
             * A record with no photograph still gets a card rather than being dropped.
             * More than half the atlas has no image, and a related list that silently
             * showed only the photographed ones would misrepresent what is nearby.
             */}
            {dish.photo ? (
              <Photo
                uri={dish.photo}
                credit={dish.credit}
                label={dish.name}
                style={{ ...styles.photo, width: layout.wide ? 168 : 132, height: layout.wide ? 112 : 88 }}
              />
            ) : (
              <View style={{ ...styles.blank, width: layout.wide ? 168 : 132, height: layout.wide ? 112 : 88 }} />
            )}

            <T style={styles.name} numberOfLines={2}>
              {dish.name}
            </T>
            <T style={styles.reason} numberOfLines={1}>
              {reason}
            </T>
            <Muted style={styles.badge} numberOfLines={1}>
              {dish.badgeIcon} {dish.score !== null ? `${dish.score}/100` : dish.badgeLabel}
            </Muted>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: space[8] },
  note: { fontSize: 12, lineHeight: 17, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: space[3] },
  card: { padding: 6, borderRadius: radius.md },
  photo: { borderRadius: radius.md },
  /* The ground, ruled. Not a monogram or an icon: a placeholder that draws something
     competes with the records that actually have a photograph. */
  blank: { borderRadius: radius.md, borderWidth: 1, borderColor: color.divider },
  name: { fontFamily: font.medium, fontSize: 12, lineHeight: 16, marginTop: 6, minHeight: 32 },
  reason: { fontSize: 11, color: color.accent },
  badge: { fontSize: 10, marginTop: 1 },
});
