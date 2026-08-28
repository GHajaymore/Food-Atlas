/**
 * One large photograph, near the top of a phone.
 *
 * The atlas holds 3,055 photographs and was showing every one of them at 132px, in a rail
 * that began 1,167px down the page. A reader opened it and met a wall of text. This is the
 * single change that most answers *"make it look like an app"*: something to look at,
 * immediately, at a size that respects the picture.
 *
 * ## Built as a card, because everything else here is
 *
 * The first version was a bare photograph with the name and place loose underneath, and it
 * read as unfinished next to the rest of the app — every other surface that holds a record
 * is a `Card`: a filled surface, a hairline edge, the photograph flush to the top corners
 * and the text inside padding. Ajay called it out as needing a more polished approach and
 * he was right; the polish was already in the design system and this was sitting outside
 * it.
 *
 * So it uses the same treatment `DishCard` does, at hero scale: photograph flush, body
 * padded, one meta row rather than four stacked lines, and the credit as the quietest
 * thing on the card rather than a fifth line competing with the place.
 *
 * ## It is not an editorial pick
 *
 * The record shown is the first of the first shelf — whatever `buildShelves` already
 * decided to lead with, which on a phone is usually the reader's own country. Nothing here
 * chooses a favourite dish, and nothing here can: an atlas that promoted a record on
 * anything other than its evidence would be making exactly the claim it refuses to make
 * everywhere else.
 *
 * Which is also why the badge comes with it. A hero photograph with no score would be the
 * one place in the app where a picture is offered without the evidence behind it.
 *
 * ## Why the dish is removed from the rail behind it
 *
 * `shelves.ts` records that two records sharing one picture on the same rail *"looked like
 * a rendering bug"*. The same photograph twice within three hundred pixels would look like
 * one, so the screen passes the rail everything except this record.
 */

import { useCopy, useLocale } from '../i18n';
import { placeName } from '../domain/continents';
import { levelLabel } from '../domain/authenticity';
import { cardPlace } from '../domain/place';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import type { Dish } from '../domain/types';
import { color, elevation, font, radius, space } from '../theme/tokens';
import { Card } from './Card';
import { EvidenceBadge } from './EvidenceBadge';
import { MapPinIcon } from './icons';
import { Photo } from './Photo';
import { Pressable } from './Pressable';
import { Muted, T } from './Text';

export function LeadDish({ dish }: { dish: Dish | undefined }) {
  const copy = useCopy();
  const locale = useLocale((state) => state.locale);
  /* No photograph, no hero. More than half the atlas has no image, and a monogram at this
     size would spend the best position on the page saying nothing. */
  if (!dish?.photo) return null;

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${dish.name}, ${placeName(cardPlace(dish.breadcrumb, dish.loc.country), copy, locale)}. ${levelLabel(copy, dish.badgeLevel)}`}
      tint="none"
      onPress={() => router.push(`/dish/${dish.id}`)}
      style={styles.press}
    >
      <Card style={styles.card} elevated>
        {/* Flush to the top corners, which is what `overflow: hidden` on the card is for.
            A photograph inset inside padding reads as an illustration rather than a
            record. */}
        <View style={styles.frame}>
          <Photo uri={dish.photo} credit={dish.credit} label={dish.name} style={styles.photo} hideCredit width={1200} />
        </View>

        <View style={styles.body}>
          <T style={styles.name} numberOfLines={2}>
            {dish.name}
          </T>

          {/*
           * Place and evidence on one row rather than two stacked lines.
           *
           * They answer the two halves of the same question — where is this from, and how
           * much do we actually know — and reading them together is the point of the card.
           */}
          <View style={styles.meta}>
            <MapPinIcon size={12} color={color.meta} />
            <Muted style={styles.place} numberOfLines={1}>
              {placeName(cardPlace(dish.breadcrumb, dish.loc.country), copy, locale)}
            </Muted>
            <View style={styles.spacer} />
            <EvidenceBadge icon={dish.badgeIcon} label={levelLabel(copy, dish.badgeLevel)} score={dish.score} size="row" />
          </View>

          {dish.blurb ? (
            <T style={styles.blurb} numberOfLines={2}>
              {dish.blurb}
            </T>
          ) : null}

          {/* The quietest line on the card. A photograph this size with its attribution
              burned into the corner reads as stock imagery. */}
          <Muted style={styles.credit} numberOfLines={1}>
            {copy.photoVia} {dish.credit}
          </Muted>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  /* 12px from the paragraph above it, measured, which reads as the next line rather than
     the next section. `space[8]` is 22px and matches the rhythm the shelves below use. */
  press: { marginTop: space[8], borderRadius: radius.lg },
  card: { padding: 0, gap: 0, overflow: 'hidden', borderRadius: radius.lg, ...elevation.sm },
  frame: { width: '100%', aspectRatio: 16 / 10 },
  photo: { width: '100%', height: '100%' },
  body: { padding: space[4], gap: 6 },
  name: { fontFamily: font.display, fontSize: 21, lineHeight: 26, color: color.text },
  /*
   * The row wraps rather than crushing the place.
   *
   * Place and evidence share a line because reading them together is the point of the
   * card. At 375 they both fit; at 320 they do not, and flex resolved that by shrinking
   * the only shrinkable thing — the hero card, the most prominent thing on the front page,
   * read "United Sta…" under a photograph. Measured: a 54px box for text needing 76.
   *
   * Wrapping costs a line on a small phone and nothing at all above it, where the row
   * still fits. Truncating a place name costs the reader the answer to the one question
   * the card exists to answer.
   */
  meta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6, rowGap: 4 },
  place: { fontSize: 12, color: color.meta, flexShrink: 1 },
  spacer: { flex: 1 },
  blurb: { fontSize: 13, lineHeight: 19, opacity: 0.8, marginTop: 2 },
  credit: { fontSize: 10, color: color.meta, marginTop: space[2] },
});
