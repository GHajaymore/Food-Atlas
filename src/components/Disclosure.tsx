/**
 * A collapsed disclosure — the platform equivalent of the prototype's `<details>`.
 *
 * Used for "If the traditional ingredient is unavailable". It stays collapsed by
 * default on purpose: the adaptation is a secondary layer, and opening it is a
 * deliberate act by the reader. The contents are never merged into the authentic
 * ingredient list above it.
 */

import { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, UIManager, View, type StyleProp, type ViewStyle } from 'react-native';
import { color, font, radius, space, TAP_TARGET } from '../theme/tokens';
import { CaretDownIcon } from './icons';
import { Pressable } from './Pressable';
import { T } from './Text';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/*
 * The caret turns over 180ms on web instead of snapping.
 *
 * Worth knowing what this does *not* fix: `LayoutAnimation` is a no-op on
 * react-native-web, so the body below still appears instantly rather than expanding.
 * Animating that properly needs a measured height and is a larger change; the caret is
 * the part a reader is actually looking at when they press, and it is the affordance that
 * tells them the press registered.
 */
const caretMotion: object = Platform.OS === 'web' ? { dataSet: { motion: 'caret' } } : {};

export function Disclosure({
  summary,
  children,
  style,
}: {
  summary: string;
  children: React.ReactNode;
  /** Lets a caller drop the default bottom margin where it stacks with its own. */
  style?: StyleProp<ViewStyle>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={[styles.wrap, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        tint="neutral"
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setOpen((v) => !v);
        }}
        style={styles.summary}
      >
        <T style={styles.summaryText}>{summary}</T>
        {/* Spread, because `dataSet` is a react-native-web extension the RN types do not
            carry — the same resolution `Photo` uses for its blend. It only supplies the
            duration; `caretOpen` below still does the rotating. */}
        <View {...caretMotion} style={open ? styles.caretOpen : undefined}>
          <CaretDownIcon size={14} color={color.neutral[400]} />
        </View>
      </Pressable>
      {open ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderColor: color.divider,
    borderRadius: radius.md,
    padding: space[3],
    marginBottom: 20,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[2],
    // TAP_TARGET. The summary row is the only way to open the adaptation, and at 28px
    // it was the smallest control on the record.
    minHeight: TAP_TARGET,
  },
  summaryText: { fontFamily: font.heading, fontSize: 14, flex: 1 },
  caretOpen: { transform: [{ rotate: '180deg' }] },
  body: { marginTop: 12 },
});
