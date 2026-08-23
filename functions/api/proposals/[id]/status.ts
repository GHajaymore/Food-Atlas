/**
 * `PUT /api/proposals/{id}/status` — decline a proposal, or put it back.
 *
 * Administrator only, and the narrowest useful power: `proposed` ⇄ `declined`.
 *
 * ## Why publishing is not here
 *
 * It would be one more line and it is the line that would matter. Publishing is what
 * turns a proposal into a record, and the entire claim this atlas makes is that a
 * record got in because people who know the dish confirmed it — not because the person
 * running the site decided it should. An administrator who can publish directly is an
 * administrator whose judgement silently replaces the community's, and no reader could
 * tell which had happened.
 *
 * So publication stays where it is: three confirmations, then
 * `scripts/promote-proposals.mjs`, which reads what the confirmations say rather than
 * what anybody wants. Declining is a different act — it removes something, and removing
 * abuse is a duty rather than an editorial judgement about food.
 *
 * ## Why declined and not deleted
 *
 * The row stays, so the unique index on (fold, country) no longer blocks the name — a
 * declined proposal should not stop somebody proposing the same dish properly later,
 * which is why that index is scoped to `status = 'proposed'`. Keeping it also means a
 * mistake is reversible, and that a pattern of the same thing being proposed and
 * declined repeatedly is visible rather than invisible.
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

export const onRequestPut: PagesFunction<Env, 'id'> = async ({ request, env, params }) => {
  const who = await admin(request, env);
  if (!who.ok) return who.response;

  const id = String(params.id ?? '');
  if (!id) return json({ error: 'No proposal named.' }, 400);

  let body: { status?: unknown; note?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: 'Could not read that.' }, 400);
  }

  const status = String(body.status ?? '');
  if (status !== 'declined' && status !== 'proposed') {
    return json({ error: "Status must be 'declined' or 'proposed'." }, 400);
  }

  const existing = await env.DB.prepare(`select status from proposal where id = ?`)
    .bind(id)
    .first<{ status: string }>();

  if (!existing) return json({ error: 'No such proposal.' }, 404);

  /*
   * A published proposal is a record now, and this endpoint has no business editing
   * records. Un-publishing would leave the catalogue holding a dish whose proposal says
   * it was never accepted — two sources of truth disagreeing, with the static one
   * winning until somebody rebuilt.
   */
  if (existing.status === 'published') {
    return json({ error: 'That is already in the atlas and cannot be changed here.' }, 409);
  }

  if (existing.status === status) return json({ ok: true, status, unchanged: true });

  await env.DB.prepare(
    `update proposal
        set status = ?, decided_by = ?, decided_at = datetime('now'), decided_note = ?
      where id = ?`,
  )
    .bind(status, who.by, String(body.note ?? '').trim().slice(0, 500), id)
    .run();

  return json({ ok: true, status });
};
