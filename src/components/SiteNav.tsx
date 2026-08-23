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
import { color, space, TAP_TARGET } from '../theme/tokens';
import { Pressable } from './Pressable';
import { T } from './Text';

const LINKS: { label: string; to: string; note: string }[] = [
  { label: 'The atlas', to: '/atlas', note: 'What is covered, and how confident it is' },
  { label: 'Add a tradition', to: '/contribute', note: 'Record a dish nobody has written down' },
  { label: 'Keeping it free', to: '/support', note: 'What it costs to run, and who pays' },
];

export function SiteNav() {
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
