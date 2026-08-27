/**
 * The place picker's options, in whichever shape the window can afford.
 *
 * Measured before this existed: at 1440 the picker was **201 full-width rows stacked
 * vertically, on a page 9,578px tall** — twenty screens of scrolling to find a country,
 * with two thirds of the window empty beside every row. It is the same fault the Food
 * Atlas had, and `AtlasDirectory` is the same answer: a list of places that fits should
 * be laid out as a directory rather than as a column of phone rows.
 *
 * It survived the desktop pass because the pass went screen by screen and this screen was
 * never on the list. That is worth recording as the reason rather than an excuse — the
 * audit that found it looked at geometry across every route instead of at the screens
 * somebody remembered.
 *
 * ## The phone branch is the previous code, moved
 *
 * Same rule as everywhere else in this pass. A picker on a phone is a column of 44px
 * rows and should stay one; nothing here changes that, and the wide branch is the only
 * new thing.
 */

import { StyleSheet, View } from 'react-native';
import { useCopy, usePlural } from '../i18n';
import { useLayout } from '../theme/layout';
import { color, space, TAP_TARGET } from '../theme/tokens';
import { Pressable } from './Pressable';
import { H6, Muted, T } from './Text';

export interface PlaceOption {
  /** The English value. It is the identity: what gets picked, and what keys the row. */
  label: string;
  /**
   * What the reader sees, where that differs — a wider region in their language.
   *
   * Kept apart from `label` rather than translating in place, because `onPick` sends this
   * value back into the data layer. Translating the one string would mean picking
   * "レヴァント" and querying the atlas for a place called レヴァント, which it has never
   * heard of: the filter would come back empty and look like an atlas with nothing in it.
   */
  display?: string;
  count: number;
  /** "wider region", "former state" — shown at country level only. */
  note?: string;
}

export interface PlaceGroup {
  label: string;
  showLabel: boolean;
  options: PlaceOption[];
}

export function PlaceOptions({ groups, onPick }: { groups: PlaceGroup[]; onPick: (value: string) => void }) {
  const { wide, columns } = useLayout();
  const copy = useCopy();
  const plural = usePlural();

  return (
    <>
      {groups.map((group, i) => (
        <View key={group.label || `group-${i}`} style={styles.group}>
          {group.showLabel ? (
            <H6 style={[styles.groupLabel, wide ? styles.groupLabelWide : null]}>{group.label}</H6>
          ) : null}

          <View style={wide ? styles.grid : undefined}>
            {group.options.map((option) => (
              <View key={option.label} style={wide ? { width: `${100 / columns}%` } : undefined}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${option.display ?? option.label}${option.note ? `, ${option.note}` : ''}, ${plural('nRecorded', 'nRecorded', option.count)}`}
                  tint="neutral"
                  onPress={() => onPick(option.label)}
                  style={wide ? styles.cell : styles.row}
                >
                  <T style={styles.optionLabel} numberOfLines={1}>
                    {option.display ?? option.label}
                  </T>
                  {/*
                   * The kind is dropped in a column and kept in a row.
                   *
                   * "Ancient Greece · former state" needs the width of a full row; in a
                   * third of one it wraps and turns a scannable directory back into a
                   * list. It stays in the accessible label either way, so nothing is
                   * lost to a screen reader — the same trade `AtlasDirectory` makes with
                   * a country's detail line.
                   */}
                  {option.note && !wide ? <Muted style={styles.kind}>{option.note}</Muted> : null}
                  <Muted style={styles.count}>{option.count}</Muted>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  group: { marginTop: space[4] },
  groupLabel: { marginBottom: space[2] },
  groupLabelWide: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: color.accent,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingVertical: 12,
    minHeight: TAP_TARGET,
    borderBottomWidth: 1,
    borderBottomColor: color.divider,
  },

  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  /* Shorter than TAP_TARGET, for the reason AtlasDirectory gives: this branch only ever
     renders on a screen being used with a pointer, and 44px a row would make a directory
     of two hundred places twice as tall as it needs to be. */
  cell: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: space[2],
    paddingVertical: 7,
    paddingRight: space[4],
    minHeight: 30,
  },

  optionLabel: { fontSize: 14, flexShrink: 1 },
  kind: { fontSize: 11, color: color.meta },
  count: { fontSize: 12, color: color.meta, fontVariant: ['tabular-nums'], flexShrink: 0 },
});
