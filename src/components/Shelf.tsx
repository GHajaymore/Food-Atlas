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

import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useLayout } from '../theme/layout';
import type { Shelf as ShelfData } from '../domain/shelves';
import { accentText, color, font, radius, space } from '../theme/tokens';
import { EvidenceBadge } from './EvidenceBadge';
import { Photo } from './Photo';
import { Pressable } from './Pressable';
import { H6, Muted, T } from './Text';

interface Props {
  shelf: ShelfData;
  /** 1-based position, for the staggered entrance. Web only; inert on native. */
  enter?: number;
  onOpenDish: (id: number) => void;
  /** Opens the whole shelf as a filtered list. */
  onOpenAll: (shelf: ShelfData) => void;
}

export function Shelf({ shelf, enter, onOpenDish, onOpenAll }: Props) {
  const remaining = shelf.total - shelf.dishes.length;
  const layout = useLayout();

  /*
   * Cards grow a little on a wide screen and the grid gets more of them per row.
   * 132 is a phone size — at desktop widths a row of 132px cards reads as a strip of
   * thumbnails rather than a grid of dishes, which is most of what made the wide
   * layout still feel like a phone.
   */
  const cardSize = layout.card;

  /*
   * A rail on a phone, a wrapping grid on anything wider.
   *
   * Sideways scrolling is a good trade on a touch screen — a rail shows a handful for
   * one screen-height where a list would cost twelve. With a mouse it is the opposite:
   * there is no gesture for it, the wheel scrolls the page instead, and the cards past
   * the fold are effectively hidden. The desktop has the room the rail was saving, so
   * it spends it.
   */
  const Rail = ({ children }: { children: React.ReactNode }) =>
    layout.wide ? (
      <View style={styles.grid}>{children}</View>
    ) : (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
        {children}
      </ScrollView>
    );

  /* Spread rather than passed: dataSet is a react-native-web extension the RN types do
     not carry. Same resolution Photo.tsx uses for its blend. */
  const enterProps: object =
    Platform.OS === 'web' && enter ? { dataSet: { enter: String(Math.min(enter, 6)) } } : {};

  return (
    <View {...enterProps} style={styles.wrap}>
      <View style={styles.header}>
        <H6 style={styles.title}>{shelf.title}</H6>
        {/*
         * "See all" as a header link on wide screens rather than a card at the end.
         *
         * As a card it cost a whole dish slot in every shelf — five of them on the front
         * page, each the size of a record, none of them a record. On a phone that is a
         * fair trade, because the rail scrolls sideways and the card is the thing your
         * thumb arrives at. In a grid it is just a hole, and putting the link where the
         * count already is costs no space at all.
         */}
        {layout.wide && remaining > 0 ? (
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`See all ${shelf.total} in ${shelf.title}`}
            tint="neutral"
            onPress={() => onOpenAll(shelf)}
            style={styles.headerLink}
          >
            <T style={styles.headerLinkLabel}>See all {shelf.total.toLocaleString()} →</T>
          </Pressable>
        ) : (
          <Muted style={styles.count}>{shelf.total.toLocaleString()}</Muted>
        )}
      </View>
      <Muted style={styles.note}>{shelf.note}</Muted>

      <Rail>
        {shelf.dishes.map((dish) => (
          <Pressable
            key={dish.id}
            accessibilityRole="button"
            accessibilityLabel={`${dish.name}, ${dish.badgeLabel}`}
            tint="neutral"
            onPress={() => onOpenDish(dish.id)}
            style={{ ...styles.card, width: cardSize }}
          >
            <Photo uri={dish.photo} credit={dish.credit} label={dish.name} style={{ ...styles.photo, width: cardSize, height: cardSize }} />
            <T style={styles.name} numberOfLines={2}>
              {dish.name}
            </T>
            <Muted style={styles.place} numberOfLines={1}>
              {dish.breadcrumb.slice(-1)[0] ?? dish.loc.country}
            </Muted>
            <EvidenceBadge icon={dish.badgeIcon} label={dish.badgeLabel} score={dish.score} />
          </Pressable>
        ))}

        {!layout.wide && remaining > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`See all ${shelf.total} in ${shelf.title}`}
            tint="accent"
            onPress={() => onOpenAll(shelf)}
            style={{ ...styles.more, width: cardSize, height: cardSize }}
          >
            <T style={styles.moreLabel}>See all</T>
            <Muted style={styles.moreCount}>{shelf.total.toLocaleString()}</Muted>
          </Pressable>
        ) : null}
      </Rail>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 26 },
  header: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: space[2] },
  title: { flex: 1 },
  count: { fontSize: 11, fontVariant: ['tabular-nums'] },
  note: { fontSize: 11, lineHeight: 11 * 1.5, marginTop: 2 },

  rail: { gap: 10, paddingTop: 10, paddingBottom: 4, paddingRight: space[3] },
  /* Same cards, allowed to wrap. Nothing about a card changes with the window. */
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingTop: 10, paddingBottom: 4 },
  /* Padding and a radius so the neutral hover tint reads as the card lighting up
     rather than as a rectangle appearing behind the text. */
  card: { padding: 6, borderRadius: radius.md },
  /* Dimensions come from the call site, which reads layout.card. Only the shape is
     declared here. */
  photo: { borderRadius: radius.md },
  // Two lines’ worth of height whether the title needs one or two, so the place and
  // the score line up across a rail. "Neapolitan Pizza Margherita" wraps and its
  // neighbours do not, which left three cards with their metadata at three heights.
  name: {
    fontFamily: font.medium,
    fontSize: 12,
    lineHeight: 12 * 1.3,
    marginTop: 6,
    minHeight: 12 * 1.3 * 2,
  },
  place: { fontSize: 11 },
  badge: { fontSize: 10 },

  // The doorway at the end of the rail.
  more: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  headerLink: { minHeight: 44, justifyContent: 'center', paddingLeft: space[3] },
  headerLinkLabel: { fontSize: 12, color: accentText },
  moreLabel: { fontFamily: font.heading, fontSize: 13, color: accentText },
  moreCount: { fontSize: 11, fontVariant: ['tabular-nums'] },
});
