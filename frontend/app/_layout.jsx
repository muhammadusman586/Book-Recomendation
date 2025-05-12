import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen  from "../components/SafeScreen";
import { StatusBar } from "react-native";
import { use, useEffect } from "react";
import { useAuthStore } from '../store/authStore'; // ✅ this path assumes store is inside mobile/

import { useRouter, useSegments } from "expo-router";

export default function RootLayout() {

  const router = useRouter();
  const segments = useSegments();

  const { checkAuth, user, token } = useAuthStore();

  useEffect(() => 
  {
    checkAuth();
  }, []);  

  //handle the navigation based on the auth state
  useEffect(() => {
    const inAuthScreen = segments[0] === "(auth)";
    const isSignedin = user && token;
    if(!isSignedin && !inAuthScreen) {
      router.replace("/(auth)");
    }
    else if(isSignedin && inAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [user, token, segments]);


  return (
  <SafeAreaProvider>
    <SafeScreen>
    <Stack screenOptions={{ headerShown: false }} >
      <Stack.Screen name="(tabs)"  />
      <Stack.Screen name="(auth)"  />
    </Stack>
    </SafeScreen>
    <StatusBar barStyle = "dark-content"/>
  </SafeAreaProvider>
  );
}
