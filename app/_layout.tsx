import 'react-native-gesture-handler';

import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalProvider } from '@gorhom/portal';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetManagerProvider } from '@/context/bottomsheet-manager/BottomSheetManagerProvider';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetManagerProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
              <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="+not-found" />
              </Stack>
              <PortalHost />
            </ThemeProvider>
          </QueryClientProvider>
      </BottomSheetManagerProvider>
    </GestureHandlerRootView>
  );
}
