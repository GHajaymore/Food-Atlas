/**
 * The Feed's dish card, in two densities.
 *
 * **Full** — a curated record: photograph, badges, blurb, confidence score. The
 * footer row is where the product's stance is visible: the score carries the heading
 * face beside its classification glyph, and the view count is the visually weakest
 * element on the card. That ordering is deliberate and should survive any redesign.
 * (It once read as a 12px accent sentence, "Authenticity 94/100" — same information,
 * the weight of a caption. Both densities now use `EvidenceBadge`.)
 *
 * **Compact** — an imported, unverified record. It has no method, no score and often
 * no photograph, so giving it a full card would dress up an absence of evidence as
 * content. A row states what we actually know — the dish and where it is from — and
 * nothing more. The visual difference between the two tiers is doing honest work.
 */

import { useCopy, useLocale } from '../i18n';
import { placeName } from '../domain/continents';
import { levelLabel } from '../domain/authenticity';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { dietLabel } from '../domain/diet';
import { mealLabel } from '../domain/meals';
import type { Dish } from '../domain/types';
import { color, elevation, radius, space } from '../theme/tokens';
import { Card } from './Card';
import { MapPinIcon } from './icons';
import { EvidenceBadge } from './EvidenceBadge';
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
  const copy = useCopy();
  const locale = useLocale((state) => state.locale);
  const open = () => router.push(`/dish/${dish.id}`);

  if (compact) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${dish.name}, ${levelLabel(copy, dish.badgeLevel)}`}
        tint="neutral"
        onPress={open}
        style={styles.row}
      >
        {/* Only where there is an image. A monogram tile beside every row is visual
            noise that carries no information. */}
        {dish.photo ? <Photo uri={dish.photo} label={dish.name} style={styles.rowThumb} /> : null}
        <View style={styles.rowText}>
          <T style={styles.rowName} numberOfLines={1}>
            {dish.name}
          </T>
          <Muted style={styles.rowPlace} numberOfLines={1}>
            {dish.breadcrumb.map((step) => placeName(step, copy, locale)).join(' › ')}
          </Muted>
          {/*
           * The evidence, at the weight it deserves rather than as a third line of grey.
           *
           * This row is what a reader meets 10,000 times while browsing, and the score
           * was set in the same muted 11px as the breadcrumb above it — indistinguishable
           * from metadata, when it is the one thing on the card no other food site could
           * print.
           */}
          <View style={styles.rowEvidence}>
            <EvidenceBadge icon={dish.badgeIcon} label={levelLabel(copy, dish.badgeLevel)} score={dish.score} size="row" />
            {dish.atRisk ? <Muted style={styles.rowRisk}>{copy.tagAtRiskShort}</Muted> : null}
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${dish.name}, ${levelLabel(copy, dish.badgeLevel)}`}
      tint="neutral"
      onPress={open}
      style={styles.press}
    >
      <Card style={styles.card} elevated>
        <View style={styles.photo}>
          <Photo uri={dish.photo} credit={dish.credit} label={dish.name} style={styles.photoFill} />
        </View>

        <View style={styles.body}>
          <View style={styles.badges}>
            <Tag label={`${dish.badgeIcon} ${levelLabel(copy, dish.badgeLevel)}`} variant="neutral" />
            {dish.atRisk ? <Tag label={copy.tagAtRiskTradition} variant="outline" /> : null}
          </View>

          <CardTitle>{dish.name}</CardTitle>

          <View style={styles.meta}>
            <MapPinIcon size={12} color={color.meta} />
            <Muted style={styles.metaText}>{dish.breadcrumb.slice(-2).map((step) => placeName(step, copy, locale)).join(', ')}</Muted>
          </View>

          {/* The dietary read and the occasion, so a reader does not open a dish
              only to find out it is not for them or not for now. */}
          <Muted style={styles.diet}>
            {dietLabel(copy, dish.diet)}
            {dish.meals.occasions.length ? ` · ${mealLabel(dish.meals)}` : ''}
          </Muted>

          <T style={styles.blurb}>{dish.blurb}</T>

          <View style={styles.footer}>
            {/*
             * The same badge the rails use, rather than this card's own sentence.
             *
             * It read "Authenticity 94/100" at 12px in accent — a line of text in the
             * weakest position on the card, in the same register as a view count. That
             * is the thing the positioning brief names: the difference existed and was
             * rendered as metadata. `EvidenceBadge` gives the figure the heading face
             * and puts the classification glyph beside it, so a reader scanning a grid
             * picks up the scale without reading anything.
             *
             * The label is dropped at this size because the tag at the top of the card
             * already carries the classification in words; what is missing down here is
             * the number.
             */}
            <EvidenceBadge icon={dish.badgeIcon} label={levelLabel(copy, dish.badgeLevel)} score={dish.score} />
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
  rowEvidence: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 2 },
  rowRisk: { fontSize: 11 },
});
