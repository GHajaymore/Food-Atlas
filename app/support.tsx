/**
 * What the project runs on, and what money would and would not change.
 *
 * The page a free project usually gets wrong. "Support our servers" is the standard line
 * and it is false for most small projects, and an app that deletes fabricated view counts
 * cannot then invent a budget to ask against. So this page says what the atlas is built
 * on — sources that are free to read and openly licensed — rather than what it spends.
 *
 * It used to itemise three line items with their prices. That reads as a household budget
 * pinned to a wall and invites a reader to audit a project rather than trust one; Ajay
 * asked for it at a higher level. Nothing load-bearing went with it: the basis is still
 * stated, and so is what a donation does not buy.
 *
 * That last part is not modesty. The product's whole claim is that classification comes
 * from evidence and from people who cook the food, and a reader who has just been asked
 * for money is entitled to be told the money does not move a badge.
 *
 * No payment is taken here. The button opens a donation page at its source, the same way
 * a video opens at the platform that hosts it — this app has no business holding
 * anybody's card details, and the destination is whatever `EXPO_PUBLIC_DONATE_URL` or an
 * Open Collective slug points at.
 */

import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Block } from '../src/components/Card';
import { NavRow } from '../src/components/NavRow';
import { useCopy, useNumber } from '../src/i18n';
import { Pressable } from '../src/components/Pressable';
import { Screen } from '../src/components/Screen';
import { H5, Muted, T } from '../src/components/Text';
import { catalogueStats } from '../src/data/catalogue';
import {
  canAcceptDonations,
  DONATION_URL,
  hasPublicLedger,
  LEDGER_URL,
} from '../src/domain/support';
import { openAtSource } from '../src/domain/video';
import { accentText, color, space } from '../src/theme/tokens';

export default function Support() {
  const copy = useCopy();
  const n = useNumber();
  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/atlas');
  };

  return (
    <Screen measure bottomPad={50}>
      <NavRow title={copy.keepingItFree} onBack={back} />

      <Muted style={styles.lead}>
        {copy.supportLead.replace('{n}', n(catalogueStats.total))}
      </Muted>

      {/*
       * What the project runs on, rather than what it spends.
       *
       * This page used to itemise three line items with their prices — a household
       * budget pinned to a wall, which invites a reader to audit a project rather than
       * trust one. Ajay asked for it at a higher level, and the two things a reader
       * actually needs from this page are untouched by that: what it is built on, and
       * what money cannot buy here.
       */}
      <Block style={styles.need}>
        <Muted style={styles.needText}>{copy.supportRunsOn}</Muted>
      </Block>

      <H5 style={styles.heading}>{copy.whatItDoesNotBuy}</H5>
      <View style={styles.list}>
        {/* Read from the copy rather than from `NOT_FOR_SALE`, because these three are
            promises to a reader and a promise has to be in their language. The domain
            list stays as the record of what was promised. */}
        {[copy.notForSaleAuthentic, copy.notForSalePromotion, copy.notForSaleAdvertising].map((line) => (
          <Muted key={line} style={styles.notForSale}>
            {line}
          </Muted>
        ))}
      </View>

      {canAcceptDonations() ? (
        <>
          {/* Name the platform only where naming it is true. Somebody deciding whether to
              click is helped by knowing where they will land, and misled by being told
              the wrong one. */}
          <Button
            label={hasPublicLedger() ? copy.contributeOnOpenCollective : copy.contributeToTheAtlas}
            block
            onPress={() => openAtSource(DONATION_URL)}
          />
          {/*
            * Only where it is true. The sentence names Open Collective, and the button
            * above it goes to whatever `EXPO_PUBLIC_DONATE_URL` points at — Ko-fi, GitHub
            * Sponsors, anything. Shown unconditionally it told a reader the wrong
            * destination, which is the one thing a donation page cannot afford to do.
            *
            * The reassurance it also carries — that this app holds no payment details —
            * is worth having on every platform, and gets its own sentence when a
            * non-Open-Collective destination is actually configured. Nothing is
            * configured today, so writing that string now would be writing it blind.
            */}
          {hasPublicLedger() ? <Muted style={styles.footnote}>{copy.donationFootnote}</Muted> : null}
          {/* The reason for choosing this platform, offered rather than claimed. An
              app that publishes its own coverage gaps should let anyone read the
              ledger too, and that promise is kept by the platform rather than by us
              remembering to update a paragraph. */}
          {hasPublicLedger() ? (
            <Button
              label={copy.readTheLedger}
              variant="secondary"
              block
              onPress={() => openAtSource(LEDGER_URL)}
              style={styles.ledger}
            />
          ) : null}
        </>
      ) : (
        /*
         * Nothing at all, rather than a card saying "not open for donations yet".
         *
         * That placeholder was the worst of both readings: it asked for nothing while
         * promising a future ask, on a project that does not collect money and is not
         * waiting to. Ajay called it out directly. With no destination configured the
         * page now goes straight from what money cannot buy here to the thing that is
         * actually wanted, which is a tradition.
         *
         * The wiring above is untouched, so setting EXPO_PUBLIC_DONATE_URL or an Open
         * Collective slug brings the button back with no code change.
         */
        null
      )}

      <Muted style={styles.footnote}>{copy.mostUsefulThing}</Muted>
      <Button
        label={copy.addATradition}
        variant="secondary"
        block
        onPress={() => router.push('/contribute')}
        style={styles.contribute}
      />

      {/*
       * The way into the console, and deliberately quiet.
       *
       * It had no link at all — settings, moderation, the refresh queue and analytics
       * were reachable only by typing the URL, which is how a feature comes to be built
       * and then not exist.
       *
       * Not in the main navigation, because it is one person's console and a prominent
       * link invites everybody to find a screen whose writes they cannot perform. This
       * page is already the one about how the project is run, which makes it the honest
       * place for it.
       *
       * No route guard: every value on that screen is already public at GET /api/settings,
       * and the authority is the bearer token checked at the server on writes. A lock on
       * the screen would be a lock on a door with no wall.
       */}
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`${copy.administration}. ${copy.administrationNote}`}
        tint="neutral"
        onPress={() => router.push('/admin')}
        style={styles.adminRow}
      >
        <T style={styles.adminLabel}>{copy.administration}</T>
        <Muted style={styles.adminNote}>{copy.administrationNote}</Muted>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  adminRow: { marginTop: space[8], paddingTop: space[6], borderTopWidth: 1, borderTopColor: color.divider, minHeight: 44, justifyContent: 'center' },
  adminLabel: { fontSize: 13, color: accentText },
  adminNote: { fontSize: 11, lineHeight: 16, marginTop: 2 },
  lead: { fontSize: 12, lineHeight: 12 * 1.55, marginTop: 4, marginBottom: 18 },

  /* `needHead`, `needTitle` and `needCost` went with the cost table. A style nothing
     renders is a style nobody reviews. */
  need: { padding: 12, marginBottom: 10 },
  needText: { fontSize: 11, lineHeight: 11 * 1.55, marginTop: 6 },

  heading: { marginTop: 22, marginBottom: 8 },
  list: { gap: 8, marginBottom: 20 },
  notForSale: { fontSize: 11, lineHeight: 11 * 1.55, borderLeftWidth: 1, borderLeftColor: color.divider, paddingLeft: 10 },

  ledger: { marginTop: 10 },
  footnote: { fontSize: 11, lineHeight: 11 * 1.55, marginTop: 12 },
  contribute: { marginTop: 12 },
});
