/**
 * What one person said, with a translation beside it rather than instead of it.
 *
 * Ajay, 2026-08-24, asked for everything in the chosen language including proposals. The
 * shape agreed for evidence is in `domain/testimony.ts`: the original always shows, a
 * translation is offered next to it, it is labelled machine-made, and it can never be
 * what a badge rests on.
 *
 * ## The original is rendered before anything is decided
 *
 * Not inside a branch, not in an `else`. Whatever the translation state — absent,
 * loading, failed, arrived — the quote above it has already been rendered and cannot be
 * swapped out by a later change to this file. That is the rule made structural instead
 * of remembered, which is the only version of a rule that survives being edited by
 * somebody who has not read the header.
 *
 * ## Nothing here is automatic
 *
 * A record translates itself on arrival because the reader asked for that language and
 * the text is the atlas's own. A confirmation waits to be asked, for two reasons: it is
 * somebody's testimony rather than our prose, and translating every confirmation on every
 * proposal on sight would spend a metered service on sentences nobody chose to read.
 */

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { canOfferTranslation, testimonyNote } from '../domain/testimony';
import { translationProvider } from '../domain/translationProvider';
import { useLocale } from '../i18n';
import { color, space } from '../theme/tokens';
import { Pressable } from './Pressable';
import { Muted } from './Text';

export function Testimony({ said }: { said: string }) {
  const locale = useLocale((state) => state.locale);
  const [translated, setTranslated] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'failed'>('idle');

  const offer = canOfferTranslation(said, translationProvider.isConfigured());

  return (
    <View style={styles.wrap}>
      {/* Rendered first and unconditionally. See the header. */}
      <Muted style={styles.said}>“{said}”</Muted>

      {translated ? (
        <View style={styles.translation}>
          <Muted style={styles.translatedText}>“{translated}”</Muted>
          <Muted style={styles.note}>{testimonyNote(translationProvider.name)}</Muted>
        </View>
      ) : null}

      {offer && !translated ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Translate this confirmation into ${locale}`}
          tint="none"
          disabled={state === 'loading'}
          onPress={async () => {
            setState('loading');
            try {
              setTranslated(await translationProvider.translateText({ text: said, target: locale }));
              setState('idle');
            } catch {
              /*
               * Said plainly rather than silently. A control that does nothing when
               * pressed is worse than one that reports it could not — and the original
               * is still on screen, which is the part that matters.
               */
              setState('failed');
            }
          }}
          style={styles.control}
        >
          <Muted style={styles.controlLabel}>
            {state === 'loading' ? 'Translating…' : state === 'failed' ? 'Could not translate — try again' : 'Translate'}
          </Muted>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  said: { fontSize: 12, lineHeight: 12 * 1.5, fontStyle: 'italic' },

  /* Indented behind a rule, so a reader can see at a glance which words are the
     person's and which are the machine's. */
  translation: {
    marginTop: 6,
    paddingLeft: space[3],
    borderLeftWidth: 1,
    borderLeftColor: color.divider,
    gap: 3,
  },
  translatedText: { fontSize: 12, lineHeight: 12 * 1.5 },
  note: { fontSize: 10, lineHeight: 10 * 1.5, color: color.meta },

  control: { alignSelf: 'flex-start', paddingVertical: 4 },
  controlLabel: { fontSize: 11, color: color.accent },
});
