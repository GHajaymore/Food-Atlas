/**
 * The language control, and the provenance banner that goes with it.
 *
 * The banner is not a nicety. A reader looking at a fermentation time needs to know
 * whether a person or a machine put that number in front of them, so the app states
 * it every time it is showing anything other than the original.
 */

import { useCopy, useNumber } from '../i18n';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { ReadableDish } from '../domain/translate';
import { languageCoverage } from '../data/catalogue';
import { LANGUAGES, languageProgress, offeredLanguages } from '../domain/language';
import { accentText, color, radius, space } from '../theme/tokens';
import { Button } from './Button';
import { Block } from './Card';
import { H6, Muted, T } from './Text';
import { Tag } from './Tag';
import type { TranslationFailure } from '../state/translations';

interface Props {
  language: string;
  onSelect: (code: string) => void;
  /** Which languages this record can be read in without fetching anything. */
  available: string[];
  reading: ReadableDish;
  status: 'idle' | 'loading' | 'error';
  /*
   * Why there is no translation, not the sentence to print.
   *
   * This was a plain string and it was whatever the provider threw — which meant a
   * reader on a Japanese page was shown "Translation altered the numbers in the method"
   * in English. The service own refusals are still shown as written, because those are
   * addressed to a reader and say something they can act on; a broken preservation rule
   * now reads as copy.translationRefused, in the language of the page.
   */
  error?: TranslationFailure;
  canTranslate: boolean;
  onTranslate: () => void;
}

export function LanguageBar({
  language,
  onSelect,
  available,
  reading,
  status,
  error,
  canTranslate,
  onTranslate,
}: Props) {
  const copy = useCopy();
  const n = useNumber();
  /**
   * Only languages the catalogue can actually meet. The reader's current choice is
   * always kept, so a language that falls below the floor after they picked it does
   * not silently vanish from under them.
   */
  const ready = offeredLanguages(languageCoverage);
  const offered = ready.some((l) => l.code === language)
    ? ready
    : [...ready, ...LANGUAGES.filter((l) => l.code === language)];

  // Named so a reader whose language is missing sees it coming rather than absent.
  const nextUp = languageProgress(languageCoverage)[0];

  return (
    <View style={styles.wrap}>
      <H6 style={styles.heading}>{copy.readThisIn}</H6>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {offered.map((lang) => (
          <Tag
            key={lang.code}
            // The endonym, so a speaker recognises their own language on the chip.
            label={available.includes(lang.code) ? `${lang.endonym} ·` : lang.endonym}
            noWrap
            variant={lang.code === language ? 'accent' : 'outline'}
            onPress={() => onSelect(lang.code)}
          />
        ))}
      </ScrollView>

      <Muted style={styles.legend}>
        {copy.aDotMarks}
        {nextUp
          ? ` ${copy.opensOnceMoreRecords
              .replace('{language}', nextUp.language.label)
              .replace('{n}', n(nextUp.needed))}`
          : ''}
      </Muted>

      {reading.status !== 'original' ? (
        <Block style={styles.banner} accent={reading.status === 'human'}>
          {reading.status === 'human' ? (
            <T style={styles.human}>{copy.communityTranslation}</T>
          ) : reading.status === 'machine' ? (
            <T style={styles.machine}>{copy.machineTranslation}</T>
          ) : (
            <T style={styles.missing}>{copy.notTranslatedYet}</T>
          )}
          <Muted style={styles.note}>{reading.note}</Muted>

          {reading.status === 'missing' ? (
            canTranslate ? (
              <Button
                label={status === 'loading' ? copy.translating : copy.translateThisRecord}
                variant="secondary"
                block
                onPress={onTranslate}
              />
            ) : (
              <Muted style={styles.note}>
                {copy.noTranslationService}
              </Muted>
            )
          ) : null}

          {status === 'error' && error ? (
            <T style={styles.error}>
              {error.kind === 'refused' ? copy.translationRefused : error.text}
            </T>
          ) : null}
        </Block>
      ) : null}

      {Object.keys(reading.glossary).length ? (
        <View style={styles.glossary}>
          <H6 style={styles.heading}>{copy.whatTheseTermsMean}</H6>
          {Object.entries(reading.glossary).map(([term, gloss]) => (
            <Muted key={term} style={styles.glossRow}>
              {/* The original term stays; the gloss sits beside it, never in place of it. */}
              <T style={styles.glossTerm}>{term}</T> — {gloss}
            </Muted>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  heading: { marginBottom: space[2] },
  chips: { gap: 6, paddingRight: space[3] },
  legend: { fontSize: 10, lineHeight: 10 * 1.5, marginTop: 8 },

  banner: { marginTop: 10, borderRadius: radius.md },
  human: { fontSize: 12, color: accentText },
  machine: { fontSize: 12, lineHeight: 12 * 1.4, color: accentText },
  missing: { fontSize: 12, color: color.neutral[300] },
  note: { fontSize: 11, lineHeight: 11 * 1.5, marginTop: 6 },
  error: { fontSize: 11, lineHeight: 11 * 1.5, marginTop: 8, color: color.neutral[300] },

  glossary: { marginTop: 14 },
  glossRow: { fontSize: 12, lineHeight: 12 * 1.5, marginBottom: 4 },
  glossTerm: { fontSize: 12, color: color.text },
});
