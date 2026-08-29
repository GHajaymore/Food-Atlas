/**
 * A page that is not here, said in this app's voice.
 *
 * Without this file Expo Router serves its own unmatched-route screen, and that screen is
 * built for whoever is writing the app rather than for whoever is reading it. On the live
 * site it read:
 *
 *   Unmatched Route
 *   Page could not be found.
 *   https://wikifoodia.ajailabs.app/not-a-real-page
 *   Go back • Sitemap
 *
 * Three things wrong with that for a reader. It is in English whatever language they chose,
 * because it is not part of the app's copy at all. It shows them the URL they already know
 * is broken. And "Sitemap" is a development tool — an invitation to a debug screen, offered
 * to somebody who mistyped a link.
 *
 * ## Why it reads the way it does
 *
 * The same shape as the two other places this app has to say "there is nothing here": the
 * empty search result, and a record id that matches nothing. Both were written to say what
 * is missing without implying the food is — *"Absence here means no record, not no food."*
 * A wrong URL means less than either of those: it says nothing about the atlas, only that
 * this address is not one of its pages. So this points onward rather than apologising, and
 * offers the two ways in that a stranger arriving on a broken link can actually use.
 *
 * A path is deliberately not shown. Somebody who followed a stale link did not type it, and
 * reciting it back is noise dressed as diagnosis.
 */

import { router } from 'expo-router';
import { Button } from '../src/components/Button';
import { Card, CardBody, CardKicker } from '../src/components/Card';
import { NavRow } from '../src/components/NavRow';
import { Screen } from '../src/components/Screen';
import { useCopy } from '../src/i18n';

export default function NotFound() {
  const copy = useCopy();

  return (
    <Screen>
      <NavRow />
      <Card>
        <CardKicker>{copy.pageNotFound}</CardKicker>
        <CardBody>{copy.pageNotFoundBody}</CardBody>
        {/* The atlas first: somebody who arrived on a broken link is more likely to be
            looking for a place than for a word they have not thought of yet. */}
        <Button label={copy.foodAtlas} onPress={() => router.replace('/atlas')} block />
        <Button label={copy.search} onPress={() => router.replace('/search')} block variant="secondary" />
      </Card>
    </Screen>
  );
}
