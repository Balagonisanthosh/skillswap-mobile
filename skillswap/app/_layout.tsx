import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#0A84FF" />  {/* light text */}
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}