import { Drawer } from "expo-router/drawer";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useAuthStore } from "@/store/AuthStore";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function DrawerLayout() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  return (
    <>
    <StatusBar style="light" backgroundColor="#0808EE" />
    <Drawer
      screenOptions={{
        headerTitleAlign: "left",
        headerStyle: styles.header,
        headerShadowVisible: false,
        headerTitleContainerStyle: styles.headerTitleContainer,

        // 🔥 Proper Brand Layout
        headerTitle: () => (
          <View style={styles.brandWrapper}>
            <Text style={styles.brandText}>SkillSwap</Text>
          </View>
        ),

        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push("/profile")}
            style={styles.avatarWrapper}
            activeOpacity={0.7}
          >
            {user?.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ),
      }}
    />
    </>
  );
}

const styles = StyleSheet.create({
  // 🔹 Header
  header: {
    backgroundColor: "#ffffff",
    height: Platform.OS === "android" ? 105 : 90,
  },

  headerTitleContainer: {
    paddingLeft: 8,
  },

  // 🔹 Brand Section
  brandWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandIcon: {
    width: 26,  // smaller, sharp
    height: 26,
    resizeMode: "contain",
    marginRight: 8,
  },

  brandText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2563eb",
    letterSpacing: 0.5,
  },

  // 🔹 Avatar
  avatarWrapper: {
    marginRight: 15,
  },

  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },

  avatarFallback: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});