/**
 * A list of records as two lists: the photographed ones as cards, then the rest as rows.
 *
 * Both the country pages and /browse laid every record into one wrapping grid, a card
 * where there was a photograph and a row where there was not. A card is four times the
 * height of a row, so every row beside a card left a hole the height of a photograph —
 * Japan's browse page was more gap than food (9 October). Each kind in its own grid
 * lines up; the second gets a heading that says what it is ("Not yet photographed"),
 * which is true, and is also the invitation the atlas makes everywhere else.
 *
 * The order inside each list is the caller's. Each list pages on its own, so "show more"
 * under the cards brings more cards, not rows from the middle of the second list.
 */

import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { listPhoto } from '../domain/listPhoto';
import type { Dish } from '../domain/types';
import { useCopy, useNumber } from '../i18n';
import { useLayout } from '../theme/layout';
import { space } from '../theme/tokens';
import { Button } from './Button';
import { DishCard } from './DishCard';
import { H6, Muted } from './Text';

/* Eight rows of a three-column grid, twelve of a two; and a list long enough to scan. */
const PHOTO_PAGE = 24;
const ROW_PAGE = 60;

export function RecordGrid({ records }: { records: Dish[] }) {
  const copy = useCopy();
  const n = useNumber();
  const layout = useLayout();
  const [photoPages, setPhotoPages] = useState(1);
  const [rowPages, setRowPages] = useState(1);

  const photographed = useMemo(() => records.filter((dish) => listPhoto(dish)), [records]);
  const unphotographed = useMemo(() => records.filter((dish) => !listPhoto(dish)), [records]);

  const shownPhotos = photographed.slice(0, photoPages * PHOTO_PAGE);
  const shownRows = unphotographed.slice(0, rowPages * ROW_PAGE);
  const width = { width: `${100 / layout.columns}%` as const };

  return (
    <>
      {shownPhotos.length ? (
        <View style={layout.wide ? styles.grid : undefined}>
          {shownPhotos.map((dish) => (
            <View key={dish.id} style={layout.wide ? [width, styles.cell] : styles.stacked}>
              <DishCard dish={dish} showViews={false} compact={false} />
            </View>
          ))}
        </View>
      ) : null}
      {shownPhotos.length < photographed.length ? (
        <Button
          label={copy.showNMore.replace('{n}', String(Math.min(PHOTO_PAGE, photographed.length - shownPhotos.length)))}
          variant="secondary"
          block
          style={styles.more}
          onPress={() => setPhotoPages((p) => p + 1)}
        />
      ) : null}

      {shownRows.length ? (
        <>
          {/* No heading when nothing above is photographed: it would only be saying
              "none of these" over the whole list. */}
          {photographed.length ? (
            <View style={styles.sectionHead}>
              <H6>{copy.notYetPhotographed}</H6>
              <Muted style={styles.sectionCount}>{n(unphotographed.length)}</Muted>
            </View>
          ) : null}
          <View style={layout.wide ? styles.grid : undefined}>
            {shownRows.map((dish) => (
              <View key={dish.id} style={layout.wide ? [width, styles.rowCell] : styles.stacked}>
                <DishCard dish={dish} showViews={false} compact />
              </View>
            ))}
          </View>
        </>
      ) : null}
      {shownRows.length < unphotographed.length ? (
        <Button
          label={copy.showNMore.replace('{n}', String(Math.min(ROW_PAGE, unphotographed.length - shownRows.length)))}
          variant="secondary"
          block
          style={styles.more}
          onPress={() => setRowPages((p) => p + 1)}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  /* A gutter between cards: they sat edge to edge, so two dishes read as one panel.
     The cell pads and the grid hands the outer half back, so the edges stay aligned. */
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: space[2], marginHorizontal: -space[2] },
  cell: { padding: space[2] },
  /* A row carries its own rule and padding; it only needs the gutter's sides. */
  rowCell: { paddingHorizontal: space[2] },
  /* On a phone the cards are stacked, and they sat about 2px apart, so separate dishes
     read as one long block (seen 9 October). */
  stacked: { marginBottom: space[3] },
  sectionHead: { flexDirection: 'row', alignItems: 'baseline', gap: space[2], marginTop: space[8], marginBottom: space[2] },
  sectionCount: { fontSize: 13 },
  more: { marginTop: space[6] },
});
