/**
 * Root layout.
 *
 * Navigation is a plain stack with no modals, matching the design: back always
 * returns to the sensible parent, and transitions are the platform's standard
 * push/pop — the handoff specifies no animations of its own.
 */

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { color } from '../src/theme/tokens';
import { installWebStyles } from '../src/theme/webStyles';

// The two Nocturne behaviours that need real CSS on web: the page ground, and the
// `.lighten` blend on photographs. No-op on native.
installWebStyles();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Hold on the ground colour rather than flashing an unstyled screen; the type
  // scale is meaningless until Inter is in.
  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: color.bg }} />;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: color.bg },
          animation: 'default',
        }}
      />
    </SafeAreaProvider>
  );
}
