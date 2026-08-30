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
import { useState } from 'react';
import { router, usePathname } from 'expo-router';
import { useCopy, type Copy } from '../i18n';
import { useLayout } from '../theme/layout';
import { color, font, space, TAP_TARGET } from '../theme/tokens';
import { IconButton } from './Button';
import { SearchIcon } from './icons';
import { LanguagePicker } from './LanguagePicker';
import { Pressable } from './Pressable';
import { SessionControl } from './SessionControl';
import { sectionOf } from './TopBar';
import { T } from './Text';
import { Wordmark } from './Wordmark';

/* The same six as the desktop bar and in the same order, so the two chromes describe one
   site. Built from copy rather than declared at module scope, because a module constant is
   evaluated before a reader has chosen a language. */
const linksFor = (copy: Copy): { label: string; to: string }[] => [
  { label: copy.howItWorks, to: '/how' },
  { label: copy.foodAtlas, to: '/atlas' },
  { label: copy.search, to: '/search' },
  { label: copy.proposeADish, to: '/propose' },
  { label: copy.confirm, to: '/proposals' },
  { label: copy.keepingItFree, to: '/support' },
];

/**
 * How large the name is set.
 *
 * Ajay: *"WikiFoodia looks a little smaller"*, then *"make the WikiFoodia same size as
 * landing page on all screens."* Measured on the phone landing page it was 20px against a
 * 29px headline directly beneath it — the product's own name set smaller than a sentence
 * about the product, which is what makes it read as an afterthought rather than a masthead.
 *
 * 26 everywhere. The first attempt kept inner screens at 20, on the reasoning that there
 * the name is a way back rather than the subject; Ajay's call is one size, and he is right
 * that a masthead which changes size between screens is not a masthead — it is two marks.
 *
 * Verified at the width where this could break: the row puts the name beside the language
 * picker and the search, and at 320px in Dutch — the widest label — it still clears.
 */
const MARK = 26;

export function SiteHeader() {
  const copy = useCopy();
  const { wide } = useLayout();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  /* TopBar owns this from tablet up, and two language pickers on one page is worse
     than none. */
  if (wide) return null;

  const here = sectionOf(path);
  const go = (to: string) => {
    setOpen(false);
    router.push(to);
  };

  return (
    <View style={styles.wrap}>
    <View role="banner" style={styles.bar}>
      {/*
       * The wordmark is the way home, which is the convention every site on the web
       * shares and the reason it is a control rather than a label. On the home page it
       * stays a label — a link to the page you are on is a dead end.
       */}
      {path === '/' ? (
        <Wordmark size={MARK} />
      ) : (
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={copy.backToTheFeed}
          tint="none"
          onPress={() => router.push('/')}
        >
          <Wordmark size={MARK} />
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

        <IconButton
          label={copy.menu}
          onPress={() => setOpen((was) => !was)}
          accessibilityState={{ expanded: open }}
        >
          {/*
           * Three rules, drawn rather than typed.
           *
           * The glyph everybody reaches for is ☰ (U+2630) — a trigram from the I Ching,
           * which most fonts set at a different weight and height from the text beside it
           * and which a screen reader may announce as "trigram for heaven". Three Views
           * cost nothing, sit exactly where they are put, and carry no meaning of their
           * own; the label above is what is announced.
           */}
          <View style={styles.glyph}>
            <View style={styles.rule} />
            <View style={styles.rule} />
            <View style={styles.rule} />
          </View>
        </IconButton>
      </View>
    </View>

    {open ? (
      <View role="navigation" style={styles.panel}>
        {linksFor(copy).map((link) => {
          const active = here === link.to;
          return (
            <Pressable
              key={link.to}
              accessibilityRole="link"
              accessibilityState={{ selected: active }}
              current={active}
              accessibilityLabel={link.label}
              tint="neutral"
              onPress={() => go(link.to)}
              style={styles.item}
            >
              {/* A bar at the leading edge rather than colour alone — colour is the one
                  channel some readers do not have, and this row is how they know which
                  section they are already in. */}
              <View style={active ? styles.mark : styles.markOff} />
              <T style={active ? styles.itemOn : styles.itemLabel}>{link.label}</T>
            </Pressable>
          );
        })}
        <View style={styles.divider} />
        <SessionControl />
      </View>
    ) : null}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[2],
    paddingTop: space[2],
    marginBottom: space[4],
  },
  controls: { flexDirection: 'row', alignItems: 'center', gap: space[1] },
  /* The positioning moved up here from `bar`, so the menu panel and the language panel
     share one stacking context and paint over the page rather than over each other. */
  wrap: { position: 'relative', zIndex: 100 },
  glyph: { width: 18, alignItems: 'center', gap: 4 },
  rule: { width: 16, height: 1.5, backgroundColor: color.accent, borderRadius: 1 },
  panel: {
    marginTop: -space[2],
    marginBottom: space[4],
    paddingBottom: space[2],
    borderBottomWidth: 1,
    borderBottomColor: color.divider,
  },
  item: { flexDirection: 'row', alignItems: 'center', gap: space[3], minHeight: TAP_TARGET },
  /* Reserved on every row rather than added to the current one, so opening the menu on one
     page does not indent the labels differently from another. */
  markOff: { width: 2, height: 18, backgroundColor: 'transparent', borderRadius: 1 },
  mark: { width: 2, height: 18, backgroundColor: color.accent, borderRadius: 1 },
  itemLabel: { fontSize: 15, color: color.neutral[100] },
  itemOn: { fontSize: 15, color: color.accent, fontFamily: font.medium },
  divider: { height: 1, backgroundColor: color.divider, marginVertical: space[2] },
});
