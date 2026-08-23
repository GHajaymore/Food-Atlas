/**
 * The mark.
 *
 * A grain at the centre, and the atlas's own geography ringing outward: country,
 * region, province, city, village. Those five levels are the whole of what `Loc`
 * records and most of what separates a record from a headword, so the mark is the
 * data model rather than a picture of food.
 *
 * The grain is the palette's idea, not a new one. `tokens.ts` moved the accent off
 * Nocturne's blurple to "the colour of the world's staple ingredient — rice and
 * wheat, the grains most of humanity eats daily", and the mark simply draws what the
 * colour already means.
 *
 * ## The broken ring
 *
 * The outermost ring is dashed, and it is the only part of this worth arguing about.
 * It is there because the atlas is unfinished — 63% of records sit at country level,
 * three of the six evidence dimensions are empty on nearly everything, and the app
 * says so on every screen it can. A closed outer ring would be the one place in the
 * product that claims completeness. This one is left open on purpose.
 *
 * ## Optical scaling
 *
 * Stroke widths are in viewBox units, so they shrink with the mark: the 2.2 that
 * looks right at 96px renders at a third of a pixel in a favicon and disappears. The
 * weight is therefore computed against the rendered size rather than fixed, and the
 * middle ring is dropped below 24px — three concentric hairlines inside 16 pixels is
 * a smudge, not a mark.
 */

import Svg, { Circle, Path } from 'react-native-svg';
import { color } from '../theme/tokens';

interface Props {
  /** Rendered size in points. The mark is square. */
  size?: number;
  /**
   * The mark's colour. Defaults to the accent — the point of the whole thing — but
   * takes a value so it can sit on gold, or go mono for a monochrome app icon.
   */
  tint?: string;
  /**
   * What shows through the grain's crease. The ground it is drawn on, not a colour of
   * its own: the crease is a gap in the seed, so it has to be whatever is behind.
   */
  ground?: string;
}

export function Logo({ size = 32, tint = color.accent, ground = color.bg }: Props) {
  /*
   * Held at roughly 1.3 rendered pixels at the bottom end, and left alone once the
   * mark is big enough for the designed weight to be the right one.
   */
  const stroke = Math.max(2.2, 130 / size);
  const rings = size >= 24;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* The world, unfinished. */}
      <Circle
        cx={50}
        cy={50}
        r={45}
        stroke={tint}
        strokeWidth={stroke}
        strokeOpacity={0.45}
        strokeDasharray="30 14"
        strokeLinecap="round"
        fill="none"
      />
      {rings ? (
        <Circle
          cx={50}
          cy={50}
          r={33}
          stroke={tint}
          strokeWidth={stroke}
          strokeOpacity={0.7}
          fill="none"
        />
      ) : null}
      <Circle
        cx={50}
        cy={50}
        r={rings ? 21 : 26}
        stroke={tint}
        strokeWidth={stroke}
        strokeOpacity={0.9}
        fill="none"
      />

      {/* The grain. Larger when the rings thin out, so the centre still reads. */}
      <Path
        d={
          rings
            ? 'M50 33c6.5 7.5 6.5 26.5 0 34-6.5-7.5-6.5-26.5 0-34Z'
            : 'M50 30c8 9 8 31 0 40-8-9-8-31 0-40Z'
        }
        fill={tint}
      />
      {/* The crease, which is a gap rather than a line — see `ground`. */}
      {size >= 28 ? (
        <Path
          d="M50 36v28"
          stroke={ground}
          strokeWidth={Math.max(1.6, 60 / size)}
          strokeLinecap="round"
        />
      ) : null}
    </Svg>
  );
}
