/**
 * Choosing the language the app speaks.
 *
 * The machinery has existed for a while — `uiLanguage.ts` negotiates a locale from the
 * device, `catalogues.ts` holds twelve translations of the chrome — and a reader had no
 * way to reach it. The device's language is a good guess and not an instruction: someone
 * whose phone is set to English because that is what the shop sold them may still want
 * to read in Tamil, and until now the app quietly decided otherwise.
 *
 * ## It says how much is actually translated
 *
 * `translationCoverage()` returns the share of the chrome that exists in a locale, and
 * where that is short of complete the picker says so on the row. This is the same rule
 * the badges follow: state what is known, including when what is known is "not much".
 * A language list that silently offers a 40% translation and lets a reader discover the
 * gaps one screen at a time is the interface equivalent of a confidence score that does
 * not match its own breakdown.
 *
 * ## What it does not claim to translate
 *
 * The chrome only — labels, headings, the sentences this app writes about itself. **Not
 * the records.** A dish's name, its ingredients and the account of how it is made stay
 * in the language they were written in, because a loose translation of "nobody has
 * confirmed this" misstates a record's standing, and an ingredient that changes name in
 * translation is the exact failure this atlas exists to prevent. The record screen has
 * its own translation controls, with a badge saying whether a human or a machine
 * produced what you are reading.
 */

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { UI_LOCALES, translationCoverage, useLocale } from '../i18n';
import { color, font, radius, space, TAP_TARGET } from '../theme/tokens';
import { Pressable } from './Pressable';
import { Muted, T } from './Text';

/**
 * Each language named in itself.
 *
 * "Deutsch" rather than "German", because the person who wants German is reading the
 * list in a language they may not have. An endonym is legible to exactly the reader who
 * needs that row and nobody else has to care.
 */
const NAMES: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  nl: 'Nederlands',
  pl: 'Polski',
  tr: 'Türkçe',
  ru: 'Русский',
  hi: 'हिन्दी',
  zh: '中文',
  ja: '日本語',
};

const label = (locale: string) => NAMES[locale] ?? locale;

export function LanguagePicker({ compact }: { compact?: boolean }) {
  const locale = useLocale((s) => s.locale);
  const setLocale = useLocale((s) => s.setLocale);
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`Language: ${label(locale)}. Change it.`}
        tint="neutral"
        onPress={() => setOpen((was) => !was)}
        style={compact ? styles.triggerCompact : styles.trigger}
      >
        {/* A globe rather than a flag. A language is not a country — Spanish is not
            Spain, and putting a flag on it tells several hundred million people their
            language belongs to somewhere else. */}
        <T style={styles.glyph}>🌐</T>
        <T style={styles.current}>{label(locale)}</T>
        <T style={styles.chevron}>{open ? '⌃' : '⌄'}</T>
      </Pressable>

      {open ? (
        <View style={styles.list}>
          {UI_LOCALES.map((code) => {
            const coverage = translationCoverage(code);
            const partial = code !== 'en' && coverage < 0.95;
            const active = code === locale;

            return (
              <Pressable
                key={code}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={
                  partial
                    ? `${label(code)}, ${Math.round(coverage * 100)} per cent translated`
                    : label(code)
                }
                tint="neutral"
                onPress={() => {
                  setLocale(code);
                  setOpen(false);
                }}
                style={styles.option}
              >
                <T style={active ? styles.optionOn : styles.optionLabel}>{label(code)}</T>
                {partial ? (
                  <Muted style={styles.partial}>{Math.round(coverage * 100)}%</Muted>
                ) : null}
              </Pressable>
            );
          })}

          <Muted style={styles.footnote}>
            Translates the app&apos;s own words. Dishes stay in the language they were recorded in —
            a record has its own translation controls.
          </Muted>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    minHeight: TAP_TARGET,
    paddingHorizontal: space[3],
    borderWidth: 1,
    borderColor: color.divider,
    borderRadius: radius.md,
    alignSelf: 'flex-start',
  },
  triggerCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    minHeight: TAP_TARGET,
    paddingHorizontal: space[2],
  },
  glyph: { fontSize: 13 },
  current: { fontSize: 13, color: color.text },
  chevron: { fontSize: 11, color: color.muted },

  /*
   * In flow rather than absolutely positioned.
   *
   * An overlay would need measuring, a backdrop, and an answer for what happens when it
   * runs off the bottom of a phone. Pushing the page down is unfashionable and it works
   * on every screen size without any of that — and the list is short enough that the
   * push is small.
   */
  list: {
    marginTop: space[2],
    borderWidth: 1,
    borderColor: color.divider,
    borderRadius: radius.md,
    padding: space[2],
    backgroundColor: color.surface,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[3],
    minHeight: TAP_TARGET,
    paddingHorizontal: space[2],
  },
  optionLabel: { fontSize: 14, color: color.text },
  optionOn: { fontSize: 14, color: color.accent, fontFamily: font.semibold },
  partial: { fontSize: 11, fontVariant: ['tabular-nums'] },
  footnote: { fontSize: 11, lineHeight: 16, marginTop: space[2], paddingHorizontal: space[2] },
});
