/**
 * Who is asking, on the confirmations path.
 *
 * The same signed-cookie identity the proposals path has used since it shipped, minted
 * separately here. Two narrow cookies rather than one wide one: an identity scoped to
 * `/api` would be sent with the analytics beacon too, and the structural promise that no
 * page view can be joined to a person is worth more than a cookie.
 *
 * The consequence, stated rather than discovered: a reader who has confirmed a proposal
 * and then confirms a record is two different `personId`s to this server. That is
 * correct for what the ids are for — each one enforces one-person-one-confirmation
 * inside its own table, and neither is an account. The thing that counts toward a badge
 * is `accountId`, which is a signed-in Google account and is the same on both paths.
 *
 * See `functions/api/_identity.ts` for what the identity is worth, and
 * `docs/confirmations-api.md` for why it exists at all.
 */

import { identityOn, type Identity, type IdentityEnv } from '../_identity';

export type { Identity };

interface Env extends IdentityEnv {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env, string, Identity> = identityOn<Env>('wf_cid', '/api/confirmations');
