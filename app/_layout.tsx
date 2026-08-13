/**
 * Root layout.
 *
 * Navigation is a plain stack with no modals, matching the design: back always
 * returns to the sensible parent, and transitions are the platform's standard
 * push/pop — the handoff specifies no animations of its own.
 */

// Imported by exact weight, not from the package root. The root index re-exports
// every Inter weight and italic, and the bundler follows all of them into the build
// — about 6 MB of fonts for the four faces this design actually uses.
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { useFonts } from 'expo-font';
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
