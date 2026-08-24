/**
 * Reading somebody else's testimony in your own language, without replacing it.
 *
 * Ajay asked for the whole site in the chosen language, proposals included. A proposal
 * and a confirmation are not the site's words though — they are a person's account of
 * their own food: *"we use ghee, not oil, and it is made at Eid, not year round."* That
 * sentence is the strongest evidence this atlas holds, and `copy.ts` already states the
 * rule it falls under: a loose translation of evidence misstates a record's standing
 * rather than merely reading badly.
 *
 * Leaving it untranslated is not neutral either. A Spanish reader who cannot read a
 * Malayalam confirmation cannot weigh it, and "confirmations are shown, not counted" is
 * the whole reason they are displayed at all — a confirmation nobody can read is a
 * confirmation being counted.
 *
 * ## The three rules that resolve it
 *
 * **1. The original is always present.** Never replaced, never behind a control, never
 * collapsed. A translation is added *beside* it. This is the same shape `translate.ts`
 * uses for a record and the reason a reader can always check what was actually said.
 *
 * **2. A translation is labelled as machine-made.** Same rule, same reason: the reader is
 * entitled to know who translated what they are reading.
 *
 * **3. A translation can never be what a badge rests on.** `validationsOf` counts people,
 * not sentences, and nothing here touches it. Stated as a rule rather than left as an
 * accident of the current code, because the accident could be undone by someone wiring
 * translation into scoring without noticing what they had done.
 *
 * ## Why the names are preserved here too
 *
 * The same reason `translate.ts` gives: "nendran banana" must not become "plantain". A
 * confirmation is usually *about* the ingredient — somebody correcting oil to ghee — so
 * translating the term away destroys the exact content that made it evidence.
 */

/** What a testimony translation is allowed to be. */
export interface Testimony {
  /** Exactly what the person wrote. Always shown. */
  original: string;
  /** The reader's language, where one has been produced. */
  translated?: string;
  /** Who produced it. Empty when there is no translation. */
  translator?: string;
}

/**
 * Whether offering a translation is honest for this reader and this text.
 *
 * Not merely "is a provider configured". An empty testimony has nothing to translate,
 * and offering the control on one would be a button that does nothing — the same fault
 * the donate button and the contribution form are careful to avoid.
 */
export const canOfferTranslation = (said: string, providerConfigured: boolean): boolean =>
  providerConfigured && said.trim().length > 0;

/**
 * The instruction sent to the translator.
 *
 * Written as constraints rather than a request, because the failure that matters is not
 * a clumsy sentence — it is a helpful one. A model asked to "translate this cooking note"
 * will tidy a quantity, resolve an ambiguity or substitute a familiar ingredient, and
 * every one of those turns a person's account into somebody else's.
 */
export function testimonyPrompt(said: string, target: string): string {
  return [
    `Translate the following into ${target}.`,
    '',
    'This is a person’s own account of how a dish is made where they are from. It is',
    'evidence, not prose to improve. Follow these rules exactly:',
    '',
    '1. Do not correct, tidy, shorten or complete it. If it is ungrammatical, it stays',
    '   ungrammatical. If it contradicts itself, it keeps contradicting itself.',
    '2. Do not translate the name of any dish, ingredient, utensil or place. Leave those',
    '   words exactly as written, in their original script.',
    '3. Do not substitute a local equivalent for anything. "Ghee" does not become',
    '   "clarified butter"; "nendran banana" does not become "plantain".',
    '4. Do not add anything that is not there — no explanation, no note, no units.',
    '5. Return only the translated sentence, with no preamble and no quotation marks.',
    '',
    'The account:',
    said,
  ].join('\n');
}

/**
 * The one-line provenance shown under a translated testimony.
 *
 * Names the translator and says plainly that the original is above it, because the whole
 * defence of translating evidence at all is that the evidence is still there to check.
 */
export const testimonyNote = (translator: string): string =>
  `Translated automatically by ${translator}. The original is shown above it and is what counts.`;
