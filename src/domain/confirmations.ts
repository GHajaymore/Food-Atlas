/**
 * Confirmations — the only thing that can *promote* a record.
 *
 * `assess.ts` scores six dimensions and three of them are unanswerable from any
 * document: traditional technique, a local source, and community validation. The
 * arithmetic is deliberate — with those three empty the best a record can reach on
 * published data alone is 43, and promotion starts at 55. No register, no
 * encyclopaedia and no amount of scraping closes that gap. Only people can, and this
 * is how they do it.
 *
 * ## Not the only route to the Authentic badge, and the difference matters
 *
 * An earlier draft of this note said confirmations were the only thing that could
 * authenticate a record, and that was wrong. A heritage designation plus recorded
 * ingredients classifies as **Authentic — Regional** by a separate and older branch
 * in `assess`, because a register tying a product to its place is what the brief
 * calls a recognised traditional preparation. 269 records reached that badge from the
 * EU register alone, with nobody having confirmed anything.
 *
 * The two routes answer different questions. The heritage branch is about the *kind*
 * of evidence — an institution has tied this name to this place. The score threshold
 * is about the *weight* of it, and only people supply that. Saying confirmations were
 * the only way overstated this file's importance and understated what the registers
 * had already done.
 *
 * ## Why this one needs a server when nothing else in the app does
 *
 * `contribution.ts` and `requests.ts` both refuse a backend on purpose: a form opened
 * at its source costs nothing and needs no account, and for *submitting* a tradition
 * that trade is right. Nobody gains anything by faking a submission — it is work
 * offered, and it is read by a person before it becomes a record.
 *
 * A confirmation is different, because a confirmation **moves the badge**. Three of
 * them promote a record to Authentic. A form cannot tell three people from one person
 * submitting three times, and a badge that can be faked is worse than no badge at
 * all — it is the one claim this atlas makes that nobody else makes.
 *
 * So identity is not a feature of this; it is the reason it exists. The unique index
 * in `docs/confirmations-api.md` — one published confirmation per person per dish —
 * is what the three-confirmation rule actually rests on. Everything else here is
 * plumbing.
 *
 * ## Shown, not counted
 *
 * `people` carries what each person said and their stated connection to the place,
 * and the record displays them. "3 confirmations" is a number a reader has to trust;
 * *"Priya, born in Kozhikode — we use ghee, not oil"* is evidence they can weigh. It
 * is also far harder to fake convincingly, which makes a fraud visible to readers
 * rather than invisible to everyone.
 *
 * ## Until it is switched on
 *
 * `EXPO_PUBLIC_CONFIRMATIONS_URL` is unset, so `canConfirm()` is false, no
 * confirmation is fetched, every record carries zero, and the app says confirmation
 * is not open yet. Same rule as the donate button and the contribution form: a
 * control that goes nowhere spends a reader's goodwill on a dead link.
 */

/** What one person confirmed, and what entitles them to. */
export interface Confirmation {
  /** How they are shown on the record. Their name, as they gave it. */
  name: string;
  /**
   * Their relationship to the place, in their words — "Born and cooking in
   * Kozhikode". This is the whole of what makes a confirmation evidence rather than
   * a vote, so it is required and it is displayed.
   */
  connection: string;
  /**
   * What they actually confirmed.
   *
   * A claim rather than the whole record, because someone from Kozhikode can tell you
   * "we use ghee, not oil" with complete authority and know nothing about where the
   * dish originated. Asking them to approve everything forces them to overclaim or to
   * say nothing.
   */
  said: string;
  /**
   * Whether they speak for the locality itself rather than the wider region.
   *
   * Decides Authentic — Local against Authentic — Regional. Not a measure of how
   * strong the confirmation is: a higher score does not make a dish more local, being
   * confirmed by the town rather than the state does.
   *
   * ## Nothing verifies this, and nothing can
   *
   * It is a claim the person makes about themselves, and so is `connection`. Somebody
   * in Toronto can tick this box and write "born and cooking in Kozhikode", and the
   * app will believe them.
   *
   * That is not an oversight waiting for a fix. Verifying residence needs identity
   * documents or geolocation, and both are hostile to exactly the people this depends
   * on — a grandmother in Kozhikode is not uploading a passport to confirm a halwa.
   * The cure would cost more than the disease.
   *
   * **The defence is exposure, not verification.** `connection` is required and
   * displayed beside the confirmation, so a reader meets "Priya — born and cooking in
   * Kozhikode" and weighs it themselves. Three vague connections look different from
   * three specific ones, and a reader can tell. That is the same stance the rest of
   * the app takes with a photograph's provenance or a contested origin: show what is
   * known and who said it, and decline to adjudicate.
   *
   * The consequence is worth stating plainly rather than discovering later: the badge
   * this dimension unlocks rests on people being honest about where they are from.
   * The unique index stops one person voting three times. Nothing stops three
   * dishonest people, and the app should never claim otherwise.
   */
  local: boolean;
  /** ISO date. Shown, because when someone said it is part of what they said. */
  at: string;
  /**
   * Whether the person was signed in when they said it.
   *
   * ## What this is actually worth, and why it changes the badge
   *
   * Without it, identity is a signed cookie. That stops a double-tap, a refresh and a
   * hand-edited cookie, and it does not stop one person opening three private windows —
   * so "3 confirmations" could mean three people or one person three times, and the app
   * had no way to tell which. That is the weakest point in the whole authenticity model
   * and it sits underneath the one claim this project makes that nobody else does.
   *
   * A signed-in confirmation is tied to an account somebody else issued. It is still not
   * proof — a determined person can make three Google accounts — but it raises the cost
   * of faking a badge from "open a private window" to "create and verify three accounts",
   * which is the difference between casual and deliberate.
   *
   * ## Why unverified confirmations are still kept and still shown
   *
   * Because requiring an account to speak would exclude precisely the people this
   * depends on. A grandmother in Kozhikode who has cooked a dish for fifty years is not
   * creating a login to say so, and an atlas that only hears from people with Google
   * accounts is a worse atlas — quieter, younger, and wrong about whose food this is.
   *
   * So both are recorded, both are displayed with what the person said and their stated
   * connection, and a reader weighs them. Only the verified ones are *counted* toward
   * the badge. The claim the number makes is narrow enough to be true.
   */
  verified?: boolean;
}

/** Everything confirmed about one dish. */
export interface DishConfirmations {
  people: Confirmation[];
}

/** Confirmations by dish id, as the endpoint returns them. */
export type ConfirmationIndex = Readonly<Record<string, DishConfirmations>>;

export const CONFIRMATIONS_URL = process.env.EXPO_PUBLIC_CONFIRMATIONS_URL ?? '';

export const canConfirm = (): boolean => CONFIRMATIONS_URL.trim().length > 0;

/** Nothing confirmed, which is the state of every record until the endpoint exists. */
export const NONE: DishConfirmations = { people: [] };

export const confirmationsFor = (index: ConfirmationIndex, id: number): DishConfirmations =>
  index[String(id)] ?? NONE;

/**
 * How many confirmations a record carries, for `assess`.
 *
 * **Signed-in confirmations only.** Everything else about a confirmation is displayed;
 * this is the one number that moves a badge, so it is the one that has to be defensible.
 * An anonymous confirmation is a signed cookie away from being three of them, and a
 * badge that can be earned by opening three private windows is worse than no badge —
 * it is the single claim this atlas makes that nobody else does.
 *
 * Still a plain count, not a weighting. Deliberately not scaled by what somebody
 * confirmed or how long ago, because weighting would make the number something only
 * this code can reproduce, and the point of the six figures on a card is that a reader
 * can add them up.
 *
 * Where nothing is signed in this returns 0 and the app says a record is unconfirmed,
 * which is true. It is the same trade `assess` makes everywhere else: silence rather
 * than a number that cannot be justified.
 */
export const validationsOf = (c: DishConfirmations): number =>
  c.people.filter((person) => person.verified).length;

/**
 * Confirmations that were made without signing in.
 *
 * Shown on the record, never counted. They are evidence a reader can weigh — a stated
 * connection and a specific claim — and the app is explicit that they did not move the
 * badge. Hiding them would lose real knowledge from exactly the people least likely to
 * hold an account, which is the opposite of what this project is for.
 */
export const unverifiedOf = (c: DishConfirmations): Confirmation[] =>
  c.people.filter((person) => !person.verified);

/**
 * Whether the confirmations speak for the locality.
 *
 * True when *any* of them does. One person who is actually from the town knows the
 * town, and requiring all of them to be local would mean a record got less specific
 * every time somebody from the wider region agreed with it.
 */
export const confirmedLocally = (c: DishConfirmations): boolean =>
  c.people.some((p) => p.local && p.verified);

/**
 * What a record still needs, said plainly.
 *
 * The sentence a reader sees on a record that has not been authenticated yet. It
 * exists because "Unverified" on its own reads as a verdict on the food, when what it
 * describes is the state of our evidence — and because a reader who knows the dish is
 * exactly the person who can fix it, if anybody tells them how.
 */
export function whatItNeeds(c: DishConfirmations, required: number): string {
  const have = validationsOf(c);
  if (have >= required) return '';

  const short = required - have;
  if (have === 0) {
    return `Nobody from the place has confirmed this yet. ${required} confirmations would authenticate it.`;
  }
  return `${have} of ${required} confirmations. ${short} more from people who know the dish would authenticate it.`;
}

/**
 * What a confirmation form calls each of its boxes.
 *
 * Here rather than in `ConfirmForm` because the component is not the only thing that
 * validates a confirmation: `src/data/proposals.ts` checks the same three fields before
 * sending, and it was reporting them as `name`, `connection`, `said` — the last of which
 * is a column nobody has seen. Same fault as `REQUIRED_LABELS` in `proposals.ts`, in a
 * layer further down, and the reason to keep the words next to the requirement is that
 * two places checking the same thing should not describe it two ways.
 */
export const SAID_LABELS = {
  name: 'your name',
  connection: 'your connection to the place',
  said: 'what you can confirm',
} as const;

export const SAID_REQUIRED = Object.keys(SAID_LABELS) as (keyof typeof SAID_LABELS)[];
