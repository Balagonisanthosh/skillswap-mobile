import { Stack } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuthStore } from "../store/AuthStore";

export default function RootLayout() {
  const { loadToken, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    loadToken();
  }, []);

  // Show loader while checking token
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
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