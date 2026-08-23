/**
 * The mark.
 *
 * A filled disc with a spoon cut out of it.
 *
 * ## Why solid, after eleven marks that were not
 *
 * Every earlier attempt — rings, a pin, a bracket bowl, a sheaf, four spoons, three
 * utensils — was thin gold line-work on a dark ground. They failed for a reason none
 * of them could fix individually: **a line has a width, and width does not survive
 * scale.** Each needed a different drawing at 16px than at 96, each lost a ring or a
 * prong or a stem on the way down, and each got weaker exactly where an app icon is
 * seen most.
 *
 * A disc is still a disc at sixteen pixels. Inverting the figure — cutting the spoon
 * out of the shape instead of drawing it on top — means one geometry at every size,
 * no small-size variant, no dropped detail, and a mark that reads on a light ground
 * without being redrawn.
 *
 * ## Why a mask rather than a compound path
 *
 * The spoon is a bowl and a stem that overlap, and an overlap is exactly what neither
 * SVG fill rule handles: under `evenodd` two overlapping holes cancel and the overlap
 * fills back in, and under `nonzero` two same-wound holes give a winding of −2, which
 * is also filled. Either way a bright wedge appears where the stem meets the bowl.
 *
 * A mask is boolean, so the overlap behaves. It is also the same operation the
 * rasteriser in `scripts/make-icons.mjs` performs — inside the disc and not inside
 * either shape — which is what keeps the icon and this component the same mark.
 */

import { useId } from 'react';
import Svg, { Circle, Defs, Ellipse, G, Mask, Path, Rect } from 'react-native-svg';
import { color } from '../theme/tokens';

interface Props {
  /** Rendered size in points. The mark is square. */
  size?: number;
  /**
   * The mark's colour. Defaults to the accent — grain gold, which `tokens.ts` chose
   * as the colour of the world's staple ingredient.
   */
  tint?: string;
}

/**
 * The disc, and the spoon taken out of it.
 *
 * Shared with the rasteriser by being written down in one place and copied there
 * deliberately, since a `.tsx` module cannot be imported by a plain `.mjs` script.
 *
 * The spoon sits fractionally low on purpose: 15 units of disc above the bowl against
 * 13.5 below the stem. Optical centring is not geometric centring, and a shape hung
 * exactly in the middle of a circle reads as slightly high.
 */
export const MARK = {
  disc: { cx: 50, cy: 50, r: 46 },
  bowl: { cx: 50, cy: 36, rx: 13, ry: 17 },
  stem: { x: 50, top: 50, bottom: 78, halfWidth: 4.5 },
  /** Tilt, in degrees. See the note on why this is not optional. */
  tilt: 32,
} as const;

export function Logo({ size = 32, tint = color.accent }: Props) {
  // Unique per instance: two Logos on one screen sharing a mask id would have the
  // second silently reuse the first's, and on web that is a real and confusing bug.
  const maskId = `logo-cut-${useId()}`;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <Mask id={maskId}>
          {/* White keeps, black cuts. */}
          <Rect x={0} y={0} width={100} height={100} fill="#fff" />
          <G transform={`rotate(${MARK.tilt} ${MARK.disc.cx} ${MARK.disc.cy})`}>
          <Ellipse
            cx={MARK.bowl.cx}
            cy={MARK.bowl.cy}
            rx={MARK.bowl.rx}
            ry={MARK.bowl.ry}
            fill="#000"
          />
          <Path
            d={`M${MARK.stem.x} ${MARK.stem.top}V${MARK.stem.bottom}`}
            stroke="#000"
            strokeWidth={MARK.stem.halfWidth * 2}
            strokeLinecap="round"
          />
          </G>
        </Mask>
      </Defs>
      <G mask={`url(#${maskId})`}>
        <Circle cx={MARK.disc.cx} cy={MARK.disc.cy} r={MARK.disc.r} fill={tint} />
      </G>
    </Svg>
  );
}
