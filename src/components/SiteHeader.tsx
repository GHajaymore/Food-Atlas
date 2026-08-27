/**
 * The wordmark, the language and the search, on every screen a phone can reach.
 *
 * Ajay: *"keep the WikiFoodia top section intact on all screens."* He is right, and the
 * gap was worse than untidy. Measured on the live site at 375px, `/atlas` opened straight
 * into "Food Atlas" with **no wordmark and no language control anywhere on the page** —
 * so a reader who arrived on any inner screen could not tell what site they were on, and
 * could not change language without finding their way back to the home page first.
 *
 * Twelve translations exist precisely so that reader does not have to read English, and
 * they were unreachable from every screen but one.
 *
 * ## Rendered from `Screen`, for the reason the footer is
 *
 * `SiteFooter` is rendered from `Screen` so that no page can lack one, and this is the
 * same argument at the other end of the page: a header that each screen has to remember
 * to include is a header some screen will forget. `/atlas` is the proof — it had a
 * heading and a nav row and nobody noticed the brand was missing.
 *
 * ## Phones only, deliberately
 *
 * `TopBar` already does this job from the tablet breakpoint up, with the links beside it.
 * Rendering both would put two language pickers on one page.
 */

import { StyleSheet, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import { useCopy } from '../i18n';
import { useLayout } from '../theme/layout';
import { color, space } from '../theme/tokens';
import { IconButton } from './Button';
import { SearchIcon } from './icons';
import { LanguagePicker } from './LanguagePicker';
import { Pressable } from './Pressable';
import { Wordmark } from './Wordmark';

export function SiteHeader() {
  const copy = useCopy();
  const { wide } = useLayout();
  const path = usePathname();

  /* TopBar owns this from tablet up, and two language pickers on one page is worse
     than none. */
  if (wide) return null;

  return (
    <View style={styles.bar}>
      {/*
       * The wordmark is the way home, which is the convention every site on the web
       * shares and the reason it is a control rather than a label. On the home page it
       * stays a label — a link to the page you are on is a dead end.
       */}
      {path === '/' ? (
        <Wordmark size={20} />
      ) : (
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={copy.backToTheFeed}
          tint="none"
          onPress={() => router.push('/')}
        >
          <Wordmark size={20} />
        </Pressable>
      )}

      <View style={styles.controls}>
        <LanguagePicker compact />
        {/* Not on the search screen itself, where it would offer the page you are on. */}
        {path === '/search' ? null : (
          <IconButton label={copy.search} onPress={() => router.push('/search')}>
            <SearchIcon size={18} color={color.accent} />
          </IconButton>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /*
   * Positioned and raised, so the language panel paints over the page rather than behind
   * it. The same fix `app/index.tsx` needed and for the same reason: react-native-web puts
   * `position: relative` on every View, so each is its own stacking context and a nested
   * z-index cannot reach past its parent.
   */
  bar: {
    position: 'relative',
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[2],
    paddingTop: space[2],
    marginBottom: space[4],
  },
  controls: { flexDirection: 'row', alignItems: 'center', gap: space[1] },
});
