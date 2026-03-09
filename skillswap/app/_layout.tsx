import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import SplashAnimation from "./components/AnimationSplash";

export default function RootLayout() {
  const { loadToken, isAuthenticated, isLoading } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    loadToken();
  }, []);

  if (showSplash) {
    return <SplashAnimation onFinish={() => setShowSplash(false)} />;
  }

  if (isLoading) return null;

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