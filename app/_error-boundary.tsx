/**
 * What a reader sees when a screen throws.
 *
 * Without this, a render error unmounts the tree and leaves a black page — no wordmark, no
 * message, no way back. Indistinguishable from a site that has gone down, on a site that
 * has not.
 *
 * The app already refuses that trade elsewhere. `_layout.tsx` says of a failed catalogue
 * fetch: *"Said plainly rather than left as an empty atlas. A reader who sees no traditions
 * should be told the data did not arrive, not left to conclude there are none."* Same
 * argument, one layer up.
 *
 * ## What it says, and what it does not
 *
 * It does not show the error. A stack trace is for whoever is fixing it, and printing it to
 * a reader is noise that also happens to describe the inside of the app to anybody who
 * asks. It says something went wrong on this screen, that the rest of the atlas is intact,
 * and offers the way back.
 *
 * `retry` is Expo Router's own, and it re-renders the route rather than reloading the page
 * — which is worth having because most render errors are about one record's shape, and the
 * reader who navigates elsewhere never sees it again.
 *
 * ## Reported, then forgotten
 *
 * One line to the console, because a fault nobody can see is a fault nobody fixes. Nothing
 * is sent anywhere: the app promises no tracking, and an error reporter is a tracker with a
 * better reason.
 */

import { useEffect } from 'react';
import { router } from 'expo-router';
import { Button } from '../src/components/Button';
import { Card, CardBody, CardKicker } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { useCopy } from '../src/i18n';

export function ErrorBoundary({ error, retry }: { error: Error; retry: () => Promise<void> }) {
  const copy = useCopy();

  useEffect(() => {
    /* The message and where it came from. Not sent anywhere — see above. */
    console.error('[screen]', error?.message ?? error, error?.stack?.split('\n')[1]?.trim() ?? '');
  }, [error]);

  return (
    <Screen footer={false}>
      <Card>
        <CardKicker>{copy.screenFailed}</CardKicker>
        <CardBody>{copy.screenFailedBody}</CardBody>
        <Button label={copy.tryAgain} onPress={() => void retry()} block />
        <Button
          label={copy.backToTheFeed}
          onPress={() => router.replace('/')}
          block
          variant="secondary"
        />
      </Card>
    </Screen>
  );
}
