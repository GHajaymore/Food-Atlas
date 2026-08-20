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
import { Screen } from '../src/components/Screen';
import { H5, Muted, T } from '../src/components/Text';
import { catalogueStats } from '../src/data/catalogue';
import {
  canAcceptDonations,
  CURRENCY,
  DONATION_URL,
  FUNDING_NEEDS,
  LEDGER_URL,
  NOT_FOR_SALE,
} from '../src/domain/support';
import { openAtSource } from '../src/domain/video';
import { accentText, color, font, space } from '../src/theme/tokens';

export default function Support() {
  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/atlas');
  };

  return (
    <Screen bottomPad={50}>
      <NavRow title="Keeping it free" onBack={back} />

      <Muted style={styles.lead}>
        {catalogueStats.total.toLocaleString()} traditions, built entirely from sources that are free to read and
        openly licensed. No advertising, no tracking, and nothing behind a payment. Here is what that actually
        costs, including the parts that cost nothing. Figures are in {CURRENCY}.
      </Muted>

      {FUNDING_NEEDS.map((need) => (
        <Block key={need.title} style={styles.need}>
          <View style={styles.needHead}>
            <T style={styles.needTitle}>{need.title}</T>
            <Muted style={styles.needCost}>{need.cost}</Muted>
          </View>
          <Muted style={styles.needText}>{need.what}</Muted>
          <Muted style={styles.needText}>{need.why}</Muted>
        </Block>
      ))}

      <H5 style={styles.heading}>What it does not buy</H5>
      <View style={styles.list}>
        {NOT_FOR_SALE.map((line) => (
          <Muted key={line} style={styles.notForSale}>
            {line}
          </Muted>
        ))}
      </View>

      {canAcceptDonations() ? (
        <>
          <Button label="Contribute on Open Collective" block onPress={() => openAtSource(DONATION_URL)} />
          <Muted style={styles.footnote}>
            Opens at Open Collective. Nothing is collected here — this app holds no payment details of yours and
            never will.
          </Muted>
          {/* The reason for choosing this platform, offered rather than claimed. An
              app that publishes its own coverage gaps should let anyone read the
              ledger too, and that promise is kept by the platform rather than by us
              remembering to update a paragraph. */}
          <Button
            label="Read the ledger — every contribution and expense"
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
          <CardKicker>Not open for donations yet</CardKicker>
          <CardBody>
            There is nowhere to send money to. It will be an Open Collective when there is, so that every
            contribution and every expense is public and anyone can check this page against the ledger.
          </CardBody>
        </Card>
      )}

      <Muted style={styles.footnote}>
        The most useful thing anyone can give this atlas is not money. Most of it is a name and a place because
        nobody has written down how the food is made.
      </Muted>
      <Button
        label="Add a tradition from your area"
        variant="secondary"
        block
        onPress={() => router.push('/contribute')}
        style={styles.contribute}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
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
