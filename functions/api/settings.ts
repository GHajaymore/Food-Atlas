/**
 * `GET  /api/settings` — what the app is currently running on. Public.
 * `PUT  /api/settings` — change it. Administrator only.
 *
 * ## Why the read is public
 *
 * Every number here is already visible in the app's own behaviour — a reader can see
 * that a proposal needs three confirmations by reading the sentence that says so. Making
 * the endpoint private would hide nothing and would mean the client could not render
 * correctly until an administrator logged in, which is nobody's idea of a good trade.
 *
 * ## How the write is protected
 *
 * A bearer token, held as a Cloudflare secret. Not an account system, because there is
 * exactly one administrator and building sign-in for one person is how a free project
 * acquires a login service it has to maintain for ever.
 *
 * The token is compared in constant time and never logged. If `ADMIN_TOKEN` is unset the
 * endpoint refuses every write rather than allowing them — the same direction of failure
 * as the identity middleware, and for the same reason: a permissions check that silently
 * passes when misconfigured is worse than one that is absent, because it looks like it
 * is working.
 */

interface Env {
  DB: D1Database;
  /** `npx wrangler pages secret put ADMIN_TOKEN`. Never in the repo. */
  ADMIN_TOKEN?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/** Bounds duplicated from src/domain/settings.ts — see the note in proposals/index.ts. */
const LIMITS: Record<string, [number, number]> = {
  proposalConfirmations: [1, 20],
  authenticAt: [40, 95],
  validationsRequired: [1, 20],
};

const KEYS = ['proposalConfirmations', 'authenticAt', 'validationsRequired', 'proposalsOpen'];

function sameToken(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * A short, stable fingerprint of the token, for the audit trail.
 *
 * The token itself must never be written anywhere — an audit log that leaks the
 * credential it audits is worse than no audit log. Eight hex characters is enough to
 * tell two administrators apart and far too little to reconstruct anything.
 */
async function fingerprint(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return [...new Uint8Array(digest)]
    .slice(0, 4)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const rows = await env.DB.prepare(`select key, value from setting`).all<{ key: string; value: string }>();

  const out: Record<string, unknown> = {};
  for (const row of rows.results ?? []) {
    try {
      out[row.key] = JSON.parse(row.value);
    } catch {
      /* A corrupt row is skipped, not fatal. The client falls back to the compiled
       * default for anything absent, which is the correct behaviour for a value the
       * server can no longer vouch for. */
    }
  }
  return json(out);
};

export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  const secret = env.ADMIN_TOKEN;
  if (!secret) return json({ error: 'No administrator is configured.' }, 503);

  const offered = (request.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!offered || !sameToken(offered, secret)) return json({ error: 'Not authorised.' }, 401);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Could not read that.' }, 400);
  }

  const by = await fingerprint(offered);
  const applied: Record<string, unknown> = {};
  const refused: { key: string; said: unknown; why: string }[] = [];

  for (const key of KEYS) {
    if (!(key in body)) continue;
    const raw = body[key];

    let value: unknown;
    if (key === 'proposalsOpen') {
      value = raw !== false;
    } else {
      const n = Math.round(Number(raw));
      const [min, max] = LIMITS[key];
      if (!Number.isFinite(n)) {
        refused.push({ key, said: raw, why: 'Not a number.' });
        continue;
      }
      if (n < min || n > max) {
        /*
         * Refused rather than clamped.
         *
         * Silently storing 40 when an administrator typed 4 would leave them believing
         * the threshold is 4 — and for `authenticAt` that belief is about what the word
         * Authentic means across the whole atlas. A rejection they can see beats a
         * correction they cannot.
         */
        refused.push({ key, said: raw, why: `Outside the usable range ${min}–${max}.` });
        continue;
      }
      value = n;
    }

    const previous = await env.DB.prepare(`select value from setting where key = ?`)
      .bind(key)
      .first<{ value: string }>();

    const encoded = JSON.stringify(value);
    if (previous?.value === encoded) continue;

    await env.DB.batch([
      env.DB.prepare(
        `insert into setting (key, value, updated_at) values (?, ?, datetime('now'))
         on conflict(key) do update set value = excluded.value, updated_at = excluded.updated_at`,
      ).bind(key, encoded),
      env.DB.prepare(`insert into setting_change (key, was, now, by) values (?, ?, ?, ?)`).bind(
        key,
        previous?.value ?? null,
        encoded,
        by,
      ),
    ]);

    applied[key] = value;
  }

  return json({ applied, refused }, refused.length && !Object.keys(applied).length ? 400 : 200);
};
