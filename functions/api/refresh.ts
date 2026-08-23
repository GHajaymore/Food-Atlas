/**
 * `GET  /api/refresh` — what has been asked for.
 * `POST /api/refresh` — ask for a source check.
 * `PUT  /api/refresh` — record what the drain found.
 *
 * Administrator only, all three. Not because the information is sensitive — it is a
 * list of dish names — but because an open queue is an open invitation to fill it, and
 * the thing at the other end makes outbound requests to Wikimedia. A public endpoint
 * that enqueues work somebody else's machine will later perform is a way to make this
 * project a nuisance to a service it depends on.
 *
 * ## This endpoint performs nothing
 *
 * It remembers. `scripts/check-sources.mjs` does the work, on a laptop, because the
 * catalogue is files: nothing on Cloudflare can rewrite `src/data/*.json`, commit it and
 * rebuild the site, and giving an edge function the ability to would mean putting a
 * repository token behind a public URL.
 *
 * The person in the middle is the point rather than the limitation. They read what
 * changed before anything is applied, which is what stops a vandalised edit reaching
 * 18,008 records unseen.
 */

import { admin, type AdminEnv } from './_admin';

interface Env extends AdminEnv {
  DB: D1Database;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const KINDS = new Set(['dish', 'country', 'all']);

interface Row {
  id: string;
  kind: string;
  target: string;
  requested_at: string;
  status: string;
  done_at: string | null;
  result: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const who = await admin(request, env);
  if (!who.ok) return who.response;

  /*
   * Everything queued, plus what finished recently.
   *
   * The finished half is what makes the queue usable rather than a write-only box: an
   * administrator who asks for a check and never sees the answer has been given a
   * button, not a feature.
   */
  const rows = await env.DB.prepare(
    `select id, kind, target, requested_at, status, done_at, result
       from refresh_request
      where status = 'queued'
         or requested_at > datetime('now', '-30 days')
      order by case status when 'queued' then 0 else 1 end, requested_at desc
      limit 200`,
  ).all<Row>();

  return json(
    (rows.results ?? []).map((row) => ({
      id: row.id,
      kind: row.kind,
      target: row.target,
      requestedAt: row.requested_at,
      status: row.status,
      doneAt: row.done_at,
      result: row.result,
    })),
  );
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const who = await admin(request, env);
  if (!who.ok) return who.response;

  let body: { kind?: unknown; target?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: 'Could not read that.' }, 400);
  }

  const kind = String(body.kind ?? '');
  if (!KINDS.has(kind)) return json({ error: "Kind must be 'dish', 'country' or 'all'." }, 400);

  const target = kind === 'all' ? '' : String(body.target ?? '').trim().slice(0, 120);
  if (kind !== 'all' && !target) return json({ error: `A ${kind} name is needed.` }, 400);

  const id = `r_${crypto.randomUUID().slice(0, 12)}`;

  try {
    await env.DB.prepare(
      `insert into refresh_request (id, kind, target, requested_by) values (?, ?, ?, ?)`,
    )
      .bind(id, kind, target, who.by)
      .run();
  } catch (error) {
    /* The unique index fired — this is already waiting. Not an error worth alarming
     * anybody about; it is the queue doing its job. */
    if (String(error).includes('UNIQUE')) {
      return json({ error: 'That is already queued.' }, 409);
    }
    throw error;
  }

  return json({ id, kind, target, status: 'queued' }, 201);
};

/**
 * The drain reporting back.
 *
 * `PUT` rather than a second POST endpoint because this updates a request that already
 * exists, and the drain is the only thing that ever calls it — with the same token,
 * from a laptop, after doing the work.
 */
export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  const who = await admin(request, env);
  if (!who.ok) return who.response;

  let body: { id?: unknown; status?: unknown; result?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: 'Could not read that.' }, 400);
  }

  const id = String(body.id ?? '');
  const status = String(body.status ?? '');
  if (!id) return json({ error: 'No request named.' }, 400);
  if (status !== 'done' && status !== 'failed') {
    return json({ error: "Status must be 'done' or 'failed'." }, 400);
  }

  const result = await env.DB.prepare(
    `update refresh_request
        set status = ?, done_at = datetime('now'), result = ?
      where id = ? and status = 'queued'`,
  )
    .bind(status, String(body.result ?? '').trim().slice(0, 1000), id)
    .run();

  if (!result.meta.changes) return json({ error: 'No such queued request.' }, 404);
  return json({ ok: true, id, status });
};
