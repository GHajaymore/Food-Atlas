/**
 * `GET /api/confirmations` — everything people have confirmed, keyed by record id.
 * `POST /api/confirmations` — confirm a record that is already in the atlas.
 *
 * The endpoint `docs/confirmations-api.md` has specified since before there was a
 * server, and the one door the authenticity model was missing. Three of the six
 * dimensions a record is scored on cannot be answered by any document; until this
 * existed, the only way anybody could answer them was to confirm a *proposal*, which
 * meant the 17,358 records already in the atlas had no route to the badge at all.
 *
 * ## The shape is a contract
 *
 * `GET` returns exactly `ConfirmationIndex` from `src/domain/confirmations.ts`, because
 * `catalogue.ts` hands the body straight to `buildCatalogue` and `assess` scores it. A
 * field renamed on one side would silently change a badge on the other.
 *
 * ## What never leaves this file
 *
 * `person_id` and `account_id`. The first exists to enforce one-person-one-confirmation
 * and the second to decide `verified`; neither is any of a reader's business, and the
 * whole point of showing a stated connection rather than a verified identity is that the
 * atlas does not hold identities. `verified` says somebody was signed in and nothing
 * about which account.
 *
 * ## Before the table exists
 *
 * A read answers `{}` and a write says plainly that confirmations are not switched on.
 * The migration (`0009_record_confirmations.sql`) is applied by hand against the
 * production database, so the code ships first and has to behave until it runs: `{}` is
 * exactly what the app has received since it was written, and every record is scored as
 * one nobody has confirmed — which is true.
 */

import { admin, type AdminEnv } from '../_admin';
import type { Identity } from './_middleware';

interface Env {
  DB: D1Database;
}

const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extra },
  });

/**
 * Whether writes are actually possible, said in a header on the read.
 *
 * The migration is applied by hand against the production database, so there is a window
 * where this code is deployed and the table is not there. An empty index is indis-
 * tinguishable from a working endpoint nobody has used yet, and the difference matters to
 * the client: offering a form that can only answer 503 is precisely the dead control this
 * project refuses everywhere else. So the read says which of the two it is, and the app
 * shows the form only when it hears `open`.
 */
const STATUS = 'X-Confirmations';

/** Trim, and cap. An unbounded text field is a free database for somebody else. */
const text = (value: unknown, max: number): string => String(value ?? '').trim().slice(0, max);

/** The table is created by a migration run by hand; until then every read is empty. */
const missingTable = (error: unknown): boolean => /no such table/i.test(String((error as Error)?.message ?? error));

interface Row {
  /** Present only on the administrator read; the public index never carries it. */
  id: string;
  dish_id: number;
  name: string;
  connection: string;
  said: string;
  local: number;
  account_id: string;
  at: string;
  status: string;
}

export const onRequestGet: PagesFunction<Env, string, Identity> = async ({ request, env }) => {
  /*
   * `?include=all` returns removed confirmations too, with their ids, and needs the
   * administrator token. Moderation is reversible only if the moderator can see what they
   * removed — and a public list of everything taken down would republish exactly the
   * material the removal was for.
   */
  const wantsAll = new URL(request.url).searchParams.get('include') === 'all';
  if (wantsAll) {
    const who = await admin(request, env as unknown as AdminEnv);
    if (!who.ok) return who.response;
  }

  let rows: Row[] = [];
  try {
    const found = await env.DB.prepare(
      wantsAll
        ? `select id, dish_id, name, connection, said, local, account_id, at, status
             from record_confirmation
            order by at desc
            limit 1000`
        : `select dish_id, name, connection, said, local, account_id, at
             from record_confirmation
            where status = 'published'
            order by at asc
            limit 5000`,
    ).all<Row>();
    rows = found.results ?? [];
    /* The moderator's view is a list, not an index: it is read by one screen that shows
       rows and acts on them, and keying it by dish would hide the ids it needs. */
    if (wantsAll) {
      return json(
        rows.map((row) => ({
          id: row.id,
          dishId: row.dish_id,
          name: row.name,
          connection: row.connection,
          said: row.said,
          local: row.local === 1,
          verified: row.account_id !== '',
          at: row.at.slice(0, 10),
          status: row.status,
        })),
        200,
        { [STATUS]: 'open' },
      );
    }
  } catch (error) {
    if (!missingTable(error)) throw error;
    return json({}, 200, { [STATUS]: 'closed' });
  }

  const index: Record<string, { people: unknown[] }> = {};
  for (const row of rows) {
    const key = String(row.dish_id);
    index[key] ??= { people: [] };
    index[key].people.push({
      name: row.name,
      connection: row.connection,
      said: row.said,
      local: row.local === 1,
      /* Whether they were signed in — which is what `validationsOf` counts — and nothing
         about who. The account id itself never leaves this file. */
      verified: row.account_id !== '',
      at: row.at.slice(0, 10),
    });
  }

  return json(index, 200, { [STATUS]: 'open' });
};

export const onRequestPost: PagesFunction<Env, string, Identity> = async ({ request, env, data }) => {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Expected JSON.' }, 400);
  }

  const dishId = Number(body.dishId);
  if (!Number.isInteger(dishId) || dishId <= 0) {
    return json({ error: 'That is not a record id.' }, 400);
  }

  /*
   * The same three fields the form requires, checked again here.
   *
   * `said` is required because a confirmation with nothing said is a vote, and a vote is
   * what this design exists to avoid. `connection` is required because it is the whole
   * of what makes a confirmation evidence rather than an opinion. Both are displayed.
   */
  const name = text(body.name, 80);
  const connection = text(body.connection, 300);
  const said = text(body.said, 1000);
  const missing = [
    !name ? 'name' : '',
    !connection ? 'connection' : '',
    !said ? 'said' : '',
  ].filter(Boolean);
  if (missing.length) return json({ error: 'Some of it is still missing.', missing }, 422);

  const accountId = String(data.accountId ?? '');
  const personId = String(data.personId ?? '');

  /*
   * How many one person may write in a day.
   *
   * The unique index stops the same person confirming the same record twice; nothing
   * stopped them confirming a thousand different ones. Somebody doing that is not reading
   * 17,358 dishes — they are filling a free database, and D1's free plan allows 100,000
   * writes a day, so the bill arrives as an outage rather than an invoice.
   *
   * Set where a real contributor never meets it. Twenty records in one sitting is a long
   * evening of honest work and an implausible amount of knowledge; the refusal says so
   * rather than pretending something broke.
   */
  const DAILY = 20;
  try {
    const today = await env.DB.prepare(
      `select count(*) as n from record_confirmation
        where person_id = ? and at > datetime('now', '-1 day')`,
    )
      .bind(personId)
      .first<{ n: number }>();
    if ((today?.n ?? 0) >= DAILY) {
      return json({ error: 'That is as many as one person can add in a day.' }, 429);
    }
  } catch (error) {
    /* No table yet: the insert below answers that case properly, with the message that
       says confirmations are not switched on rather than a count that cannot be made. */
    if (!missingTable(error)) throw error;
  }

  try {
    await env.DB.prepare(
      `insert into record_confirmation (id, dish_id, person_id, account_id, name, connection, said, local)
       values (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        crypto.randomUUID(),
        dishId,
        personId,
        accountId,
        name,
        connection,
        said,
        body.local ? 1 : 0,
      )
      .run();
  } catch (error) {
    if (missingTable(error)) {
      return json({ error: 'Confirmations are not switched on yet.' }, 503);
    }
    /*
     * The unique index doing its job, reported as the fact it is rather than as a
     * failure: one published confirmation per person per record, and one per account.
     */
    if (/unique/i.test(String((error as Error)?.message ?? error))) {
      return json({ error: 'You have already confirmed this one.' }, 409);
    }
    throw error;
  }

  return json({ ok: true }, 201);
};
