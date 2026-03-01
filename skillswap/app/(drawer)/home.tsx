import { fetchMentors } from "@/services/authService";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";

export default function Home() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Fetch mentors on mount
  useEffect(() => {
    const loadMentors = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchMentors();

        setMentors(data.mentors);
        console.log(mentors); // backend returns { mentors: [...] }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to fetch mentors");
      } finally {
        setLoading(false);
        
      }
    };

    loadMentors();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.welcome}>Welcome back 👋</Text>
        <Text style={styles.subtitle}>
          Search, filter, and connect with mentors
        </Text>

        {/* 🔥 Loading State */}
        {loading && <ActivityIndicator size="large" color="#2563eb" />}

        {/* 🔥 Error State */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* 🔥 Mentor Cards */}
        {!loading &&
          !error &&
          mentors.map((mentor) => (
            <View key={mentor._id} style={styles.card}>
              {/* 🔹 Avatar */}
              {mentor.userId.profileImage ? (
                <Image
                  source={{ uri: mentor.userId.profileImage }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {mentor.userId.username.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}

              {/* 🔹 Name */}
              <Text style={styles.name}>{mentor.userId.username}</Text>

              {/* 🔹 Email */}
              <Text style={styles.email}>{mentor.userId.email}</Text>

              {/* 🔹 Title */}
              <Text style={styles.title}>{mentor.title}</Text>

              {/* 🔹 Experience */}
              <Text style={styles.info}>
                Experience: {mentor.experienceYears} years
              </Text>

              {/* 🔹 Bio */}
              <Text style={styles.bio}>{mentor.bio}</Text>

              {/* 🔹 Skills */}
              <View style={styles.skillContainer}>
                {mentor.skills.map((skill: string, index: number) => (
                  <View key={index} style={styles.skillBadge}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))}

        {/* 🔥 Empty State */}
        {!loading && mentors.length === 0 && (
          <Text style={styles.emptyText}>No mentors available</Text>
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // 🔹 Header Text
  welcome: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
    color: "#111827",
  },

  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },

  // 🔹 Search Bar
  searchInput: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 14,
    color: "#111827",
  },

  // 🔹 Filters
  filterContainer: {
    marginBottom: 20,
  },

  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 20,
    marginRight: 10,
  },

  activeChip: {
    backgroundColor: "#2563eb",
  },

  filterText: {
    fontSize: 12,
    color: "#374151",
  },

  activeText: {
    color: "#ffffff",
  },

  // 🔹 Card
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,

    // Shadow iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,

    // Shadow Android
    elevation: 3,
  },

  // 🔹 Avatar
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  avatarText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },

  // 🔹 Mentor Info
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  email: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 10,
  },

  info: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 8,
  },

  // 🔹 Skills
  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },

  skillBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },

  skillText: {
    fontSize: 12,
    color: "#2563eb",
    fontWeight: "500",
  },

  // 🔹 Button
  button: {
    borderWidth: 1,
    borderColor: "#2563eb",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#2563eb",
    fontWeight: "600",
    fontSize: 14,
  },

  // 🔹 Loading / Error / Empty States
  errorText: {
    color: "#ef4444",
    textAlign: "center",
    marginVertical: 15,
    fontSize: 14,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#6b7280",
    fontSize: 14,
  },
  avatarImage: {
  width: 52,
  height: 52,
  borderRadius: 26,
  marginBottom: 12,
},

title: {
  fontSize: 14,
  fontWeight: "600",
  color: "#2563eb",
  marginBottom: 6,
},

bio: {
  fontSize: 13,
  color: "#4b5563",
  marginBottom: 10,
  lineHeight: 18,
},
});
