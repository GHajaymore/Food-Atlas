/**
 * Dish photographs.
 *
 * Three things this component is responsible for:
 *
 * 1. **Attribution.** The photographs come from Wikimedia Commons and several are
 *    CC BY-SA, so credit must be displayed *wherever the image is shown* — not only
 *    on the detail screen. The credit renders as a small overlay in the bottom-left,
 *    as the prototype does. Suppress it only where the same image already carries a
 *    visible credit in the same viewport.
 *
 * 2. **The `.lighten` treatment.** Nocturne blends photographs into the page with
 *    `mix-blend-mode: lighten`, so dark values fall away into the ground. React
 *    Native supports `mixBlendMode` on the new architecture; react-native-web drops
 *    it from the style resolver, so on web the Image carries `data-lighten` and the
 *    rule injected by `theme/webStyles` applies it. The frame stays transparent so
 *    the blend composites against whatever the page actually paints behind it — the
 *    card surface, or the page ground — which is what the design intends.
 *
 * 3. **Arriving rather than appearing.** A photograph that pops in at full opacity the
 *    instant it decodes is the single most noticeable thing about a slow connection, and
 *    on a rail of a dozen cards it reads as the page flickering. Each one fades up over
 *    260ms instead.
 *
 *    The transition lives in `theme/webStyles` under `[data-motion="photo-veil"]`, inside
 *    the `prefers-reduced-motion: no-preference` guard — so a reader who has asked their
 *    system for less movement gets the picture immediately and without a fade, which is
 *    the correct reading of that preference rather than an exemption from it. Native has
 *    no such rule and simply shows the image on load; the fade is a web nicety, not a
 *    correctness requirement, and nothing depends on it having run.
 */

import { useCallback, useState } from 'react';
import { Image, Platform, StyleSheet, View, type ImageStyle, type ViewStyle } from 'react-native';
import { color, font, radius } from '../theme/tokens';
import { T } from './Text';

interface Props {
  uri: string;
  /** The rights holder, e.g. 'MOs810 / Wikimedia Commons'. */
  credit?: string;
  /** Accessible name — the dish, not the file. */
  label: string;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  /** Set where a visible credit line already accompanies this image. */
  hideCredit?: boolean;
  resizeMode?: 'cover' | 'contain';
}

// Native applies the blend through the style prop; web through the CSS rule.
const blendStyle = Platform.OS === 'web' ? null : ({ mixBlendMode: 'lighten' } as ImageStyle);

/*
 * One `dataSet`, carrying both hooks.
 *
 * These have to be written as a single object rather than two spreads. `dataSet` is one
 * prop, so a second `{...veilProps}` after `{...blendProps}` would not merge — it would
 * replace, silently removing `data-lighten` and taking the Nocturne blend off every
 * photograph in the app. Nothing would error; the pictures would just stop sitting in the
 * page the way the design intends.
 */
const webHooks = Platform.OS === 'web' ? { dataSet: { lighten: 'true', motion: 'photo-veil' } } : {};

export function Photo({ uri, credit, label, style, imageStyle, hideCredit, resizeMode = 'cover' }: Props) {
  /**
   * Which picture has finished arriving, rather than whether one has.
   *
   * The obvious version is a boolean plus an effect resetting it when `uri` changes, and
   * it is wrong on a rail: cards are reused as a reader scrolls, so a recycled card would
   * show the *previous* dish's photograph at full opacity while the new one loads.
   * Comparing the loaded URL to the current one needs no effect and cannot desynchronise.
   */
  const [loadedUri, setLoadedUri] = useState<string | null>(null);
  const arrived = loadedUri === uri;

  /**
   * Stable identity, and not as a micro-optimisation — the fade does not work without it.
   *
   * `react-native-web`'s `Image` lists its callbacks in the dependency array of the effect
   * that starts the download, and that effect's cleanup *aborts the request*:
   *
   *     }, [uri, requestRef, updateState, onError, onLoad, onLoadEnd, onLoadStart]);
   *
   * So an inline arrow — a new function on every render — makes any re-render of a parent
   * cancel the in-flight load and start a fresh one, repeatedly killing the callback just
   * before it fires. The first attempt at this did exactly that: measured in the browser,
   * all 63 photographs on the front page sat at `opacity: 0` while their `<img>` elements
   * reported `complete: true` — every picture downloaded, decoded, and invisible.
   *
   * Keyed on `uri` because that is the one change that *should* restart the download.
   */
  const onArrived = useCallback(() => setLoadedUri(uri), [uri]);

  // Most imported records have no photograph. An empty frame reads as a broken
  // image; a quiet monogram reads as "we don't have one", which is the truth.
  if (!uri) {
    return (
      <View style={[styles.frame, styles.placeholder, style]} accessibilityLabel={`${label} — no photograph on record`}>
        <T style={styles.monogram}>{label.trim().charAt(0).toUpperCase()}</T>
      </View>
    );
  }

  return (
    <View style={[styles.frame, style]}>
      <Image
        source={{ uri }}
        accessibilityLabel={label}
        accessible
        resizeMode={resizeMode}
        {...webHooks}
        /*
         * `onError` raises the veil too, and deliberately.
         *
         * A photograph that fails to load must not leave an invisible frame behind — the
         * fallback is the broken-image state, which is at least legible as something
         * going wrong. Holding at zero opacity would turn a failed image into a silent
         * blank space, which is the one outcome worse than showing the failure.
         */
        onLoad={onArrived}
        onError={onArrived}
        style={[styles.image, blendStyle, imageStyle, { opacity: arrived ? 1 : 0 }]}
      />
      {credit && !hideCredit ? (
        <View style={styles.creditWrap} pointerEvents="none">
          {/*
            Two lines, not one.
            On a rail card the credit has about 100px to live in, and 30 of the 51 on
            the front page did not fit: "Manuel González Olaechea · CC BY 3.0" was
            rendering as "Manuel González Ola…". Truncating an attribution is worse
            than an untidy one — it credits a photographer by a name they do not have,
            on a field that is a condition of the licence rather than a caption.
            Two lines clears the longest credit in the catalogue with room to spare.
          */}
          <T style={styles.credit} numberOfLines={2}>
            {credit}
          </T>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // Transparent on purpose: the blend needs the real backdrop behind it.
  frame: { overflow: 'hidden', backgroundColor: 'transparent' },
  placeholder: { backgroundColor: color.neutral[900], alignItems: 'center', justifyContent: 'center' },
  monogram: { fontFamily: font.heading, fontSize: 20, color: color.neutral[700] },
  image: { width: '100%', height: '100%' },
  creditWrap: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    // A little more room, since the text may now wrap rather than be cut.
    maxWidth: '92%',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: radius.sm,
    // A ground behind the credit so it stays legible over any photograph.
    backgroundColor: 'rgba(22, 24, 38, 0.72)',
  },
  credit: { fontFamily: font.regular, fontSize: 9, lineHeight: 9 * 1.35, color: 'rgba(233, 233, 237, 0.75)' },
});
