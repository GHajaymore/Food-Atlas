/**
 * Dishes waiting for somebody who knows them.
 *
 * This screen is what makes a proposal different from the contribution form it replaces.
 * A form sends a dish to one person's inbox; this puts it where the people who could
 * confirm it can find it. Without this screen the whole feature is a slower version of
 * the thing it was built to fix.
 *
 * ## Ordered by what a reader can act on, not by what arrived last
 *
 * Newest-first is the obvious default and it is wrong here. A proposal with two
 * confirmations needs one more person and is one person away from entering the atlas; a
 * proposal posted an hour ago with none needs three. Sorting by how close something is
 * to being decided puts the actionable thing first, which is the same reasoning
 * `nearby.ts` uses to lead with dishes from the reader's own country.
 *
 * ## It shows the score, and the score is usually low
 *
 * A proposal is scored by the same `assess()` as every record, so most will read
 * Unverified with a number well under the threshold — and that is displayed rather than
 * hidden. Showing a flattering number on a dish nobody has confirmed would be the exact
 * dishonesty the rest of this app is built to avoid, and the low score is *the argument*
 * for confirming it. A reader who sees "23" and knows the dish has been told precisely
 * what their confirmation is worth.
 */

import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Block, Card, CardBody, CardKicker } from '../src/components/Card';
import { ConfirmForm, type Said } from '../src/components/ConfirmForm';
import { NavRow } from '../src/components/NavRow';
import { Pressable } from '../src/components/Pressable';
import { Screen } from '../src/components/Screen';
import { useCopy } from '../src/i18n';
import { Testimony } from '../src/components/Testimony';
import { Tag } from '../src/components/Tag';
import { H5, Muted, T } from '../src/components/Text';
import { confirmProposal, loadProposals } from '../src/data/proposals';
import {
  PROPOSAL_CONFIRMATIONS,
  assessProposal,
  canPropose,
  whatItNeeds,
  type Proposal,
} from '../src/domain/proposals';
import { color, font, space } from '../src/theme/tokens';

export default function Proposals() {
  const copy = useCopy();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string>('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    loadProposals().then((rows) => {
      if (!live) return;
      setProposals(rows);
      setLoading(false);
    });
    return () => {
      live = false;
    };
  }, []);

  /* Closest to being decided first — see the header. Ties broken by age so the order
   * is stable between renders rather than dependent on the server's. */
  const ordered = useMemo(
    () =>
      [...proposals].sort(
        (a, b) => b.people.length - a.people.length || (a.at < b.at ? -1 : a.at > b.at ? 1 : 0),
      ),
    [proposals],
  );

  return (
    <Screen measure>
      <NavRow title={copy.openProposals} />

      <Card style={styles.intro}>
        <CardKicker>{copy.whatTheseAre}</CardKicker>
        <CardBody>
          Dishes people say exist that the atlas has no record of. Each needs{' '}
          {PROPOSAL_CONFIRMATIONS} confirmations from people who know it before it enters the atlas —
          judged on the same six dimensions as every other record here.
        </CardBody>
        <Button
          label={copy.proposeADish}
          variant="secondary"
          block
          style={styles.propose}
          onPress={() => router.push('/propose')}
        />
      </Card>

      {!canPropose() ? (
        <Block style={styles.empty}>
          <T style={styles.emptyHead}>Proposals are not open yet</T>
          <Muted style={styles.emptyNote}>
            This needs somewhere to store what people send. Until it exists the app says so, rather than
            showing an empty list as though nobody had anything to add.
          </Muted>
        </Block>
      ) : loading ? (
        <Muted style={styles.emptyNote}>Loading…</Muted>
      ) : !ordered.length ? (
        <Block style={styles.empty}>
          <T style={styles.emptyHead}>Nothing is waiting</T>
          <Muted style={styles.emptyNote}>
            Every proposal has been decided. If you know a dish the atlas does not have, it starts here.
          </Muted>
        </Block>
      ) : (
        ordered.map((p) => {
          const assessment = assessProposal(p);
          const isOpen = open === p.id;

          return (
            <Block key={p.id} style={styles.card}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
                accessibilityLabel={`${p.name}. ${whatItNeeds(p)}`}
                tint="neutral"
                onPress={() => setOpen(isOpen ? '' : p.id)}
                style={styles.head}
              >
                <View style={styles.headText}>
                  <H5>{p.name}</H5>
                  <Muted style={styles.place}>
                    {[p.region, p.country].filter(Boolean).join(', ')}
                  </Muted>
                </View>
                <Tag
                  label={`${assessment.badgeIcon} ${assessment.score ?? '—'}`}
                  fontSize={11}
                  noWrap
                />
              </Pressable>

              <T style={styles.needs}>{whatItNeeds(p)}</T>

              {isOpen ? (
                <View style={styles.detail}>
                  <Muted style={styles.by}>
                    Proposed by {p.submitter} — {p.connection}
                  </Muted>

                  {p.cooks ? <CardBody>{p.cooks}</CardBody> : null}

                  {p.ingredients.length ? (
                    <View style={styles.list}>
                      <T style={styles.listHead}>Ingredients</T>
                      {p.ingredients.map((item, i) => (
                        <Muted key={`${item}-${i}`} style={styles.item}>
                          {item}
                        </Muted>
                      ))}
                    </View>
                  ) : null}

                  {p.steps.length ? (
                    <View style={styles.list}>
                      <T style={styles.listHead}>Method</T>
                      {p.steps.map((step, i) => (
                        <Muted key={`${step}-${i}`} style={styles.item}>
                          {i + 1}. {step}
                        </Muted>
                      ))}
                    </View>
                  ) : null}

                  {p.people.length ? (
                    <View style={styles.list}>
                      <T style={styles.listHead}>Confirmed by</T>
                      {p.people.map((person, i) => (
                        <View key={`${person.name}-${i}`} style={styles.person}>
                          <T style={styles.personName}>
                            {person.name}
                            {person.local ? ' — from the town' : ''}
                          </T>
                          <Muted style={styles.item}>{person.connection}</Muted>
                          {/* The quote, with a translation available beside it rather
                              than in place of it. See `domain/testimony.ts`. */}
                          <Testimony said={person.said} />
                        </View>
                      ))}
                    </View>
                  ) : null}

                  <ConfirmForm
                    subject={p.name}
                    busy={busy}
                    onSubmit={async (said: Said) => {
                      setBusy(true);
                      const result = await confirmProposal(p.id, said);
                      setBusy(false);
                      if (result.ok) {
                        /* Reflect it immediately. The server is the truth, but a reader
                         * who confirms something and sees no change assumes it failed. */
                        setProposals((prev) =>
                          prev.map((row) =>
                            row.id === p.id
                              ? { ...row, people: [...row.people, { ...said, at: new Date().toISOString().slice(0, 10) }] }
                              : row,
                          ),
                        );
                      }
                      return result.ok ? { ok: true } : { ok: false, error: result.error };
                    }}
                  />
                </View>
              ) : null}
            </Block>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { padding: space[4], gap: space[2], marginBottom: space[3] },
  propose: { marginTop: space[2] },
  card: { padding: space[3], gap: space[1], marginBottom: space[3] },
  head: { flexDirection: 'row', alignItems: 'center', gap: space[2], minHeight: 44 },
  headText: { flex: 1 },
  place: { fontSize: 12 },
  needs: { fontSize: 12, color: color.accent, lineHeight: 17 },
  detail: { gap: space[3], marginTop: space[3] },
  by: { fontSize: 12, lineHeight: 17 },
  list: { gap: 2 },
  listHead: { fontSize: 11, color: color.accent, fontFamily: font.semibold, letterSpacing: 0.6 },
  item: { fontSize: 13, lineHeight: 19 },
  person: { marginTop: space[2] },
  personName: { fontSize: 13, color: color.text },
  said: { fontSize: 13, lineHeight: 19, fontStyle: 'italic' },
  empty: { padding: space[4], gap: space[1] },
  emptyHead: { fontSize: 14, color: color.text, fontFamily: font.semibold },
  emptyNote: { fontSize: 12, lineHeight: 17 },
});
