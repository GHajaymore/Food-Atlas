/**
 * The hint that a row scrolls, shown only while it does.
 *
 * The authenticity chips overflow every phone and most desktop windows, and the row
 * was cut off mid-chip with nothing to say it continued — which reads as a layout
 * fault rather than as more content. A short fade to the page ground says "there is
 * more this way" without adding a scrollbar or arrows, neither of which the design
 * uses anywhere else.
 *
 * **Conditional, because a permanent fade is its own bug.** On a wide window the chips
 * fit and there is nothing beyond the edge, and a gradient sitting over the last chip
 * would dim a control for no reason. The same applies once the reader has scrolled to
 * the end. So the fade tracks the row: it appears when content extends past the right
 * edge and goes when it does not.
 *
 * Drawn with the SVG already in the project rather than adding a gradient package, and
 * non-interactive, so it never takes a tap meant for the chip underneath it.
 */

import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { color } from '../theme/tokens';

/** How wide the fade is. Enough to read as a soft edge, not as a panel. */
const EDGE = 28;

/**
 * A couple of pixels of slack.
 *
 * Layout and content widths are floats and land a fraction apart at rest, which
 * without this leaves a fade permanently showing on a row that does not scroll.
 */
const SLACK = 2;

export function FadingScrollRow({
  children,
  style,
  contentContainerStyle,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}) {
  const [viewport, setViewport] = useState(0);
  const [content, setContent] = useState(0);
  const [offset, setOffset] = useState(0);

  const more = content - viewport - offset > SLACK;

  return (
    <View style={style}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
        onLayout={(e) => setViewport(e.nativeEvent.layout.width)}
        onContentSizeChange={(w) => setContent(w)}
        scrollEventThrottle={32}
        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => setOffset(e.nativeEvent.contentOffset.x)}
      >
        {children}
      </ScrollView>

      {more ? (
        <View style={styles.edge} pointerEvents="none">
          <Svg width={EDGE} height="100%">
            <Defs>
              <LinearGradient id="scrollEdgeFade" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={color.bg} stopOpacity="0" />
                <Stop offset="1" stopColor={color.bg} stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width={EDGE} height="100%" fill="url(#scrollEdgeFade)" />
          </Svg>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  edge: { position: 'absolute', right: 0, top: 0, bottom: 0, width: EDGE },
});
