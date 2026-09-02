/**
 * Does the app stand down when the reader is paying for every byte?
 *
 * The atlas prefetches 1.2 MB of method text on a browser that is idle, so the words are
 * already there when somebody opens a record. That is a good trade on a fast link and a
 * bad one on a metered link, where it is money rather than milliseconds and most visits
 * never open a record at all.
 *
 * It matters more here than the size suggests. 14,352 records hold a name and a place and
 * nothing else, and the people who could write them down are disproportionately the ones
 * on 3G in the places the food comes from. This is the difference between an atlas that
 * asks them for help and one that spends their data first.
 *
 * Asserted rather than assumed because the failure is invisible from the inside: the app
 * looks identical either way, the file simply arrives.
 */

import { onAMeteredConnection } from '../src/data/catalogue';

/** Pretend to be a browser reporting a particular connection, then put it back. */
const withConnection = <T>(connection: unknown, run: () => T): T => {
  const holder = globalThis as { navigator?: unknown };
  const before = holder.navigator;
  const had = 'navigator' in holder;
  Object.defineProperty(holder, 'navigator', { value: { connection }, configurable: true, writable: true });
  try {
    return run();
  } finally {
    if (had) Object.defineProperty(holder, 'navigator', { value: before, configurable: true, writable: true });
    else delete holder.navigator;
  }
};

describe('the prefetch stands down on a connection that has to pay for it', () => {
  it('honours the reader asking for less data, whatever the speed says', () => {
    expect(withConnection({ saveData: true, effectiveType: '4g' }, onAMeteredConnection)).toBe(true);
  });

  it.each(['slow-2g', '2g', '3g'])('treats %s as metered', (effectiveType) => {
    expect(withConnection({ effectiveType }, onAMeteredConnection)).toBe(true);
  });

  it('leaves a fast connection alone, so the method is ready before it is asked for', () => {
    expect(withConnection({ effectiveType: '4g' }, onAMeteredConnection)).toBe(false);
  });

  /*
   * The direction to be careful about. `navigator.connection` is Chromium-only — Safari
   * and Firefox report nothing at all. Reading silence as "expensive" would withhold the
   * prefetch from every reader on those browsers, which is a worse trade than the one this
   * exists to avoid.
   */
  it('does not guess that an unknown connection is expensive', () => {
    expect(withConnection(undefined, onAMeteredConnection)).toBe(false);
    expect(withConnection({}, onAMeteredConnection)).toBe(false);
  });
});
