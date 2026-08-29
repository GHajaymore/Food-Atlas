/**
 * The database constraints the badge rests on.
 *
 * `0001_proposals.sql` says it plainly about the one-per-person index:
 *
 *   "This index is what the number '3 confirmations' actually means. Everything else in
 *    the authenticity model is arithmetic over evidence; this is the only line that stops
 *    one person supplying all of it. **If it is ever dropped, the badge stops meaning
 *    anything and no test in the app would notice.**"
 *
 * That last clause was true. `assess.ts` counts rows; it cannot tell three people from one
 * person three times, because by the time it counts, the distinction has already been made
 * — or not made — in SQLite. Every test of the scoring model would go on passing with the
 * index deleted.
 *
 * These read the migrations as text, which is a weaker guarantee than exercising a
 * database and the right one to have here: the failure being guarded against is somebody
 * removing or loosening a line, and that is visible in the file. The live database was
 * checked separately and carries all three.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const MIGRATIONS = resolve(__dirname, '..', 'migrations');

/** Every migration, concatenated, with comment lines removed so a mention is not a match. */
const schema = (): string =>
  readdirSync(MIGRATIONS)
    .filter((f) => f.endsWith('.sql'))
    .sort()
    .map((f) => readFileSync(resolve(MIGRATIONS, f), 'utf8'))
    .join('\n')
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
    .toLowerCase();

describe('the constraints that make a confirmation count', () => {
  const sql = schema();

  /**
   * One person, one confirmation — the anonymous identity.
   *
   * Partial on `status = 'published'` deliberately: a withdrawn confirmation should not
   * bar that person for ever. The predicate is asserted too, because widening it to all
   * rows or narrowing it to something else would both change what "3 confirmations" means.
   */
  it('keeps one confirmation per person per proposal', () => {
    expect(sql).toContain('unique index if not exists proposal_one_per_person');
    expect(sql).toMatch(/proposal_one_per_person\s+on proposal_confirmation \(proposal_id, person_id\)/);
    expect(sql).toMatch(/proposal_one_per_person[\s\S]{0,120}where status = 'published'/);
  });

  /**
   * One account, one confirmation — the signed-in identity.
   *
   * Partial on `account_id is not null`, so the unlimited anonymous rows do not collide
   * with each other. Dropping that predicate would make every anonymous confirmation after
   * the first fail; dropping the index would make a Google account worth no more than a
   * cleared cookie.
   */
  it('keeps one confirmation per account per proposal', () => {
    expect(sql).toContain('unique index if not exists confirmation_one_per_account');
    expect(sql).toMatch(/confirmation_one_per_account\s+on proposal_confirmation \(proposal_id, account_id\)/);
    expect(sql).toMatch(/confirmation_one_per_account[\s\S]{0,120}where account_id is not null/);
  });

  /** The same dish proposed twice is one proposal, not two half-confirmed ones. */
  it('keeps a proposal from being filed twice', () => {
    expect(sql).toContain('unique index if not exists proposal_not_duplicated');
  });

  /**
   * A submitter cannot confirm their own proposal.
   *
   * Enforced by a trigger rather than an index, because it is a relationship between two
   * tables. The endpoint checks it too and returns 403; this is the line that holds when
   * the check is bypassed.
   */
  it('stops somebody confirming what they proposed', () => {
    expect(sql).toMatch(/create trigger[\s\S]{0,400}own proposal/);
  });

  /**
   * `verified` is the server's word, not the client's.
   *
   * The column exists so a signed-in confirmation can be counted differently from an
   * anonymous one. It defaults to 0, so a row that says nothing about it is not verified —
   * the safe direction, and the one a forgotten `bind` falls into.
   */
  it('treats an unstated confirmation as unverified', () => {
    expect(sql).toMatch(/verified integer not null default 0/);
  });
});
