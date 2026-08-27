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
 * Reject a response that altered a preserved term or dropped a step. This is the
 * check that turns "please don't rename the ingredients" from a hope into a rule.
 */
export function assertPreserved(dish: Dish, result: DishTranslation): void {
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
    `5. Keep the same number of steps: ${dish.steps.length}.`,
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
    return result;
  }

  async translateText({ text, target }: { text: string; target: string }): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('No translation endpoint is configured.');
    }

    const response = await fetch(this.endpoint, {
      method: 'POST',
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
