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
import type { Copy } from '../i18n/copy';

export interface Language {
  code: string;
  /** The language in English, for the app's own chrome. */
  label: string;
  /** The language in its own script — how a speaker would recognise it. */
  endonym: string;
}

/**
 * Every language the app knows how to ask for.
 *
 * Wide on purpose. An atlas that offers sixteen languages is telling most of the
 * world that their food is welcome but their reading is not, and the languages
 * missing from a short list are exactly the ones whose traditions are least
 * documented elsewhere — which is the food this app most wants to carry.
 *
 * The set is drawn from the Wikipedia editions with real food coverage, because
 * that is where the free translations come from, plus the languages the seed's own
 * cooks speak (Malayalam, Icelandic, Mongolian). It is a list of languages, not a
 * list of markets.
 *
 * Being on this list is not a promise. `offeredLanguages` decides what a reader is
 * actually shown, and it refuses to offer a language the catalogue cannot fill.
 */
export const LANGUAGES: readonly Language[] = [
  { code: 'en', label: 'English', endonym: 'English' },

  // Europe
  { code: 'es', label: 'Spanish', endonym: 'Español' },
  { code: 'fr', label: 'French', endonym: 'Français' },
  { code: 'de', label: 'German', endonym: 'Deutsch' },
  { code: 'it', label: 'Italian', endonym: 'Italiano' },
  { code: 'pt', label: 'Portuguese', endonym: 'Português' },
  { code: 'nl', label: 'Dutch', endonym: 'Nederlands' },
  { code: 'pl', label: 'Polish', endonym: 'Polski' },
  { code: 'ru', label: 'Russian', endonym: 'Русский' },
  { code: 'uk', label: 'Ukrainian', endonym: 'Українська' },
  { code: 'cs', label: 'Czech', endonym: 'Čeština' },
  { code: 'sk', label: 'Slovak', endonym: 'Slovenčina' },
  { code: 'hu', label: 'Hungarian', endonym: 'Magyar' },
  { code: 'ro', label: 'Romanian', endonym: 'Română' },
  { code: 'bg', label: 'Bulgarian', endonym: 'Български' },
  { code: 'el', label: 'Greek', endonym: 'Ελληνικά' },
  { code: 'sr', label: 'Serbian', endonym: 'Српски' },
  { code: 'hr', label: 'Croatian', endonym: 'Hrvatski' },
  { code: 'sl', label: 'Slovenian', endonym: 'Slovenščina' },
  { code: 'sv', label: 'Swedish', endonym: 'Svenska' },
  { code: 'da', label: 'Danish', endonym: 'Dansk' },
  { code: 'nb', label: 'Norwegian', endonym: 'Norsk' },
  { code: 'fi', label: 'Finnish', endonym: 'Suomi' },
  { code: 'et', label: 'Estonian', endonym: 'Eesti' },
  { code: 'lv', label: 'Latvian', endonym: 'Latviešu' },
  { code: 'lt', label: 'Lithuanian', endonym: 'Lietuvių' },
  { code: 'is', label: 'Icelandic', endonym: 'Íslenska' },
  { code: 'ga', label: 'Irish', endonym: 'Gaeilge' },
  { code: 'cy', label: 'Welsh', endonym: 'Cymraeg' },
  { code: 'eu', label: 'Basque', endonym: 'Euskara' },
  { code: 'ca', label: 'Catalan', endonym: 'Català' },
  { code: 'gl', label: 'Galician', endonym: 'Galego' },

  // Middle East, Caucasus and Central Asia
  { code: 'ar', label: 'Arabic', endonym: 'العربية' },
  { code: 'he', label: 'Hebrew', endonym: 'עברית' },
  { code: 'fa', label: 'Persian', endonym: 'فارسی' },
  { code: 'tr', label: 'Turkish', endonym: 'Türkçe' },
  { code: 'ku', label: 'Kurdish', endonym: 'Kurdî' },
  { code: 'az', label: 'Azerbaijani', endonym: 'Azərbaycanca' },
  { code: 'hy', label: 'Armenian', endonym: 'Հայերեն' },
  { code: 'ka', label: 'Georgian', endonym: 'ქართული' },
  { code: 'kk', label: 'Kazakh', endonym: 'Қазақша' },
  { code: 'uz', label: 'Uzbek', endonym: 'Oʻzbekcha' },
  { code: 'tg', label: 'Tajik', endonym: 'Тоҷикӣ' },
  { code: 'mn', label: 'Mongolian', endonym: 'Монгол' },

  // South Asia
  { code: 'hi', label: 'Hindi', endonym: 'हिन्दी' },
  { code: 'bn', label: 'Bengali', endonym: 'বাংলা' },
  { code: 'ur', label: 'Urdu', endonym: 'اردو' },
  { code: 'pa', label: 'Punjabi', endonym: 'ਪੰਜਾਬੀ' },
  { code: 'gu', label: 'Gujarati', endonym: 'ગુજરાતી' },
  { code: 'mr', label: 'Marathi', endonym: 'मराठी' },
  { code: 'ta', label: 'Tamil', endonym: 'தமிழ்' },
  { code: 'te', label: 'Telugu', endonym: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', endonym: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', endonym: 'മലയാളം' },
  { code: 'or', label: 'Odia', endonym: 'ଓଡ଼ିଆ' },
  { code: 'as', label: 'Assamese', endonym: 'অসমীয়া' },
  { code: 'si', label: 'Sinhala', endonym: 'සිංහල' },
  { code: 'ne', label: 'Nepali', endonym: 'नेपाली' },

  // East and Southeast Asia
  { code: 'zh', label: 'Chinese', endonym: '中文' },
  { code: 'ja', label: 'Japanese', endonym: '日本語' },
  { code: 'ko', label: 'Korean', endonym: '한국어' },
  { code: 'vi', label: 'Vietnamese', endonym: 'Tiếng Việt' },
  { code: 'th', label: 'Thai', endonym: 'ไทย' },
  { code: 'km', label: 'Khmer', endonym: 'ខ្មែរ' },
  { code: 'lo', label: 'Lao', endonym: 'ລາວ' },
  { code: 'my', label: 'Burmese', endonym: 'မြန်မာ' },
  { code: 'id', label: 'Indonesian', endonym: 'Bahasa Indonesia' },
  { code: 'ms', label: 'Malay', endonym: 'Bahasa Melayu' },
  { code: 'tl', label: 'Filipino', endonym: 'Tagalog' },
  { code: 'jv', label: 'Javanese', endonym: 'Basa Jawa' },

  // Africa
  { code: 'sw', label: 'Swahili', endonym: 'Kiswahili' },
  { code: 'am', label: 'Amharic', endonym: 'አማርኛ' },
  { code: 'ha', label: 'Hausa', endonym: 'Hausa' },
  { code: 'yo', label: 'Yoruba', endonym: 'Yorùbá' },
  { code: 'ig', label: 'Igbo', endonym: 'Igbo' },
  { code: 'zu', label: 'Zulu', endonym: 'isiZulu' },
  { code: 'af', label: 'Afrikaans', endonym: 'Afrikaans' },
  { code: 'so', label: 'Somali', endonym: 'Soomaali' },
  { code: 'mg', label: 'Malagasy', endonym: 'Malagasy' },
];

/**
 * The fewest records a language must be able to show before the app offers it.
 *
 * A language in the picker is a promise that choosing it will change what you see.
 * Offering eighty when seventy of them would return the English text unchanged
 * breaks that promise eighty times over, and it breaks it worst for the languages
 * with the least documented food — the readers this app is most for.
 *
 * So a language is offered once the catalogue can actually meet it. Below the floor
 * it is not hidden and not lied about: `languageProgress` reports how far along it
 * is, so a reader can see their language coming rather than wonder why it is absent.
 *
 * The number is a starting point and is meant to move. Raise it as coverage grows,
 * lower it to open a language up early.
 */
export const MIN_RECORDS_PER_LANGUAGE = 250;

/** How many records can be read in each language, keyed by BCP-47 code. */
export type LanguageCoverage = Readonly<Record<string, number>>;

/**
 * Count what the catalogue can actually serve in each language.
 *
 * Both sources count, and they are different kinds of thing: a record with its own
 * article in a language, and a record whose text this project has had translated.
 * Either gives a reader of that language something real, which is what the floor is
 * measuring.
 */
export function coverageOf(dishes: { readableIn?: string[]; translations?: Record<string, unknown> }[]): LanguageCoverage {
  const counts: Record<string, number> = {};

  for (const dish of dishes) {
    // A record could be reachable both ways; it is still one record.
    const codes = new Set([...(dish.readableIn ?? []), ...Object.keys(dish.translations ?? {})]);
    for (const code of codes) counts[code] = (counts[code] ?? 0) + 1;
  }

  return counts;
}

/**
 * The languages a reader is actually offered.
 *
 * English is always present: it is the language the catalogue is written in, so it
 * needs no coverage to be honest, and a picker with nothing in it is worse than one
 * with a single entry.
 */
export function offeredLanguages(
  coverage: LanguageCoverage,
  min: number = MIN_RECORDS_PER_LANGUAGE,
): Language[] {
  return LANGUAGES.filter((l) => l.code === 'en' || (coverage[l.code] ?? 0) >= min);
}

/** A language the catalogue cannot yet fill, and how close it is. */
export interface LanguageProgress {
  language: Language;
  records: number;
  needed: number;
}

/**
 * Languages still short of the floor, nearest first.
 *
 * Shown so that a reader whose language is missing learns that it is coming and how
 * far off it is, rather than concluding the app does not care about it.
 */
export function languageProgress(
  coverage: LanguageCoverage,
  min: number = MIN_RECORDS_PER_LANGUAGE,
): LanguageProgress[] {
  return LANGUAGES.filter((l) => l.code !== 'en' && (coverage[l.code] ?? 0) < min)
    .map((language) => ({
      language,
      records: coverage[language.code] ?? 0,
      needed: min - (coverage[language.code] ?? 0),
    }))
    .sort((a, b) => b.records - a.records);
}

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
  copy: Copy,
  video: { languageCode?: string; audioTracks?: string[] },
  preferred: string,
): TranslationPlan {
  const spoken = video.languageCode;

  if (spoken && spoken === preferred) {
    return {
      route: 'original',
      note: copy.videoOriginalAudio.replace('{language}', languageName(spoken)),
    };
  }

  if (video.audioTracks?.includes(preferred)) {
    return {
      route: 'creator-audio',
      note: copy.videoCreatorTrack.replace('{language}', languageName(preferred)),
    };
  }

  if (spoken) {
    return {
      route: 'provider-captions',
      note: copy.videoPlatformCaptions
        .replace('{spoken}', languageName(spoken))
        .replace('{preferred}', languageName(preferred)),
    };
  }

  return {
    route: 'unavailable',
    note: copy.videoLanguageUnknown.replace('{language}', languageName(preferred)),
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
