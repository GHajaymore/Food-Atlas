/**
 * What the site knows about a reader, in the site's own words.
 *
 * Written because Google will not let the app out of testing mode without a privacy
 * policy link — but written to be true rather than to satisfy a form. The front page
 * claims "nothing tracked" in four places, and a policy that quietly contradicted that
 * would make the claim worse, not better.
 *
 * Deliberately six short sections and not the nine it started as. Ajay's objection was
 * exactly right: length is itself a claim. A policy with a section per worry implies
 * there are that many worries, and on a site that holds no email address, no name and no
 * user table at all, the honest shape of the page is a short one.
 *
 * Every statement is checkable against code in this repository:
 *
 *   - `migrations/0005_analytics.sql` — `event_day(day, kind, target, count)`. No visitor
 *     column, no time finer than a day, counters incremented rather than rows appended.
 *   - `functions/api/events.ts` — reads no IP, no user agent, no cookie. The identity
 *     cookie is scoped to `/api/proposals`, so the browser does not even send one here.
 *   - `functions/api/auth/_session.ts` — a salted one-way hash of Google's subject id.
 *     No email, no name, no picture, and no user table anywhere in the schema.
 *   - `functions/api/auth/google.ts` — the scope requested is `openid`, and nothing else.
 *
 * The section that matters most is the one about other people's servers. Photographs come
 * from Wikimedia and video stills from YouTube, which means those companies see a reader's
 * IP address as a consequence of the browser fetching an image. Saying "nothing tracked"
 * without saying that would be the kind of true-sounding half-statement this project
 * refuses everywhere else.
 *
 * English only, and the page says so in its own lede. This is the one screen where a
 * guessed translation is worse than none: elsewhere a stiff sentence costs nothing, and
 * here a mistranslated one is a false statement to a reader about their own data.
 */

import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { NavRow } from '../src/components/NavRow';
import { Screen } from '../src/components/Screen';
import { Body, H4, Muted } from '../src/components/Text';
import { useCopy } from '../src/i18n';
import { space } from '../src/theme/tokens';

export default function Privacy() {
  const copy = useCopy();

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/atlas');
  };

  const sections: [string, string][] = [
    [copy.privacyCountsHeading, copy.privacyCountsBody],
    [copy.privacyCookiesHeading, copy.privacyCookiesBody],
    [copy.privacyPublicHeading, copy.privacyPublicBody],
    [copy.privacyOthersHeading, copy.privacyOthersBody],
    [copy.privacyPlainHeading, copy.privacyPlainBody],
    [copy.privacyContactHeading, copy.privacyContactBody],
  ];

  return (
    <Screen measure bottomPad={50}>
      <NavRow title={copy.privacyTitle} onBack={back} />

      <Muted style={styles.lede}>{copy.privacyLede}</Muted>

      {sections.map(([heading, body]) => (
        <View key={heading} style={styles.section}>
          <H4 level={2} style={styles.heading}>
            {heading}
          </H4>
          <Body style={styles.body}>{body}</Body>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  lede: { marginTop: space[2], lineHeight: 22 },
  section: { marginTop: space[6] },
  heading: { marginBottom: space[2] },
  body: { lineHeight: 24 },
});
