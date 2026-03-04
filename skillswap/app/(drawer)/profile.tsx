import { useAuthStore } from "@/store/AuthStore";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No user data available</Text>
      </View>
    );
  }

  const firstLetter = user.username?.charAt(0).toUpperCase();

  const handleMentorRequest = () => {
    setLoading(true);

    // simulate small delay so loader is visible
    setTimeout(() => {
      router.push("/screens/mentorRequestForm");
      setLoading(false);
    }, 300);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Avatar */}
        {user.profileImage ? (
          <Image source={{ uri: user.profileImage }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>{firstLetter}</Text>
          </View>
        )}

        {/* Username */}
        <Text style={styles.title}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>

        {/* Skills Known */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills You Know</Text>
          {user.skillsYouKnown?.map((skill, index) => (
            <Text key={index} style={styles.skillItem}>
              • {skill}
            </Text>
          ))}
        </View>

        {/* Skills To Learn */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills You Want To Learn</Text>
          {user.skillsYouWantToLearn?.map((skill, index) => (
            <Text key={index} style={styles.skillItem}>
              • {skill}
            </Text>
          ))}
        </View>

        {/* Mentor Button */}
        {user.role !== "mentor" ? (
          <TouchableOpacity
            style={styles.mentorButton}
            onPress={handleMentorRequest}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.mentorButtonText}>Request as Mentor</Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.alreadyMentor}>
            <Text style={styles.alreadyMentorText}>
              You are already a mentor
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Profile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    padding: 24,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    elevation: 6,
    alignItems: "center",
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },

  avatarFallback: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  avatarText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },

  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },

  section: {
    width: "100%",
    marginTop: 15,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },

  skillItem: {
    fontSize: 14,
    color: "#444",
    marginBottom: 2,
  },

  mentorButton: {
    marginTop: 25,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },

  mentorButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },

  alreadyMentor: {
    marginTop: 20,
    paddingVertical: 10,
  },

  alreadyMentorText: {
    color: "#16a34a",
    fontWeight: "600",
    fontSize: 18,
  },
});