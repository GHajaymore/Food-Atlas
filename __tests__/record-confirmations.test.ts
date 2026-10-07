/**
 * Confirming a record that is already in the atlas.
 *
 * The door the authenticity model was missing: three of the six dimensions a record is
 * scored on cannot be answered by any document, and until `/api/confirmations` existed
 * the only way anybody could answer them was to confirm a *proposal*. These tests are
 * about what the client must refuse to send and what it must tell a reader when the
 * server refuses — the write path, where a silent failure costs somebody the sentence
 * they just wrote about their grandmother's cooking.
 */

import { EN } from '../src/i18n/copy';
import {
  confirmationsFor,
  confirmationsOpen,
  setConfirmationsOpen,
  unverifiedOf,
  validationsOf,
  type ConfirmationIndex,
} from '../src/domain/confirmations';
import { submitConfirmation } from '../src/data/confirmations';

const said = {
  name: 'Priya',
  connection: 'Born and cooking in Kozhikode',
  said: 'We use ghee, not oil.',
  local: true,
};

const answered = (status: number, body: unknown = {}) =>
  jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    headers: { get: () => null },
  } as unknown as Response);

afterEach(() => {
  jest.restoreAllMocks();
  setConfirmationsOpen(false);
});

describe('what the client refuses to send', () => {
  test('a confirmation with nothing said is not a confirmation', async () => {
    const fetched = answered(201);
    global.fetch = fetched as unknown as typeof fetch;

    const result = await submitConfirmation(EN, 1, { ...said, said: '   ' });

    expect(result.ok).toBe(false);
    /* Never reached the network: a vote is exactly what this design exists to avoid, and
       the server would refuse it too — this is the message, not the guarantee. */
    expect(fetched).not.toHaveBeenCalled();
  });

  test('and neither is one with no stated connection', async () => {
    const fetched = answered(201);
    global.fetch = fetched as unknown as typeof fetch;

    const result = await submitConfirmation(EN, 1, { ...said, connection: '' });

    expect(result.ok).toBe(false);
    expect(fetched).not.toHaveBeenCalled();
  });

  test('sends the record id with what was said', async () => {
    const fetched = answered(201);
    global.fetch = fetched as unknown as typeof fetch;

    const result = await submitConfirmation(EN, 1042, said);

    expect(result.ok).toBe(true);
    const [, init] = fetched.mock.calls[0];
    expect(JSON.parse(String(init.body))).toEqual({ dishId: 1042, ...said });
    /* The identity cookie is the whole point of the endpoint — one person, one
       confirmation — and it is HttpOnly, so the request has to be told to carry it. */
    expect(init.credentials).toBe('include');
  });
});

describe('what a reader is told when the server refuses', () => {
  test('a second confirmation of the same record is a fact, not an error', async () => {
    global.fetch = answered(409) as unknown as typeof fetch;

    const result = await submitConfirmation(EN, 1, said);

    expect(result).toEqual({ ok: false, error: EN.alreadyConfirmed });
  });

  test('a table that does not exist yet says confirmation is not open', async () => {
    global.fetch = answered(503) as unknown as typeof fetch;

    const result = await submitConfirmation(EN, 1, said);

    expect(result).toEqual({ ok: false, error: EN.confirmationsNotOpen });
  });

  test('nothing a reader typed is lost when the network fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch')) as unknown as typeof fetch;

    const result = await submitConfirmation(EN, 1, said);

    expect(result.ok).toBe(false);
    expect('error' in result && result.error).toContain('lost');
  });
});

describe('the form is not offered before the table exists', () => {
  /*
   * An empty index and a missing table look identical to the client, and the difference
   * decides whether a form can accept what somebody writes. The read reports it in a
   * header; this is the flag it sets, and it starts closed because that is the direction
   * that never wastes the person who knows the dish.
   */
  test('starts closed', () => {
    expect(confirmationsOpen()).toBe(false);
  });

  test('opens only when the server says so', () => {
    setConfirmationsOpen(true);
    expect(confirmationsOpen()).toBe(true);
    setConfirmationsOpen(false);
    expect(confirmationsOpen()).toBe(false);
  });
});

describe('what the index means once it arrives', () => {
  const index: ConfirmationIndex = {
    '1042': {
      people: [
        { ...said, at: '2026-10-07', verified: true },
        { name: 'Anon', connection: 'Lived there', said: 'Same at home.', local: false, at: '2026-10-07' },
      ],
    },
  };

  test('only a signed-in confirmation moves the number', () => {
    expect(confirmationsFor(index, 1042).people).toHaveLength(2);
    expect(validationsOf(confirmationsFor(index, 1042))).toBe(1);
    expect(unverifiedOf(confirmationsFor(index, 1042))).toHaveLength(1);
  });

  test('a record nobody has confirmed is scored as one nobody has confirmed', () => {
    expect(validationsOf(confirmationsFor(index, 9999))).toBe(0);
  });
});
