/**
 * .field and .input — form fields.
 *
 * The focus ring is the design system's, never the platform default: 2px accent.
 * On a text input that reads as the border switching to the accent colour, which is
 * what `.input:focus-visible` does in the stylesheet.
 */

import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
import { color, font, radius, TAP_TARGET } from '../theme/tokens';
import { T } from './Text';

interface InputProps extends TextInputProps {
  style?: ViewStyle;
  multiline?: boolean;
}

export function Input({ style, multiline, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      placeholderTextColor={color.muted}
      selectionColor={color.accent}
      cursorColor={color.accent}
      multiline={multiline}
      {...props}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
      style={[
        styles.input,
        multiline ? styles.multiline : null,
        focused ? { borderColor: color.accent } : null,
        style,
      ]}
    />
  );
}

export function Field({
  label,
  children,
  style,
}: {
  label: string;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={style}>
      <T style={styles.label}>{label}</T>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    minHeight: TAP_TARGET,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontFamily: font.regular,
    fontSize: 14,
    color: color.text,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.divider,
    borderRadius: radius.md,
  },
  multiline: { minHeight: 90, textAlignVertical: 'top', paddingTop: 10 },
  label: {
    fontFamily: font.regular,
    fontSize: 12,
    marginBottom: 5,
    color: 'rgba(233, 233, 237, 0.7)',
  },
});
