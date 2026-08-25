/**
 * The back row at the top of every screen below the Feed.
 *
 * Back always returns to the sensible parent, which expo-router's stack already
 * does; this component only draws the control and the screen title.
 */

import { router } from 'expo-router';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useCopy } from '../i18n';
import { color, space } from '../theme/tokens';
import { IconButton } from './Button';
import { CaretLeftIcon } from './icons';
import { H2 } from './Text';

interface Props {
  title?: string;
  /** Override the default pop, for the intake flow's step-by-step back. */
  onBack?: () => void;
  /** Rendered at the far right, e.g. the detail screen's bookmark. */
  right?: React.ReactNode;
  style?: ViewStyle;
}

export function NavRow({ title, onBack, right, style }: Props) {
  const copy = useCopy();
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));

  return (
    <View style={[styles.row, style]}>
      {/* The 44px tap target is inset by the page padding so the glyph aligns
          optically with the content edge rather than sitting proud of it. */}
      <IconButton label={copy.goBack} onPress={back} style={styles.backButton}>
        <CaretLeftIcon size={18} color={color.text} />
      </IconButton>
      {title ? <H2 style={styles.title}>{title}</H2> : <View style={styles.spacer} />}
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
    paddingTop: space[1],
    paddingBottom: 10,
  },
  backButton: { marginLeft: -10 },
  /*
   * A page title, not a toolbar label.
   *
   * This was H4 — 25.6 on a desktop — on all ten screens that pass a title, which put a
   * page's own name below the figures printed on it: /atlas announced itself at 25.6
   * above three 40.3 numbers. Meanwhile the record screen sets its subject in H2 at 46.1,
   * so the app named a dish twice the size it named a whole section of itself.
   *
   * H2 matches that. The record screen passes no title here — its H2 is the dish name —
   * so nothing ends up with two.
   */
  title: { flex: 1 },
  spacer: { flex: 1 },
});
