import { fetchMentors } from "@/services/authService";
import { useAuthStore } from "@/store/AuthStore";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
} from "react-native";

export default function Home() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const loadMentors = async () => {
      try {
        setLoading(true);
        const data = await fetchMentors();
        setMentors(data.mentors);
        setFilteredMentors(data.mentors);
      } catch (err: any) {
        setError("Failed to fetch mentors");
      } finally {
        setLoading(false);
      }
    };

    loadMentors();
  }, []);

  // 🔹 Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setFilteredMentors(mentors);
      return;
    }

    const query = debouncedSearch.toLowerCase();

    const filtered = mentors.filter((mentor) => {
      return (
        mentor.userId.username.toLowerCase().includes(query) ||
        mentor.title.toLowerCase().includes(query) ||
        mentor.skills.join(" ").toLowerCase().includes(query)
      );
    });

    setFilteredMentors(filtered);
  }, [debouncedSearch, mentors]);

  const renderMentor = ({ item }: any) => (
    <View style={styles.card}>
      {item.userId.profileImage ? (
        <Image
          source={{ uri: item.userId.profileImage }}
          style={styles.avatarImage}
        />
      ) : (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.userId.username.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.userId.username}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.experience}>
          {item.experienceYears} yrs experience
        </Text>

        <View style={styles.skillContainer}>
          {item.skills.slice(0, 3).map((skill: string, index: number) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Connect</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greetingText}>
        Welcome back,{" "}
        <Text style={styles.username}>
          {user?.username || "User"}
        </Text>{" "}
        👋
      </Text>

      <Text style={styles.welcome}>Find Your Mentor</Text>

      <TextInput
        placeholder="Search mentors..."
        placeholderTextColor="#9ca3af"
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />

      {filteredMentors.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No mentors found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMentors}
          keyExtractor={(item) => item._id}
          renderItem={renderMentor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
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

  greetingText: {
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 5,
  },

  username: {
    color: "#2563eb",
    fontWeight: "600",
  },

  welcome: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 15,
    color: "#111827",
  },

  searchInput: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 14,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  avatarImage: {
    width: 65,
    height: 65,
    borderRadius: 32,
  },

  avatar: {
    width: 65,
    height: 65,
    borderRadius: 32,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },

  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },

  title: {
    fontSize: 14,
    color: "#2563eb",
    marginTop: 4,
  },

  experience: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },

  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
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
  },

  button: {
    marginTop: 10,
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    color: "#ef4444",
    fontSize: 14,
  },

  emptyText: {
    color: "#6b7280",
    fontSize: 14,
  },
});