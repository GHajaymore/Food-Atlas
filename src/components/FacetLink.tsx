/**
 * A fact on a record, turned into the list it belongs to.
 *
 * This is the small component that does most of the work of making the atlas read like
 * a reference site rather than an app. "Kerala" on a record was text; now it opens every
 * Kerala dish. So does the cuisine, the category, each ingredient, and the badge.
 *
 * Nothing here computes anything — `hrefFor` builds a URL, `/browse` runs it through
 * `feedFor` and `searchResults`, and both of those already existed. The links were the
 * only missing part, which is why a page can get substantially richer without a single
 * new sentence being written.
 *
 * ## It looks like a link and behaves like one
 *
 * `accessibilityRole="link"` rather than `button`, because that is what it is: a screen
 * reader should announce it as navigation, and on the web it should feel like the rest
 * of the internet. The underline is the accent colour at rest rather than on hover only,
 * because a link a reader has to hover to discover is a link most readers never find —
 * and on a touch screen there is no hover at all.
 */

import { useCopy } from '../i18n';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { hrefFor, type BrowseQuery } from '../domain/browse';
import { accentText, color, font, space, TAP_TARGET } from '../theme/tokens';
import { Pressable } from './Pressable';
import { Tag } from './Tag';
import { T } from './Text';

interface Props {
  /** What the link says. */
  label: string;
  /** The filter it opens. */
  query: BrowseQuery;
  /**
   * A chip has a border and its own tap target; inline sits in a line of text.
   *
   * Inline is for a fact inside a sentence — a country under a dish name. A chip is for
   * a list of peers, like ingredients, where the boundary between one and the next has
   * to be visible.
   *
   * `tag` keeps the appearance of the badge it replaces. The classification tag on a
   * record had to become a link without becoming a different object: it is the single
   * most meaningful thing on the page, and restyling it as a chip would have made the
   * product's central claim look like a filter control.
   */
  variant?: 'chip' | 'inline' | 'tag';
  /** Announced instead of the label, where the label alone would be ambiguous. */
  describedAs?: string;
}

export function FacetLink({ label, query, variant = 'inline', describedAs }: Props) {
  const copy = useCopy();
  if (!label.trim()) return null;

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={describedAs ?? copy.seeEverything.replace('{label}', label)}
      tint="neutral"
      onPress={() => router.push(hrefFor(query))}
      style={variant === 'chip' ? styles.chip : styles.inline}
    >
      {variant === 'tag' ? (
        <Tag label={label} variant="neutral" />
      ) : (
        <T style={variant === 'chip' ? styles.chipLabel : styles.inlineLabel}>{label}</T>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  /*
   * No minimum height on the inline variant, deliberately.
   *
   * `TAP_TARGET` is right for a control and wrong for a word inside a sentence: forcing
   * 44px around "Kerala" in a breadcrumb would break the line it sits in. The chip
   * variant, which is a control, keeps it.
   */
  inline: { alignSelf: 'flex-start' },
  inlineLabel: {
    fontSize: 13,
    color: accentText,
    textDecorationLine: 'underline',
    textDecorationColor: color.divider,
  },
  chip: {
    minHeight: TAP_TARGET,
    justifyContent: 'center',
    paddingHorizontal: space[3],
    borderWidth: 1,
    borderColor: color.divider,
    borderRadius: 6,
  },
  chipLabel: { fontSize: 12, color: color.text, fontFamily: font.medium },
});
