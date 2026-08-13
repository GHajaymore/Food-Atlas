/**
 * Finding a preparation video for a dish that has none.
 *
 * Most imported records carry no video, and a "Watch it being made" section with
 * nothing in it is exactly the empty shell this atlas should not have. So where no
 * locality-ranked video has been curated, the app offers a route to one.
 *
 * **How this sits with the locality rule.** The brief orders videos by the cook's
 * closeness to the tradition, never by views, and that rule is untouched: a curated
 * record's ranked list is never reordered, and a discovered video never joins it.
 * What changes is only the case where the alternative is *nothing at all* — and
 * there, the most-watched preparation video is a genuinely useful starting point,
 * provided the app says plainly that is what it is. A discovered video is labelled
 * "Most watched", carries no authenticity standing, and never affects a score.
 *
 * Two levels of capability:
 *
 *   - **Always available, no key**: a search link at the provider, built from the
 *     dish and its place. Honest — it promises a search, not a verified video.
 *   - **With a discovery endpoint configured**: the top preparation videos by view
 *     count, fetched and shown, still labelled as popularity-ranked and unverified.
 */

import type { Dish } from './types';

/** A video found by popularity rather than by locality. Never mixed into `videos`. */
export interface DiscoveredVideo {
  id: string;
  title: string;
  channel: string;
  /** Display string, e.g. '1.2M views'. Popularity, kept visibly separate. */
  views: string;
  short: boolean;
  /** 'hd' or 'sd', from the provider. */
  definition?: string;
  /** Runtime in seconds. A preparation is minutes long; a clip is not. */
  durationSeconds?: number;
  /** The provider's licence field, where it distinguishes uploads from syndication. */
  license?: string;
}

/**
 * What counts as a high-quality original.
 *
 * The point of "original" is the same point the locality rule makes: the video
 * should be the work of the person who cooked, not a re-upload, a compilation, or a
 * clip lifted from someone else's kitchen. Those are the videos that strip a cook of
 * both credit and context, and they dominate popularity rankings precisely because
 * they are cheap to produce.
 *
 * These rules travel with the request, so any backend implementing the endpoint
 * applies the same ones, and are re-checked on the way back in `isAcceptable`.
 */
export const VIDEO_QUALITY_RULES = {
  /** HD only. A traditional method is worth seeing properly. */
  definition: 'high' as const,
  /**
   * At least two minutes. Shorts and clips almost never show a full preparation,
   * and are the format most often re-uploaded without the original cook's involvement.
   */
  minDurationSeconds: 120,
  /** Long enough to be a method, not a montage; loose enough for a real recipe video. */
  maxDurationSeconds: 60 * 60,
  /** Embeddable, syndicated uploads only — a proxy for a legitimate original upload. */
  embeddable: true,
  /**
   * Title markers of derivative uploads. Not exhaustive, and deliberately
   * conservative: it rejects the obvious re-uploads rather than trying to be clever.
   */
  excludeTitlePatterns: [
    'compilation',
    'reaction',
    'tiktok',
    'shorts',
    'top 10',
    'top 5',
    'best of',
    'mukbang',
    'asmr',
    're-upload',
    'reupload',
  ],
} as const;

/**
 * Reject anything that came back violating the rules.
 *
 * Same posture as the translation provider: a response that broke the contract is
 * discarded, not displayed. A search endpoint that quietly returns a 30-second clip
 * scraped from someone's kitchen should not be able to put it in front of a reader.
 */
export function isAcceptable(video: DiscoveredVideo): boolean {
  if (video.short) return false;

  if (video.definition && video.definition !== 'hd') return false;

  if (video.durationSeconds !== undefined) {
    if (video.durationSeconds < VIDEO_QUALITY_RULES.minDurationSeconds) return false;
    if (video.durationSeconds > VIDEO_QUALITY_RULES.maxDurationSeconds) return false;
  }

  const title = video.title.toLowerCase();
  return !VIDEO_QUALITY_RULES.excludeTitlePatterns.some((p) => title.includes(p));
}

/**
 * The query used to look for a preparation video.
 *
 * Built from the dish and the deepest place on its record, plus the words that bias
 * towards someone actually cooking rather than a restaurant review. The place terms
 * matter: they are the only thing nudging the result towards the tradition's own
 * kitchens rather than the most-viewed international version.
 */
export function searchQuery(dish: Pick<Dish, 'name' | 'breadcrumb'>): string {
  const place = dish.breadcrumb.slice(-2).join(' ');
  // "full recipe" and "traditional" bias towards a complete original preparation
  // rather than a clip or a compilation.
  return `${dish.name} ${place} traditional full recipe how to make`.replace(/\s+/g, ' ').trim();
}

/** A provider search URL. Always available — no API key, no fabrication. */
export const searchUrl = (dish: Pick<Dish, 'name' | 'breadcrumb'>): string =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery(dish))}`;

export interface VideoDiscoveryProvider {
  readonly name: string;
  isConfigured(): boolean;
  /** Top preparation videos by view count. Ordered by popularity, and labelled so. */
  findTopVideos(dish: Dish, limit?: number): Promise<DiscoveredVideo[]>;
}

/**
 * Discovery through your own backend route.
 *
 * The endpoint holds the provider API key and forwards the search. The key
 * deliberately does not live in the app: `EXPO_PUBLIC_*` values ship inside the
 * bundle, so a key placed there is readable by anyone who downloads the app.
 *
 * Expected contract — POST `{ query, limit }`, returns
 * `{ videos: [{ id, title, channel, views, short }] }`, ordered by view count.
 */
export class RemoteVideoDiscovery implements VideoDiscoveryProvider {
  readonly name = 'most-watched search';

  constructor(private endpoint = process.env.EXPO_PUBLIC_VIDEO_SEARCH_ENDPOINT ?? '') {}

  isConfigured(): boolean {
    return this.endpoint.length > 0;
  }

  async findTopVideos(dish: Dish, limit = 3): Promise<DiscoveredVideo[]> {
    if (!this.isConfigured()) return [];

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // The quality rules travel with the request so the backend filters at source,
      // and are re-checked below so a lax endpoint cannot slip a clip through.
      body: JSON.stringify({ query: searchQuery(dish), limit, rules: VIDEO_QUALITY_RULES }),
    });

    if (!response.ok) throw new Error(`Video search returned ${response.status}.`);

    const payload = (await response.json()) as { videos?: DiscoveredVideo[] };
    return (payload.videos ?? []).filter(isAcceptable).slice(0, limit);
  }
}

export const videoDiscovery: VideoDiscoveryProvider = new RemoteVideoDiscovery();

/**
 * True when the record has no curated video. These are the dishes that would
 * otherwise show an empty "Watch it being made" section.
 */
export const needsDiscovery = (dish: Dish): boolean => dish.videos.length === 0;
