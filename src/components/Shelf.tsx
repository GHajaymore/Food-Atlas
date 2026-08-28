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

import { levelLabel } from '../domain/authenticity';
import { placeName } from '../domain/continents';
import { cardPlace } from '../domain/place';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useLayout } from '../theme/layout';
import { useReveal } from '../theme/reveal';
import type { Shelf as ShelfData } from '../domain/shelves';
import { accentText, color, font, radius, space } from '../theme/tokens';
import { EvidenceBadge } from './EvidenceBadge';
import { Photo } from './Photo';
import { Pressable } from './Pressable';
import { H4, Muted, T } from './Text';
import { shelfLabel } from '../domain/shelves';
import { useCopy, useNumber, useLocale } from '../i18n';

interface Props {
  shelf: ShelfData;
  onOpenDish: (id: number) => void;
  /** Opens the whole shelf as a filtered list. */
  onOpenAll: (shelf: ShelfData) => void;
}

export function Shelf({ shelf, onOpenDish, onOpenAll }: Props) {
  const copy = useCopy();
  const locale = useLocale((state) => state.locale);
  const n = useNumber();
  const label = shelfLabel(copy, shelf, locale);
  const remaining = shelf.total - shelf.dishes.length;
  const layout = useLayout();

  /*
   * Cards grow a little on a wide screen and the grid gets more of them per row.
   * 132 is a phone size — at desktop widths a row of 132px cards reads as a strip of
   * thumbnails rather than a grid of dishes, which is most of what made the wide
   * layout still feel like a phone.
   */
  const cardSize = layout.card;
  /* The type that goes with that card. Both come from `layout` so a card and its name
     cannot be resized independently of each other. */
  const cardText = layout.cardType;

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

  /* Reveals when the reader reaches it. Returns nothing on native and on a browser with
     no IntersectionObserver, so there is no platform branch here. */
  const reveal = useReveal();

  return (
    <View {...reveal} style={{ ...styles.wrap, marginTop: layout.sectionGap }}>
      <View style={styles.header}>
        <H4 style={styles.title}>{label.title}</H4>
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
            accessibilityLabel={`${copy.seeAll} ${shelf.total} · ${label.title}`}
            tint="neutral"
            onPress={() => onOpenAll(shelf)}
            style={styles.headerLink}
          >
            <T style={styles.headerLinkLabel}>
              {copy.seeAll} {n(shelf.total)} →
            </T>
          </Pressable>
        ) : (
          <Muted style={styles.count}>{n(shelf.total)}</Muted>
        )}
      </View>
      <Muted style={styles.note}>{label.note}</Muted>

      <Rail>
        {shelf.dishes.map((dish) => (
          <Pressable
            key={dish.id}
            accessibilityRole="button"
            accessibilityLabel={`${dish.name}, ${levelLabel(copy, dish.badgeLevel)}`}
            tint="neutral"
            onPress={() => onOpenDish(dish.id)}
            style={{ ...styles.card, width: cardSize }}
          >
            <Photo uri={dish.photo} credit={dish.credit} label={dish.name} style={{ ...styles.photo, width: cardSize, height: cardSize }} width={Math.round(cardSize * 2)} />
            {/* Size and the two-line floor come from the card, so a wider card gets a
                larger name rather than the same name with more room around it. */}
            <T
              style={{
                ...styles.name,
                fontSize: cardText.name,
                lineHeight: cardText.name * 1.3,
                minHeight: cardText.name * 1.3 * 2,
              }}
              numberOfLines={2}
            >
              {dish.name}
            </T>
            <Muted style={{ ...styles.place, fontSize: cardText.place }} numberOfLines={1}>
              {placeName(cardPlace(dish.breadcrumb, dish.loc.country), copy, locale)}
            </Muted>
            <EvidenceBadge icon={dish.badgeIcon} label={levelLabel(copy, dish.badgeLevel)} score={dish.score} />
          </Pressable>
        ))}

        {!layout.wide && remaining > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${copy.seeAll} ${shelf.total} · ${label.title}`}
            tint="accent"
            onPress={() => onOpenAll(shelf)}
            style={{ ...styles.more, width: cardSize, height: cardSize }}
          >
            <T style={styles.moreLabel}>{copy.seeAll}</T>
            <Muted style={styles.moreCount}>{n(shelf.total)}</Muted>
          </Pressable>
        ) : null}
      </Rail>
    </View>
  );
}

const styles = StyleSheet.create({
  /* `marginTop` comes from `layout.sectionGap` at the call site. It was a flat 26 at every
     width, which on a desktop separated rails a thousand pixels tall by two and a half per
     cent of their own height — the phone's rhythm on a page with room for its own. */
  wrap: {},
  header: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: space[2] },
  /*
   * A heading, not an eyebrow.
   *
   * This was `H6` — the 13px uppercase tracked label — which put every section heading
   * on the front page below the size of the body text. Measured at 1440 the page ran a
   * 71px headline, five 37px figures, and then nothing at all until 19px: the whole
   * middle of the scale was empty, which is the "h2, h3 and h4 barely appear" in the
   * original diagnosis, still true after the type work.
   *
   * The rails are the spine of this page. Their titles are how a reader finds their way
   * down it, and `H4` puts them where the structure actually sits — 20 on a phone, 25.6
   * once `wideType` opens the scale up. It also drops the last uppercase-tracked eyebrow
   * from the front page, which is worth losing on its own: that device is one of the
   * house styles the brief asked this app not to look like.
   */
  title: { flex: 1 },
  count: { fontSize: 11, fontVariant: ['tabular-nums'] },
  note: { fontSize: 12, lineHeight: 12 * 1.5, marginTop: 3 },

  rail: { gap: 10, paddingTop: 10, paddingBottom: 4, paddingRight: space[3] },
  /* Same cards, allowed to wrap. Nothing about a card changes with the window. */
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingTop: 10, paddingBottom: 4 },
  /* Padding and a radius so the neutral hover tint reads as the card lighting up
     rather than as a rectangle appearing behind the text. */
  card: { padding: 6, borderRadius: radius.md },
  /* Dimensions come from the call site, which reads layout.card. Only the shape is
     declared here. */
  photo: { borderRadius: radius.md },
  /*
   * The display face, as `tokens.ts` has always said a dish name should take — the rails
   * were the one place in the app that named a dish in the interface face, and the rails
   * are most of what the front page is.
   *
   * Size, line height and the two-line floor all come from `layout.cardType` at the call
   * site rather than from here, because a card that is wider on a desktop should carry a
   * larger name and not the same name with more space around it. The floor is still two
   * lines' worth whether the title needs one or two, so the place and the score line up
   * across a rail: "Neapolitan Pizza Margherita" wraps and its neighbours do not, which
   * left three cards with their metadata at three heights.
   */
  name: { fontFamily: font.display, marginTop: 6 },
  place: {},
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
