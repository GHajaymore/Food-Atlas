/**
 * The Feed's collapsed filter panel.
 *
 * The design gives the Feed one chip row, directly under the place selector, and is
 * emphatic about that order: the place selector is the primary control and
 * popularity is demoted to the bottom. Diet and meal occasion added two more chip
 * rows, which pushed the dishes below a wall of controls and buried the hierarchy
 * the design was arguing for.
 *
 * So they live behind one line here. Collapsed, it is a single row that names what
 * is currently applied — the filters stay visible as text even when the controls are
 * not, which matters, because a reader who has forgotten they set "vegan" should be
 * able to see why the list is short.
 */

import { useState } from 'react';
import { LayoutAnimation, StyleSheet, View } from 'react-native';
import { accentText, color, radius, space } from '../theme/tokens';
import { CaretDownIcon } from './icons';
import { Pressable } from './Pressable';
import { Muted, T } from './Text';
import { useCopy } from '../i18n';

interface Props {
  /** The row's own label, e.g. 'Diet & occasion' or 'Filters'. */
  label?: string;
  /** Human-readable summary of what is applied, e.g. 'Vegan · Breakfast'. */
  summary: string;
  /** How many choices are active, for the count badge. */
  count: number;
  /** Shown in place of the summary when nothing is applied. */
  emptyLabel?: string;
  children: React.ReactNode;
}

export function Refine({ label = 'Diet & occasion', summary, count, emptyLabel = 'Any', children }: Props) {
  const copy = useCopy();
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${label}. ${count ? summary : copy.nothingApplied}`}
        tint="neutral"
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setOpen((v) => !v);
        }}
        style={styles.header}
      >
        <T style={styles.label}>{label}</T>
        {count ? (
          <Muted style={styles.summary} numberOfLines={1}>
            {summary}
          </Muted>
        ) : (
          <Muted style={styles.summary}>{emptyLabel}</Muted>
        )}
        <View style={open ? styles.caretOpen : undefined}>
          <CaretDownIcon size={14} color={color.neutral[400]} />
        </View>
      </Pressable>

      {open ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 12 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    // 44, not 40: the minimum a finger reliably hits, and this row is one of the two
    // controls the feed is driven by.
    minHeight: 44,
    paddingVertical: space[2],
    paddingHorizontal: space[3],
    borderWidth: 1,
    borderColor: color.divider,
    borderRadius: radius.md,
  },
  label: { fontSize: 12, flexShrink: 0 },
  // The applied filters read as accent text so an active constraint is legible at a
  // glance without opening the panel.
  summary: { fontSize: 12, flex: 1, textAlign: 'right', color: accentText },
  caretOpen: { transform: [{ rotate: '180deg' }] },
  body: { marginTop: 4 },
});
