/**
 * What other languages call this dish.
 *
 * These are endonyms, not translations. Each one is the title of the dish's own
 * article in that language's Wikipedia, written by people who speak it and usually
 * by people who eat the food. Nothing here was generated.
 *
 * The rule that shapes this component is the one the whole app turns on: the name is
 * shown **beside** the original and never instead of it. A Malayalam reader seeing
 * the Malayalam name next to "Hákarl" gains something. Seeing it replace "Hákarl"
 * loses the identity of the food, which is the one thing this app will not trade —
 * it is the same reason `assertPreserved` rejects a translation that renamed an
 * ingredient, and the same reason the editorial rules forbid tidying a dish name.
 *
 * Collapsed by default. A dish with fifty language editions would otherwise push the
 * method off the screen, and the method is the product.
 */

import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { languageByCode } from '../domain/language';
import { accentText, color, font, radius, space } from '../theme/tokens';
import { Block } from './Card';
import { Pressable } from './Pressable';
import { Muted, T } from './Text';

interface Props {
  /** Language code to the dish's name in that language. */
  names?: Record<string, string>;
  /** The name these sit beside, so it can be excluded if a source repeats it. */
  original: string;
}

/** How many to show before asking. Enough to feel worldwide, few enough to scan. */
const PREVIEW = 6;

export function LocalNames({ names, original }: Props) {
  const [open, setOpen] = useState(false);

  // Only languages the app knows how to label. A bare code tells a reader nothing,
  // and the endonym is what makes their own language recognisable in the list.
  const known = Object.entries(names ?? {})
    .filter(([code, name]) => languageByCode(code) && name.trim() && name.trim() !== original.trim())
    .sort((a, b) => a[0].localeCompare(b[0]));

  if (!known.length) return null;

  const shown = open ? known : known.slice(0, PREVIEW);
  const rest = known.length - shown.length;

  return (
    <Block style={styles.wrap}>
      <View style={styles.head}>
        <T style={styles.title}>Also called</T>
        <Muted style={styles.count}>{known.length} languages</Muted>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
        {shown.map(([code, name]) => (
          <View key={code} style={styles.chip}>
            <T style={styles.name} numberOfLines={1}>
              {name}
            </T>
            {/* The language in its own script, so a speaker finds theirs by sight. */}
            <Muted style={styles.lang}>{languageByCode(code)!.endonym}</Muted>
          </View>
        ))}
      </ScrollView>

      {rest > 0 || open ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          tint="none"
          onPress={() => setOpen(!open)}
        >
          <Muted style={styles.more}>{open ? 'Show fewer' : `Show ${rest} more`}</Muted>
        </Pressable>
      ) : null}

      <Muted style={styles.note}>
        Each is the name used in that language&apos;s own encyclopaedia article — not a translation of ours, and
        never a replacement for the name above.
      </Muted>
    </Block>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 12, marginTop: 14 },
  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: space[2] },
  title: { fontSize: 13, fontFamily: font.medium },
  count: { fontSize: 11, fontVariant: ['tabular-nums'] },

  rail: { gap: 8, paddingTop: 10, paddingBottom: 2, paddingRight: space[3] },
  chip: {
    maxWidth: 180,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.divider,
  },
  name: { fontSize: 13 },
  lang: { fontSize: 10, marginTop: 1 },

  more: { fontSize: 11, color: accentText, marginTop: 8 },
  note: { fontSize: 11, lineHeight: 11 * 1.55, marginTop: 8 },
});
