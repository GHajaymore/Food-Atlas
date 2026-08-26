/**
 * The list of every place the atlas holds, in whichever shape the window can afford.
 *
 * ## Why a desktop opens rather than collapses
 *
 * The phone screen shows seven collapsed continents, one open at a time, and the reason
 * is written on `app/atlas.tsx`: at 268 origins a flat list buries the coverage figures
 * that are the point of the screen. That is a true constraint — on a phone.
 *
 * On a 1240px page it is not a constraint, it is an inherited compromise. Accordions
 * there cost a reader two clicks and a scroll to answer "is Ghana in here", while nine
 * tenths of the window sits empty beside the answer. A directory that fits should be a
 * directory: every continent open, countries in columns, the whole atlas legible by
 * scanning rather than by guessing which lid to lift.
 *
 * A desktop continent **can** still be folded away — Ajay asked for that and it is a fair
 * ask on a 3,000px page — but it starts open, and closing one says nothing about the
 * others. See `Open`.
 *
 * Which is also the honest reading of what Ajay has been asking for. *"Desktop still
 * feels like a mobile version"* is rarely about width — it is about phone interaction
 * patterns surviving onto a screen that never needed them.
 *
 * ## Arrangement lives here, and only here
 *
 * The same rule `RecordColumns` states: this component consults the window once and
 * decides a shape. Nothing it renders knows how wide anything is, and the phone branch
 * is the previous behaviour moved rather than rewritten, so a phone cannot regress
 * because of a desktop change.
 */

import { useCopy } from '../i18n';
import type { Copy } from '../i18n/copy';
import { useState } from 'react';
import { LayoutAnimation, StyleSheet, View } from 'react-native';
import type { AtlasGroup } from '../domain/queries';
import { continentLabel, isCountry, placeName } from '../domain/continents';
import { useLayout } from '../theme/layout';
import { accentText, color, space } from '../theme/tokens';
import { CaretDownIcon } from './icons';
import { Pressable } from './Pressable';
import { H6, Muted, T } from './Text';

/** Spread, not passed — `dataSet` is a react-native-web extension the RN types lack. */
const caretMotion: object = { dataSet: { motion: 'caret' } };

/** How the header of a continent describes itself, on either layout. */
function groupSummary(copy: Copy, group: AtlasGroup) {
  const dishCount = group.countries.reduce((sum, c) => sum + c.count, 0);
  /*
   * "Elsewhere" holds origins recorded as a region or a former state — Levant,
   * Mesoamerica, the Ottoman Empire. Calling those countries put thirty-two imaginary
   * ones on the screen, in the group least likely to be checked.
   */
  const realCountries = group.countries.filter((c) => isCountry(c.name)).length;
  const allCountries = realCountries === group.countries.length;
  const template = allCountries ? copy.groupSummaryCountries : copy.groupSummaryOrigins;
  return {
    dishCount,
    label: template
      .replace('{c}', String(group.countries.length))
      .replace('{n}', dishCount.toLocaleString()),
  };
}

interface Props {
  groups: AtlasGroup[];
  onPick: (country: string) => void;
}

export function AtlasDirectory({ groups, onPick }: Props) {
  const { wide, columns } = useLayout();
  return wide ? <Open groups={groups} onPick={onPick} columns={columns} /> : <Collapsed groups={groups} onPick={onPick} />;
}

/**
 * Continents in columns, each one collapsible.
 *
 * `flexWrap` with a percentage width rather than a real column count, because React
 * Native has no CSS multi-column and a fixed count would need the container's measured
 * width to divide. Wrapping needs neither and reflows correctly when the window changes.
 *
 * ## Open by default, and collapsible rather than the other way round
 *
 * Ajay asked for a collapsible option here after the desktop pass opened every continent.
 * Both halves of that matter and they pull in opposite directions, so this keeps both:
 *
 * **Open by default**, because a directory that fits should be a directory — that is the
 * whole reason the accordion was dropped on desktop, and starting collapsed would put the
 * two clicks back that removing it was meant to save.
 *
 * **Collapsible anyway**, because at 230 origins the page is about 3,000px tall, and
 * somebody who knows they want Europe should be able to fold Asia away rather than
 * scroll past it. That is a different need from the phone's, where collapsing exists to
 * make the page navigable at all.
 *
 * So unlike the phone, several can be closed at once and closing one says nothing about
 * the others. One-at-a-time is a space constraint, and there is no space constraint here.
 */
function Open({ groups, onPick, columns }: Props & { columns: number }) {
  const copy = useCopy();
  /* Closed rather than open, so the empty set means "everything open" and a continent
     added tomorrow arrives expanded like the rest. */
  const [closed, setClosed] = useState<ReadonlySet<string>>(new Set());

  const toggle = (label: string) =>
    setClosed((current) => {
      const next = new Set(current);
      if (!next.delete(label)) next.add(label);
      return next;
    });

  return (
    <View style={styles.openGroups}>
      {groups.map((group) => {
        const summary = groupSummary(copy, group);
        const open = !closed.has(group.label);
        return (
          <View key={group.label}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
              accessibilityLabel={`${continentLabel(group.label, copy)}, ${summary.label}`}
              tint="neutral"
              onPress={() => toggle(group.label)}
              style={styles.openHeader}
            >
              <H6 style={styles.openLabel}>{continentLabel(group.label, copy)}</H6>
              <Muted style={styles.groupCount}>{summary.label}</Muted>
              {/* The affordance. Without it a heading that happens to be pressable is a
                  secret, and the countries below give no hint that they could fold. */}
              <View {...caretMotion} style={open ? styles.caretOpen : undefined}>
                <CaretDownIcon size={13} color={color.accent} />
              </View>
            </Pressable>

            <View style={open ? styles.grid : styles.hidden}>
              {group.countries.map((country) => (
                <View key={country.name} style={{ width: `${100 / columns}%` }}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${placeName(country.name, copy)}, ${country.detail}`}
                    tint="neutral"
                    onPress={() => onPick(country.name)}
                    style={styles.gridCell}
                  >
                    {/* Translated for display only. The `onPick` above still sends the
                        English name, because that is what the atlas is keyed on. */}
                    <T style={styles.gridCountry} numberOfLines={1}>
                      {placeName(country.name, copy)}
                    </T>
                    {/*
                     * The count only, not the full detail line.
                     * "12 traditions · 4 places" is right on a row that owns the width;
                     * in a third of a column it wraps to two lines and turns a scannable
                     * directory back into a list. The full sentence is still the
                     * accessible label above, so nothing is lost to a screen reader.
                     */}
                    <Muted style={styles.gridCount}>{country.count.toLocaleString()}</Muted>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

/** The phone shape, unchanged: seven collapsed rows, one open at a time. */
function Collapsed({ groups, onPick }: Props) {
  const copy = useCopy();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <View style={styles.groups}>
      {groups.map((group) => {
        const open = expanded === group.label;
        const summary = groupSummary(copy, group);

        return (
          <View key={group.label}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
              accessibilityLabel={`${continentLabel(group.label, copy)}, ${summary.label}`}
              tint="neutral"
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                // One open at a time: the list is long enough that several open
                // continents is the same problem in a different shape.
                setExpanded(open ? null : group.label);
              }}
              style={[styles.groupHeader, open ? styles.groupHeaderOpen : null]}
            >
              <H6 style={[styles.groupLabel, open ? styles.groupLabelOpen : null]}>{continentLabel(group.label, copy)}</H6>
              {/* Both numbers named. "36 countries · 297" left the reader to guess
                  what 297 counted. */}
              <Muted style={styles.groupCount}>{summary.label}</Muted>
              <View {...caretMotion} style={open ? styles.caretOpen : undefined}>
                <CaretDownIcon size={14} color={open ? color.accent : color.neutral[400]} />
              </View>
            </Pressable>

            {/* The children sit inside a rule that runs the length of the group, so an
                expanded continent reads as one block rather than as more rows in the
                same list as the headers above it. */}
            {open ? (
              <View style={styles.groupBody}>
                {group.countries.map((country) => (
                  <Pressable
                    key={country.name}
                    accessibilityRole="button"
                    accessibilityLabel={`${country.name}, ${country.detail}`}
                    tint="neutral"
                    onPress={() => onPick(country.name)}
                    style={styles.row}
                  >
                    <T style={styles.country}>{country.name}</T>
                    <Muted style={styles.detail}>{country.detail}</Muted>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  groups: { gap: 24 },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingVertical: 12,
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: color.divider,
  },
  // Open: the header stops being a list row and becomes a section heading — the rule
  // under it goes accent, and the label follows.
  groupHeaderOpen: { borderBottomColor: color.accent },
  groupLabel: { flex: 1 },
  groupLabelOpen: { color: accentText },
  groupCount: { fontSize: 11, fontVariant: ['tabular-nums'] },
  caretOpen: { transform: [{ rotate: '180deg' }] },

  groupBody: {
    marginLeft: space[2],
    paddingLeft: space[4],
    borderLeftWidth: 1,
    borderLeftColor: color.divider,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
    paddingVertical: 11,
    paddingHorizontal: 2,
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: color.divider,
  },
  country: { fontSize: 14, flexShrink: 0 },
  detail: { fontSize: 12, textAlign: 'right', flex: 1, marginLeft: space[2] },

  openGroups: { gap: 34 },
  openHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: space[3],
    paddingBottom: 8,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: color.accent,
  },
  openLabel: { color: accentText },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  /* Unmounted rather than hidden: 230 rows kept in the tree behind `display: none`
     would still be laid out on every resize for no reason. */
  hidden: { display: 'none' },
  gridCell: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: space[2],
    paddingVertical: 7,
    paddingRight: space[4],
    // Shorter than TAP_TARGET on purpose: this branch only ever renders on a screen
    // being used with a pointer, where 44px of height per row would make a directory
    // of 230 places twice as tall as it needs to be.
    minHeight: 30,
  },
  gridCountry: { fontSize: 13.5, flexShrink: 1 },
  gridCount: { fontSize: 11, fontVariant: ['tabular-nums'], flexShrink: 0 },
});
