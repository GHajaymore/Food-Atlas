/**
 * `POST /api/proposals/{id}/confirmations` — say you know this dish.
 *
 * The endpoint the badge rests on. Three of these move a proposal into the atlas, so
 * every refusal below is load-bearing and each one exists for a reason that is easy to
 * lose later:
 *
 * - **403, your own proposal.** One person supplying both the claim and the agreement
 *   turns a bar of three into a bar of two. The trigger in the migration enforces this
 *   as well; this check exists to say *why* rather than to be the guarantee.
 * - **409, already confirmed.** The unique index is what makes "3 confirmations" mean
 *   three people rather than three clicks.
 * - **404, no such proposal.** Returned for a declined one too, deliberately: a
 *   confirmation on something already rejected has nowhere to go, and reporting the
 *   distinction would tell a stranger what has been declined.
 * - **410, already published.** It is a record now. Confirmations belong on the record.
 *
 * `said` and `connection` are required here as well as in the form, because they are
 * not decoration — a confirmation without them is a vote, and the entire design of this
 * atlas is that it shows evidence rather than counting votes.
 */

import type { Identity } from '../_middleware';

interface Env {
  DB: D1Database;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const text = (value: unknown, max: number): string => String(value ?? '').trim().slice(0, max);

export const onRequestPost: PagesFunction<Env, 'id', Identity> = async ({ request, env, params, data }) => {
  const proposalId = String(params.id ?? '');
  if (!proposalId) return json({ error: 'No proposal named.' }, 400);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Could not read that.' }, 400);
  }

  const said = {
    name: text(body.name, 80),
    connection: text(body.connection, 300),
    said: text(body.said, 1000),
    local: body.local === true,
  };

  const missing = (['name', 'connection', 'said'] as const).filter((k) => !said[k]);
  if (missing.length) return json({ error: `Still needed: ${missing.join(', ')}.` }, 400);

  const proposal = await env.DB.prepare(`select submitter_id, status from proposal where id = ?`)
    .bind(proposalId)
    .first<{ submitter_id: string; status: string }>();

  if (!proposal || proposal.status === 'declined') return json({ error: 'No such proposal.' }, 404);
  if (proposal.status === 'published') {
    return json({ error: 'This is already in the atlas.' }, 410);
  }
  if (proposal.submitter_id === data.personId) {
    return json({ error: 'You proposed this dish, so it needs somebody else to confirm it.' }, 403);
  }

  try {
    await env.DB.prepare(
      `insert into proposal_confirmation (proposal_id, person_id, name, connection, said, local)
       values (?, ?, ?, ?, ?, ?)`,
    )
      .bind(proposalId, data.personId, said.name, said.connection, said.said, said.local ? 1 : 0)
      .run();
  } catch (error) {
    const message = String(error);
    if (message.includes('UNIQUE')) return json({ error: 'You have already confirmed this one.' }, 409);
    /* The trigger, if the check above was somehow bypassed. */
    if (message.includes('own proposal')) {
      return json({ error: 'You proposed this dish, so it needs somebody else to confirm it.' }, 403);
    }
    throw error;
  }

  const count = await env.DB.prepare(
    `select count(*) as n from proposal_confirmation where proposal_id = ? and status = 'published'`,
  )
    .bind(proposalId)
    .first<{ n: number }>();

  /*
   * The count is returned and the status is not changed here.
   *
   * Reaching three does not publish a proposal — `scripts/promote-proposals.mjs` does,
   * and a person runs it. That is not timidity about automation: the catalogue is built
   * files, and a record that flipped to `published` in the database would exist in the
   * app and nowhere else — not in the counts, not in search, not on a page anybody can
   * find. See docs/proposals-api.md.
   */
  return json({ ok: true, confirmations: count?.n ?? 0 });
};
