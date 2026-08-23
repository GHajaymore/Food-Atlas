/**
 * The numbers an administrator can move, and the ones they should think hard about.
 *
 * Until now every threshold in this app was a constant compiled into the bundle, which
 * made them honest and unchangeable in equal measure. `PROPOSAL_CONFIRMATIONS` is 3
 * because three seemed right, not because anybody watched three work — and there was no
 * way to find out short of a release.
 *
 * ## Two kinds of setting, and the difference is the whole design
 *
 * **Operational.** `proposalConfirmations` decides how many people must recognise a
 * proposed dish before it enters the atlas. Moving it changes what happens *next*: some
 * proposals become eligible sooner, some later. Nothing already published changes, and
 * nothing is re-judged. This is a dial, and it is meant to be turned.
 *
 * **Structural.** `authenticAt` and `validationsRequired` are read by `assess()` on
 * every record in the catalogue. Moving either re-badges all 18,008 *retroactively* —
 * a record that was Unverified yesterday is Authentic today, having gained no evidence
 * whatsoever. That is not a dial; it is a redefinition of the word the whole atlas is
 * built to mean.
 *
 * They are still exposed, because they are the right thing to tune if the model is
 * wrong and hiding them would mean pretending the model is finished. But `blastRadius()`
 * exists so the change is never made blind: the admin screen counts how many records
 * would change badge *before* anything is saved, and shows the number.
 *
 * ## Why clamping is not defensive programming
 *
 * `authenticAt: 0` would classify every record in the atlas as Authentic, including the
 * 9,680 that carry nothing but a name and a country. It would take one typo, it would
 * be invisible — the app would render perfectly, every badge green — and it would
 * destroy the only claim this project makes that nobody else makes.
 *
 * So the bounds below are not input validation. They are the range within which the
 * scoring model still means something, and a value outside them is not a preference,
 * it is a mistake. `LIMITS` is enforced in the client, in the endpoint, and again when
 * the settings are read back, because a setting that is only checked where it is
 * written is only checked once.
 */

/** Every setting an administrator can change. */
export interface Settings {
  /**
   * Confirmations before a proposed dish enters the atlas. Operational.
   *
   * Low enough and invention gets in; high enough and a dish known to four people in
   * one village never does. There is no correct answer available from first principles,
   * which is precisely why it is here rather than compiled in.
   */
  proposalConfirmations: number;
  /**
   * Score at which a record is called Authentic. **Structural — re-badges everything.**
   */
  authenticAt: number;
  /**
   * Confirmations required for the Authentic badge itself. **Structural.**
   */
  validationsRequired: number;
  /**
   * Whether proposals are open at all.
   *
   * A switch rather than a number, and the one setting that is genuinely reversible with
   * no consequences — it exists so a flood can be stopped in seconds without a deploy.
   */
  proposalsOpen: boolean;
}

/**
 * What the app runs on when nothing has been configured, or when the endpoint is down.
 *
 * These are the values that were compiled in before settings existed, so an atlas that
 * cannot reach its settings behaves exactly as it did — rather than as something new
 * and unpredictable at the moment it is least able to explain itself.
 */
export const DEFAULTS: Settings = {
  proposalConfirmations: 3,
  authenticAt: 55,
  validationsRequired: 3,
  proposalsOpen: true,
};

/** The range within which each number still means something. See the header. */
export const LIMITS: Record<'proposalConfirmations' | 'authenticAt' | 'validationsRequired', [number, number]> = {
  proposalConfirmations: [1, 20],
  /*
   * Never below 40. With no confirmations at all, published data alone tops out at 43 —
   * so a threshold under that would hand the badge to every well-documented record in
   * the catalogue without a single person having confirmed anything, which is the exact
   * arithmetic `confirmations.ts` was written to prevent.
   */
  authenticAt: [40, 95],
  validationsRequired: [1, 20],
};

/** Whether a setting re-judges records that already exist. */
export const isStructural = (key: keyof Settings): boolean =>
  key === 'authenticAt' || key === 'validationsRequired';

const clamp = (value: unknown, [min, max]: [number, number], fallback: number): number => {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
};

/**
 * Read whatever arrived and return something the app can safely run on.
 *
 * Every field is taken independently, so one bad value never discards the others — an
 * administrator who mistypes `authenticAt` should not silently lose the proposal
 * setting they changed correctly in the same save.
 */
export function readSettings(raw: unknown): Settings {
  const input = (raw ?? {}) as Partial<Record<keyof Settings, unknown>>;
  return {
    proposalConfirmations: clamp(
      input.proposalConfirmations,
      LIMITS.proposalConfirmations,
      DEFAULTS.proposalConfirmations,
    ),
    authenticAt: clamp(input.authenticAt, LIMITS.authenticAt, DEFAULTS.authenticAt),
    validationsRequired: clamp(input.validationsRequired, LIMITS.validationsRequired, DEFAULTS.validationsRequired),
    proposalsOpen: input.proposalsOpen === undefined ? DEFAULTS.proposalsOpen : input.proposalsOpen !== false,
  };
}

/** A setting that was refused, and why — shown rather than silently corrected. */
export interface Refusal {
  key: keyof Settings;
  said: number;
  used: number;
  why: string;
}

/**
 * What was changed on the way in, so the admin screen can say so.
 *
 * Clamping silently is how somebody comes to believe they set the threshold to 10 and
 * spends a week wondering why nothing changed. If a value could not be used, the person
 * who typed it is the one person who needs to know.
 */
export function refusals(raw: unknown): Refusal[] {
  const input = (raw ?? {}) as Partial<Record<keyof Settings, unknown>>;
  const used = readSettings(raw);
  const out: Refusal[] = [];

  for (const key of ['proposalConfirmations', 'authenticAt', 'validationsRequired'] as const) {
    if (input[key] === undefined) continue;
    const said = Math.round(Number(input[key]));
    if (!Number.isFinite(said)) {
      out.push({ key, said: NaN, used: used[key], why: 'That is not a number.' });
      continue;
    }
    const [min, max] = LIMITS[key];
    if (said < min || said > max) {
      out.push({
        key,
        said,
        used: used[key],
        why:
          key === 'authenticAt' && said < min
            ? `Below ${min} the badge would be given to records nobody has confirmed — published data alone reaches 43.`
            : `Outside the usable range of ${min}–${max}.`,
      });
    }
  }
  return out;
}
