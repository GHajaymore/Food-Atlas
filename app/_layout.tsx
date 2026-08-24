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
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FeedSkeleton } from '../src/components/FeedSkeleton';
import { TopBar } from '../src/components/TopBar';
import { loadCatalogue } from '../src/data/catalogue';
import { watchForExit } from '../src/data/events';
import { useCopy } from '../src/i18n';
import { color, font } from '../src/theme/tokens';
import { installWebStyles } from '../src/theme/webStyles';

// The two Nocturne behaviours that need real CSS on web: the page ground, and the
// `.lighten` blend on photographs. No-op on native.
installWebStyles();

// Send whatever is buffered when the page is hidden. Mobile browsers frequently never
// fire an unload event at all, so without this a reader who switches apps and does not
// come back loses the tail of their session — which on a phone is most sessions.
watchForExit();

export default function RootLayout() {
  const copy = useCopy();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  /**
   * The catalogue is fetched rather than bundled, so it has to arrive before a
   * route renders.
   *
   * This is the whole reason every screen can go on reading `catalogue` as a plain
   * array: the wait happens once, here, instead of a loading branch in each of the
   * seven places that read it.
   */
  const [dataState, setDataState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    loadCatalogue().then(
      () => setDataState('ready'),
      (reason: Error) => {
        setError(reason.message);
        setDataState('failed');
      },
    );
  }, []);

  /*
   * One appearance for the whole wait, rather than three.
   *
   * This used to hold on a bare dark rectangle until Inter arrived, then swap to a
   * spinner until sixteen megabytes of JSON had downloaded and been built, then show the
   * entire page at once. Three states, two of which said nothing at all.
   *
   * The skeleton covers both waits and grows into the page: shapes while the fonts land,
   * then the real wordmark, tagline and headline the moment they can be set properly —
   * none of which needs a byte of the catalogue. A reader has something true to read in a
   * few hundred milliseconds instead of a spinner for several seconds.
   */
  if (!fontsLoaded) return <FeedSkeleton fonts={false} />;

  // Said plainly rather than left as an empty atlas. A reader who sees no
  // traditions should be told the data did not arrive, not left to conclude there
  // are none.
  if (dataState === 'failed') {
    return (
      <View style={styles.centre}>
        <Text style={styles.failedTitle}>{copy.couldNotLoad}</Text>
        <Text style={styles.failedNote}>{error}</Text>
      </View>
    );
  }

  if (dataState === 'loading') return <FeedSkeleton fonts />;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {/*
       * Above the stack rather than inside a screen, so the masthead does not remount
       * on every navigation and stays put while the page under it changes — which is
       * most of what makes a set of screens read as one site rather than a sequence of
       * them. Renders nothing below the tablet breakpoint.
       */}
      <TopBar />
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

const styles = StyleSheet.create({
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: color.bg, padding: 32 },
  failedTitle: { fontFamily: font.heading, fontSize: 16, color: color.neutral[100], textAlign: 'center' },
  failedNote: { fontFamily: font.regular, fontSize: 12, color: color.neutral[400], textAlign: 'center' },
});
