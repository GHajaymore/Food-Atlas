/**
 * The session cookie expires because the server says so, not because a browser agreed to.
 *
 * The cookie carried `account.signature` and nothing else, with `Max-Age` doing all the
 * expiring. `Max-Age` is an instruction to a browser, not a fact a server can rely on: a
 * value copied off a shared machine, or pasted into curl, kept working **for ever** —
 * the signature stayed valid and there was nothing inside it to go stale.
 *
 * These run against the real functions, which nothing else in the suite does. The sign-in
 * routes cannot be exercised through the app until Ajay sets the Google credentials, so
 * without this the change would ship on reasoning alone.
 */

import { accountFrom, newSessionCookie, same, sign, SESSION_MAX_AGE } from '../functions/api/auth/_session';

const SECRET = 'a-test-secret-that-is-not-the-real-one';

/** A request carrying whatever cookie string we want to test. */
const withCookie = (cookie: string): Request =>
  new Request('https://example.test/api/auth/me', { headers: { Cookie: cookie } });

/** The cookie value out of a Set-Cookie line. */
const valueOf = (setCookie: string): string => setCookie.split(';')[0].split('=').slice(1).join('=');

describe('a session cookie is only good for as long as the server allows', () => {
  it('admits a freshly issued account', async () => {
    const cookie = await newSessionCookie('abc123', SECRET);
    expect(await accountFrom(withCookie(`wf_acct=${valueOf(cookie)}`), SECRET)).toBe('abc123');
  });

  /*
   * The whole point. A cookie stamped thirty-one days ago is refused even though its
   * signature is perfect — which is exactly the state a copied cookie is in.
   */
  it('refuses one that is older than the maximum age, however valid its signature', async () => {
    const issued = Math.floor(Date.now() / 1000) - (SESSION_MAX_AGE + 60);
    const account = 'abc123';
    const signature = await sign(`${account}.${issued}`, SECRET);
    const forged = `wf_acct=${account}.${issued}.${signature}`;

    /* The signature really is valid — this is not passing for the wrong reason. */
    expect(same(await sign(`${account}.${issued}`, SECRET), signature)).toBe(true);
    expect(await accountFrom(withCookie(forged), SECRET)).toBe('');
  });

  it('admits one issued just inside the window', async () => {
    const issued = Math.floor(Date.now() / 1000) - (SESSION_MAX_AGE - 60);
    const signature = await sign(`abc123.${issued}`, SECRET);
    expect(await accountFrom(withCookie(`wf_acct=abc123.${issued}.${signature}`), SECRET)).toBe('abc123');
  });

  /* A stamp in the future is not a session anybody issued. */
  it('refuses a future-dated stamp', async () => {
    const issued = Math.floor(Date.now() / 1000) + 86_400;
    const signature = await sign(`abc123.${issued}`, SECRET);
    expect(await accountFrom(withCookie(`wf_acct=abc123.${issued}.${signature}`), SECRET)).toBe('');
  });

  it('refuses a stamp that is not a number at all', async () => {
    const signature = await sign('abc123.tomorrow', SECRET);
    expect(await accountFrom(withCookie(`wf_acct=abc123.tomorrow.${signature}`), SECRET)).toBe('');
  });

  it('refuses a tampered account with a signature from another one', async () => {
    const cookie = valueOf(await newSessionCookie('abc123', SECRET));
    const [, issued, signature] = cookie.split('.');
    expect(await accountFrom(withCookie(`wf_acct=someone-else.${issued}.${signature}`), SECRET)).toBe('');
  });

  it('refuses a moved timestamp, because the stamp is inside the signature', async () => {
    const cookie = valueOf(await newSessionCookie('abc123', SECRET));
    const [account, , signature] = cookie.split('.');
    const later = Math.floor(Date.now() / 1000) + 10;
    expect(await accountFrom(withCookie(`wf_acct=${account}.${later}.${signature}`), SECRET)).toBe('');
  });

  it('refuses a cookie signed with a different secret', async () => {
    const cookie = valueOf(await newSessionCookie('abc123', 'some-other-secret'));
    expect(await accountFrom(withCookie(`wf_acct=${cookie}`), SECRET)).toBe('');
  });

  it('refuses the old two-part shape, which had no expiry in it', async () => {
    const signature = await sign('abc123', SECRET);
    expect(await accountFrom(withCookie(`wf_acct=abc123.${signature}`), SECRET)).toBe('');
  });

  it('refuses no cookie at all', async () => {
    expect(await accountFrom(new Request('https://example.test/'), SECRET)).toBe('');
  });

  /* The attributes are the other half of the protection and are easy to drop silently. */
  it('sets the cookie so script cannot read it and another site cannot send it', async () => {
    const cookie = await newSessionCookie('abc123', SECRET);
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('Secure');
    expect(cookie).toContain('SameSite=Lax');
    expect(cookie).toContain(`Max-Age=${SESSION_MAX_AGE}`);
  });
});
