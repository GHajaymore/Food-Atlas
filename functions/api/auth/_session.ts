/**
 * The signed-in session: one cookie, holding an account id nobody here issued.
 *
 * ## Why an account at all, when the app was proud of not having them
 *
 * Because the badge rests on counting people, and until now it could not. The anonymous
 * identity is a signed cookie — it stops a double-tap, a refresh and a hand-edited
 * cookie, and it does not stop one person opening three private windows. "3
 * confirmations" therefore meant *at least one person*, and the app displayed it as
 * though it meant three.
 *
 * Signing in does not make a confirmation true. It raises the cost of faking a badge
 * from opening a private window to creating and verifying three Google accounts, which
 * is the difference between casual and deliberate — and deliberate is a much smaller
 * population.
 *
 * ## What it deliberately does not do
 *
 * There is no user table, no profile, no display name taken from Google, and no email
 * stored. The only thing kept is a one-way hash of the provider's subject id, used to
 * tell one account from another and for nothing else. A reader who signs in and
 * confirms a dish appears on the record under the name **they** typed, exactly as an
 * anonymous confirmer does.
 *
 * That is not minimalism for its own sake: an account system is a thing to maintain, a
 * thing to breach, and a thing to be asked to delete. Holding a hash means there is
 * almost nothing to hand over and almost nothing to lose.
 *
 * ## Off until configured
 *
 * With no `GOOGLE_CLIENT_ID` the sign-in routes refuse and the app carries on exactly as
 * it did — anonymous confirmations, displayed, uncounted. Same rule as every other
 * integration here: a control that goes nowhere is worse than one that says it is not
 * ready.
 */

export interface AuthEnv {
  /** From the Google Cloud console. Public by nature — it appears in the redirect URL. */
  GOOGLE_CLIENT_ID?: string;
  /** `npx wrangler pages secret put GOOGLE_CLIENT_SECRET`. */
  GOOGLE_CLIENT_SECRET?: string;
  /** Signs the session cookie. Shared with the anonymous identity middleware. */
  IDENTITY_SECRET?: string;
}

export const SESSION_COOKIE = 'wf_acct';
/** Thirty days. Long enough not to nag, short enough that a shared computer forgets. */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

const enc = new TextEncoder();

const hex = (buffer: ArrayBuffer): string =>
  [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');

export async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ]);
  return hex(await crypto.subtle.sign('HMAC', key, enc.encode(value)));
}

/** Constant time, so a signature cannot be recovered one byte at a time. */
export function same(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * The account id we store: a hash of the provider's subject, salted with our own secret.
 *
 * Hashed so that what sits in the database is not a Google user id. It is enough to tell
 * two accounts apart — which is the entire requirement — and not enough to look anybody
 * up anywhere. Salted with `IDENTITY_SECRET` so the same hash cannot be computed by
 * somebody who obtains the database and guesses a subject id.
 */
export async function accountIdFor(subject: string, secret: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(`${secret}:${subject}`));
  return hex(digest).slice(0, 32);
}

export const readCookie = (header: string | null, name: string): string => {
  for (const part of (header ?? '').split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return '';
};

/**
 * The account this request is signed in as, or empty.
 *
 * ## Why the issue time is inside the signature
 *
 * The cookie used to carry `account.signature` and nothing else, and `Max-Age` was doing
 * all the expiring. `Max-Age` is an instruction to a browser, not a fact the server can
 * rely on: anything that keeps sending the cookie — a copy taken off a shared machine,
 * a value pasted into curl — stays signed in **for ever**, because the signature is still
 * perfectly valid and there is nothing in it to go stale.
 *
 * The comment on `SESSION_MAX_AGE` says thirty days is "short enough that a shared
 * computer forgets". That was only ever true of a browser that chose to honour it. Now the
 * moment of issue is signed alongside the account, so age is something this side can check
 * and the thirty days is the server's rule rather than a request.
 *
 * Nothing was live when this changed — `/api/auth/me` reports `available:false` until Ajay
 * sets the Google credentials — so there was no old cookie to keep working, and the format
 * is simply the right one from the start.
 */
export async function accountFrom(request: Request, secret: string): Promise<string> {
  const raw = readCookie(request.headers.get('Cookie'), SESSION_COOKIE);
  const [account, issued, signature] = raw.split('.');
  if (!account || !issued || !signature) return '';

  if (!same(await sign(`${account}.${issued}`, secret), signature)) return '';

  /* A malformed or future-dated stamp is not a session. `Number()` on nonsense gives NaN,
     and every comparison with NaN is false, so this rejects rather than admits. */
  const age = Math.floor(Date.now() / 1000) - Number(issued);
  if (!(age >= 0 && age <= SESSION_MAX_AGE)) return '';

  return account;
}

/**
 * A fresh session cookie, signed with the moment it was issued.
 *
 * One function rather than a `sign` at the call site and a cookie built from it: the
 * signature and the stamp inside it have to agree, and the way to guarantee that is to
 * leave no way to produce one without the other.
 */
export async function newSessionCookie(account: string, secret: string): Promise<string> {
  const issued = Math.floor(Date.now() / 1000);
  const signature = await sign(`${account}.${issued}`, secret);
  return `${SESSION_COOKIE}=${account}.${issued}.${signature}; Path=/api; Max-Age=${SESSION_MAX_AGE}; HttpOnly; Secure; SameSite=Lax`;
}

/** Signing out. Same attributes, expired — a cookie is only cleared by its own path. */
export const clearedCookie = (): string =>
  `${SESSION_COOKIE}=; Path=/api; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
