/**
 * Translating one piece of somebody's testimony.
 *
 * ## What used to be here, and why it is not
 *
 * This file also translated whole records on demand, guarded by a rule for every way a
 * model can ruin one: preserved ingredient and equipment names, unchanged numbers per
 * step, an unchanged step count, the target script, no repetition loop, and finally no
 * handing the original back untranslated. Six rules, a D1 cache, a daily spend counter
 * and a refusal vocabulary.
 *
 * Two facts ended it. **No record has ever carried a curated translation** — that path
 * was theoretical from the start. And **3,895 records already link to an article written
 * by people who speak the language**, one section above where the machine control sat.
 * The atlas was spending its most intricate subsystem to produce a worse answer than the
 * one already on the page, and it was the only thing on the read path that could bill.
 *
 * A reader's testimony is the opposite case, which is why this survived. It is one
 * sentence somebody wrote themselves; there is no encyclopaedia article to link to
 * instead, so a machine translation beside the original is the only way another reader
 * gets to understand it at all. Its protection is the instruction in `domain/testimony.ts`
 * rather than a preservation rule, because one sentence has no structure to preserve.
 */

import { testimonyPrompt } from './testimony';

/**
 * How long a translation may take before the app gives up on it.
 *
 * There was no timeout at all, so a model that never answered left the reader waiting for
 * ever with no way to tell that from slowness. Forty-five seconds is well past a normal
 * answer — a short prompt returns in under two — and well short of deciding the page is
 * broken.
 */
const TRANSLATION_TIMEOUT = 45_000;

export interface TranslationProvider {
  readonly name: string;
  /** False when the provider has no credentials; the UI then says so plainly. */
  isConfigured(): boolean;
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
