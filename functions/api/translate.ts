/**
 * `POST /api/translate` — the one endpoint in this project that can cost money.
 *
 * Everything else is static files on a CDN, or a few hundred bytes into D1. This calls a
 * model, and a model call has a price. So the shape of this file is mostly about making
 * sure it cannot spend more than Ajay agreed to, and that it degrades honestly when it
 * will not spend any more.
 *
 * ## Why Workers AI rather than an API key
 *
 * The provider in `domain/translationProvider.ts` warns that `EXPO_PUBLIC_*` values ship
 * inside the app bundle, so an API key placed there is readable by anyone who downloads
 * it. Workers AI removes the question: there is no key. Cloudflare binds the model to the
 * Function itself, so `EXPO_PUBLIC_TRANSLATION_ENDPOINT` only ever holds `/api/translate`
 * — a relative path with nothing secret in it.
 *
 * It is also the account the site is already deployed from. No second provider, no second
 * bill, no second thing to cancel.
 *
 * ## Three guards, in order
 *
 * 1. **Unbound is off.** No `AI` binding means 503 and a sentence saying so. The app
 *    already handles a provider that is not configured — the translate control does not
 *    render at all — so an unbound deployment behaves exactly like today.
 * 2. **Cache first.** A (record, language) pair is translated once, ever. The thousandth
 *    reader of the same record in Spanish costs nothing. See `0007_translations.sql`.
 * 3. **A hard daily ceiling.** The endpoint is public. Without a limit, a script could
 *    walk the whole catalogue and bill for it. `DAILY_LIMIT` is counted in D1, so the cap
 *    survives restarts and cannot be forgotten the way a note in a README can.
 *
 * The third guard makes the 501st reader of the day wait until tomorrow. That is a worse
 * experience, and it is the right trade for a project that collects no money: this must
 * not be able to run up a bill nobody agreed to.
 *
 * ## What is not here
 *
 * No caching of testimony. A confirmation is one sentence, written by one person, read by
 * whoever opens that record — there is no (record, language) key to hold it under and no
 * reuse to win. It counts against the daily meter like anything else.
 */

interface Env {
  DB: D1Database;
  /** Bound by Cloudflare when Workers AI is enabled on the project. Absent = off. */
  AI?: { run: (model: string, input: unknown) => Promise<{ response?: string }> };
  /** Optional override, so the ceiling can be raised without a deploy. */
  TRANSLATION_DAILY_LIMIT?: string;
}

/**
 * Model calls allowed per day before the endpoint refuses.
 *
 * Deliberately low. It is a ceiling on spend, not a target, and it is far easier to raise
 * a number that turned out to be too small than to explain a bill.
 */
const DAILY_LIMIT = 500;

/**
 * A small instruction-following model.
 *
 * Chosen for cost rather than capability: the prompts in `translationProvider.ts` and
 * `testimony.ts` do most of the work, and they are written as rules rather than as
 * requests precisely so a modest model can follow them. Every result is labelled machine
 * translation pending community review, so the failure mode of a weaker model is a
 * clearly-marked rough translation rather than a silent claim.
 */
const MODEL = '@cf/meta/llama-3.1-8b-instruct';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/** Date only. This table must not become a record of when somebody read something. */
const today = () => new Date().toISOString().slice(0, 10);

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.AI) {
    return json(
      { error: 'No translation service is connected to this deployment.' },
      503,
    );
  }

  let body: { prompt?: unknown; target?: unknown; dish?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: 'Could not read that.' }, 400);
  }

  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
  const target = typeof body.target === 'string' ? body.target.trim() : '';
  /* Present for a record, absent for a piece of testimony. */
  const dish = Number.isInteger(body.dish) ? (body.dish as number) : null;

  if (!prompt || !target) return json({ error: 'A prompt and a target language are required.' }, 400);
  /* A prompt is a record's prose plus its rules. Anything far past that is not one. */
  if (prompt.length > 12_000) return json({ error: 'That is too long to translate in one request.' }, 413);

  const day = today();

  /* ---- 2. cache ---- */
  if (dish !== null) {
    const hit = await env.DB.prepare('SELECT body FROM translation WHERE dish_id = ? AND lang = ?')
      .bind(dish, target)
      .first<{ body: string }>();
    if (hit) return json({ text: hit.body, cached: true });
  }

  /* ---- 3. the meter ----
   *
   * Read before the call, incremented after a successful one. A failed call is not
   * charged and does not count — the reader gets nothing, so neither should the meter.
   */
  const spent =
    (await env.DB.prepare('SELECT spent FROM translation_day WHERE day = ?')
      .bind(day)
      .first<{ spent: number }>())?.spent ?? 0;

  const limit = Number(env.TRANSLATION_DAILY_LIMIT) || DAILY_LIMIT;
  if (spent >= limit) {
    return json(
      {
        error:
          'No more translations today. This is a free project with a daily limit on machine translation — ' +
          'the original is still shown in full, and this record can be translated again tomorrow.',
      },
      429,
    );
  }

  /* ---- the call ---- */
  let text: string;
  try {
    const result = await env.AI.run(MODEL, {
      messages: [{ role: 'user', content: prompt }],
      /* Low, because this is transcription across a language rather than composition.
         A model being creative with a fermentation time is the failure this whole
         subsystem is arranged to avoid. */
      temperature: 0.2,
      max_tokens: 2048,
    });
    text = (result?.response ?? '').trim();
  } catch {
    return json({ error: 'The translation service did not answer.' }, 502);
  }

  if (!text) return json({ error: 'The translation service returned nothing.' }, 502);

  /* Charged only now, and only once, whatever happens to the writes below. */
  await env.DB.prepare(
    'INSERT INTO translation_day (day, spent) VALUES (?, 1) ' +
      'ON CONFLICT(day) DO UPDATE SET spent = spent + 1',
  )
    .bind(day)
    .run();

  if (dish !== null) {
    /*
     * Stored even though the app has not parsed it yet.
     *
     * The parse and the preserved-term check live in `translationProvider.ts`, where the
     * record's own ingredient list is available; this layer has the text and nothing to
     * check it against. A rejected translation therefore stays cached — which is right,
     * because a second call would send the identical prompt to the identical model and
     * pay again for the same answer.
     */
    await env.DB.prepare(
      'INSERT INTO translation (dish_id, lang, body, translator, made_on) VALUES (?, ?, ?, ?, ?) ' +
        'ON CONFLICT(dish_id, lang) DO UPDATE SET body = excluded.body, made_on = excluded.made_on',
    )
      .bind(dish, target, text, MODEL, day)
      .run();
  }

  return json({ text, cached: false });
};

/**
 * `GET /api/translate` — whether it is on, and what is left today.
 *
 * Public and deliberately dull: it reports the state of the service, not of any reader.
 * The admin console can show it without a token, and it gives whoever is looking a
 * straight answer about why a translation control did or did not appear.
 */
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  if (!env.AI) return json({ available: false, spent: 0, limit: 0 });

  const limit = Number(env.TRANSLATION_DAILY_LIMIT) || DAILY_LIMIT;
  const spent =
    (await env.DB.prepare('SELECT spent FROM translation_day WHERE day = ?')
      .bind(today())
      .first<{ spent: number }>())?.spent ?? 0;

  return json({ available: true, spent, limit, model: MODEL });
};
