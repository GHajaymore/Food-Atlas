/**
 * How a dish becomes authentic.
 *
 * The front page has had a button labelled "How it gets authenticated" pointing at
 * `/atlas` — a page about *coverage*: how many records, from where, how complete. Real,
 * useful, and not the question the button asks. A link whose label promises one thing
 * and delivers another is broken in the way that matters, and Ajay reported it as such.
 *
 * ## Why this page is the product
 *
 * Every food site on the internet has photographs and recipes. The thing no other one
 * has is a scale that a reader can check, and a rule that stops a document proving a
 * tradition. That is the whole differentiation, and until now it was explained nowhere —
 * it lived in `assess.ts` as arithmetic and on a record as a number in the corner.
 *
 * ## Every figure here is imported, not typed
 *
 * `AUTHENTIC_AT`, `VALIDATIONS_REQUIRED`, `SCORE_DIMENSIONS` and the ceiling are read
 * from the domain, so the page cannot drift from the code the way a hand-written
 * explanation would. If somebody moves the threshold in the admin screen, this page
 * says the new number. A page describing rules the app no longer follows would be the
 * same failure as a confidence score that does not match its own breakdown — and this
 * project has already fixed one of those.
 */

import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Block, Card, CardBody, CardKicker } from '../src/components/Card';
import { NavRow } from '../src/components/NavRow';
import { useCopy } from '../src/i18n';
import { CardGrid, ReadingColumns } from '../src/components/ReadingLayout';
import { Screen } from '../src/components/Screen';
import { H4, H5, Muted, T } from '../src/components/Text';
import { settings } from '../src/data/settings';
import { SCORE_DIMENSIONS } from '../src/domain/authenticity';
import { color, font, space } from '../src/theme/tokens';

/**
 * What each dimension can and cannot be answered by.
 *
 * The second half of each line is the point. Three of the six are unanswerable from any
 * document ever written, and that is why a published source cannot authenticate a dish.
 */
const DIMENSIONS: { name: string; what: string; from: 'documents' | 'people' }[] = [
  {
    name: SCORE_DIMENSIONS[0],
    what: 'Where the dish is from, and how precisely. A town beats a country.',
    from: 'documents',
  },
  {
    name: SCORE_DIMENSIONS[1],
    what: 'What it is made of, as the tradition makes it.',
    from: 'documents',
  },
  {
    name: SCORE_DIMENSIONS[2],
    what: 'How it is made — not that somebody published a recipe, but that this is the method of the place.',
    from: 'people',
  },
  {
    name: SCORE_DIMENSIONS[3],
    what: 'Somebody with a stated connection to the place has spoken for it.',
    from: 'people',
  },
  {
    name: SCORE_DIMENSIONS[4],
    what: 'A register, an inscription or an encyclopaedia has recorded it.',
    from: 'documents',
  },
  {
    name: SCORE_DIMENSIONS[5],
    what: 'People from the place have confirmed it, and said what they are confirming.',
    from: 'people',
  },
];

export default function How() {
  const copy = useCopy();
  /* Read at render, so the admin screen moving a threshold moves this page with it. */
  const { authenticAt, validationsRequired } = settings;

  return (
    <Screen bottomPad={50}>
      <NavRow title={copy.howItWorks} />

      {/*
       * The argument on the left, the two numbers it is about on the right.
       *
       * Every paragraph here is about the distance between the ceiling a document cannot
       * pass and the score the badge starts at, and the reader was having to scroll back
       * to the card that states them. See `ReadingColumns`.
       */}
      <ReadingColumns
        aside={
          <Card style={styles.ceiling}>
            <CardKicker>{copy.theGapThatCannotBeClosed}</CardKicker>
            <CardBody>
              Three of those six cannot be answered by any document ever written. No encyclopaedia knows
              whether a method is the method of a place; no register is a person from the town. With
              those three empty, the best a record can score on published sources alone is{' '}
              <T style={styles.figure}>43</T>.
            </CardBody>
            <CardBody>
              A record is called Authentic at <T style={styles.figure}>{authenticAt}</T>. The distance
              between those two numbers is deliberate, and it is the entire argument: it is closable
              only by people who know the dish.
            </CardBody>
          </Card>
        }
        before={
          <>
            <H4 style={styles.title}>{copy.aDocumentCannotMakeAuthentic}</H4>
            <Muted style={styles.lead}>
              That is the rule this atlas is built on, and it is arithmetic rather than a policy — which
              means you can check it rather than trust it.
            </Muted>

            <H5 style={styles.head}>{copy.sixThingsScoredSeparately}</H5>
            <Muted style={styles.body}>
              Every record is scored on the same six dimensions, and all six are printed on the record
              itself. The score is their average, so a reader who doubts it can add up the numbers.
            </Muted>

            <CardGrid>
              {DIMENSIONS.map((dimension) => (
                <Block key={dimension.name} style={styles.dimension}>
                  <View style={styles.dimensionHead}>
                    <T style={styles.dimensionName}>{dimension.name}</T>
                    <T style={dimension.from === 'people' ? styles.fromPeople : styles.fromDocs}>
                      {dimension.from === 'people' ? 'only people' : 'documents can'}
                    </T>
                  </View>
                  <Muted style={styles.dimensionWhat}>{dimension.what}</Muted>
                </Block>
              ))}
            </CardGrid>


          </>
        }
        after={
          <>
            <H5 style={styles.head}>{copy.whatClosesIt}</H5>
            <Muted style={styles.body}>
              {validationsRequired} confirmations from people who state their connection to the place —
              and who say what they are confirming, not merely that they approve. Both are shown on the
              record, because <T style={styles.inline}>“Priya, born in Kozhikode — we use ghee, not
              oil”</T> is evidence a reader can weigh, and “3 confirmations” is a number they have to
              trust.
            </Muted>

            {/*
             * Why accounts exist, said on the page that explains the model.
             *
             * The page described the ceiling and the threshold and never mentioned that only a
             * signed-in confirmation counts — which is the entire reason this app has accounts
             * at all, and the answer to Ajay's question about one person confirming twice.
             */}
            <Muted style={styles.body}>
              Those {validationsRequired} have to be {validationsRequired} different people, so a
              confirmation counts toward the badge only when the person was signed in. An anonymous one
              is still recorded and still shown on the record — what somebody knows is worth having
              whether or not they hold an account — it simply does not move the number. Reading the
              atlas never requires signing in.
            </Muted>

            <H5 style={styles.head}>{copy.whatThisIsNot}</H5>
            <View style={styles.nots}>
              {[
                'No ratings. Nobody scores a dish out of five.',
                'No comments, and no feed. There is nothing here to engage with.',
                'No algorithm deciding what you see. The order is evidence, and you can change it.',
                'No advertising, and no reader is tracked.',
                'Popularity is recorded and kept apart. The most-published version of a dish never becomes the authentic one.',
              ].map((line) => (
                <Muted key={line} style={styles.not}>
                  {line}
                </Muted>
              ))}
            </View>

            <Card style={styles.ask}>
              <CardKicker>{copy.whichIsWhereYouComeIn}</CardKicker>
              <CardBody>
                Most of the atlas has nobody speaking for it. If you know how a dish is made where you are
                from, that is the one thing no source can supply and no amount of scraping can reach.
              </CardBody>
              <Button label={copy.confirmADishYouKnow} block onPress={() => router.push('/proposals')} />
              <Button
                label={copy.proposeOneMissing}
                variant="secondary"
                block
                style={styles.second}
                onPress={() => router.push('/propose')}
              />
            </Card>
          </>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: space[2] },
  lead: { fontSize: 14, lineHeight: 21, marginTop: space[2] },
  head: { marginTop: space[8] },
  body: { fontSize: 13, lineHeight: 20, marginTop: space[2] },
  dimensions: { gap: space[2], marginTop: space[3] },
  dimension: { padding: space[3], gap: 2 },
  dimensionHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: space[2] },
  dimensionName: { fontSize: 13, color: color.text, fontFamily: font.medium },
  /* The accent goes on the three nobody can read their way to. */
  fromPeople: { fontSize: 10, color: color.accent, fontFamily: font.semibold },
  fromDocs: { fontSize: 10, color: color.meta },
  dimensionWhat: { fontSize: 12, lineHeight: 17 },
  ceiling: { padding: space[4], gap: space[2], marginTop: space[6] },
  figure: { fontFamily: font.heading, fontSize: 15, color: color.accent },
  inline: { fontStyle: 'italic', color: color.text },
  nots: { gap: space[2], marginTop: space[3] },
  not: { fontSize: 13, lineHeight: 19 },
  ask: { padding: space[4], gap: space[2], marginTop: space[8] },
  second: { marginTop: space[1] },
});
