/**
 * One large photograph, near the top of a phone.
 *
 * The atlas holds 3,055 photographs and was showing every one of them at 132px, in a rail
 * that began 1,167px down the page. A reader opened it and met a wall of text. This is the
 * single change that most answers *"make it look like an app"*: something to look at,
 * immediately, at a size that respects the picture.
 *
 * ## It is not an editorial pick
 *
 * The record shown is the first of the first shelf — whatever `buildShelves` already
 * decided to lead with, which on a phone is usually the reader's own country. Nothing here
 * chooses a favourite dish, and nothing here can: an atlas that promotes a record on
 * anything other than its evidence would be making exactly the claim it refuses to make
 * everywhere else.
 *
 * Which is also why the badge comes with it. A hero photograph with no score would be the
 * one place in the app where a picture is offered without the evidence behind it, and the
 * hero size of `EvidenceBadge` exists for this.
 *
 * ## Why the dish is removed from the rail behind it
 *
 * `shelves.ts` records that two records sharing one picture on the same rail *"looked like
 * a rendering bug"*. The same photograph twice within three hundred pixels would look like
 * one, so the screen passes the rail everything except this record.
 */

import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import type { Dish } from '../domain/types';
import { color, font, radius, space } from '../theme/tokens';
import { EvidenceBadge } from './EvidenceBadge';
import { Photo } from './Photo';
import { Pressable } from './Pressable';
import { Muted, T } from './Text';

export function LeadDish({ dish }: { dish: Dish | undefined }) {
  /* No photograph, no hero. More than half the atlas has no image, and a monogram at this
     size would spend the best position on the page saying nothing. */
  if (!dish?.photo) return null;

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${dish.name}, ${dish.breadcrumb.slice(-1)[0] ?? dish.loc.country}. ${dish.badgeLabel}`}
      tint="neutral"
      onPress={() => router.push(`/dish/${dish.id}`)}
      style={styles.wrap}
    >
      <Photo uri={dish.photo} credit={dish.credit} label={dish.name} style={styles.photo} hideCredit />

      <View style={styles.body}>
        <T style={styles.name} numberOfLines={2}>
          {dish.name}
        </T>
        <Muted style={styles.place} numberOfLines={1}>
          {dish.breadcrumb.slice(-1)[0] ?? dish.loc.country}
        </Muted>
        <View style={styles.badge}>
          <EvidenceBadge icon={dish.badgeIcon} label={dish.badgeLabel} score={dish.score} size="row" />
        </View>
        {/* The credit stays, moved under the frame rather than over it. A photograph this
            size with its attribution burned into the corner reads as stock imagery. */}
        <Muted style={styles.credit} numberOfLines={1}>
          photo via {dish.credit}
        </Muted>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: space[4], borderRadius: radius.lg, overflow: 'hidden' },
  /* 16:10 rather than square. A square at full width costs 335px of a 812px screen and
     pushes the first rail back below the fold, which is the problem this is solving. */
  photo: { width: '100%', aspectRatio: 16 / 10, borderRadius: radius.lg },
  body: { paddingTop: space[3], gap: 2 },
  name: { fontFamily: font.heading, fontSize: 20, lineHeight: 25, color: color.text },
  place: { fontSize: 13 },
  badge: { marginTop: space[2] },
  credit: { fontSize: 10, color: color.meta, marginTop: space[2] },
});
