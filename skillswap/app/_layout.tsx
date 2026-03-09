import { Stack } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../store/AuthStore";
export default function RootLayout() {
  const { loadToken, isAuthenticated, isLoading } = useAuthStore();
  useEffect(() => {
    loadToken();
  }, []);
  if (isLoading) return null;
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {" "}
      {isAuthenticated ? (
        <Stack.Screen name="(drawer)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}{" "}
    </Stack>
  );
}
