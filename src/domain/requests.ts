/**
 * Asking for a dish that is not in the atlas.
 *
 * The design principle here is that a request queue nobody fulfils is worse than no
 * queue — it becomes a list of unanswered asks that makes the atlas look abandoned.
 * So the flow is built around one observation: **most people asking for a missing
 * dish already know how it is made.** "Where is kaipola?" usually means "kaipola is
 * my food and you are missing it."
 *
 * That makes the moment of absence the moment of maximum motivation, and the search
 * box has already collected the dish name. So the empty state asks one question —
 * do you know how it's made? — and routes accordingly:
 *
 *   yes → the contribution flow, name already filled. That is a record, not a request.
 *   no  → a request: the name, and where they think it is from.
 *
 * **Cost.** Storing requests needs somewhere to put them, and a backend is the
 * version that costs money every month. This uses a pre-filled form opened at
 * source: no server, no API key, no account for the person submitting, and no
 * running cost. It is a worse experience than capturing in-app, and that is the
 * deliberate trade for keeping the app free to operate.
 *
 * Point REQUEST_FORM at your own form and the field ids below at its fields.
 */

/**
 * A form that accepts pre-filled answers through the query string — a Google Form's
 * "Get pre-filled link" gives exactly this shape. Left blank until one exists, and
 * the UI degrades to explaining that requests are not open rather than to a dead
 * button.
 */
export const REQUEST_FORM = process.env.EXPO_PUBLIC_REQUEST_FORM_URL ?? '';

/** The pre-filled entry ids, from the form's own pre-filled link. */
const FIELD = {
  dish: process.env.EXPO_PUBLIC_REQUEST_FIELD_DISH ?? 'entry.1000001',
  place: process.env.EXPO_PUBLIC_REQUEST_FIELD_PLACE ?? 'entry.1000002',
} as const;

export const canRequest = (): boolean => REQUEST_FORM.length > 0;

/**
 * The pre-filled request link.
 *
 * The dish name comes from what they already typed, so nobody is asked to type it
 * twice — the friction that kills this kind of capture.
 */
export function requestUrl(dish: string, place = ''): string {
  if (!canRequest()) return '';
  const params = new URLSearchParams({ usp: 'pp_url', [FIELD.dish]: dish.trim() });
  if (place.trim()) params.set(FIELD.place, place.trim());
  return `${REQUEST_FORM}?${params.toString()}`;
}
