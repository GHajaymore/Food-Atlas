/**
 * Proposals — a dish a reader says exists, which the atlas has no record of.
 *
 * These tests are mostly about what a proposal *cannot* do. The feature's whole risk is
 * that a submitter supplies both the claim and the evidence for it, so the assertions
 * below are the fence: no self-declared heritage, no self-confirmation, no separate and
 * gentler ladder, and no admission without other people.
 */

import { EN } from '../src/i18n/copy';
import { AUTHENTIC_AT } from '../src/domain/assess';
import type { Confirmation } from '../src/domain/confirmations';
import {
  PROPOSAL_CONFIRMATIONS,
  assessProposal,
  evidenceOf,
  fold,
  isPublishable,
  missingFrom,
  possibleDuplicates,
  whatItNeeds,
  type Proposal,
} from '../src/domain/proposals';
import type { Dish } from '../src/domain/types';

const person = (name: string, local = true): Confirmation => ({
  name,
  connection: `Born and cooking in Kozhikode`,
  said: 'We use ghee, not oil.',
  local,
  at: '2026-08-23',
});

const proposal = (over: Partial<Proposal> = {}): Proposal => ({
  id: 'p1',
  name: 'Kaipola',
  country: 'India',
  region: 'Kerala',
  cooks: 'Made at home for Eid, by the grandmothers.',
  ingredients: ['ripe plantain', 'egg', 'ghee', 'cardamom'],
  steps: ['Mash the plantain.', 'Fold through beaten egg.', 'Set in ghee over low heat.'],
  submitter: 'Ajay',
  connection: 'Grew up in Malabar',
  photo: '',
  at: '2026-08-23',
  status: 'proposed',
  people: [],
  ...over,
});

describe('what a proposal may not assert about itself', () => {
  test('cannot declare heritage, which would hand it Authentic with nobody confirming', () => {
    // Heritage + ingredients classifies Authentic-Regional through a separate branch of
    // assess. 269 EU-register records reached the badge that way with no confirmations,
    // which is correct for a register and would be forgery for a submitter.
    const e = evidenceOf(proposal({ ingredients: ['plantain', 'egg', 'ghee'] }));
    expect(e.heritage).toEqual([]);
    expect(e.registerMethod).toBe(false);
  });

  test('cannot claim an article — a proposal is by definition undocumented', () => {
    expect(evidenceOf(proposal()).hasArticle).toBe(false);
  });

  test('a described method counts as a firsthand account, a bare name does not', () => {
    expect(evidenceOf(proposal()).hasAccount).toBe(true);
    expect(evidenceOf(proposal({ cooks: '', steps: [] })).hasAccount).toBe(false);
  });
});

describe('the ladder is the same one every record climbs', () => {
  test('unconfirmed, a fully described proposal is still not authentic', () => {
    const a = assessProposal(proposal());
    expect(a.level).not.toBe('local');
    expect(a.level).not.toBe('regional');
    expect(a.score ?? 0).toBeLessThan(AUTHENTIC_AT);
  });

  test('confirmations are what move it, and three are enough', () => {
    const bare = assessProposal(proposal()).score ?? 0;
    const one = assessProposal(proposal({ people: [person('Priya')] })).score ?? 0;
    const three = assessProposal(
      proposal({ people: [person('Priya'), person('Suresh'), person('Fatima')] }),
    );

    expect(one).toBeGreaterThan(bare);
    expect(three.score ?? 0).toBeGreaterThanOrEqual(AUTHENTIC_AT);
    expect(['local', 'regional']).toContain(three.level);
  });

  test('confirmations from the town make it Local rather than Regional', () => {
    const wider = [person('A', false), person('B', false), person('C', false)];
    const town = [person('A', true), person('B', false), person('C', false)];
    expect(assessProposal(proposal({ people: wider })).level).toBe('regional');
    expect(assessProposal(proposal({ people: town })).level).toBe('local');
  });
});

describe('admission', () => {
  test('needs other people, not a better description', () => {
    const rich = proposal({ steps: Array.from({ length: 20 }, (_, i) => `Step ${i}.`) });
    expect(isPublishable(rich)).toBe(false);
  });

  test('opens at exactly PROPOSAL_CONFIRMATIONS', () => {
    const people = Array.from({ length: PROPOSAL_CONFIRMATIONS }, (_, i) => person(`P${i}`));
    expect(isPublishable(proposal({ people: people.slice(0, -1) }))).toBe(false);
    expect(isPublishable(proposal({ people }))).toBe(true);
  });

  test('an already published proposal is not published twice', () => {
    const people = Array.from({ length: PROPOSAL_CONFIRMATIONS }, (_, i) => person(`P${i}`));
    expect(isPublishable(proposal({ people, status: 'published' }))).toBe(false);
  });

  test('admission does not require the Authentic score — undocumented food is the point', () => {
    // A dish with nothing but a name, a place and three people who know it.
    const sparse = proposal({
      ingredients: [],
      steps: [],
      cooks: '',
      region: '',
      people: Array.from({ length: PROPOSAL_CONFIRMATIONS }, (_, i) => person(`P${i}`)),
    });
    expect(isPublishable(sparse)).toBe(true);
    expect(assessProposal(sparse).score ?? 0).toBeLessThan(AUTHENTIC_AT);
  });
});

describe('required fields', () => {
  test('a place and a connection are required; a recipe is not', () => {
    expect(missingFrom(proposal())).toEqual([]);
    expect(missingFrom(proposal({ ingredients: [], steps: [], cooks: '', photo: '' }))).toEqual([]);
    expect(missingFrom({ name: 'X' })).toEqual(['country', 'submitter', 'connection']);
  });
});

describe('duplicate detection', () => {
  const dish = (name: string, localNames?: Record<string, string>): Dish =>
    ({ id: 1, name, localNames, loc: { country: 'India' } }) as unknown as Dish;

  test('folds accents and punctuation, which search deliberately does not', () => {
    expect(fold('Kozhikodé Halwa!')).toBe('kozhikode halwa');
    expect(fold('  BÁNH   mì  ')).toBe('banh mi');
  });

  test('catches a record filed under a different spelling', () => {
    const found = possibleDuplicates([dish('Kozhikode Halwa')], 'kozhikodé halwa');
    expect(found).toHaveLength(1);
  });

  test('catches a record whose local name matches — the gap that broke search', () => {
    const found = possibleDuplicates([dish('Rice cake', { ml: 'കൊഴുക്കട്ട', ta: 'Kozhukattai' })], 'kozhukattai');
    expect(found).toHaveLength(1);
  });

  test('does not match a genuinely different dish', () => {
    expect(possibleDuplicates([dish('Kaipola')], 'Kozhikode Halwa')).toEqual([]);
  });

  test('an empty name matches nothing rather than everything', () => {
    expect(possibleDuplicates([dish('Kaipola')], '   ')).toEqual([]);
  });
});

describe('what it tells the reader', () => {
  test('asks for what is missing rather than reporting a verdict', () => {
    expect(whatItNeeds(EN, proposal())).toMatch(/Nobody has confirmed/);
    expect(whatItNeeds(EN, proposal({ people: [person('A')] }))).toMatch(/1 of 3/);
    const full = Array.from({ length: PROPOSAL_CONFIRMATIONS }, (_, i) => person(`P${i}`));
    expect(whatItNeeds(EN, proposal({ people: full }))).toMatch(/enters the atlas/);
    expect(whatItNeeds(EN, proposal({ status: 'published' }))).toBe('');
  });
});
