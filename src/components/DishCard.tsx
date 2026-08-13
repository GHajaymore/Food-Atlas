/**
 * The Feed's dish card, in two densities.
 *
 * **Full** — a curated record: photograph, badges, blurb, confidence score. The
 * footer row is where the product's stance is visible: the authenticity score sits
 * in accent-300, and the view count is the visually weakest element on the card.
 * That ordering is deliberate and should survive any redesign.
 *
 * **Compact** — an imported, unverified record. It has no method, no score and often
 * no photograph, so giving it a full card would dress up an absence of evidence as
 * content. A row states what we actually know — the dish and where it is from — and
 * nothing more. The visual difference between the two tiers is doing honest work.
 */

import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { dietLabel } from '../domain/diet';
import { mealLabel } from '../domain/meals';
import type { Dish } from '../domain/types';
import { accentText, color, elevation, radius, space } from '../theme/tokens';
import { Card } from './Card';
import { MapPinIcon } from './icons';
import { Photo } from './Photo';
import { Pressable } from './Pressable';
import { CardTitle, Muted, T } from './Text';
import { Tag } from './Tag';

interface Props {
  dish: Dish;
  showViews: boolean;
  /** Imported records default to the compact row. */
  compact?: boolean;
}

export function DishCard({ dish, showViews, compact }: Props) {
  const open = () => router.push(`/dish/${dish.id}`);

  if (compact) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${dish.name}, ${dish.badgeLabel}`}
        tint="neutral"
        onPress={open}
        style={styles.row}
      >
        <Photo uri={dish.photo} label={dish.name} style={styles.rowThumb} />
        <View style={styles.rowText}>
          <T style={styles.rowName} numberOfLines={1}>
            {dish.name}
          </T>
          <Muted style={styles.rowPlace} numberOfLines={1}>
            {dish.breadcrumb.join(' › ')}
          </Muted>
          <Muted style={styles.rowClass}>
            {dish.badgeIcon} {dish.badgeLabel}
          </Muted>
        </View>
      </Pressable>
    );
  }

  const scoreDisplay = dish.score == null ? 'Not classified' : `Authenticity ${dish.score}/100`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${dish.name}, ${dish.badgeLabel}`}
      tint="none"
      onPress={open}
      style={styles.press}
    >
      <Card style={styles.card} elevated>
        <View style={styles.photo}>
          <Photo uri={dish.photo} credit={dish.credit} label={dish.name} style={styles.photoFill} />
        </View>

        <View style={styles.body}>
          <View style={styles.badges}>
            <Tag label={`${dish.badgeIcon} ${dish.badgeLabel}`} variant="neutral" />
            {dish.atRisk ? <Tag label="🕯️ At-Risk Tradition" variant="outline" /> : null}
          </View>

          <CardTitle>{dish.name}</CardTitle>

          <View style={styles.meta}>
            <MapPinIcon size={12} color={color.meta} />
            <Muted style={styles.metaText}>{dish.breadcrumb.slice(-2).join(', ')}</Muted>
          </View>

          {/* The dietary read and the occasion, so a reader does not open a dish
              only to find out it is not for them or not for now. */}
          <Muted style={styles.diet}>
            {dietLabel(dish.diet)}
            {dish.meals.occasions.length ? ` · ${mealLabel(dish.meals)}` : ''}
          </Muted>

          <T style={styles.blurb}>{dish.blurb}</T>

          <View style={styles.footer}>
            <T style={styles.score}>{scoreDisplay}</T>
            {showViews && dish.views ? <Muted style={styles.views}>{dish.views}</Muted> : null}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { borderRadius: radius.md },
  card: { padding: 0, gap: 0, overflow: 'hidden', ...elevation.sm },
  photo: { width: '100%', aspectRatio: 16 / 10 },
  photoFill: { width: '100%', height: '100%' },
  body: { padding: space[3], gap: 6 },
  badges: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 11, color: color.meta, flex: 1 },
  diet: { fontSize: 11, marginTop: -2 },
  blurb: { fontSize: 13, lineHeight: 13 * 1.5, opacity: 0.8 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 },
  score: { fontSize: 12, color: accentText },
  views: { fontSize: 11 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 2,
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: color.divider,
  },
  rowThumb: { width: 48, height: 48, borderRadius: radius.sm },
  rowText: { flex: 1, minWidth: 0 },
  rowName: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  rowPlace: { fontSize: 11, lineHeight: 11 * 1.4 },
  rowClass: { fontSize: 11, lineHeight: 11 * 1.4 },
});
