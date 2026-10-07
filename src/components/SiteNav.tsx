/**
 * The way to the rest of the app.
 *
 * Found by auditing what a reader can actually reach. From the feed there were exactly
 * three routes out — search, the place picker, and a dish — and the app's own pages
 * were unreachable from its front door:
 *
 *   /atlas      only from contribute, search and support
 *   /contribute only from atlas, search, support and a dish
 *   /support    only from /atlas, so two levels deep
 *
 * Which means the page explaining that the project is free and takes no money could
 * only be found by somebody who had already gone looking for it twice. Every screen
 * had a back button, every link resolved, nothing was broken — and there was still no
 * navigation, because a set of correct one-way links is not the same as a way around.
 *
 * ## Why a footer and not a tab bar
 *
 * A tab bar claims these are peers of the food, and they are not. Nobody opens an atlas
 * of eighteen thousand dishes to read the funding page. They are the colophon of a
 * reference work: present, findable, and at the end — after the reader has seen what
 * the thing actually is.
 */

import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { usePendingProposals } from '../data/pending';
import { useCopy, type Copy } from '../i18n';
import { useLayout } from '../theme/layout';
import { accentAlpha, accentText, color, font, space, TAP_TARGET } from '../theme/tokens';
import { Pressable } from './Pressable';
import { SessionControl } from './SessionControl';
import { T } from './Text';

const linksFor = (copy: Copy): { label: string; to: string; note: string }[] => [
  { label: copy.foodAtlas, to: '/atlas', note: copy.navAtlasNote },
  { label: copy.proposeADish, to: '/propose', note: copy.navProposeNote },
  /*
   * Listed separately from proposing, because they are different acts and the second is
   * the one in short supply. Anybody can describe a dish they know; a proposal only
   * moves when somebody *else* recognises it, and a reader who never sees the open list
   * has no way to discover that confirming is a thing they could do.
   */
  { label: copy.confirmAProposal, to: '/proposals', note: copy.navConfirmNote },
  { label: copy.keepingItFree, to: '/support', note: copy.navSupportNote },
  { label: copy.privacyLink, to: '/privacy', note: copy.privacyTitle },
];

export function SiteNav() {
  const copy = useCopy();
  const links = linksFor(copy);
  const waiting = usePendingProposals();
  const layout = useLayout();

  /*
   * Nothing on a wide screen, because `TopBar` already carries these routes.
   *
   * Rendered at both sizes it printed "The atlas", "Propose a dish" and "Keeping it
   * free" twice on the same page, forty pixels of scroll apart — the header at the top
   * and this at the foot, saying the same four things.
   *
   * A website does want a footer, and this is not it: a colophon is a phone pattern,
   * three links stacked with a note each. The real one carries the whole map of the
   * site and is queued in docs/queue.md. Until it exists, saying each thing once is
   * better than saying half of them twice.
   */
  if (layout.wide) return null;

  return (
    <View role="navigation" style={styles.wrap}>
      {links.map((link) => {
        /* Same count as the masthead carries on a wide screen, in the one place a phone
           reader passes on the way out of the feed. Digits, not a phrase: see TopBar. */
        const count = link.to === '/proposals' ? waiting : 0;
        return (
          <Pressable
            key={link.to}
            accessibilityRole="button"
            accessibilityLabel={count ? `${link.label} (${count}). ${link.note}` : `${link.label}. ${link.note}`}
            tint="neutral"
            onPress={() => router.push(link.to)}
            style={styles.item}
          >
            <View style={styles.row}>
              <T style={styles.label}>{link.label}</T>
              {count > 0 ? (
                <View style={styles.count}>
                  <T style={styles.countText}>{count}</T>
                </View>
              ) : null}
            </View>
            <T style={styles.note}>{link.note}</T>
          </Pressable>
        );
      })}

      {/*
       * The session, at the foot of the phone.
       *
       * Renders nothing until sign-in is configured, so on a deployment without Google
       * credentials this is invisible rather than a dead control. TopBar carries the same
       * thing above the tablet breakpoint, where this component returns null.
       */}
      <SessionControl />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: space[8],
    paddingTop: space[6],
    borderTopWidth: 1,
    borderTopColor: color.divider,
    gap: space[1],
  },
  item: {
    minHeight: TAP_TARGET,
    justifyContent: 'center',
    paddingVertical: space[2],
  },
  label: { fontSize: 14, color: color.accent },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[1] },
  count: {
    minWidth: 18,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: accentAlpha(35),
    backgroundColor: accentAlpha(12),
    alignItems: 'center',
  },
  countText: { fontSize: 11, color: accentText, fontFamily: font.medium },
  note: { fontSize: 12, color: color.muted, marginTop: 1 },
});
