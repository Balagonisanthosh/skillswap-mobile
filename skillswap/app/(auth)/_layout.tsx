import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function AuthLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#0808EE" />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_bottom",
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </>
  );
}