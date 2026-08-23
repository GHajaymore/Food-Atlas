/**
 * Counting what happens, without watching who it happens to.
 *
 * The app tells readers there is no tracking, so what leaves the device is worth being
 * exact about. One event is `{kind: 'dish', target: '4211'}` — a dish id and nothing
 * else. No identifier is attached because there is none to attach: the identity cookie
 * is scoped to `/api/proposals`, so a request to `/api/events` carries no cookie at all,
 * and that is a property of the browser rather than of this file behaving well.
 *
 * ## Buffered, because a beacon per tap is a beacon too many
 *
 * A reader flicking through fifteen dishes should not make fifteen requests. Events
 * collect for a few seconds and go as one, which is cheaper for the reader's battery,
 * cheaper against D1's row-write allowance, and — the part that matters — impossible to
 * time-correlate into a sequence, because the server records only the day.
 *
 * ## It never blocks and never throws
 *
 * Nothing here is awaited by a screen and every failure is swallowed. A lost count is
 * the correct price for a page that cannot be slowed down or broken by analytics, and
 * this is the one part of the app where being wrong quietly is right.
 */

import { PROPOSALS_URL, canPropose } from '../domain/proposals';

export type EventKind = 'dish' | 'search' | 'shelf' | 'screen' | 'propose' | 'confirm';

interface Event {
  kind: EventKind;
  target: string;
}

const FLUSH_AFTER = 4000;
/** Send early rather than sit on a long list. Well under the endpoint's cap of 40. */
const FLUSH_AT = 20;

let buffer: Event[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

const endpoint = () => `${PROPOSALS_URL.replace(/\/+$/, '')}/events`;

function flush(): void {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (!buffer.length) return;

  const events = buffer;
  buffer = [];

  try {
    void fetch(endpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
      /*
       * Survives the page being closed, which is exactly when the last few events of a
       * session would otherwise be lost — and those are the interesting ones, because
       * they are what somebody was reading when they left.
       */
      keepalive: true,
      /*
       * No cookies, stated rather than assumed. The cookie's path already prevents it,
       * and saying so here means a future change to that path cannot quietly start
       * attaching an identity to page views.
       */
      credentials: 'omit',
    }).catch(() => {});
  } catch {
    /* Counting is never worth an error a reader can see. */
  }
}

/**
 * Record that something happened.
 *
 * `target` is a dish id, a search term, a shelf title or a screen name. Never anything a
 * person typed about themselves, and never anything identifying — the endpoint enforces
 * an allow-list of kinds for the same reason.
 */
export function count(kind: EventKind, target: string | number = ''): void {
  if (!canPropose()) return;

  buffer.push({ kind, target: String(target).slice(0, 60) });

  if (buffer.length >= FLUSH_AT) {
    flush();
    return;
  }
  timer ??= setTimeout(flush, FLUSH_AFTER);
}

/**
 * Send whatever is buffered before the page goes away.
 *
 * `visibilitychange` rather than `unload`: mobile browsers frequently never fire
 * `unload` at all, so a reader who switches apps and never comes back would lose
 * everything buffered — which on a phone is most sessions.
 */
export function watchForExit(): void {
  if (typeof document === 'undefined') return;
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
}
