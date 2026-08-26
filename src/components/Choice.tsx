/**
 * Pick from what the atlas can actually file, instead of typing and hoping.
 *
 * Ajay: *"don't you think we should have dropdowns for the proposals wherever it matters,
 * ex Country"* — and then *"avoid the free flow text wherever you can"*. He is right, and
 * the evidence is in this repository: a whole session went into repairing imported records
 * whose country was a guess, and `/propose` was inviting readers to make the same mistake
 * by hand. "USA", "Untied States" and a country the continent map has never heard of all
 * arrive as the same kind of unusable string.
 *
 * ## What it will not do
 *
 * It will not offer a value the app cannot use, and it will not pretend a long list is a
 * short one: past a dozen options it filters, because scrolling 156 countries to find
 * Nepal is not a control, it is a punishment.
 *
 * ## Where free text stays, deliberately
 *
 * Only the fields with a real vocabulary become choosers. The region, the town, the method
 * and the ingredients stay open, and that is not laziness — `continents.ts` states the
 * principle plainly: *"a person naming somewhere unrecorded is the case this project exists
 * for, never an error."* The country is different because a record has to sit on one, and
 * a country the atlas cannot place is a record it cannot file.
 */

import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useCopy } from '../i18n';
import { accentText, color, font, radius, space, TAP_TARGET } from '../theme/tokens';
import { Input } from './Field';
import { Pressable } from './Pressable';
import { Muted, T } from './Text';

/** Past this many options the list gets a filter box. */
const FILTER_FROM = 12;

interface Props {
  /** The chosen value, or empty. */
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  /** Shown on the trigger when nothing is chosen yet. */
  placeholder: string;
  /** For the screen reader, since the visible label sits on the Field above. */
  accessibilityLabel: string;
}

export function Choice({ value, options, onChange, placeholder, accessibilityLabel }: Props) {
  const copy = useCopy();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    /* Starts-with first, then contains: typing "in" should reach India before Argentina. */
    const starts = options.filter((o) => o.toLowerCase().startsWith(q));
    const rest = options.filter((o) => !o.toLowerCase().startsWith(q) && o.toLowerCase().includes(q));
    return [...starts, ...rest];
  }, [options, query]);

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={value ? `${accessibilityLabel}: ${value}` : accessibilityLabel}
        tint="neutral"
        onPress={() => {
          setOpen((was) => !was);
          setQuery('');
        }}
        style={styles.trigger}
      >
        <T style={value ? styles.value : styles.placeholder}>{value || placeholder}</T>
        <T style={styles.chevron}>{open ? '⌃' : '⌄'}</T>
      </Pressable>

      {open ? (
        <View style={styles.panel}>
          {options.length > FILTER_FROM ? (
            <Input
              value={query}
              onChangeText={setQuery}
              placeholder={copy.filterTheList}
              accessibilityLabel={copy.filterTheList}
              autoCorrect={false}
              style={styles.filter}
            />
          ) : null}

          {/*
           * A ScrollView, not a capped View.
           *
           * This was a View with maxHeight and overflow hidden, which measured exactly as
           * badly as it sounds: 40 options rendered, **5 visible**, and the other 35
           * clipped away with no way to reach them. The filter box hid the damage — you
           * could type to narrow — but a reader who opened the list and tried to scroll
           * got nothing, and every country after Algeria was unreachable by browsing.
           *
           * Caught by measuring the box against its own content, not by the clipping audit:
           * an option hidden by an overflow is not text overflowing its box, so nothing
           * that looks for truncated text would ever have found it.
           */}
          <ScrollView style={styles.list} nestedScrollEnabled keyboardShouldPersistTaps="handled">
            {filtered.slice(0, 40).map((option) => (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected: option === value }}
                accessibilityLabel={option}
                tint="neutral"
                onPress={() => {
                  onChange(option);
                  setOpen(false);
                  setQuery('');
                }}
                style={styles.option}
              >
                <T style={option === value ? styles.optionOn : styles.optionLabel}>{option}</T>
              </Pressable>
            ))}
          </ScrollView>

          {/* Said rather than left to be discovered: a list that silently stops at forty
              looks like an atlas that has never heard of your country. */}
          {filtered.length > 40 ? (
            <Muted style={styles.note}>
              {copy.showingFirstNOfM.replace('{n}', '40').replace('{m}', String(filtered.length))}
            </Muted>
          ) : null}
          {filtered.length === 0 ? <Muted style={styles.note}>{copy.nothingMatchesThat}</Muted> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    minHeight: TAP_TARGET,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[3],
    borderWidth: 1,
    borderColor: color.divider,
    borderRadius: radius.md,
    backgroundColor: color.surface,
  },
  value: { fontSize: 14, color: color.text },
  placeholder: { fontSize: 14, color: color.meta },
  chevron: { fontSize: 12, color: color.meta },

  panel: {
    marginTop: space[2],
    borderWidth: 1,
    borderColor: color.divider,
    borderRadius: radius.md,
    backgroundColor: color.surface,
    padding: space[2],
  },
  filter: { marginBottom: space[2] },
  /* Capped so a long list cannot push the rest of the form off the screen, and it
     scrolls inside that cap rather than hiding what does not fit. */
  list: { maxHeight: 260 },
  option: {
    minHeight: TAP_TARGET,
    justifyContent: 'center',
    paddingHorizontal: space[3],
    borderRadius: radius.sm,
  },
  optionLabel: { fontSize: 14, color: color.text },
  optionOn: { fontSize: 14, color: accentText, fontFamily: font.medium },
  note: { fontSize: 11, lineHeight: 11 * 1.5, marginTop: space[2], paddingHorizontal: space[3] },
});
