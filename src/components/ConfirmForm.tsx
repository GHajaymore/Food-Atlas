/**
 * Saying you know a dish.
 *
 * One form for two callers, and that is deliberate rather than economical. A
 * confirmation on an eighteen-thousandth existing record and a confirmation on a
 * proposal somebody made this morning are the *same act*, carrying the same weight
 * against the same threshold — `PROPOSAL_CONFIRMATIONS` is `VALIDATIONS_REQUIRED` for
 * exactly this reason. Two forms would have drifted, and the day they said different
 * things the badge would have started meaning two things.
 *
 * ## Why it asks what it asks
 *
 * `connection` and `said` are required, and they are the whole design. A count is
 * something a reader has to trust; *"Priya, born in Kozhikode — we use ghee, not oil"*
 * is evidence they can weigh, and it is far harder to fake convincingly. The app shows
 * confirmations rather than counting them, which is also what makes a fraud visible
 * instead of invisible.
 *
 * `said` asks what they are confirming rather than whether they approve, because
 * somebody from Kozhikode can tell you about the ghee with complete authority and know
 * nothing about where the dish originated. A yes/no forces them to overclaim or to say
 * nothing, and both lose the thing worth having.
 *
 * ## The checkbox that decides Local against Regional
 *
 * Nothing verifies it and nothing can — a person in Toronto can tick it. That is not an
 * oversight awaiting a fix: verifying residence needs identity documents or geolocation,
 * and both are hostile to precisely the people this depends on. The defence is exposure,
 * not verification, which is why the connection sits beside it and is displayed.
 *
 * The wording matters here. It asks about the *town* rather than about the region,
 * because the checkbox does not measure how strong a confirmation is — a record does not
 * become more authentic when somebody from the wider state agrees, it becomes more
 * *local* when somebody from the town does.
 */

import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { NO_SESSION, loadSession, signInUrl, type Session } from '../data/auth';
import { color, font, space, TAP_TARGET } from '../theme/tokens';
import { Button } from './Button';
import { Block } from './Card';
import { Field, Input } from './Field';
import { Pressable } from './Pressable';
import { stillNeeded, tidyName, tidyText } from '../domain/entry';
import { Muted, T } from './Text';

export interface Said {
  name: string;
  connection: string;
  said: string;
  local: boolean;
}

const EMPTY: Said = { name: '', connection: '', said: '', local: false };

/**
 * The words this form puts on each box, for when one is left empty.
 *
 * It used to report the field keys — *"Still needed: name, connection, said."* — and
 * `said` is a database column nobody has ever seen on screen. Same fault and same fix as
 * `REQUIRED_LABELS` in `domain/proposals.ts`.
 */
const REQUIRED_LABELS = {
  name: 'your name',
  connection: 'your connection to the place',
  said: 'what you can confirm',
} satisfies Partial<Record<keyof Said, string>>;

export function ConfirmForm({
  /** What is being confirmed, named in the prompt so the act is never ambiguous. */
  subject,
  onSubmit,
  busy,
}: {
  subject: string;
  onSubmit: (said: Said) => Promise<{ ok: boolean; error?: string }>;
  busy?: boolean;
}) {
  const [form, setForm] = useState<Said>(EMPTY);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [session, setSession] = useState<Session>(NO_SESSION);

  useEffect(() => {
    loadSession().then(setSession);
  }, []);

  const set = <K extends keyof Said>(key: K, value: Said[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const missing = (Object.keys(REQUIRED_LABELS) as (keyof typeof REQUIRED_LABELS)[]).filter(
    (k) => !form[k].trim(),
  );

  if (done) {
    return (
      <Block accent style={styles.wrap}>
        <T style={styles.thanks}>Recorded. Thank you.</T>
        <Muted style={styles.note}>
          It is shown on the record with your connection beside it, so readers can weigh it themselves.
        </Muted>
      </Block>
    );
  }

  return (
    <Block style={styles.wrap}>
      <T style={styles.prompt}>Do you know {subject}?</T>
      <Muted style={styles.note}>
        Confirm what you actually know. You do not have to vouch for the whole record — one specific thing
        from somebody who cooks it is worth more than general agreement.
      </Muted>

      {/*
       * Said before the fields, not after sending.
       *
       * Only a signed-in confirmation counts toward the badge, because an anonymous one
       * is a private window away from being three of them. A reader who writes three
       * sentences about their grandmother's halwa and *then* learns it did not count has
       * been wasted, and will reasonably not come back.
       *
       * Both states are worded as a fact rather than a nudge. An unsigned confirmation is
       * genuinely wanted — it is shown on the record with everything the person said —
       * and telling somebody their contribution is worthless unless they get an account
       * would be both discouraging and untrue.
       */}
      {session.available ? (
        session.signedIn ? (
          <T style={styles.counts}>Signed in — this will count toward the badge.</T>
        ) : (
          <View style={styles.signIn}>
            <Muted style={styles.note}>
              Not signed in. What you write will be shown on the record with your connection, and it will
              not move the badge — that count only rises for signed-in people, so one person cannot be
              three of them.
            </Muted>
            <Button
              label="Sign in, so it counts"
              variant="secondary"
              compact
              style={styles.signInButton}
              onPress={() => {
                if (Platform.OS === 'web' && typeof window !== 'undefined') {
                  window.location.href = signInUrl();
                }
              }}
            />
          </View>
        )
      ) : null}

      <Field label="Your name" style={styles.field}>
        <Input
          value={form.name}
          onChangeText={(v) => set('name', v)}
          placeholder="Shown on the record"
          accessibilityLabel="Your name"
        />
      </Field>

      <Field label="Your connection to the place" style={styles.field}>
        <Input
          value={form.connection}
          onChangeText={(v) => set('connection', v)}
          placeholder="Born and cooking in Kozhikode"
          accessibilityLabel="Your connection to the place"
        />
      </Field>

      <Field label="What can you confirm?" style={styles.field}>
        <Input
          value={form.said}
          onChangeText={(v) => set('said', v)}
          placeholder="We use ghee, not oil — and it is made at Eid, not year round."
          multiline
          numberOfLines={3}
          accessibilityLabel="What can you confirm"
        />
      </Field>

      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: form.local }}
        accessibilityLabel="I am from the town or village itself, not the wider region"
        tint="neutral"
        onPress={() => set('local', !form.local)}
        style={styles.check}
      >
        <View style={[styles.box, form.local ? styles.boxOn : null]}>
          {form.local ? <T style={styles.tick}>✓</T> : null}
        </View>
        <T style={styles.checkLabel}>
          I am from the town or village itself, not just the wider region
        </T>
      </Pressable>

      {error ? <T style={styles.error}>{error}</T> : null}

      <Button
        label={busy ? 'Sending…' : 'Confirm'}
        block
        style={styles.submit}
        onPress={async () => {
          if (busy) return;
          if (missing.length) {
            setError(stillNeeded(missing.map((k) => REQUIRED_LABELS[k])));
            return;
          }
          setError('');
          /*
           * Sent tidied, not raw. This form used to trim only to decide whether a field
           * was empty, then submit whatever was in the box — so a confirmation could be
           * signed "  Priya  " while a proposal typed on the next screen came through
           * clean. A confirmation is evidence a reader weighs by eye; it should not look
           * scruffier than the record it is vouching for. See `domain/entry.ts`.
           */
          const result = await onSubmit({
            ...form,
            name: tidyName(form.name),
            connection: tidyText(form.connection),
            said: tidyText(form.said),
          });
          if (result.ok) setDone(true);
          else setError(result.error ?? 'That did not send.');
        }}
      />
    </Block>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: space[4], gap: space[2] },
  prompt: { fontSize: 15, color: color.text, fontFamily: font.semibold },
  note: { fontSize: 12, lineHeight: 17 },
  field: { marginTop: space[2] },
  check: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    minHeight: TAP_TARGET,
    marginTop: space[2],
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: color.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: { borderColor: color.accent, backgroundColor: color.accent },
  tick: { fontSize: 13, color: color.bg, fontFamily: font.semibold },
  checkLabel: { flex: 1, fontSize: 12, color: color.muted, lineHeight: 16 },
  // The palette has no danger colour, on purpose — nothing in this app is an alarm.
  // Accent is what it uses to mean "look here", which is what an unsent form needs.
  error: { fontSize: 12, color: color.accent, marginTop: space[1] },
  thanks: { fontSize: 15, color: color.accent, fontFamily: font.semibold },
  submit: { marginTop: space[3] },
  counts: { fontSize: 12, color: color.accent, marginTop: space[2] },
  signIn: { marginTop: space[2], gap: space[2] },
  signInButton: { alignSelf: 'flex-start' },
});
