/**
 * What it costs to run, and what money would and would not change.
 *
 * The page a free project usually gets wrong. "Support our servers" is the standard
 * line and it is false for most small projects — this one runs inside a free tier
 * and spends nothing today. An app that deletes fabricated view counts cannot then
 * invent a budget to ask against.
 *
 * So the page leads with the fact that almost everything is free, names the single
 * thing that is not, and says plainly what a donation does not buy. That last part
 * is not modesty: the product's whole claim is that its classifications come from
 * evidence and from people who cook the food, and a reader who has just been asked
 * for money is entitled to be told the money does not move a badge.
 *
 * No payment is taken here. The button opens a donation page at its source, the same
 * way a video opens at the platform that hosts it — this app has no business holding
 * anybody's card details.
 */

import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Block, Card, CardBody, CardKicker } from '../src/components/Card';
import { NavRow } from '../src/components/NavRow';
import { useCopy } from '../src/i18n';
import { Pressable } from '../src/components/Pressable';
import { Screen } from '../src/components/Screen';
import { H5, Muted, T } from '../src/components/Text';
import { catalogueStats } from '../src/data/catalogue';
import {
  canAcceptDonations,
  CURRENCY,
  DONATION_URL,
  LEDGER_URL,
  NOT_FOR_SALE,
} from '../src/domain/support';
import { openAtSource } from '../src/domain/video';
import { accentText, color, font, space } from '../src/theme/tokens';

export default function Support() {
  const copy = useCopy();
  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/atlas');
  };

  return (
    <Screen measure bottomPad={50}>
      <NavRow title={copy.keepingItFree} onBack={back} />

      <Muted style={styles.lead}>
        {copy.supportLead
          .replace('{n}', catalogueStats.total.toLocaleString())
          .replace('{currency}', CURRENCY)}
      </Muted>

      {/* Built from the copy rather than mapped over `FUNDING_NEEDS`, so the table a
          reader sees is in their language. The domain list stays as the record of what
          the project actually spends; this is the same list, said. */}
      {[
        { title: copy.needTranslationTitle, what: copy.needTranslationWhat, why: copy.needTranslationWhy, cost: copy.needTranslationCost },
        { title: copy.needHostingTitle, what: copy.needHostingWhat, why: copy.needHostingWhy, cost: copy.needHostingCost },
        { title: copy.needSourcesTitle, what: copy.needSourcesWhat, why: copy.needSourcesWhy, cost: copy.needSourcesCost },
      ].map((need) => (
        <Block key={need.title} style={styles.need}>
          <View style={styles.needHead}>
            <T style={styles.needTitle}>{need.title}</T>
            <Muted style={styles.needCost}>{need.cost}</Muted>
          </View>
          <Muted style={styles.needText}>{need.what}</Muted>
          <Muted style={styles.needText}>{need.why}</Muted>
        </Block>
      ))}

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
          <Button label={copy.contributeOnOpenCollective} block onPress={() => openAtSource(DONATION_URL)} />
          <Muted style={styles.footnote}>{copy.donationFootnote}</Muted>
          {/* The reason for choosing this platform, offered rather than claimed. An
              app that publishes its own coverage gaps should let anyone read the
              ledger too, and that promise is kept by the platform rather than by us
              remembering to update a paragraph. */}
          <Button
            label={copy.readTheLedger}
            variant="secondary"
            block
            onPress={() => openAtSource(LEDGER_URL)}
            style={styles.ledger}
          />
        </>
      ) : (
        /* No destination, no button. A donate control pointing nowhere spends a
           reader's goodwill on a dead link, which is worse than not asking. */
        <Card style={styles.pending}>
          <CardKicker>{copy.notOpenForDonationsYet}</CardKicker>
          <CardBody>{copy.donationsPendingBody}</CardBody>
        </Card>
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

  need: { padding: 12, marginBottom: 10 },
  needHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: space[2] },
  needTitle: { fontSize: 13, fontFamily: font.medium },
  needCost: { fontSize: 11, color: accentText, flexShrink: 0, maxWidth: '58%', textAlign: 'right' },
  needText: { fontSize: 11, lineHeight: 11 * 1.55, marginTop: 6 },

  heading: { marginTop: 22, marginBottom: 8 },
  list: { gap: 8, marginBottom: 20 },
  notForSale: { fontSize: 11, lineHeight: 11 * 1.55, borderLeftWidth: 1, borderLeftColor: color.divider, paddingLeft: 10 },

  ledger: { marginTop: 10 },
  pending: { marginBottom: 16 },
  footnote: { fontSize: 11, lineHeight: 11 * 1.55, marginTop: 12 },
  contribute: { marginTop: 12 },
});
