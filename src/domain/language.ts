/**
 * Language preference for video playback.
 *
 * The constraint this is built around: videos always open at their source. We do not
 * embed a player, proxy the stream, or generate audio of our own. So "translate the
 * video" cannot mean dubbing a synthetic voice over the cook — that would replace
 * the actual voice of the person whose tradition the record documents, and the app
 * would be presenting something the cook never said as if they had.
 *
 * What we do instead is pass the viewer's language preference to the provider, which
 * serves, in this order of preference:
 *
 *   1. a **creator-published** alternate audio track, where the creator recorded or
 *      authorised one — the creator's own translation;
 *   2. the provider's **auto-dubbed** track, where the provider generated one;
 *   3. **auto-translated captions** over the original audio — the original voice is
 *      untouched and the translation is visibly machine-made;
 *   4. nothing, in which case the app says so rather than implying a translation
 *      exists.
 *
 * The UI labels which of these the viewer is getting. That is the same rule the rest
 * of the app follows: no silent substitution, and say so when we don't know.
 */

/** BCP-47 codes the provider accepts for `hl` / `cc_lang_pref`. */
export interface Language {
  code: string;
  /** The language in English, for the app's own chrome. */
  label: string;
  /** The language in its own script — how a speaker would recognise it. */
  endonym: string;
}

/**
 * The offered set. Deliberately includes the languages the seed's own cooks speak
 * (Malayalam, Spanish, Italian, Icelandic, Mongolian) alongside the widely-spoken
 * ones, so the list is not just a list of large markets.
 */
export const LANGUAGES: readonly Language[] = [
  { code: 'en', label: 'English', endonym: 'English' },
  { code: 'es', label: 'Spanish', endonym: 'Español' },
  { code: 'hi', label: 'Hindi', endonym: 'हिन्दी' },
  { code: 'ml', label: 'Malayalam', endonym: 'മലയാളം' },
  { code: 'ar', label: 'Arabic', endonym: 'العربية' },
  { code: 'fr', label: 'French', endonym: 'Français' },
  { code: 'pt', label: 'Portuguese', endonym: 'Português' },
  { code: 'it', label: 'Italian', endonym: 'Italiano' },
  { code: 'de', label: 'German', endonym: 'Deutsch' },
  { code: 'is', label: 'Icelandic', endonym: 'Íslenska' },
  { code: 'mn', label: 'Mongolian', endonym: 'Монгол' },
  { code: 'zh', label: 'Chinese', endonym: '中文' },
  { code: 'ja', label: 'Japanese', endonym: '日本語' },
  { code: 'ko', label: 'Korean', endonym: '한국어' },
  { code: 'tr', label: 'Turkish', endonym: 'Türkçe' },
  { code: 'ru', label: 'Russian', endonym: 'Русский' },
];

export const languageByCode = (code: string): Language | undefined =>
  LANGUAGES.find((l) => l.code === code);

export const languageName = (code: string): string => languageByCode(code)?.label ?? code;

/**
 * How the viewer's chosen language will actually reach them for a given video.
 *
 * `original` — the video is already in the chosen language, so nothing is translated.
 * `creator-audio` — the creator published an audio track in this language.
 * `provider-captions` — the provider can auto-translate captions over the original
 *   audio. This is the honest default: the cook's voice is untouched.
 * `unavailable` — we have no evidence a translation exists. We say so.
 */
export type TranslationRoute = 'original' | 'creator-audio' | 'provider-captions' | 'unavailable';

export interface TranslationPlan {
  route: TranslationRoute;
  /** The sentence shown under the video. Written to be true in every case. */
  note: string;
}

/**
 * Decide — and describe — what the viewer will get.
 *
 * Note what this function does NOT do: it never claims a translation the provider has
 * not actually published. `creator-audio` is only returned when the record says the
 * creator published a track in that language, which is a curated field, not a guess.
 */
export function planTranslation(
  video: { languageCode?: string; audioTracks?: string[] },
  preferred: string,
): TranslationPlan {
  const spoken = video.languageCode;

  if (spoken && spoken === preferred) {
    return {
      route: 'original',
      note: `Spoken in ${languageName(spoken)} — the cook's own language. Nothing is translated.`,
    };
  }

  if (video.audioTracks?.includes(preferred)) {
    return {
      route: 'creator-audio',
      note:
        `The creator published a ${languageName(preferred)} audio track. It opens in that track at the source — ` +
        `the translation is the creator's own, not ours.`,
    };
  }

  if (spoken) {
    return {
      route: 'provider-captions',
      note:
        `Spoken in ${languageName(spoken)}. Opens with machine-translated ${languageName(preferred)} captions ` +
        `over the original audio — the cook's voice is not replaced, and the translation is the video ` +
        `platform's, not a human one.`,
    };
  }

  return {
    route: 'unavailable',
    note:
      `We don't have this video's spoken language on record, so we can't promise ${languageName(preferred)}. ` +
      `It opens at the source, where the platform's own caption options apply.`,
  };
}

/**
 * Append the language preference to a provider watch URL.
 *
 * `hl` sets the interface and picks the matching audio track where one exists;
 * `cc_lang_pref` + `cc_load_policy=1` turn on captions in that language over the
 * original audio. Both are the provider's own parameters — we are asking the source
 * to serve its translation, not making one.
 */
export function withLanguage(url: string, preferred: string, plan: TranslationPlan): string {
  if (plan.route === 'original') return url;

  const separator = url.includes('?') ? '&' : '?';
  const params = [`hl=${encodeURIComponent(preferred)}`, `persist_hl=1`];

  if (plan.route === 'provider-captions') {
    params.push(`cc_lang_pref=${encodeURIComponent(preferred)}`, 'cc_load_policy=1');
  }

  return `${url}${separator}${params.join('&')}`;
}
