/**
 * A collapsed disclosure — the platform equivalent of the prototype's `<details>`.
 *
 * Used for "If the traditional ingredient is unavailable". It stays collapsed by
 * default on purpose: the adaptation is a secondary layer, and opening it is a
 * deliberate act by the reader. The contents are never merged into the authentic
 * ingredient list above it.
 */

import { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, UIManager, View } from 'react-native';
import { color, font, radius, space } from '../theme/tokens';
import { CaretDownIcon } from './icons';
import { Pressable } from './Pressable';
import { T } from './Text';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function Disclosure({ summary, children }: { summary: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrap}>
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
        <View style={open ? styles.caretOpen : undefined}>
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
    minHeight: 28,
  },
  summaryText: { fontFamily: font.heading, fontSize: 14, flex: 1 },
  caretOpen: { transform: [{ rotate: '180deg' }] },
  body: { marginTop: 12 },
});
