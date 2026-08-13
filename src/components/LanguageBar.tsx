/**
 * The language control, and the provenance banner that goes with it.
 *
 * The banner is not a nicety. A reader looking at a fermentation time needs to know
 * whether a person or a machine put that number in front of them, so the app states
 * it every time it is showing anything other than the original.
 */

import { ScrollView, StyleSheet, View } from 'react-native';
import type { ReadableDish } from '../domain/translate';
import { LANGUAGES } from '../domain/language';
import { accentText, color, radius, space } from '../theme/tokens';
import { Button } from './Button';
import { Block } from './Card';
import { H6, Muted, T } from './Text';
import { Tag } from './Tag';

interface Props {
  language: string;
  onSelect: (code: string) => void;
  /** Which languages this record can be read in without fetching anything. */
  available: string[];
  reading: ReadableDish;
  status: 'idle' | 'loading' | 'error';
  error?: string;
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
  return (
    <View style={styles.wrap}>
      <H6 style={styles.heading}>Read this in</H6>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {LANGUAGES.map((lang) => (
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
        A dot marks a language this record has already been translated into.
      </Muted>

      {reading.status !== 'original' ? (
        <Block style={styles.banner} accent={reading.status === 'human'}>
          {reading.status === 'human' ? (
            <T style={styles.human}>Community translation</T>
          ) : reading.status === 'machine' ? (
            <T style={styles.machine}>Machine translation — not yet checked by anyone from the community</T>
          ) : (
            <T style={styles.missing}>Not translated yet</T>
          )}
          <Muted style={styles.note}>{reading.note}</Muted>

          {reading.status === 'missing' ? (
            canTranslate ? (
              <Button
                label={status === 'loading' ? 'Translating…' : 'Translate this record'}
                variant="secondary"
                block
                onPress={onTranslate}
              />
            ) : (
              <Muted style={styles.note}>
                No translation service is connected to this build, so nothing can be translated automatically. A
                translation from someone who cooks this dish is worth more than one anyway — it can be contributed
                through Add a tradition.
              </Muted>
            )
          ) : null}

          {status === 'error' && error ? <T style={styles.error}>{error}</T> : null}
        </Block>
      ) : null}

      {Object.keys(reading.glossary).length ? (
        <View style={styles.glossary}>
          <H6 style={styles.heading}>What these terms mean</H6>
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
