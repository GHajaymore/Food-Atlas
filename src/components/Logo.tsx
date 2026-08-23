/**
 * The mark.
 *
 * A spoon, a fork and a pair of chopsticks, radiating from a shared centre, with
 * nothing in the middle.
 *
 * ## What it says
 *
 *   **food**    — three utensils, with no cleverness required to see it.
 *   **global**  — three ways of eating, not one. Half this product is that the atlas
 *                 does not describe the world from one table.
 *   **wiki**    — many hands on one record, which is what a wiki is. Not a "W", and
 *                 not a puzzle globe borrowed from someone else's trademark.
 *   **free**    — freely *given*, by many. The honest drawing of free is not an open
 *                 padlock; it is that the labour is volunteered.
 *
 * The empty centre is the argument the app makes in arithmetic. Three of the six
 * evidence dimensions can only be filled by people from the place, and no record
 * reaches Authentic until three of them agree — so no single authority sits at the
 * middle of this atlas, and none sits at the middle of its mark.
 *
 * ## Why three arms and not four
 *
 * The mark this replaced was four identical spoons at ninety degrees. It read
 * correctly at 30px and failed at icon size: four matching ovals on four equal arms
 * stop being cutlery and become a compass rose. Symmetry that regular has a meaning
 * of its own, and it took the drawing over. Three *different* utensils cannot do
 * that — the asymmetry is what keeps the mark reading as what it is.
 *
 * ## The optical centre is not the geometric one
 *
 * Three arms at 120° do not sit centred on the point they rotate about. Arms reaching
 * 43 units put tips at y=7 (up) and y=71.5 (the two below), so the drawing's own
 * centre is 39.25 and the rosette hangs 10.75 units high inside its box. Four arms at
 * 90° have no such problem, which is why this only appeared on replacing the mark.
 *
 * `DROP` corrects it. It is computed above rather than nudged by eye, and it is the
 * difference between an app icon that looks centred and one that looks like a
 * mistake nobody could name.
 */

import Svg, { Ellipse, G, Path } from 'react-native-svg';
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

/** See the note above: the vertical correction a three-armed rosette needs. */
export const DROP = 10.75;

export function Logo({ size = 32, tint = color.accent }: Props) {
  const detailed = size >= 24;
  const stroke = Math.max(4.5, 250 / size);

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G translateY={DROP}>
        {/* Spoon, upright. The bowl is filled — outlined, it reads as a ring. */}
        <G>
          {detailed ? (
            <>
              <Ellipse cx={50} cy={18} rx={9} ry={11.5} fill={tint} />
              <Path d="M50 30v17" stroke={tint} strokeWidth={stroke} strokeLinecap="round" />
            </>
          ) : (
            <>
              <Ellipse cx={50} cy={19} rx={12} ry={15} fill={tint} />
              <Path d="M50 33v14" stroke={tint} strokeWidth={10} strokeLinecap="round" />
            </>
          )}
        </G>

        {/*
         * Fork. Three prongs running into a shoulder, and the proportions are the
         * whole of whether it reads.
         *
         * Two earlier attempts failed for the same reason from opposite directions: a
         * disc under the prongs looked like a ball with lines floating off it, and a
         * horizontal bar across them looked like a clamp. What a fork actually has is
         * prongs that *become* the shoulder, so the shoulder is an ellipse the prongs
         * end inside rather than a shape sitting beneath them.
         *
         * The gaps are 2.5 against prongs of 3.67 — wider than looks right on paper.
         * Thin gaps close up the moment the mark is scaled down, and a fork with its
         * gaps closed is a butter knife.
         */}
        <G rotation={120} originX={50} originY={50}>
          {detailed ? (
            <>
              <Path
                d="M43.84 11v14M50 11v14M56.17 11v14"
                stroke={tint}
                strokeWidth={3.67}
                strokeLinecap="round"
              />
              <Ellipse cx={50} cy={25} rx={8} ry={6} fill={tint} />
              <Path d="M50 29v18" stroke={tint} strokeWidth={stroke} strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Prongs dropped: three of them inside sixteen pixels is a grey blur,
                  and a shoulder on a stem still reads as a fork rather than a spoon. */}
              <Ellipse cx={50} cy={22} rx={10} ry={7} fill={tint} />
              <Path d="M50 28v19" stroke={tint} strokeWidth={10} strokeLinecap="round" />
            </>
          )}
        </G>

        {/* Chopsticks, converging slightly, as a resting pair actually lies. */}
        <G rotation={240} originX={50} originY={50}>
          <Path
            d={detailed ? 'M45 9 47 47M55 9 53 47' : 'M44 11 47 47M56 11 53 47'}
            stroke={tint}
            strokeWidth={detailed ? stroke * 0.93 : 8}
            strokeLinecap="round"
          />
        </G>
      </G>
    </Svg>
  );
}
