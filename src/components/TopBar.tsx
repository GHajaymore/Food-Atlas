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
import { useLayout } from '../theme/layout';
import { color, font, PAGE_PADDING, space, TAP_TARGET } from '../theme/tokens';
import { LanguagePicker } from './LanguagePicker';
import { Pressable } from './Pressable';
import { SessionControl } from './SessionControl';
import { T } from './Text';
import { Wordmark } from './Wordmark';

const LINKS: { label: string; to: string }[] = [
  { label: 'How it works', to: '/how' },
  { label: 'Food Atlas', to: '/atlas' },
  { label: 'Search', to: '/search' },
  { label: 'Propose a dish', to: '/propose' },
  { label: 'Confirm', to: '/proposals' },
  { label: 'Keeping it free', to: '/support' },
];

export function TopBar() {
  const layout = useLayout();
  const path = usePathname();

  if (!layout.wide) return null;

  return (
    <View style={styles.bar}>
      <View style={[styles.inner, { maxWidth: layout.shell }]}>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="WikiFoodia — back to the atlas"
          tint="none"
          onPress={() => router.push('/')}
          style={styles.brand}
        >
          <Wordmark size={19} />
        </Pressable>

        <View style={styles.links}>
          {LINKS.map((link) => {
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
  inner: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: PAGE_PADDING * 2,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[6],
  },
  brand: { justifyContent: 'center', minHeight: TAP_TARGET },
  links: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  link: {
    minHeight: TAP_TARGET,
    justifyContent: 'center',
    paddingHorizontal: space[3],
  },
  label: { fontSize: 13, color: color.muted },
  labelOn: { fontSize: 13, color: color.accent, fontFamily: font.medium },
});
