/**
 * Who is asking, on the proposals path.
 *
 * Every endpoint under `/api/proposals` runs through this first. Its whole job is to put
 * a stable `personId` on the request, because the two indexes the Authentic badge rests
 * on — one confirmation per person, and no confirming your own proposal — are meaningless
 * without one.
 *
 * ## What this identity is actually worth, stated plainly
 *
 * It is a signed cookie. The server mints a random id, HMACs it so it cannot be forged
 * or guessed, and sets it `HttpOnly` so no script on the page can read or change it.
 *
 * That stops the things people do by accident and the things they do casually: a
 * double-tap, a refresh, an enthusiastic supporter confirming the same dish three times
 * from the same browser, and anyone editing a cookie by hand. It does **not** stop
 * somebody who opens a private window three times. Clearing storage issues a new
 * identity, and nothing here can tell that apart from a new person.
 *
 * That limit is deliberate rather than unfinished, and it is the same trade
 * `confirmations.ts` already documents: the alternative is an account, and requiring
 * one excludes precisely the people this depends on — a grandmother in Kozhikode is not
 * creating a login to confirm a halwa. The atlas would gain a defensible number and
 * lose the person who knows the dish.
 *
 * **So the real defence is not this file.** It is that every confirmation is displayed
 * with the connection its author claimed, so three fabrications have to be three
 * convincing pieces of writing rather than three clicks — and a reader can weigh them.
 * `docs/proposals-api.md` says the same thing about what identity does not solve.
 *
 * ## And now there is a second identity beside it
 *
 * `accountId` is a signed-in Google account, and it is what a badge now actually counts
 * — see `validationsOf`. The two coexist rather than one replacing the other, because
 * they answer different questions: `personId` stops the same browser confirming twice,
 * including for somebody who never signs in, and `accountId` decides whether a
 * confirmation moves a number.
 *
 * Keeping both is what lets an anonymous confirmation still be *made* and *displayed*.
 * Requiring an account to speak would have excluded the grandmother in Kozhikode;
 * requiring one to move a badge is what makes the badge worth having.
 *
 * ## Why the cookie is scoped to this path
 *
 * It used to sit at `functions/api/` and set the cookie on the whole site, so every
 * request the app ever made — including the analytics beacon added later — carried an
 * identifier the server could have correlated against. Nothing did correlate them, but
 * "nothing does" is a promise about today's code, and the app tells readers in four
 * places that it does not track them.
 *
 * Scoped here, the guarantee is structural instead: an event request is not under this
 * path, so the browser does not send the cookie, so no code written later can join a
 * page view to a person. `/api/confirmations` mints its own for the same reason, rather
 * than widening this one back out to `/api`.
 *
 * The machinery itself lives in `functions/api/_identity.ts`, shared with that one.
 */

import { identityOn, type Identity, type IdentityEnv } from '../_identity';

export type { Identity };

interface Env extends IdentityEnv {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env, string, Identity> = identityOn<Env>('wf_id', '/api/proposals');
