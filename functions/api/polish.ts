/**
 * Tidy a contributor's own words, and never say them for them.
 *
 * Ajay: *"for the free flow use AI to polish it"*. The fields that stay free text are the
 * ones a chooser cannot hold — how a dish is made, who makes it, what somebody's connection
 * to a place actually is — and they arrive as a person typed them on a phone, often in a
 * second language, often with the autocorrect fighting a word it has never seen.
 *
 * ## The three rules this inherits
 *
 * `testimony.ts` already settled how machine text may behave in this app, for exactly the
 * same material, and this endpoint is bound by all three:
 *
 * **1. The original is always present.** Nothing here writes into a field. It returns a
 * suggestion; the contributor reads both and picks. A silent rewrite of somebody's account
 * of their grandmother's cooking would be the worst thing this app could do.
 *
 * **2. Machine text is labelled as machine-made.** The screen says so beside the
 * suggestion, before it is accepted.
 *
 * **3. It can never be what a badge rests on.** Confirmations count people, not sentences,
 * and nothing here touches scoring. Worth stating rather than leaving as an accident of
 * where the code happens to sit.
 *
 * ## What "polish" is allowed to mean
 *
 * Spelling, punctuation, capitalisation, spacing, and line breaks in a list. Not tone, not
 * length, not word choice, not order — and above all not *content*. A model that decides
 * ghee sounds better as butter has destroyed the only thing the record was for. The prompt
 * is written as prohibitions rather than as a request, the same way the translation prompt
 * is, because a small model follows rules better than it follows intentions.
 *
 * The temperature is zero. This is correction, not composition.
 *
 * ## Cost, which is the reason for the meter
 *
 * Workers AI is free up to a daily allocation and billed after it. This shares the exact
 * counter the translation endpoint uses — one `translation_day` row, one ceiling — so
 * adding a second AI feature cannot double the spend. It raises how fast the day's budget
 * is consumed, not how much can be spent, and that was the deliberate choice: a
 * contributor who cannot polish today still has a form that works.
 */

interface Env {
  DB: D1Database;
  /** Bound by Cloudflare when Workers AI is enabled. Absent = the feature is off. */
  AI?: { run: (model: string, input: unknown) => Promise<{ response?: string }> };
  TRANSLATION_DAILY_LIMIT?: string;
}

/** Shared with translate.ts on purpose — see the note on cost above. */
const DAILY_LIMIT = 500;
/*
 * Catalogue name, and it moved.
 *
 * This read '@cf/meta/llama-3.1-8b-instruct' from the day it was written, and that model
 * is no longer in Workers AI. Nothing caught it because the binding had never been
 * enabled: the endpoint returned 503 for the missing binding long before it could reach
 * a missing model. The day the binding went on, both endpoints answered 502 instead.
 *
 * Same model, FP8-quantised, which is the successor Cloudflare kept and is cheaper and
 * faster than the original — consistent with the note above that this was chosen for
 * cost rather than capability.
 */
const MODEL = '@cf/meta/llama-3.1-8b-instruct-fp8';

/**
 * Longer than any field on the contribution form, short enough that one call cannot
 * become an essay. A method that runs past this is polished up to here and the rest is
 * returned untouched, rather than being quietly truncated.
 */
const MAX_CHARS = 1200;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/** Date only. This table must not become a record of when somebody wrote something. */
const today = () => new Date().toISOString().slice(0, 10);

/**
 * Written as a list of refusals.
 *
 * Every line here exists because the opposite is a plausible thing for a helpful model to
 * do, and each one would be a different way of putting words in somebody's mouth.
 */
const instruction = (text: string) =>
  [
    'You are correcting typing, not writing.',
    'Fix only: spelling, punctuation, capitalisation, spacing, and obvious autocorrect errors.',
    'Do NOT translate. Keep every word in the language it was written in.',
    'Do NOT change any name of a dish, ingredient, place or person, even if it looks misspelled.',
    'Do NOT add any word, fact, quantity, time or explanation that is not already there.',
    'Do NOT remove anything, shorten anything, or reorder anything.',
    'Do NOT change tone, formality, or word choice.',
    'If the text is already correct, return it exactly as it is.',
    'Return only the corrected text, with no preamble, quotes or commentary.',
    '',
    'TEXT:',
    text,
  ].join('\n');

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.AI) {
    return json(
      {
        error:
          'Polishing is not switched on for this deployment. Nothing you have typed has been ' +
          'changed, and the form works exactly as it did.',
      },
      503,
    );
  }

  let body: { text?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Expected JSON.' }, 400);
  }

  const original = (body.text ?? '').trim();
  if (!original) return json({ error: 'Nothing to polish.' }, 400);
  if (original.length > MAX_CHARS) {
    return json({ error: `That is longer than ${MAX_CHARS} characters.` }, 413);
  }

  const day = today();
  const spent =
    (await env.DB.prepare('SELECT spent FROM translation_day WHERE day = ?')
      .bind(day)
      .first<{ spent: number }>())?.spent ?? 0;

  const limit = Number(env.TRANSLATION_DAILY_LIMIT) || DAILY_LIMIT;
  if (spent >= limit) {
    return json(
      {
        error:
          'No more polishing today. This is a free project with a daily limit on the AI it uses — ' +
          'what you have written is fine as it is, and you can submit it now.',
      },
      429,
    );
  }

  let polished: string;
  try {
    const result = await env.AI.run(MODEL, {
      messages: [{ role: 'user', content: instruction(original) }],
      /* Zero. This is correction, not composition — see the note above. */
      temperature: 0,
    });
    polished = (result.response ?? '').trim();
  } catch {
    return json({ error: 'The polish service did not answer. Your text is unchanged.' }, 502);
  }

  /* The meter counts a call that was made, not one that was useful. */
  await env.DB.prepare(
    'INSERT INTO translation_day (day, spent) VALUES (?, 1) ' +
      'ON CONFLICT(day) DO UPDATE SET spent = spent + 1',
  )
    .bind(day)
    .run();

  /*
   * A model that returned nothing, or that returned something far longer or far shorter
   * than it was given, has not corrected typing — it has done something else. Returning the
   * original is the honest failure: the contributor sees no suggestion rather than a
   * suggestion nobody should take.
   */
  const wildlyDifferent =
    !polished || polished.length > original.length * 1.6 + 40 || polished.length < original.length * 0.5;

  return json({
    original,
    polished: wildlyDifferent ? original : polished,
    changed: !wildlyDifferent && polished !== original,
    model: MODEL,
  });
};

/** What the client asks before offering the control at all. */
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  if (!env.AI) return json({ available: false, spent: 0, limit: 0 });

  const spent =
    (await env.DB.prepare('SELECT spent FROM translation_day WHERE day = ?')
      .bind(today())
      .first<{ spent: number }>())?.spent ?? 0;

  const limit = Number(env.TRANSLATION_DAILY_LIMIT) || DAILY_LIMIT;
  return json({ available: true, spent, limit, model: MODEL });
};
