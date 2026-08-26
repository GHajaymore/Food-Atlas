/**
 * Say it instead of typing it.
 *
 * Ajay: *"if you can add voice to text"*. For this project it is not a convenience. The
 * people whose knowledge the atlas is missing are, disproportionately, people who would
 * describe a method aloud in a minute and never type it at all — in Malayalam, in Amharic,
 * on a phone keyboard that fights their script. Every field this sits beside is one the
 * atlas has almost nothing in.
 *
 * ## Free, and that is why it is this API
 *
 * The browser's own `SpeechRecognition`. No key, no endpoint, no bill — which matters on a
 * project that collects no money and has to stay that way. Cloudflare's Whisper would work
 * and would draw on the same metered allowance the translation endpoint already rations;
 * this draws on nothing.
 *
 * ## What it costs instead, and why the app says so
 *
 * Chrome does not transcribe locally. It streams the audio to Google and sends back text.
 * That is a real thing to hand a stranger describing their grandmother's cooking, and this
 * app already tells readers when something leaves it — a video "opens at source", a
 * donation happens "at its source". So the control carries the same disclosure rather than
 * quietly opening a microphone into somebody else's server.
 *
 * ## Where it does not appear
 *
 * Firefox has no support, and neither does the native build: `SpeechRecognition` is a web
 * API, and an App Store build would need a new dependency, which this project does not add
 * without asking. In both cases the button is simply absent — never a dead control, which
 * is the rule the donate button and `requests.ts` already follow.
 *
 * ## It adds, never replaces
 *
 * Recognised text is appended to whatever is already in the field. Speech recognition is
 * wrong often enough that overwriting somebody's typing would be unforgivable, and a
 * person dictating in a second language will usually want to fix a word afterwards.
 */

import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useCopy, useLocale } from '../i18n';
import { accentText, color, font, radius, space, TAP_TARGET } from '../theme/tokens';
import { Pressable } from './Pressable';
import { Muted, T } from './Text';

/** The constructor, under either name, or undefined where there is none. */
function recogniser(): (new () => SpeechRecogniser) | undefined {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return undefined;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecogniser;
    webkitSpeechRecognition?: new () => SpeechRecogniser;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

/** Only the parts of the API this uses. The full type is not in the RN lib. */
interface SpeechRecogniser {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

interface Props {
  /** Current field contents, so dictation can be appended rather than dropped on top. */
  value: string;
  onChange: (value: string) => void;
  /** Names the field this dictates into, for the screen reader. */
  accessibilityLabel: string;
}

export function Dictate({ value, onChange, accessibilityLabel }: Props) {
  const copy = useCopy();
  const locale = useLocale((s) => s.locale);
  const [listening, setListening] = useState(false);
  const [problem, setProblem] = useState('');
  const ref = useRef<SpeechRecogniser | null>(null);

  /* Whatever is in the field when a session starts, so appending survives re-renders. */
  const base = useRef(value);

  useEffect(() => () => ref.current?.abort(), []);

  const Recogniser = recogniser();
  if (!Recogniser) return null;

  const start = () => {
    setProblem('');
    base.current = value;

    const engine = new Recogniser();
    /* The reader's own language, so a Hindi speaker is not transcribed as English. */
    engine.lang = locale;
    engine.continuous = true;
    engine.interimResults = false;

    engine.onresult = (event) => {
      let heard = '';
      for (let i = 0; i < event.results.length; i++) heard += event.results[i][0].transcript;
      const spoken = heard.trim();
      if (!spoken) return;
      const existing = base.current.trim();
      onChange(existing ? `${existing} ${spoken}` : spoken);
    };

    engine.onerror = (event) => {
      /* "aborted" is what stopping produces, and is not a fault worth reporting. */
      if (event.error === 'aborted') return;
      setProblem(event.error === 'not-allowed' ? copy.dictateNotAllowed : copy.dictateDidNotWork);
      setListening(false);
    };

    engine.onend = () => setListening(false);

    ref.current = engine;
    try {
      engine.start();
      setListening(true);
    } catch {
      setProblem(copy.dictateDidNotWork);
    }
  };

  const stop = () => {
    ref.current?.stop();
    setListening(false);
  };

  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ busy: listening }}
        accessibilityLabel={
          listening ? copy.dictateStop : `${copy.dictateSpeak}. ${accessibilityLabel}`
        }
        tint="neutral"
        onPress={listening ? stop : start}
        style={styles.button}
      >
        <T style={styles.glyph}>{listening ? '■' : '🎙'}</T>
        <T style={listening ? styles.labelOn : styles.label}>
          {listening ? copy.dictateListening : copy.dictateSpeak}
        </T>
      </Pressable>

      {/* Said once, beside the control, rather than buried in a policy nobody opens. */}
      <Muted style={styles.note}>{problem || copy.dictateSendsAudio}</Muted>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: space[2] },
  button: {
    minHeight: TAP_TARGET,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingHorizontal: space[3],
    borderWidth: 1,
    borderColor: color.divider,
    borderRadius: radius.md,
  },
  glyph: { fontSize: 14 },
  label: { fontSize: 13, color: color.text },
  labelOn: { fontSize: 13, color: accentText, fontFamily: font.medium },
  note: { fontSize: 11, lineHeight: 11 * 1.5, marginTop: space[2] },
});
