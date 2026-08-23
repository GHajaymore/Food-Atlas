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
import { useLayout } from '../theme/layout';
import { color, space, TAP_TARGET } from '../theme/tokens';
import { Pressable } from './Pressable';
import { T } from './Text';

const LINKS: { label: string; to: string; note: string }[] = [
  { label: 'The atlas', to: '/atlas', note: 'What is covered, and how confident it is' },
  { label: 'Propose a dish', to: '/propose', note: 'Food the atlas has no record of' },
  /*
   * Listed separately from proposing, because they are different acts and the second is
   * the one in short supply. Anybody can describe a dish they know; a proposal only
   * moves when somebody *else* recognises it, and a reader who never sees the open list
   * has no way to discover that confirming is a thing they could do.
   */
  { label: 'Confirm a proposal', to: '/proposals', note: 'Dishes waiting for someone who knows them' },
  { label: 'Keeping it free', to: '/support', note: 'What it costs to run, and who pays' },
];

export function SiteNav() {
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
    <View style={styles.wrap}>
      {LINKS.map((link) => (
        <Pressable
          key={link.to}
          accessibilityRole="button"
          accessibilityLabel={`${link.label}. ${link.note}`}
          tint="neutral"
          onPress={() => router.push(link.to)}
          style={styles.item}
        >
          <T style={styles.label}>{link.label}</T>
          <T style={styles.note}>{link.note}</T>
        </Pressable>
      ))}
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
  note: { fontSize: 12, color: color.muted, marginTop: 1 },
});
