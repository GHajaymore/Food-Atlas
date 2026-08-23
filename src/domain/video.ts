/**
 * Video links.
 *
 * Videos always open at their source, in an external context. We do not embed a
 * player, do not proxy, and do not autoplay — we store the provider id and metadata
 * only. The still frame comes from the provider's own thumbnail endpoint, so the
 * dish you see is the dish that cook actually made.
 */

import * as WebBrowser from 'expo-web-browser';
import { Linking, Platform } from 'react-native';
import type { Video } from './types';

/** The still frame, taken from the video itself. */
export const thumbnailUrl = (video: Pick<Video, 'id'>): string =>
  `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;

/** The canonical watch URL at the provider. */
export const watchUrl = (video: Pick<Video, 'id' | 'short'>): string =>
  video.short ? `https://www.youtube.com/shorts/${video.id}` : `https://www.youtube.com/watch?v=${video.id}`;

/**
 * Schemes this app will hand to the platform. Everything else is refused.
 *
 * `javascript:` is the one that matters. On web `Linking.openURL` ends up navigating,
 * and a `javascript:` URL there executes in the page — with the reader's session and
 * whatever the app holds.
 *
 * That is not a theoretical worry here, because **the URLs are not ours**. Every source
 * link on a record comes from Wikidata, Wikipedia or Wikibooks, which are edited by the
 * public; `dish.popular.url` and `claim.source.url` are the same. An atlas built out of
 * open wikis has to assume its own data can be hostile, and the only safe way to open a
 * link somebody else wrote is to check what kind of link it is first.
 *
 * `data:` and `blob:` are refused for the same reason, and `file:` because nothing here
 * should ever reach the device's own storage.
 */
const OPENABLE = new Set(['http:', 'https:', 'mailto:']);

/**
 * Whether a URL is safe to hand to the platform.
 *
 * Parsed rather than pattern-matched: `java\nscript:alert(1)` and `JaVaScript:` both
 * defeat a regex over the raw string, and `URL` normalises them. Anything unparseable
 * is refused, which is the right way round — a link the app cannot understand is not a
 * link it should open.
 */
export function isOpenable(url: string): boolean {
  try {
    return OPENABLE.has(new URL(url).protocol);
  } catch {
    return false;
  }
}

/**
 * Open a URL outside the app. On native this hands off to the system browser /
 * the provider's own app; on web it opens a new tab. Either way playback happens
 * at the source, with the creator credited and their metrics intact.
 *
 * Refuses silently on a URL it will not open. A reader tapping a source and getting
 * nothing is a poor experience; a reader tapping a source and running somebody's
 * script is a much worse one, and the case is rare enough that the trade is easy.
 */
export async function openAtSource(url: string): Promise<void> {
  if (!isOpenable(url)) return;
  if (Platform.OS === 'web') {
    await Linking.openURL(url);
    return;
  }
  await WebBrowser.openBrowserAsync(url, { presentationStyle: WebBrowser.WebBrowserPresentationStyle.AUTOMATIC });
}

/** The top-ranked video for a dish — ranked by locality, so index 0 is the closest cook. */
export const topVideo = (videos: Video[]): Video | undefined => videos[0];
