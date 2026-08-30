/**
 * Signing in, signing out, and knowing which of the two you are.
 *
 * Ajay: *"I still don't see the login and admin privilege."* He was right, and it was not
 * a configuration problem. Sign-in existed in exactly one place — inside `ConfirmForm`,
 * behind a form a reader only reaches after choosing a proposal — and there was no way to
 * sign out anywhere at all.
 *
 * `SiteNav` already carries the lesson in its own header: *a set of correct one-way links
 * is not the same as a way around*. A control that only appears at the moment it is
 * needed cannot tell anybody the feature exists, and a session with no visible state is a
 * session a reader cannot reason about — they confirm a dish and have no idea whether it
 * counted.
 *
 * ## Nothing when there is nowhere to go
 *
 * With no `GOOGLE_CLIENT_ID` configured, `available` is false and this renders nothing at
 * all. Same rule as the donate button, the contribution form and the proposals screen: a
 * control that goes nowhere spends a reader's goodwill on a dead link. That is also why
 * it asks the server rather than assuming — the session cookie is `HttpOnly`, so the app
 * genuinely cannot see it.
 *
 * ## Why a full-page navigation rather than a fetch
 *
 * OAuth is a redirect through a domain we do not control; it cannot happen inside an XHR.
 * `src/data/auth.ts` returns URLs rather than performing the navigation for exactly this
 * reason, which keeps that module free of anything platform-specific.
 */

import { useCopy } from '../i18n';
import { Platform, StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import { NO_SESSION, loadSession, signInUrl, signOutUrl, type Session } from '../data/auth';
import { color, font, radius, space, TAP_TARGET } from '../theme/tokens';
import { Pressable } from './Pressable';
import { Muted, T } from './Text';

/** Compact for the desktop masthead; full for the phone colophon, which has room. */
export function SessionControl({ compact }: { compact?: boolean }) {
  const copy = useCopy();
  const [session, setSession] = useState<Session>(NO_SESSION);

  useEffect(() => {
    let live = true;
    loadSession().then((next) => {
      if (live) setSession(next);
    });
    return () => {
      live = false;
    };
  }, []);

  if (!session.available) return null;

  const go = (url: string) => {
    /*
     * Web only, and deliberately not silently ignored elsewhere: on native this needs the
     * system browser and a deep link back, which is a different piece of work. Until then
     * the control simply does not render on native — `available` comes from an endpoint a
     * native build can reach, so this guard is what stops it appearing there as a button
     * that does nothing.
     */
    if (Platform.OS === 'web' && typeof window !== 'undefined') window.location.href = url;
  };

  if (session.signedIn) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={copy.signedInSignOut}
        tint="neutral"
        onPress={() => go(signOutUrl())}
        style={compact ? styles.compact : styles.full}
      >
        <T style={styles.mark}>●</T>
        <View style={compact ? undefined : styles.text}>
          {/* "Sign out" in both, not "Signed in" in the masthead.

              It is a button, and a button says what pressing it does. Labelling it with
              a state left the desktop bar reading as a status while the identical
              control in the phone colophon read as an action — and the accessibility
              label has said `signedInSignOut` throughout, so a screen reader announced
              the truth that the visible text withheld.

              Nothing is lost by dropping the status: the dot beside it and the presence
              of the control both already say a session exists. Ajay asked for this after
              looking for a way to sign out and finding what looked like a label. */}
          <T style={styles.label}>{copy.signOut}</T>
          {compact ? null : (
            <Muted style={styles.note}>{copy.confirmationsCount}</Muted>
          )}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={copy.signInSoConfirmationsCount}
      tint="neutral"
      onPress={() => go(signInUrl())}
      style={compact ? styles.compact : styles.full}
    >
      <View style={compact ? undefined : styles.text}>
        <T style={styles.label}>{copy.signIn}</T>
        {compact ? null : (
          <Muted style={styles.note}>{copy.onlySignedInMovesBadge}</Muted>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    minHeight: TAP_TARGET,
    paddingHorizontal: space[3],
    borderWidth: 1,
    borderColor: color.divider,
    borderRadius: radius.md,
  },
  full: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    minHeight: TAP_TARGET,
    paddingVertical: space[2],
  },
  text: { flex: 1 },
  /* A dot rather than an avatar: there is no avatar to show. The app never asked Google
     for a name or a picture, and inventing a placeholder face would imply it holds one. */
  mark: { fontSize: 9, color: color.accent },
  label: { fontSize: 13, color: color.accent },
  note: { fontSize: 12, marginTop: 1 },
});
