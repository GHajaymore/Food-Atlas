/**
 * `PUT /api/confirmations/{id}/status` — take a confirmation down, or put it back.
 *
 * Administrator only, and the narrowest useful power: `published` ⇄ `removed`.
 *
 * ## Why this had to exist the moment writes opened
 *
 * A confirmation is published the instant somebody writes it, on a record anybody can
 * read, with the name and the stated connection attached. That is the design — evidence
 * is only worth something if a reader can see who gave it — and it means the first piece
 * of abuse is live until there is a way to remove it. Without this endpoint the only
 * remedy was a hand-written SQL statement against the production database.
 *
 * ## Why removed and not deleted
 *
 * The row stays and stops counting: `record_one_per_person` is scoped to
 * `status = 'published'`, so removing a confirmation also frees that person to write a
 * better one rather than locking them out of the record for good. A mistake is reversible,
 * and a pattern — the same person removed repeatedly — stays visible instead of vanishing.
 *
 * ## What an administrator cannot do here
 *
 * Add one, or edit what somebody said. Both would let the person running the site put
 * words in a reader's mouth on the one claim this atlas makes that nobody else makes.
 * Removing abuse is a duty; editing testimony is forgery.
 */

import { admin, type AdminEnv } from '../../_admin';

interface Env extends AdminEnv {
  DB: D1Database;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const ALLOWED = new Set(['published', 'removed']);

export const onRequestPut: PagesFunction<Env> = async ({ request, env, params }) => {
  const who = await admin(request, env);
  if (!who.ok) return who.response;

  const id = String(params.id ?? '');
  if (!id) return json({ error: 'No confirmation named.' }, 400);

  let body: { status?: string };
  try {
    body = (await request.json()) as { status?: string };
  } catch {
    return json({ error: 'Expected JSON.' }, 400);
  }

  const status = String(body.status ?? '');
  if (!ALLOWED.has(status)) return json({ error: 'Status must be published or removed.' }, 400);

  const result = await env.DB.prepare(`update record_confirmation set status = ? where id = ?`)
    .bind(status, id)
    .run();

  if (!result.meta.changes) return json({ error: 'No confirmation with that id.' }, 404);

  return json({ ok: true });
};
