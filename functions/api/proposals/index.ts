/**
 * `GET /api/proposals` — everything open for confirmation.
 * `POST /api/proposals` — propose a dish the atlas does not have.
 *
 * The shape returned here is `Proposal` in `src/domain/proposals.ts`, exactly. That is
 * a contract rather than a coincidence: the client scores a proposal with the same
 * `assess()` it uses on every record, and a field renamed on one side would silently
 * change a badge on the other.
 *
 * ## Nothing that identifies a person leaves this file
 *
 * `submitter_id` and `person_id` are selected only where a query needs them and are
 * never in a response body. The client has no use for them and every use it could find
 * would be a worse one — the whole point of showing a stated connection rather than a
 * verified identity is that the atlas does not hold identities.
 */

import { admin, type AdminEnv } from '../_admin';
import type { Identity } from './_middleware';

interface Env extends AdminEnv {
  DB: D1Database;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/**
 * The same fold as `src/domain/proposals.ts`, and it must stay the same.
 *
 * Duplicated rather than imported because a Pages Function and the app bundle are
 * separate builds with no shared module graph. The duplication is a real risk — if one
 * side changes, a dish the client says is a duplicate will be accepted by the server —
 * so it is written identically and both are covered by `__tests__/proposals.test.ts`.
 */
const fold = (name: string): string =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number} ]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const asArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.map((v) => String(v).trim()).filter(Boolean).slice(0, 100) : [];

/** Trim, and cap. An unbounded text field is a free database for somebody else. */
const text = (value: unknown, max: number): string => String(value ?? '').trim().slice(0, max);

interface Row {
  id: string;
  name: string;
  country: string;
  region: string;
  cooks: string;
  ingredients: string;
  steps: string;
  submitter: string;
  connection: string;
  photo: string;
  at: string;
  status: string;
}

export const onRequestGet: PagesFunction<Env, string, Identity> = async ({ request, env }) => {
  /*
   * `?include=all` returns declined proposals too, and needs the administrator token.
   *
   * Moderation is reversible only if the moderator can see what they removed. Gated
   * because a declined proposal is usually declined for being abusive or spam, and a
   * public list of everything ever taken down would republish exactly the material the
   * decline was for.
   */
  const wantsAll = new URL(request.url).searchParams.get('include') === 'all';
  if (wantsAll) {
    const who = await admin(request, env);
    if (!who.ok) return who.response;
  }

  /*
   * Open proposals, plus anything published in the last 30 days.
   *
   * The second half is not tidiness. Somebody who confirms a dish and comes back to an
   * empty list has no way to know their confirmation was the one that carried it, and
   * the single most encouraging thing this feature can show a contributor is the moment
   * something they helped got in.
   */
  const proposals = await env.DB.prepare(
    wantsAll
      ? `select id, name, country, region, cooks, ingredients, steps, submitter, connection, photo, at, status
           from proposal
          order by case status when 'proposed' then 0 when 'declined' then 1 else 2 end, at desc
          limit 500`
      : `select id, name, country, region, cooks, ingredients, steps, submitter, connection, photo, at, status
           from proposal
          where status = 'proposed'
             or (status = 'published' and at > datetime('now', '-30 days'))
          order by at desc
          limit 500`,
  ).all<Row>();

  const rows = proposals.results ?? [];
  if (!rows.length) return json([]);

  const confirmations = await env.DB.prepare(
    `select proposal_id, name, connection, said, local, verified, at
       from proposal_confirmation
      where status = 'published'`,
  ).all<{ proposal_id: string; name: string; connection: string; said: string; local: number; verified: number; at: string }>();

  const byProposal = new Map<string, unknown[]>();
  for (const c of confirmations.results ?? []) {
    const list = byProposal.get(c.proposal_id) ?? [];
    /*  leaves;  never does. A reader learns that somebody was
       signed in, and nothing whatever about which account. */
    list.push({ name: c.name, connection: c.connection, said: c.said, local: c.local === 1, verified: c.verified === 1, at: c.at });
    byProposal.set(c.proposal_id, list);
  }

  return json(
    rows.map((row) => ({
      id: row.id,
      name: row.name,
      country: row.country,
      region: row.region,
      cooks: row.cooks,
      ingredients: JSON.parse(row.ingredients || '[]'),
      steps: JSON.parse(row.steps || '[]'),
      submitter: row.submitter,
      connection: row.connection,
      photo: row.photo,
      at: row.at,
      status: row.status,
      people: byProposal.get(row.id) ?? [],
    })),
  );
};

export const onRequestPost: PagesFunction<Env, string, Identity> = async ({ request, env, data }) => {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Could not read that.' }, 400);
  }

  const entry = {
    name: text(body.name, 120),
    country: text(body.country, 80),
    region: text(body.region, 120),
    cooks: text(body.cooks, 2000),
    ingredients: asArray(body.ingredients),
    steps: asArray(body.steps),
    submitter: text(body.submitter, 80),
    connection: text(body.connection, 300),
    photo: text(body.photo, 200),
  };

  /*
   * The same four the client checks, checked again.
   *
   * Not distrust of the client so much as of the assumption that this endpoint is only
   * ever reached by it. A proposal without a connection is not a weaker submission; it
   * is a different kind of thing, and the atlas has no use for it.
   */
  const missing = (['name', 'country', 'submitter', 'connection'] as const).filter((k) => !entry[k]);
  /*
   * The field names go back as DATA, not inside the sentence a reader sees.
   *
   * This used to answer `Still needed: name, connection, said.` and the client shows a
   * server error verbatim, so a column name reached the page from the one place the app
   * cannot re-word it. Functions are a separate type world from `src` on purpose — see
   * this directory's tsconfig — so they cannot share the label map, and duplicating it
   * here would be two copies to disagree. Sending the keys and letting the UI say the
   * words keeps one set of labels in the app and none in the API.
   */
  if (missing.length) {
    return json({ error: 'Some required details are missing.', missing }, 400);
  }

  const id = `p_${crypto.randomUUID().slice(0, 12)}`;

  try {
    await env.DB.prepare(
      `insert into proposal
         (id, name, fold, country, region, cooks, ingredients, steps, submitter_id, submitter, connection, photo)
       values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        id,
        entry.name,
        fold(entry.name),
        entry.country,
        entry.region,
        entry.cooks,
        JSON.stringify(entry.ingredients),
        JSON.stringify(entry.steps),
        data.personId,
        entry.submitter,
        entry.connection,
        entry.photo,
      )
      .run();
  } catch (error) {
    /*
     * The unique index on (fold, country) fired: this dish is already open. 409 rather
     * than 500, because the client turns it into the useful sentence — open it and
     * confirm it instead, which is what actually moves a dish.
     */
    if (String(error).includes('UNIQUE')) {
      return json({ error: 'That dish has already been proposed.' }, 409);
    }
    throw error;
  }

  return json(
    {
      id,
      ...entry,
      at: new Date().toISOString().slice(0, 10),
      status: 'proposed',
      people: [],
    },
    201,
  );
};
