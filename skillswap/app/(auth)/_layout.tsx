import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";


export default function AuthLayout() {
  return (
    <>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#0808EE" }}>

      <StatusBar style="light" backgroundColor="#0808EE" translucent={false} />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_bottom",
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
      </SafeAreaView>
    </>
  );
}