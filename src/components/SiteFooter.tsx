/**
 * The footer a website has and this app did not.
 *
 * `SiteNav` — the phone colophon — says in its own header that it is not this: *"A
 * website does want a footer, and this is not it: a colophon is a phone pattern, three
 * links stacked with a note each. The real one carries the whole map of the site."* This
 * is that footer, and `SiteNav` keeps the phone.
 *
 * ## Why the absence mattered more than it sounds
 *
 * On a desktop the page simply stopped. Whatever the last section happened to be — a
 * form, a table of countries, a card — the window ended there and nothing said the site
 * had. That is one of the clearest tells that a page is an app screen rather than a page:
 * an application ends when its content does, a document has a foot.
 *
 * It also closes the reachability gap `SiteNav` was built to fix, at the other end. The
 * header carries five destinations because a header has room for five; the site has more
 * than five pages, and the ones that were only reachable by already knowing about them —
 * browse-all, the record of how confidence is scored — now have a permanent home.
 *
 * ## What it claims
 *
 * Only what is checkable. The source line names the projects the catalogue is actually
 * built from, worded as `domain/support.ts` words it, because a footer is exactly where
 * a reader looks to find out whether a site is allowed to be showing them what it is
 * showing them — and several of the photographs are CC BY-SA, which makes attribution a
 * licence condition rather than a courtesy.
 *
 * There is no copyright line, deliberately. The atlas does not own this material; a
 * confident "© WikiFoodia" under a page of other people's openly licensed work would be
 * a claim in exactly the wrong direction.
 */

import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useCopy, type Copy, useNumber } from '../i18n';
import { BRAND } from '../brand';
import { catalogueStats } from '../data/catalogue';
import { useLayout } from '../theme/layout';
import { color, font, space } from '../theme/tokens';
import { Pressable } from './Pressable';
import { SessionControl } from './SessionControl';
import { Muted, T } from './Text';
import { Wordmark } from './Wordmark';

interface Column {
  heading: string;
  links: { label: string; to: string }[];
}

/*
 * Grouped by what a reader came to do, not by which file the route lives in.
 *
 * Reading and contributing are genuinely different visits — one is somebody looking a
 * dish up, the other is somebody who knows one — and the split is the same distinction
 * the whole evidence model rests on.
 */
const columnsFor = (copy: Copy): Column[] => [
  {
    heading: copy.navExplore,
    links: [
      { label: copy.foodAtlas, to: '/atlas' },
      { label: copy.search, to: '/search' },
      { label: copy.everyRecord, to: '/browse' },
    ],
  },
  {
    heading: copy.navContribute,
    links: [
      { label: copy.proposeADish, to: '/propose' },
      { label: copy.confirmAProposal, to: '/proposals' },
      { label: copy.addATraditionShort, to: '/contribute' },
    ],
  },
  {
    heading: copy.navAbout,
    links: [
      { label: copy.howItWorks, to: '/how' },
      { label: copy.keepingItFree, to: '/support' },
    ],
  },
];

export function SiteFooter() {
  const copy = useCopy();
  const n = useNumber();
  const columns = columnsFor(copy);
  const { wide } = useLayout();

  /*
   * Phone keeps `SiteNav`. Rendering both printed the same four destinations twice on
   * one page, which is the fault that component's header already records — and a
   * four-column footer on a 375px screen is four stacked lists, which is a worse
   * colophon than the colophon.
   */
  if (!wide) return null;

  /* The colophon, announced so a screen reader can skip to it or past it. */
  return (
    <View role="contentinfo" style={styles.foot}>
      <View style={styles.columns}>
        <View style={styles.identity}>
          <Wordmark size={17} />
          <Muted style={styles.tagline}>{BRAND.tagline}</Muted>
          <Muted style={styles.holding}>
            {copy.footerHolding
              .replace('{n}', n(catalogueStats.total))
              .replace('{c}', String(catalogueStats.countries))}
          </Muted>
        </View>

        {columns.map((column) => (
          <View key={column.heading} style={styles.column}>
            <T style={styles.heading}>{column.heading}</T>
            {column.links.map((link) => (
              <Pressable
                key={link.to}
                accessibilityRole="link"
                tint="none"
                onPress={() => router.push(link.to)}
                style={styles.linkRow}
              >
                <Muted style={styles.link}>{link.label}</Muted>
              </Pressable>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.base}>
        <Muted style={styles.sources}>{copy.footerSources}</Muted>
        <SessionControl compact />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  foot: {
    marginTop: 64,
    paddingTop: 30,
    borderTopWidth: 1,
    borderTopColor: color.divider,
    gap: 26,
  },
  /*
   * Wrapping, because the footer does not always get the window.
   *
   * A screen with `measure` caps its column at 720, which leaves about 640 after padding
   * — and three 150px columns with gaps do not fit beside an identity block in that. The
   * first version used `flex: 1` and no wrapping, so on `/support` the identity column
   * was squeezed to 46px and the tagline set one character per line. Wrapping lets the
   * links drop to their own row on a narrow page and sit alongside on a wide one, with
   * no breakpoint of its own to keep in step with the others.
   */
  columns: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', columnGap: 48, rowGap: 30 },
  /* Grows into spare width so the link columns stay put as the window widens — a nav
     column stretched to 300px is a column of very lonely words — but never below a
     width that can set a line of text. */
  identity: { flexGrow: 1, flexBasis: 280, minWidth: 250, gap: 6 },
  tagline: { fontSize: 11 },
  holding: { fontSize: 11, lineHeight: 11 * 1.6, marginTop: 6, maxWidth: 330 },

  column: { width: 150, gap: 2 },
  heading: { fontFamily: font.heading, fontSize: 11, letterSpacing: 0.6, marginBottom: 6, color: color.text },
  linkRow: { paddingVertical: 5 },
  link: { fontSize: 12.5 },

  base: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: space[6],
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: color.divider,
  },
  sources: { fontSize: 10.5, lineHeight: 10.5 * 1.6, flex: 1, minWidth: 0 },
});
