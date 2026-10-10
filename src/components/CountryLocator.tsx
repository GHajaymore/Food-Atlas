/**
 * Where the country is: its outline in gold among its neighbours.
 *
 * A country page opened on a name and a count. For a reader who came from a search engine
 * to "Eritrea" or "Bhutan", the first useful fact is where on earth it is, and what it sits
 * between — the neighbours are half of any cuisine's story (Eritrea's injera is Ethiopia's;
 * Bhutan's momos came over the passes from Tibet). So the page shows the region around
 * it, drawn from the same outlines as the Food Atlas map, which the reader's browser
 * already holds if they came from there.
 *
 * It is a picture, not a control: nothing on it is pressable, and it is hidden from screen
 * readers, because the country's name is the heading right beside it.
 */

import { useMemo } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { color, radius } from '../theme/tokens';
import { EMPTY_LAND, useWorldMap } from './worldMapData';

/* The frame's shape, and the least of the world it shows — a frame drawn tight round
   Malta or Bahrain would be a blob with no neighbours to say where it is. */
const ASPECT = 16 / 9;
const MIN_WIDTH = 210;

export function CountryLocator({ code, style }: { code: string | undefined; style?: ViewStyle }) {
  const map = useWorldMap();

  const frame = useMemo(() => {
    if (!map || !code) return null;
    const shape = map.countries.find((c) => c.a2 === code);
    const dot = map.dots.find((d) => d.a2 === code);
    if (!shape && !dot) return null;
    const [x0, y0, x1, y1] = shape ? shape.b : [dot!.c[0], dot!.c[1], dot!.c[0], dot!.c[1]];
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    /* Room for the country and as much again around it, in the frame's shape. */
    let w = Math.max(MIN_WIDTH, (x1 - x0) * 2.2, (y1 - y0) * 2.2 * ASPECT);
    w = Math.min(w, map.width);
    const h = w / ASPECT;
    /* Centred, even at the world's edge: open sea beside Japan or New Zealand is the
       truth, and clamping the frame to the map pushed both against one side. */
    const x = cx - w / 2;
    const y = cy - h / 2;
    return { x, y, w, h, dot: shape ? undefined : dot };
  }, [map, code]);

  if (!map || !frame) return null;

  /* The outline stroke is in map units, so it is scaled to stay a hairline at any zoom. */
  const hair = frame.w / 500;

  return (
    <View
      style={[styles.frame, style]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      {...({ 'aria-hidden': true } as object)}
    >
      <Svg width="100%" height="100%" viewBox={`${frame.x} ${frame.y} ${frame.w} ${frame.h}`} preserveAspectRatio="xMidYMid meet">
        {map.countries.map((c) => (
          <Path
            key={c.a2 + c.d.length}
            d={c.d}
            fill={c.a2 === code ? color.accent : EMPTY_LAND}
            stroke={color.bg}
            strokeWidth={c.a2 === code ? hair * 1.2 : hair}
          />
        ))}
        {frame.dot ? (
          <>
            <Circle cx={frame.dot.c[0]} cy={frame.dot.c[1]} r={frame.w / 40} fill="none" stroke={color.accent} strokeWidth={hair * 1.5} />
            <Circle cx={frame.dot.c[0]} cy={frame.dot.c[1]} r={frame.w / 120} fill={color.accent} />
          </>
        ) : null}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    aspectRatio: ASPECT,
    maxWidth: '100%',
    overflow: 'hidden',
    borderRadius: radius.lg,
    /* The sea is the page's own ground, so the land reads as the thing drawn on it. */
    backgroundColor: color.bg,
    borderWidth: 1,
    borderColor: color.surface,
  },
});
