import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Account() {
  const router = useRouter();

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
      <Text style={styles.backText}>← Back</Text>
    </TouchableOpacity>
      <Text style={styles.title}>Account Settings</Text>

      <View style={styles.card}>
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => router.push("/screens/edit-profile")}
        >
          <Text style={styles.optionText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={()=>router.push("/screens/changePassword")}
        >
          <Text style={styles.optionText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow} 
          onPress={()=>{router.push("/(drawer)/profile")}}
        >
          <Text style={styles.optionText}>My Skills</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={()=>router.push("/(auth)/register")}>
          <Text style={styles.deleteText} >Delete Account</Text>
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
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },

  optionRow: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  optionText: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
  },

  deleteText: {
    fontSize: 16,
    color: "#ef4444",
    fontWeight: "600",
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