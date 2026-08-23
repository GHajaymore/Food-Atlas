/**
 * The mark.
 *
 * Four spoons laid head-out in a ring, and nothing in the middle.
 *
 * That absence is the whole idea. This atlas is not one authority describing the
 * world's food; it is many people describing their own, and the model says so in
 * arithmetic — three of the six evidence dimensions can only be filled by people from
 * the place, and no record reaches Authentic until three of them agree. Nobody sits
 * at the centre of that, so nobody sits at the centre of this.
 *
 * It carries the three things the name promises, which is rare for one mark:
 *
 *   **food**  — spoons, without ambiguity or cleverness.
 *   **wiki**  — many hands on one record, which is what a wiki is. Not a "W", not a
 *               puzzle globe borrowed from somebody else's trademark.
 *   **free**  — freely *given*, by many. The honest reading of free here is not an
 *               open padlock; it is that the labour is volunteered.
 *
 * It reads as a compass rose too, which an atlas can only be glad of.
 *
 * ## Optical scaling
 *
 * Stroke widths are in viewBox units, so they shrink with the mark: the 4 that looks
 * right at 96px renders at two thirds of a pixel in a favicon and vanishes. Weight is
 * therefore computed against the rendered size.
 *
 * Below 24px the spoons stop being drawn as outlines and become four solid heads. A
 * stroked bowl with a stem inside sixteen pixels is four grey smudges; four filled
 * ovals in a rosette still reads as a mark, and still reads as spoons.
 */

import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';
import { color } from '../theme/tokens';

interface Props {
  /** Rendered size in points. The mark is square. */
  size?: number;
  /**
   * The mark's colour. Defaults to the accent — grain gold, which `tokens.ts` chose
   * as the colour of the world's staple ingredient — but takes a value so the mark
   * can go mono for a monochrome app icon.
   */
  tint?: string;
}

/** The four quarters. Ninety degrees apart, so the rosette is the same whichever way up it is. */
const QUARTERS = [0, 90, 180, 270];

export function Logo({ size = 32, tint = color.accent }: Props) {
  const outlined = size >= 24;

  if (!outlined) {
    // Four solid heads. The stems and the centre are dropped rather than drawn thin,
    // because at this size they would only muddy what is left.
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Ellipse cx={50} cy={20} rx={13} ry={16} fill={tint} />
        <Ellipse cx={80} cy={50} rx={16} ry={13} fill={tint} />
        <Ellipse cx={50} cy={80} rx={13} ry={16} fill={tint} />
        <Ellipse cx={20} cy={50} rx={16} ry={13} fill={tint} />
      </Svg>
    );
  }

  const stroke = Math.max(4, 260 / size);

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {QUARTERS.map((angle) => (
        <G key={angle} rotation={angle} originX={50} originY={50}>
          <Ellipse
            cx={50}
            cy={19}
            rx={8.5}
            ry={11}
            stroke={tint}
            strokeWidth={stroke}
            fill="none"
          />
          <Path d="M50 30v16" stroke={tint} strokeWidth={stroke} strokeLinecap="round" />
        </G>
      ))}
      {/*
       * The centre is a point, not a hub — small enough to hold the rosette together
       * and too small to be the thing the spoons are arranged around.
       */}
      <Circle cx={50} cy={50} r={stroke * 1.15} fill={tint} />
    </Svg>
  );
}
