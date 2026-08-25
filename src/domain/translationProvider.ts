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
    throw new Error(
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
      throw new Error(
        `Translation dropped or renamed the preserved term "${term}". ` +
          `Traditional ingredient, equipment and dish names are never translated.`,
      );
    }
  }

  // Numbers carry the technique: 6-12 weeks, 430C, 250 g, 2-4 hours.
  const numbers = (text: string) => (text.match(/\d+/g) ?? []).sort().join(',');
  if (numbers(originalProse) !== numbers(translatedProse)) {
    throw new Error(
      'Translation altered the numbers in the method. Durations, temperatures and ' +
        'quantities must survive translation exactly.',
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

  constructor(private endpoint = process.env.EXPO_PUBLIC_TRANSLATION_ENDPOINT ?? '') {}

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
