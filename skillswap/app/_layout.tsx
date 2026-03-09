import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import * as SplashScreen from "expo-splash-screen";
import AnimatedSplash from "./components/AnimationSplash";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { loadToken, isAuthenticated } = useAuthStore();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      await loadToken();

      // show animation for 1.2s
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setAppReady(true);
      await SplashScreen.hideAsync();
    };

    prepare();
  }, []);

  if (!appReady) {
    return <AnimatedSplash />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="(drawer)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}