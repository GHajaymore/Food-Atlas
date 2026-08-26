/**
 * Offer a tidied version. Never impose one.
 *
 * The fields this sits beside are the ones a chooser cannot hold — how a dish is made, who
 * makes it, somebody's connection to a place — typed on a phone, often in a second
 * language, often with autocorrect fighting a word it has never seen. Fixing that is a
 * kindness. Doing it without being asked would be something else entirely.
 *
 * ## The shape is the argument
 *
 * The suggestion appears **below what they wrote, as a separate block, marked as machine
 * text**, with a control to take it and a control to keep their own. Nothing is written
 * into the field until the person presses the button. That is `testimony.ts`'s first rule
 * — the original is always present — applied at the point of writing rather than the point
 * of reading, and it is the difference between a tool and a ghostwriter.
 *
 * ## Absent rather than broken
 *
 * `GET /api/polish` answers `available: false` where Workers AI is not bound, and then this
 * renders nothing at all: no button, no explanation, no dead control. Same rule as the
 * donate button and the dictation control.
 *
 * ## What it costs
 *
 * Every press is one call against the same daily allowance the translation endpoint
 * rations — one counter, one ceiling, so a second AI feature cannot double the bill. When
 * the day's budget is gone the endpoint says so in a sentence that makes clear nothing is
 * wrong with what they wrote.
 */

import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useCopy } from '../i18n';
import { accentText, color, radius, space } from '../theme/tokens';
import { Button } from './Button';
import { Muted, T } from './Text';

interface Props {
  value: string;
  onChange: (value: string) => void;
  accessibilityLabel: string;
}

/** Cached across mounts: whether the deployment has the feature at all. */
let availability: boolean | null = null;

export function Polish({ value, onChange, accessibilityLabel }: Props) {
  const copy = useCopy();
  const [available, setAvailable] = useState<boolean>(availability ?? false);
  const [busy, setBusy] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [problem, setProblem] = useState('');

  useEffect(() => {
    if (availability !== null) {
      setAvailable(availability);
      return;
    }
    let alive = true;
    void fetch('/api/polish')
      .then((r) => r.json())
      .then((info: { available?: boolean }) => {
        availability = Boolean(info?.available);
        if (alive) setAvailable(availability);
      })
      /* A failed check means no feature, not an error worth showing anybody. */
      .catch(() => {
        availability = false;
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!available) return null;

  const text = value.trim();

  const ask = async () => {
    setBusy(true);
    setProblem('');
    setSuggestion('');
    try {
      const response = await fetch('/api/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data: { polished?: string; changed?: boolean; error?: string } = await response.json();
      if (!response.ok) {
        setProblem(data.error ?? copy.polishDidNotWork);
      } else if (!data.changed) {
        /* Saying "nothing to change" is worth more than showing an identical block. */
        setProblem(copy.polishFoundNothing);
      } else {
        setSuggestion(data.polished ?? '');
      }
    } catch {
      setProblem(copy.polishDidNotWork);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Button
        label={busy ? copy.polishWorking : copy.polishTidyThis}
        variant="secondary"
        compact
        fontSize={12}
        onPress={() => {
          if (!busy && text) void ask();
        }}
        style={styles.button}
      />

      {problem ? <Muted style={styles.note}>{problem}</Muted> : null}

      {suggestion ? (
        <View style={styles.panel}>
          {/* Labelled before it is read, not after it is taken. */}
          <Muted style={styles.badge}>{copy.polishMachineMade}</Muted>
          <T style={styles.suggestion}>{suggestion}</T>
          <View style={styles.actions}>
            <Button
              label={copy.polishUseThis}
              compact
              fontSize={12}
              onPress={() => {
                onChange(suggestion);
                setSuggestion('');
              }}
            />
            <Button
              label={copy.polishKeepMine}
              variant="secondary"
              compact
              fontSize={12}
              onPress={() => setSuggestion('')}
            />
          </View>
          <Muted style={styles.note}>{copy.polishOnlyTyping}</Muted>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: space[2] },
  button: { alignSelf: 'flex-start' },
  panel: {
    marginTop: space[2],
    padding: space[3],
    borderWidth: 1,
    borderColor: color.divider,
    borderRadius: radius.md,
    backgroundColor: color.surface,
  },
  badge: { fontSize: 11, color: accentText, marginBottom: space[2] },
  suggestion: { fontSize: 13, lineHeight: 13 * 1.5, color: color.text },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2], marginTop: space[3] },
  note: { fontSize: 11, lineHeight: 11 * 1.5, marginTop: space[2] },
});
