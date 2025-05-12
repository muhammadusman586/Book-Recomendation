import { Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen"; // Ensure this component exists
import { StatusBar } from "react-native";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore"; // Ensure this store is implemented correctly

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const rootNavigation = useRootNavigationState();

  const { checkAuth, user, token } = useAuthStore();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Handle navigation based on authentication state
  useEffect(() => {
    if (!rootNavigation?.key) return; // Wait for layout to mount

    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)"); // Redirect to auth screens if not signed in
    } else if (isSignedIn && inAuthScreen) {
      router.replace("/(tabs)"); // Redirect to tabs if signed in
    }
  }, [user, token, segments, rootNavigation]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Define the main navigation groups */}
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          {/* Fallback route for unmatched paths */}
          <Stack.Screen name="*" options={{ title: "Not Found" }} />
        </Stack>
      </SafeScreen>
      <StatusBar barStyle="dark-content" />
    </SafeAreaProvider>
  );
}