import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
export default function Privacy() {
  const [isProfilePublic, setIsProfilePublic] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [allowMessages, setAllowMessages] = useState(true);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Privacy Settings</Text>

      <View style={styles.card}>
        {/* Profile Visibility */}
        <View style={styles.row}>
          <Text style={styles.option}>Public Profile</Text>
          <Switch value={isProfilePublic} onValueChange={setIsProfilePublic} />
        </View>

        {/* Show Email */}
        <View style={styles.row}>
          <Text style={styles.option}>Show Email on Profile</Text>
          <Switch value={showEmail} onValueChange={setShowEmail} />
        </View>

        {/* Allow Messages */}
        <View style={styles.row}>
          <Text style={styles.option}>Allow Messages</Text>
          <Switch value={allowMessages} onValueChange={setAllowMessages} />
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.dangerCard}>
        <TouchableOpacity>
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  option: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
  },

  dangerCard: {
    marginTop: 30,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fee2e2",
  },

  deleteText: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  backText: {
    fontSize: 16,
    marginLeft: 6,  
    color: "#111827",
    fontWeight: "500",
  },
});
