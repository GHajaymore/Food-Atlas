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
 * Open a URL outside the app. On native this hands off to the system browser /
 * the provider's own app; on web it opens a new tab. Either way playback happens
 * at the source, with the creator credited and their metrics intact.
 */
export async function openAtSource(url: string): Promise<void> {
  if (!url) return;
  if (Platform.OS === 'web') {
    await Linking.openURL(url);
    return;
  }
  await WebBrowser.openBrowserAsync(url, { presentationStyle: WebBrowser.WebBrowserPresentationStyle.AUTOMATIC });
}

/** The top-ranked video for a dish — ranked by locality, so index 0 is the closest cook. */
export const topVideo = (videos: Video[]): Video | undefined => videos[0];
