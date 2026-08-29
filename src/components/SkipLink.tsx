/**
 * "Skip to the atlas" — the first thing in the tab order, and invisible until it matters.
 *
 * Every page opens with the masthead: the wordmark, five destinations, the language
 * picker, the search. Eight controls before a single record. Somebody using a keyboard or
 * a switch met all eight on every page, and somebody using a screen reader heard them
 * read out before reaching what they came for.
 *
 * WCAG 2.4.1 (Bypass Blocks) is a Level A criterion and this was the app failing it. The
 * heading and landmark work done earlier helps a screen reader jump around; it does
 * nothing for a keyboard, which has no notion of a heading.
 *
 * ## Why a real anchor rather than a Pressable
 *
 * A `<a href="#main">` moves focus in the browser's own way, with no JavaScript involved
 * and no listener to fail. `Pressable` would render a div with a click handler, which
 * cannot move focus by itself and would need the very code this avoids. Web only: on
 * native there is no tab order to skip through and no fragment to navigate to.
 *
 * ## Visible only when focused
 *
 * Hidden by clipping rather than by `display: none` or `visibility: hidden` — both of
 * those remove an element from the tab order entirely, which would make this link
 * unreachable by the only people who need it. The clip is undone on `:focus`, so it
 * appears the moment somebody tabs to it and disappears again after. That rule lives in
 * `theme/webStyles.ts` beside the other things react-native-web cannot express.
 */

import { Platform } from 'react-native';
import { useCopy } from '../i18n';

export function SkipLink() {
  const copy = useCopy();

  /* Nothing to skip on a phone app: there is no tab order and no fragment navigation. */
  if (Platform.OS !== 'web') return null;

  return (
    <a href="#main" data-skip-link="true">
      {copy.skipToContent}
    </a>
  );
}
