/**
 * The desktop header.
 *
 * On a phone this app navigates the way phones do: a back button on every screen and a
 * colophon at the foot of the feed. That is right for a thumb and wrong for a mouse.
 * On a wide screen the absence of a persistent header is the single loudest signal that
 * something is a phone app someone has stretched — every reference work on the web has
 * a masthead, and a reader arriving on a dish page from a search engine has no other
 * way of knowing what site they are on.
 *
 * So this renders only above `BREAKPOINT.tablet` and `SiteNav` keeps the foot of the
 * feed below it. Both routes exist at every size; only the furniture changes.
 *
 * ## The mark is the way home
 *
 * Clicking the wordmark returns to the atlas, because that is what clicking a masthead
 * does everywhere and a reader should not have to learn otherwise. It is a `link` role
 * rather than a button so a screen reader announces it as navigation.
 *
 * ## Why the current route is marked
 *
 * A header that never changes tells a reader nothing about where they are. The active
 * item takes the accent and the others stay muted — the same distinction the badges
 * use, so the page has one visual language rather than two.
 */

import { router, usePathname } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useCopy, type Copy } from '../i18n';
import { useLayout } from '../theme/layout';
import { color, font, PAGE_PADDING, space, TAP_TARGET } from '../theme/tokens';
import { LanguagePicker } from './LanguagePicker';
import { Pressable } from './Pressable';
import { SessionControl } from './SessionControl';
import { T } from './Text';
import { Wordmark } from './Wordmark';

/* Built from the copy rather than declared once at module scope, because a module
   constant is evaluated before a reader has chosen a language and would keep the
   English labels for the rest of the session. */
const linksFor = (copy: Copy): { label: string; to: string }[] => [
  { label: copy.howItWorks, to: '/how' },
  { label: copy.foodAtlas, to: '/atlas' },
  { label: copy.search, to: '/search' },
  { label: copy.proposeADish, to: '/propose' },
  { label: copy.confirm, to: '/proposals' },
  { label: copy.keepingItFree, to: '/support' },
];

export function TopBar() {
  const copy = useCopy();
  const links = linksFor(copy);
  const layout = useLayout();
  const path = usePathname();

  if (!layout.wide) return null;

  return (
    <View role="navigation" style={styles.bar}>
      <View style={[styles.inner, { maxWidth: layout.shell }]}>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`WikiFoodia — ${copy.backToTheAtlas}`}
          tint="none"
          onPress={() => router.push('/')}
          style={styles.brand}
        >
          <Wordmark size={19} />
        </Pressable>

        <View style={styles.links}>
          {links.map((link) => {
            const active = path === link.to;
            return (
              <Pressable
                key={link.to}
                accessibilityRole="link"
                accessibilityState={{ selected: active }}
                accessibilityLabel={link.label}
                tint="neutral"
                onPress={() => router.push(link.to)}
                style={styles.link}
              >
                <T style={active ? styles.labelOn : styles.label}>{link.label}</T>
              </Pressable>
            );
          })}
          <SessionControl compact />
          <LanguagePicker compact />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /*
   * A hairline rather than a shadow. Elevation on this ground is "a hairline edge plus
   * ambient darkness" — a drop shadow under a header would be the first shadow in the
   * app and would read as borrowed from somewhere else.
   */
  bar: {
    borderBottomWidth: 1,
    borderBottomColor: color.divider,
    backgroundColor: color.bg,
    /*
     * Above the page, and this is load-bearing rather than tidy.
     *
     * `TopBar` renders before `<Stack>` in the root layout, so without a stacking
     * context of its own every screen paints over it in DOM order. The language
     * dropdown was the visible casualty: it opened at the right size in the right
     * place, was clipped by nothing, and could not be seen, because the page's own
     * buttons were drawn on top of it. `elementFromPoint` in the middle of the open
     * list returned "How it gets authenticated".
     *
     * A z-index needs a position to take effect, so `relative` is here to make the
     * z-index mean anything rather than to move the bar.
     *
     * Worth remembering: an element's geometry says nothing about whether a reader can
     * see it. Measuring `getBoundingClientRect` said the dropdown was fine twice.
     */
    position: 'relative',
    zIndex: 100,
  },
  /*
   * The bar wraps rather than overflowing, and the height is a floor rather than a fact.
   *
   * Measured at 768 — an iPad held upright, and the narrowest width this bar renders at:
   * the links needed 683px and had 569, so the page scrolled 74px sideways. It had been
   * doing that since the header was written. `SessionControl` renders nothing until
   * Google OAuth is configured, so the live figure is the *best* case; switching sign-in
   * on makes it worse.
   *
   * Three fixes were considered and rejected. Dropping links at this width makes routes
   * unreachable — `SiteNav` is phone-only, so there would be nowhere else to reach them
   * from, which is the exact failure that put this header here. Shrinking the type and
   * padding recovers about 90 of the 114px needed and spends tap target to do it. A
   * width threshold to stack at is guesswork in any language but English: the German
   * labels are longer, and the number would be right for one of twelve.
   *
   * Wrapping asks the browser the question instead of answering it. The links move to
   * their own line exactly when they do not fit beside the mark, in whatever language,
   * at whatever width — and `links` wraps internally too, so even a width narrower than
   * one row of labels degrades to two rows rather than off the side of the page.
   *
   * `height: 60` became `minHeight`. A fixed height with wrapping content is a second
   * row drawn outside its own bar, under the page rather than above it.
   */
  inner: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: PAGE_PADDING * 2,
    minHeight: 60,
    paddingVertical: space[2],
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[6],
    rowGap: space[2],
  },
  brand: { justifyContent: 'center', minHeight: TAP_TARGET },
  /*
   * `flexShrink` and `minWidth` are why the internal wrap actually happens.
   *
   * With `flexWrap` alone this row moved to its own line and then stayed at its
   * max-content width — 852px of German labels on a 688px line, still off the side of the
   * page. A flex item is sized to its content unless it is allowed to shrink, and its
   * automatic minimum keeps it at min-content, so both are needed: `flexShrink` lets the
   * line squeeze it, `minWidth: 0` lets that squeeze go past one label's width, and the
   * `flexWrap` above then takes the labels onto a second row.
   *
   * German is the case that found this. English fits one row at every width this bar
   * renders at, so testing in English only would have shipped it looking fixed.
   */
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space[2],
    flexShrink: 1,
    minWidth: 0,
  },
  link: {
    minHeight: TAP_TARGET,
    justifyContent: 'center',
    paddingHorizontal: space[3],
  },
  label: { fontSize: 13, color: color.muted },
  labelOn: { fontSize: 13, color: color.accent, fontFamily: font.medium },
});
