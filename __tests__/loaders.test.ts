/**
 * The loaders, which had no test at all.
 *
 * `loadCatalogue` now fetches the five source files, the confirmations and the settings
 * concurrently rather than in series. That is a latency win and it changes a failure
 * mode: inside `Promise.all`, anything that rejects takes the catalogue down with it.
 *
 * Both side loaders are documented as never rejecting — `confirmations.ts` says an
 * endpoint being down must not take the atlas with it, and `settings.ts` says a network
 * error must never move the meaning of the word Authentic. Those contracts were load
 * bearing before and are structural now, and nothing was checking them.
 */

import { loadSettings, settings, thresholds } from '../src/data/settings';
import { DEFAULTS } from '../src/domain/settings';

const realFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = realFetch;
});

describe('settings never take the atlas down', () => {
  test('a rejected request resolves to the compiled defaults', async () => {
    globalThis.fetch = (() => Promise.reject(new Error('offline'))) as typeof fetch;

    await expect(loadSettings()).resolves.toBeDefined();
    expect(settings.authenticAt).toBe(DEFAULTS.authenticAt);
    expect(settings.validationsRequired).toBe(DEFAULTS.validationsRequired);
  });

  test('a non-ok response resolves to the defaults rather than throwing', async () => {
    globalThis.fetch = (() =>
      Promise.resolve({ ok: false, status: 500, json: async () => ({}) })) as unknown as typeof fetch;

    await expect(loadSettings()).resolves.toBeDefined();
    expect(settings.authenticAt).toBe(DEFAULTS.authenticAt);
  });

  test('a malformed body resolves to the defaults', async () => {
    globalThis.fetch = (() =>
      Promise.resolve({ ok: true, json: async () => 'not an object' })) as unknown as typeof fetch;

    await expect(loadSettings()).resolves.toBeDefined();
    expect(settings.proposalConfirmations).toBe(DEFAULTS.proposalConfirmations);
  });

  test('an out-of-range value from the server is clamped, not obeyed', async () => {
    /*
     * The server refuses these on write, but a stored value could predate a bound or be
     * edited directly in D1. `authenticAt: 0` would classify every record in the atlas as
     * Authentic, so the read path clamps as well — checked here because nothing else does.
     */
    globalThis.fetch = (() =>
      Promise.resolve({ ok: true, json: async () => ({ authenticAt: 0 }) })) as unknown as typeof fetch;

    await loadSettings();
    expect(settings.authenticAt).toBeGreaterThanOrEqual(40);
  });
});

describe('thresholds feed assess', () => {
  test('reports what the settings hold, in the shape assess wants', () => {
    const t = thresholds();
    expect(t).toEqual({
      authenticAt: settings.authenticAt,
      validationsRequired: settings.validationsRequired,
    });
  });
});
