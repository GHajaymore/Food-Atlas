/**
 * The translation provider.
 *
 * A record has to be readable in the reader's language or the atlas is only global
 * for the languages someone already curated — which defeats the point. So the app
 * translates on demand, for any record, through this interface.
 *
 * What makes that compatible with the brief is *what is sent and what is forbidden*:
 *
 *   - Only prose is translated: the blurb, the prep summary, the numbered method,
 *     the adaptation note and the disclaimer.
 *   - The dish name, every traditional ingredient and every piece of traditional
 *     equipment are sent as a **do-not-translate list** and must come back byte-for-
 *     byte identical. `assertPreserved` checks that they did; a response that
 *     renamed "chilhuacle negro" to "poblano" is rejected, not displayed.
 *   - Durations, temperatures and quantities must survive unchanged. A mistranslated
 *     fermentation time is a corrupted record, not a rough edge.
 *   - The result is always labelled a machine translation pending community review.
 *     It never overwrites a curated one and never changes the record's confidence.
 *
 * Swap the implementation freely — the contract is this file.
 */

import { testimonyPrompt } from './testimony';
import type { Dish, DishTranslation } from './types';
import { languageName } from './language';

export interface TranslationRequest {
  dish: Dish;
  /** BCP-47 target. */
  target: string;
}

export interface TranslationProvider {
  readonly name: string;
  /** False when the provider has no credentials; the UI then says so plainly. */
  isConfigured(): boolean;
  translate(request: TranslationRequest): Promise<DishTranslation>;
  /**
   * A single piece of somebody's testimony, translated for display beside the original.
   *
   * Separate from `translate` because the two carry different risks and different
   * guarantees. A record translation is checked by `assertPreserved` against the terms
   * the record itself declares; a confirmation has no such structure — it is one
   * sentence — so its protection lives in the instruction, in `domain/testimony.ts`.
   *
   * Returns plain text. Nothing here writes to a record or to a count.
   */
  translateText(request: { text: string; target: string }): Promise<string>;
}

/**
 * A translation that arrived intact but broke one of the rules above.
 *
 * Distinct from a service failure because the two are for different audiences. The
 * endpoint's own refusals are sentences a reader can act on — a daily limit has been
 * reached, come back tomorrow — and are shown as written. These are diagnostics:
 * "Translation altered the numbers in step 3" tells the reader nothing they can do
 * and, worse, was printed in English in the middle of an otherwise Japanese page,
 * which is one of the things Ajay reported as a translation fault. It was one — just
 * not in the record.
 *
 * The message stays in English on purpose: it is for whoever reads the logs. What the
 * reader sees is `copy.translationRefused`, in their own language.
 */
export class PreservationError extends Error {}

/** Terms that must survive a translation untouched. */
export const preservedTerms = (dish: Dish): string[] => [
  dish.name,
  ...dish.ingredients,
  ...dish.equipment,
];

/**
 * How long a translation may take before the app gives up on it.
 *
 * Neither request had a timeout, so a model that never answered left the record on
 * "Translating…" for ever. Ajay reported the language picker as doing nothing, and on a
 * record whose model call hangs that is precisely what it does: the request goes out, the
 * button changes, and nothing ever comes back to change it again.
 *
 * Forty-five seconds is well past a normal answer — a short prompt returns in under two —
 * and well short of a reader concluding the page is broken. Failing is not worse than
 * hanging here: the banner says what happened and offers the retry.
 */
const TRANSLATION_TIMEOUT = 45_000;

/**
 * Reject a response that altered a preserved term or dropped a step. This is the
 * check that turns "please don't rename the ingredients" from a hope into a rule.
 */
export function assertPreserved(dish: Dish, result: DishTranslation): void {
  /*
   * A record with no method cannot have one corrupted, so invented steps are dropped
   * rather than treated as a corrupted translation.
   *
   * Found from Ajay's report that "Read this in" does nothing on Jalebi. It does: it
   * asks for a translation, the model returns fifteen method steps for a record that has
   * none, and this rule refuses the whole response — so the reader clicks a language and
   * gets an error at the bottom of the page, which reads as nothing happening.
   *
   * The rule is right about what it protects. It exists so a translation cannot alter or
   * lose a method that a person recorded, and that is worth failing loudly for. But there
   * is no method here to lose: the only fault is content the model invented, and the
   * correct answer to invented content is to not show it. Refusing instead threw away a
   * perfectly good translation of the prose beside it and left the record unreadable to
   * everyone who does not read Arabic.
   *
   * The other checks below still run on the prose, so a response that also mangled an
   * ingredient name or a fermentation time is still refused.
   */
  if (dish.steps.length === 0 && result.steps.length > 0) {
    result.steps = [];
  }

  if (result.steps.length !== dish.steps.length) {
    throw new PreservationError(
      `Translation returned ${result.steps.length} steps for a ${dish.steps.length}-step method. ` +
        `The method must survive translation intact.`,
    );
  }

  // A preserved term that appears in the original prose must still appear in the
  // translation. Names carry the identity of the food; a familiar local equivalent
  // substituted for a traditional ingredient is silent customization by dictionary.
  const originalProse = [dish.prepSummary, ...dish.steps].join(' ');
  const translatedProse = [result.prepSummary, ...result.steps].join(' ');

  for (const term of preservedTerms(dish)) {
    if (originalProse.includes(term) && !translatedProse.includes(term)) {
      throw new PreservationError(
        `Translation dropped or renamed the preserved term "${term}". ` +
          `Traditional ingredient, equipment and dish names are never translated.`,
      );
    }
  }

  /*
   * Numbers carry the technique: 6-12 weeks, 430C, 250 g, 2-4 hours. A mistranslated
   * fermentation time is a corrupted record, so they are checked rather than trusted —
   * but checked where they live.
   *
   * This compared the numbers of the whole record as one bag, and rejected Kozhikode
   * Halwa's Japanese translation for it. Nothing had been altered: the method says
   * "over 2-4 hours" in step 3, and the translation also named the duration in the
   * summary, so 2,4 met 2,2,4,4 and the reader was told the numbers had been altered.
   * They had not. A record that states its own duration twice is not a corrupted one.
   *
   * Per step instead, and index-aligned — which is stricter, not looser. The old bag
   * could not see a number move between steps, so a translation that soaked the rice
   * for four hours and thickened it overnight passed. This does not.
   */
  const digits = (text: string) => (text.match(/\d+/g) ?? []).sort().join(',');

  dish.steps.forEach((step, i) => {
    if (digits(step) !== digits(result.steps[i])) {
      throw new PreservationError(
        `Translation altered the numbers in step ${i + 1}. Durations, temperatures and ` +
          `quantities must survive translation exactly.`,
      );
    }
  });

  /*
   * The summary is prose about the method, so it is held to a different rule: it may
   * not lose a number it had, and it may not introduce one the record does not contain
   * anywhere. Naming a duration the method already states is a summary doing its job;
   * inventing a temperature is the failure this guards against.
   */
  const inTheRecord = new Set((`${dish.prepSummary} ${dish.steps.join(' ')}`.match(/\d+/g) ?? []));
  for (const number of dish.prepSummary.match(/\d+/g) ?? []) {
    if (!result.prepSummary.includes(number)) {
      throw new PreservationError(
        `Translation dropped "${number}" from the summary. Durations, temperatures and ` +
          `quantities must survive translation exactly.`,
      );
    }
  }
  for (const number of result.prepSummary.match(/\d+/g) ?? []) {
    if (!inTheRecord.has(number)) {
      throw new PreservationError(
        `Translation added the number "${number}", which is nowhere in the record. ` +
          `A translation may not introduce a quantity of its own.`,
      );
    }
  }
}

/**
 * The writing systems this app can tell apart, and the ones each language is written in.
 *
 * Only the scripts the atlas actually meets. A script missing from this table simply
 * cannot be detected, and the check below then permits everything — which is the correct
 * direction to fail for a guard whose job is to catch an obvious wrong, not to be the
 * authority on the world's writing systems.
 */
const SCRIPTS: ReadonlyArray<readonly [string, RegExp]> = [
  ['Devanagari', /[\u0900-\u097F]/],
  ['Bengali', /[\u0980-\u09FF]/],
  ['Tamil', /[\u0B80-\u0BFF]/],
  ['Malayalam', /[\u0D00-\u0D7F]/],
  ['Thai', /[\u0E00-\u0E7F]/],
  ['Greek', /[\u0370-\u03FF]/],
  ['Cyrillic', /[\u0400-\u04FF]/],
  ['Hebrew', /[\u0590-\u05FF]/],
  ['Arabic', /[\u0600-\u06FF]/],
  ['Han', /[\u4E00-\u9FFF]/],
  ['Kana', /[\u3040-\u30FF]/],
  ['Hangul', /[\uAC00-\uD7AF]/],
];

/**
 * What each language is written in. Latin is never listed: it is always allowed, because
 * every preserved term in this atlas is Latin by construction and must appear untouched
 * in every translation.
 */
const WRITTEN_IN: Record<string, readonly string[]> = {
  hi: ['Devanagari'], mr: ['Devanagari'], ne: ['Devanagari'],
  bn: ['Bengali'], ta: ['Tamil'], ml: ['Malayalam'], th: ['Thai'],
  el: ['Greek'], he: ['Hebrew'],
  ar: ['Arabic'], fa: ['Arabic'], ur: ['Arabic'],
  ru: ['Cyrillic'], uk: ['Cyrillic'], bg: ['Cyrillic'], sr: ['Cyrillic'],
  zh: ['Han'], ja: ['Han', 'Kana'], ko: ['Hangul', 'Han'],
};

/** Which of the scripts above appear in a piece of text. */
const scriptsIn = (text: string): Set<string> =>
  new Set(SCRIPTS.filter(([, pattern]) => pattern.test(text)).map(([name]) => name));

/** How many characters of one script a text holds. */
const countOf = (text: string, script: string): number => {
  const pattern = SCRIPTS.find(([name]) => name === script)?.[1];
  if (!pattern) return 0;
  let n = 0;
  for (const character of text) if (pattern.test(character)) n += 1;
  return n;
};

/**
 * A word's worth. One stray character is model noise and not worth refusing a whole
 * translation over; three together is a word in the wrong language.
 */
const A_WORD = 3;

/**
 * Reject a translation that is partly in some third language.
 *
 * The model behind this is small, and a small model asked for French sometimes returns
 * French with a clause of the source language still sitting in it — Devanagari inside
 * French prose was observed during this work. That is not a translation with a rough
 * edge; it is a record the reader cannot read, presented as one they can.
 *
 * What is allowed is deliberately generous, because the alternative is refusing good
 * translations:
 *
 *   - **Latin, always.** Every preserved term is Latin here and must survive verbatim.
 *   - **Whatever the target language is written in.**
 *   - **Whatever the source record already contained.** A record whose prose quotes a
 *     term in Malayalam may keep quoting it after translation; that is the record being
 *     faithful, not the model wandering.
 *
 * So this fires only on a script that is in neither the target nor the original — which
 * has no innocent explanation.
 */
export function assertTargetScript(dish: Dish, result: DishTranslation, target: string): void {
  /*
   * The prose handed back unchanged is not a translation.
   *
   * The script check below cannot catch this, and correctly so: it allows any script that
   * appears in the original, because a translation may legitimately quote it. An answer
   * that is byte-identical to the source is allowed by that rule and by every other one
   * here — nothing was renamed, no number moved, no step appeared.
   *
   * Asked for French, Jalebi's Arabic account came back verbatim with only the glossary
   * in French. Every check passed, so the record displayed the original Arabic under a
   * banner reading "Machine translation" — a claim that a translation had happened when
   * it had not, which is worse than the failure it replaced.
   *
   * Length-guarded because a very short blurb can legitimately survive translation
   * unchanged — a proper noun, a one-word name. Forty characters is past that.
   */
  const untouched = (a: string, b: string) => a.trim().length > 40 && a.trim() === b.trim();
  if (untouched(dish.blurb, result.blurb) && untouched(dish.prepSummary, result.prepSummary)) {
    throw new PreservationError(
      `Translation into ${languageName(target)} returned the original text unchanged. ` +
        `An untranslated record is not shown as a translation.`,
    );
  }

  const language = target.toLowerCase().split(/[-_]/)[0];
  const allowed = new Set([
    ...(WRITTEN_IN[language] ?? []),
    ...scriptsIn(`${dish.blurb} ${dish.prepSummary} ${dish.steps.join(' ')}`),
  ]);

  const translated = [result.blurb, result.prepSummary, ...result.steps].join(' ');
  for (const script of scriptsIn(translated)) {
    if (allowed.has(script)) continue;
    if (countOf(translated, script) < A_WORD) continue;
    throw new PreservationError(
      `Translation into ${languageName(target)} came back partly in ${script}, which is ` +
        `in neither the target language nor the original record. A partial translation is ` +
        `not shown.`,
    );
  }
}

/** The instruction sent with every request. Kept here so the rules are auditable. */
export function buildPrompt(dish: Dish, target: string): string {
  const keep = preservedTerms(dish);
  return [
    `Translate the following traditional food record into ${languageName(target)} (${target}).`,
    '',
    'Rules, in order of importance:',
    `1. Do NOT translate these terms. Reproduce each one exactly as written, in the Latin script given, wherever it appears: ${keep
      .map((t) => `"${t}"`)
      .join(', ')}. They are the identity of the food. Never replace a traditional ingredient or piece of equipment with a locally familiar equivalent.`,
    '2. Do NOT change any number, duration, temperature, quantity or proportion.',
    '3. Do NOT simplify, shorten, modernise or make the method more approachable. Translate what is there, including hand techniques and long waiting times.',
    '4. Do NOT add an ingredient, a step, or an explanatory aside that is not in the original.',
    /*
     * A record with no method needs telling so in words, not by a zero.
     *
     * "Keep the same number of steps: 0" is a true instruction that the smallest model
     * reads straight past, because the shape below still asks for a `steps` array and an
     * array wants filling. Asked for French, Jalebi came back with the same invented
     * Arabic sentence repeated until the response hit `max_tokens` and the JSON was cut
     * off mid-array — which is what Ajay saw as the language picker doing nothing.
     *
     * The guards added elsewhere stop that being cached or shown. This is the attempt to
     * stop it happening: say there is no method, and say what the array must be.
     */
    dish.steps.length === 0
      ? '5. This record has NO recorded method. "steps" must be exactly []. Do not write any steps, and do not invent a preparation.'
      : `5. Keep the same number of steps: ${dish.steps.length}.`,
    '',
    'Return JSON only, matching this shape:',
    '{"blurb":string,"prepSummary":string,"steps":string[],"adaptation":{"traditional":string,"substitute":string}|null,"disclaimer":string,"glossary":{[originalTerm:string]:string}}',
    '',
    `"glossary" may explain a preserved term in ${languageName(target)} — it is shown next to the original term, never instead of it. Leave it empty if nothing needs explaining.`,
    '',
    'Record:',
    JSON.stringify(
      {
        blurb: dish.blurb,
        prepSummary: dish.prepSummary,
        steps: dish.steps,
        adaptation: dish.adaptation,
        disclaimer: dish.disclaimer,
      },
      null,
      2,
    ),
  ].join('\n');
}

/**
 * Claude-backed provider.
 *
 * Reads `EXPO_PUBLIC_TRANSLATION_ENDPOINT` — your own backend route that holds the
 * API key and forwards to the model. The key deliberately does NOT live in the app
 * bundle: `EXPO_PUBLIC_*` values ship to the client, so a key placed there would be
 * readable by anyone who downloads the app.
 *
 * The endpoint should accept `{ prompt, target }` and return `{ text }`.
 */
/**
 * What went wrong, in the service's own words where it has any.
 *
 * The endpoint explains a daily limit in a sentence a reader can act on; a bare status
 * code explains nothing and reads as a fault in the app. Anything unreadable falls back
 * to the status, which is at least honest about being unhelpful.
 */
async function refusal(response: Response): Promise<Error> {
  try {
    const body = (await response.json()) as { error?: string };
    if (typeof body.error === 'string' && body.error.trim()) return new Error(body.error.trim());
  } catch {
    /* Not JSON. The status is all there is. */
  }
  return new Error(`Translation service returned ${response.status}.`);
}

export class RemoteTranslationProvider implements TranslationProvider {
  readonly name = 'automated translation';

  /**
   * The app's own endpoint, unless something else is named.
   *
   * This defaulted to the empty string, so `isConfigured()` was false and the client never
   * called anything. That was right when the route might live on someone else's server; it
   * has been wrong since `functions/api/translate.ts` shipped inside this app.
   *
   * The cost of the mismatch was invisible in exactly the way this project keeps finding:
   * Workers AI was switched on, the endpoint answered correctly to curl, the record screen
   * asked for a translation on mount — and `canTranslate()` said no, so nothing was ever
   * requested. `Kozhikode Halwa` read in English on a Japanese page with no error anywhere,
   * because nothing had failed. Ajay found it; the `translation` table being empty and the
   * day's spend sitting at exactly the five calls I had made by hand is what proved it.
   *
   * Same shape as `EXPO_PUBLIC_DATA_URL` in `data/catalogue.ts`: a root-relative path on
   * web, where the function is served beside the app, and an origin from the environment
   * for a native build that has no such neighbour. The override stays, for anyone pointing
   * this at a route of their own.
   */
  constructor(
    private endpoint = process.env.EXPO_PUBLIC_TRANSLATION_ENDPOINT ??
      `${process.env.EXPO_PUBLIC_DATA_URL ?? ''}/api/translate`,
  ) {}

  isConfigured(): boolean {
    return this.endpoint.length > 0;
  }

  async translate({ dish, target }: TranslationRequest): Promise<DishTranslation> {
    if (!this.isConfigured()) {
      throw new Error('No translation endpoint is configured.');
    }

    const response = await fetch(this.endpoint, {
      method: 'POST',
      signal: AbortSignal.timeout(TRANSLATION_TIMEOUT),
      headers: { 'Content-Type': 'application/json' },
      /* The record id is the cache key at the other end: a (record, language) pair is
         translated once and read for ever. Testimony sends none — one sentence by one
         person has nothing to be reused under. */
      body: JSON.stringify({ prompt: buildPrompt(dish, target), target, dish: dish.id }),
    });

    if (!response.ok) {
      throw await refusal(response);
    }

    const payload = (await response.json()) as { text?: string };
    const raw = payload.text ?? '';
    const json = raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1);

    let parsed: Omit<DishTranslation, 'code' | 'translator' | 'machine'>;
    try {
      parsed = JSON.parse(json);
    } catch {
      throw new Error('Translation service returned a response the app could not read.');
    }

    const result: DishTranslation = {
      code: target,
      blurb: parsed.blurb,
      prepSummary: parsed.prepSummary,
      steps: parsed.steps,
      adaptation: parsed.adaptation ?? null,
      disclaimer: parsed.disclaimer,
      glossary: parsed.glossary ?? {},
      translator: this.name,
      machine: true,
    };

    // Reject rather than display a translation that broke the rules.
    assertPreserved(dish, result);
    assertTargetScript(dish, result, target);
    return result;
  }

  async translateText({ text, target }: { text: string; target: string }): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('No translation endpoint is configured.');
    }

    const response = await fetch(this.endpoint, {
      method: 'POST',
      signal: AbortSignal.timeout(TRANSLATION_TIMEOUT),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: testimonyPrompt(text, target), target }),
    });

    if (!response.ok) {
      throw await refusal(response);
    }

    const payload = (await response.json()) as { text?: string };
    const translated = (payload.text ?? '').trim();

    /*
     * An empty answer is a failure, not an empty translation.
     *
     * Rendering nothing under "translated" would read as "this person said nothing",
     * which is a claim about the witness rather than about the service.
     */
    if (!translated) throw new Error('Translation service returned nothing.');
    return translated;
  }
}

export const translationProvider: TranslationProvider = new RemoteTranslationProvider();
