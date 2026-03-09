import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ExploreScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons name="compass-outline" size={70} color="#2563eb" />
        <Text style={styles.title}>Explore Skills</Text>
        <Text style={styles.subtitle}>
          Discover people who can teach the skills you want to learn.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Find Developers</Text>
        <Text style={styles.cardText}>
          Connect with developers who know React, Node, and more.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Learn Design</Text>
        <Text style={styles.cardText}>
          Find designers willing to exchange skills.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>SkillSwap Community</Text>
        <Text style={styles.cardText}>
          Grow your network and learn faster by teaching others.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 10,
    color: "#111827",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    color: "#6b7280",
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },

  cardText: {
    fontSize: 14,
    color: "#6b7280",
  },
});