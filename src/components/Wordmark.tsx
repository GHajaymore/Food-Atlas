/**
 * The name, with the mark inside it.
 *
 * "WikiFoodia" already contains two circles side by side — F**oo**dia — so the mark
 * does not need to sit next to the name competing with it. The two o's *are* the
 * mark: a gold disc with a spoon cut out of one and a fork cut out of the other.
 *
 * ## Why the two are different
 *
 * Because that is where the globality belongs. An earlier mark tried to say "the
 * world's ways of eating" by arranging three utensils in a rosette, and it failed —
 * at icon size a regular arrangement of arms reads as a compass, not as cutlery.
 * Inside the name there is no arrangement to misread: two letters, two utensils, and
 * the point lands without a diagram.
 *
 * It also means the wordmark and the icon carry different amounts of the story, which
 * is how an identity is supposed to work. The icon is one disc and one spoon, because
 * an app icon has about a fifth of a second to be recognised and cannot afford a
 * second idea.
 *
 * ## Why the discs are not letters
 *
 * They are drawn rather than set, so they hold their weight at any size and in any
 * font the app is ever moved to. The trade is that they have to be positioned against
 * the text by hand — see `BASELINE_LIFT`.
 */

import { View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, Mask, Path, Rect } from 'react-native-svg';
import { useId } from 'react';
import { Text } from 'react-native';
import { color, font } from '../theme/tokens';

/**
 * How far a disc sits above the bottom of the text box, as a fraction of the size.
 *
 * The row aligns on `flex-end`, so without this the discs would hang level with the
 * bottom of the descenders rather than sitting on the baseline where an "o" does.
 * Inter's descender is a little over a fifth of the em; this is that, less a hair,
 * because a circle beside flat-bottomed letters reads high if it is set exactly level.
 */
const BASELINE_LIFT = 0.185;

/** The disc's diameter against the font size — an Inter "o" is close to this. */
const DISC_RATIO = 0.6;

/**
 * The air a disc carries on each side, as a fraction of the font size.
 *
 * Every letter in a font has sidebearings — built-in space either side of the drawn
 * shape — and it is what stops a word looking like it was assembled from stamps. The
 * discs are drawn objects with none, so measuring the rendered lockup showed "F"
 * ending at 296.7px and the first disc beginning at 296.7px: touching, and again
 * between the two discs and "dia".
 *
 * An Inter "o" carries roughly 0.06em a side. This is a shade under, because a circle
 * beside a flat-sided letter reads further apart than it measures, and because the
 * name's own tracking is slightly negative.
 */
const DISC_BEARING = 0.052;

type Utensil = 'spoon' | 'fork';

/**
 * One letter-shaped disc.
 *
 * A mask rather than a compound path: the bowl and the stem overlap, and an overlap
 * is exactly what neither SVG fill rule handles — under `evenodd` the two holes
 * cancel and the overlap fills back in, and under `nonzero` two same-wound holes give
 * a winding of −2, which is also filled. Either way a bright wedge appears where the
 * stem meets the bowl.
 */
function Disc({ utensil, size, tint }: { utensil: Utensil; size: number; tint: string }) {
  const id = `wm-${utensil}-${useId()}`;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <Mask id={id}>
          {/* White keeps, black cuts. */}
          <Rect x={0} y={0} width={100} height={100} fill="#fff" />
          {/*
           * Tilted, and not for decoration. A round hole with a straight slot below
           * it, set upright, is a keyhole — which reads as *locked*, the opposite of
           * what this atlas is. A keyhole is always vertical; a tilted spoon cannot
           * be mistaken for one. The two tilt opposite ways so the pair reads as a
           * pair rather than as one thing printed twice.
           */}
          <G transform={`rotate(${utensil === 'spoon' ? 32 : -32} 50 50)`}>
            {utensil === 'spoon' ? (
              <>
                <Ellipse cx={50} cy={36} rx={13} ry={17} fill="#000" />
                <Path d="M50 50V78" stroke="#000" strokeWidth={9} strokeLinecap="round" />
              </>
            ) : (
              <>
                {/*
                 * Heavier than it looks like it should be, and measured rather than
                 * judged. A fork's cut-out removes less of the disc than a spoon's —
                 * prongs are thin where a bowl is solid — so with the two drawn to
                 * their natural weights the fork disc kept **2.7% more gold** than the
                 * spoon and read as the heavier of the pair.
                 *
                 * Sampling both on a 1000×1000 grid and solving for equal remaining
                 * gold gives prongs at 6.8 and a shoulder of 11.5 × 7, which lands
                 * within 0.25%. Thicker prongs also survive being scaled down, which
                 * is the other thing that was wrong with them.
                 */}
                <Path
                  d="M41.5 22v22M50 22v22M58.5 22v22"
                  stroke="#000"
                  strokeWidth={6.8}
                  strokeLinecap="round"
                />
                <Ellipse cx={50} cy={45} rx={11.5} ry={7} fill="#000" />
                <Path d="M50 49V78" stroke="#000" strokeWidth={9} strokeLinecap="round" />
              </>
            )}
          </G>
        </Mask>
      </Defs>
      <G mask={`url(#${id})`}>
        <Circle cx={50} cy={50} r={46} fill={tint} />
      </G>
    </Svg>
  );
}

interface Props {
  /** Font size of the name. The discs follow it. */
  size?: number;
  tint?: string;
  style?: StyleProp<ViewStyle>;
}

export function Wordmark({ size = 20, tint = color.accent, style }: Props) {
  const disc = size * DISC_RATIO;

  /*
   * `lineHeight` equal to the font size keeps each Text box tight, so the row's
   * flex-end alignment has a predictable edge to work from. Left at the theme's 1.12
   * the boxes carry leading the discs would have to be nudged around.
   */
  const letters: StyleProp<TextStyle> = {
    fontFamily: font.display,
    fontSize: size,
    lineHeight: size,
    color: color.text,
    letterSpacing: -size * 0.015,
  };

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'flex-end' }, style]}>
      {/*
       * Wiki recedes by *weight*, not by colour.
       *
       * It carried the muted grey until the whole thing was looked at together, and
       * the word was wearing three treatments — grey, white, gold — across nine
       * letters, which left the gold marooned in the middle rather than reading as
       * the mark. One ink for the name and one accent for the discs is the design
       * system's own rule: the accent is a line, a mark and a glow, never a fill.
       *
       * The emphasis is still there. Wiki says what kind of thing this is and
       * Foodia is its name, and regular against semibold carries that on its own.
       */}
      <Text style={[letters, { fontFamily: font.regular }]}>Wiki</Text>
      <Text style={letters}>F</Text>
      <View style={{ marginBottom: size * BASELINE_LIFT, marginHorizontal: size * DISC_BEARING }}>
        <Disc utensil="spoon" size={disc} tint={tint} />
      </View>
      <View style={{ marginBottom: size * BASELINE_LIFT, marginHorizontal: size * DISC_BEARING }}>
        <Disc utensil="fork" size={disc} tint={tint} />
      </View>
      <Text style={letters}>dia</Text>
    </View>
  );
}
