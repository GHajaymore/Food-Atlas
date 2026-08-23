/**
 * Do the source checks that were asked for from the app.
 *
 *   ADMIN_TOKEN=... node scripts/drain-refresh.mjs --at https://wikifoodia.pages.dev
 *   ADMIN_TOKEN=... node scripts/drain-refresh.mjs --at http://127.0.0.1:8788 --dry
 *
 * An administrator reading a record on a phone can mark it worth checking; this is the
 * other end of that. It takes the queue, runs `checkSources` on each request — the same
 * function `check-sources.mjs` runs, imported rather than reimplemented — and writes the
 * one-line answer back so the outcome appears where the question was asked.
 *
 * ## Why this runs on a laptop and not on a schedule in the cloud
 *
 * Because the catalogue is files. Nothing on Cloudflare can rewrite `src/data/*.json`,
 * commit it and rebuild the site, and giving an edge function that power would mean a
 * repository token behind a public URL.
 *
 * The person in the middle is the safeguard, not the friction. This script records that
 * a page has been edited; it never applies the edit. Somebody reads what changed and
 * decides, which is what stops a vandalised Wikipedia edit reaching the atlas unseen.
 *
 * ## The token
 *
 * From the environment, never an argument. A token on the command line is in the shell
 * history of every machine it has been run on.
 */

import { checkSources, summarise } from './check-sources.mjs';

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? null : (process.argv[i + 1] ?? '');
};
const has = (name) => process.argv.includes(`--${name}`);

const TOKEN = process.env.ADMIN_TOKEN ?? '';
const AT = (arg('at') ?? 'http://127.0.0.1:8788').replace(/\/+$/, '');

const api = (path, init = {}) =>
  fetch(`${AT}/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
      ...(init.headers ?? {}),
    },
    signal: AbortSignal.timeout(30000),
  });

const main = async () => {
  if (!TOKEN) {
    process.stdout.write('Set ADMIN_TOKEN in the environment. It is not taken as an argument.\n');
    process.exitCode = 1;
    return;
  }

  const response = await api('/refresh');
  if (response.status === 401) throw new Error('That token was not accepted.');
  if (!response.ok) throw new Error(`Could not read the queue (HTTP ${response.status}).`);

  const queue = (await response.json()).filter((r) => r.status === 'queued');

  if (!queue.length) {
    process.stdout.write('Nothing queued.\n');
    return;
  }

  process.stdout.write(`${queue.length} request${queue.length === 1 ? '' : 's'} queued.\n\n`);

  for (const request of queue) {
    const scope =
      request.kind === 'all' ? 'the whole atlas' : `${request.kind} "${request.target}"`;
    process.stdout.write(`— ${scope}\n`);

    if (has('dry')) {
      process.stdout.write('  (dry run — not checked, not reported back)\n');
      continue;
    }

    let status = 'done';
    let line = '';

    try {
      const result = await checkSources({
        dish: request.kind === 'dish' ? request.target : '',
        country: request.kind === 'country' ? request.target : '',
        all: request.kind === 'all',
      });
      line = summarise(result);
      for (const entry of result.report.slice(0, 20)) process.stdout.write(`${entry}\n`);
    } catch (error) {
      /*
       * A failed request is reported back as failed rather than left queued.
       *
       * Left queued it would be retried on every future drain, for ever, and the reason
       * it failed would never reach the person who asked — the same shape of bug that
       * kept 145 cuisine rows "pending" for weeks.
       */
      status = 'failed';
      line = error.message.slice(0, 300);
    }

    process.stdout.write(`  ${line}\n\n`);

    const reported = await api('/refresh', {
      method: 'PUT',
      body: JSON.stringify({ id: request.id, status, result: line }),
    });
    if (!reported.ok) {
      process.stdout.write(`  (could not report back: HTTP ${reported.status})\n`);
    }
  }

  process.stdout.write('Nothing was rewritten. Drift is recorded; applying it is a decision.\n');
};

main().catch((error) => {
  process.stderr.write(`\nDrain failed: ${error.message}\n`);
  process.exitCode = 1;
});
