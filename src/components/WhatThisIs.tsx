/**
 * What a first-time reader is looking at, said before anything is claimed about it.
 *
 * Ajay: *"if a new user logs in, they won't understand what the app is about. so we need
 * to provide a clear mission of the app upfront, we can have more details in how it
 * works."*
 *
 * He is right, and the measurement was blunt: the phone home screen opened with a
 * tagline, a headline and a paragraph — sixty-one words, three claims, all of them about
 * *evidence* — and not one of them contained a noun for the product. "Every dish here
 * shows its evidence" is a promise about something the reader has not been told the name
 * of.
 *
 * So this block leads with the noun. "A free atlas of traditional dishes" is four words
 * and does the job the other sixty-one could not.
 *
 * ## The numbers are counted, never typed
 *
 * `catalogueStats` is derived from the built catalogue, so the figures here cannot drift
 * away from what the atlas actually holds — the same rule `Mission` follows and the same
 * reason: a headline number that has quietly gone stale is the one kind of dishonesty
 * this project cannot afford, because the whole proposition is that its claims are
 * checkable.
 *
 * The third cell says the price. It is not a boast — it is the answer to the question a
 * reader asks second, and it is only here because it is true: there is no advertising,
 * nothing is tracked, and no endpoint that could bill anybody is switched on.
 *
 * ## Why it is not the full mission
 *
 * `Mission` still exists and still runs below, and `/how` still explains the six
 * dimensions and the 43 ceiling. This is orientation, not the argument: enough for a
 * stranger to know what they opened and decide whether to scroll.
 */

import { StyleSheet, View } from 'react-native';
import { catalogueStats } from '../data/catalogue';
import { formatNumber, useCopy, useLocale } from '../i18n';
import { color, font, radius, space } from '../theme/tokens';
import { Muted, T } from './Text';

export function WhatThisIs() {
  const copy = useCopy();
  const locale = useLocale((s) => s.locale);
  const { total, countries } = catalogueStats;

  return (
    <View style={styles.wrap}>
      <T style={styles.kicker}>{copy.whatThisIs.toUpperCase()}</T>
      <T style={styles.definition}>{copy.atlasDefinition}</T>

      {/*
       * Three cells rather than a sentence, because the numbers are the part a reader
       * checks and a sentence buries them. Borrowed from direction B of the mockup, which
       * was the better half of a design that gave up too much elsewhere.
       */}
      <View style={styles.strip}>
        <View style={styles.cell}>
          <T style={styles.figure}>{formatNumber(total, locale)}</T>
          <Muted style={styles.label}>{copy.traditionsLabel}</Muted>
        </View>
        <View style={[styles.cell, styles.divided]}>
          <T style={styles.figure}>{formatNumber(countries, locale)}</T>
          <Muted style={styles.label}>{copy.countries}</Muted>
        </View>
        <View style={[styles.cell, styles.divided]}>
          <Muted style={styles.freeLabel}>{copy.freeNoAds}</Muted>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* The rule marks this as orientation rather than a fourth claim competing with the
     three that follow it. */
  wrap: {
    borderLeftWidth: 2,
    borderLeftColor: color.accent,
    paddingLeft: space[3],
    gap: space[2],
  },
  kicker: {
    fontSize: 10,
    lineHeight: 10 * 1.5,
    letterSpacing: 1.2,
    color: color.accent,
    fontFamily: font.medium,
  },
  definition: { fontSize: 14, lineHeight: 14 * 1.55, color: color.text },

  strip: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: color.divider,
    borderRadius: radius.sm,
    marginTop: space[1],
  },
  cell: { flex: 1, paddingVertical: space[2], paddingHorizontal: space[1], alignItems: 'center', justifyContent: 'center' },
  divided: { borderLeftWidth: 1, borderLeftColor: color.divider },
  figure: {
    fontFamily: font.display,
    fontSize: 16,
    lineHeight: 16 * 1.3,
    color: color.text,
    fontVariant: ['tabular-nums'],
  },
  label: { fontSize: 9.5, lineHeight: 9.5 * 1.5, letterSpacing: 0.4, color: color.meta },
  /* No figure above it, so it centres on its own and matches the labels beside it. */
  freeLabel: { fontSize: 10.5, lineHeight: 10.5 * 1.5, textAlign: 'center', color: color.meta },
});
