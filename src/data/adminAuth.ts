/**
 * How an administrative request proves it is allowed.
 *
 * There are two credentials now and the difference is not the client's to decide, so
 * this sends both and lets the server pick. `functions/api/_admin.ts` tries the session
 * first and falls back to the token, which means a signed-in owner or admin never has to
 * type anything and a break-glass request still works on a browser with no session.
 *
 * ## Why `credentials: 'include'` is on every one of these
 *
 * The session cookie is `HttpOnly` and scoped to `/api`. Without this flag `fetch` sends
 * no cookie at all and every one of these calls would fall through to the token — which
 * is exactly the state this change exists to end, and it would fail *silently*, looking
 * like "roles do not work" rather than "the cookie was never sent".
 *
 * ## Why an empty token is not an error here
 *
 * It used to be: each of these functions began by refusing a blank token. That was right
 * when the token was the only credential and is wrong now — a signed-in administrator has
 * no token and never will. The refusal moved to the server, where it belongs, and these
 * functions ask rather than assume.
 */

/** Headers for an administrative call. The token is omitted when there is none. */
export const adminHeaders = (token: string, extra: Record<string, string> = {}): Record<string, string> =>
  token.trim() ? { ...extra, Authorization: `Bearer ${token.trim()}` } : extra;
