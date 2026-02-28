import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import { registerUser } from "@/services/authService";
export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [knownSkillInput, setKnownSkillInput] = useState("");
  const [learnSkillInput, setLearnSkillInput] = useState("");
  const [knownSkills, setKnownSkills] = useState<string[]>([]);
  const [learnSkills, setLearnSkills] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const addKnownSkill = () => {
    if (knownSkillInput.trim() === "") return;

    setKnownSkills([...knownSkills, knownSkillInput.trim()]);
    setKnownSkillInput("");
  };

  const addLearnSkill = () => {
    if (learnSkillInput.trim() === "") return;

    setLearnSkills([...learnSkills, learnSkillInput.trim()]);
    setLearnSkillInput("");
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const router = useRouter();

  const handleRegister = async () => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("skillsYouKnown", JSON.stringify(knownSkills));
      formData.append("skillsYouWantToLearn", JSON.stringify(learnSkills));
      if (profileImage) {
        const fileType = profileImage.split(".").pop();
        formData.append("profileImage", {
          uri: profileImage,
          type: `image/${fileType}`,
          name: `profile.${fileType}`,
        } as any);
      }
      await registerUser(formData);
      alert("register success..");

      router.push("/(auth)/login");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      alert(message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <View style={styles.uploadRow}>
        <Text style={styles.uploadLabel}>Upload Profile Image</Text>

        <TouchableOpacity style={styles.fileButton} onPress={pickImage}>
          <Text style={styles.fileButtonText}>
            {profileImage ? "Change File" : "Choose File"}
          </Text>
        </TouchableOpacity>
      </View>

      {profileImage && <Text style={styles.fileName}>Selected ✓</Text>}
      <TextInput
        placeholder="Type skills your known and press enter"
        value={knownSkillInput}
        onChangeText={setKnownSkillInput}
        returnKeyType="done"
        onSubmitEditing={addKnownSkill}
        style={styles.input}
      />
      <View style={styles.skillContainer}>
        {knownSkills.map((skill, index) => (
          <TouchableOpacity
            key={index}
            style={styles.skillTag}
            onPress={() =>
              setKnownSkills(knownSkills.filter((_, i) => i !== index))
            }
          >
            <Text style={styles.skillText}>{skill} ✕</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Type skills your want to learn and press enter"
        value={learnSkillInput}
        onChangeText={setLearnSkillInput}
        onSubmitEditing={addLearnSkill}
        returnKeyType="done"
        style={styles.input}
      />
      <View style={styles.skillContainer}>
        {learnSkills.map((skill, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.skillTag, { backgroundColor: "#16a34a" }]}
            onPress={() =>
              setLearnSkills(learnSkills.filter((_, i) => i !== index))
            }
          >
            <Text style={styles.skillText}>{skill} ✕</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => router.push("/(auth)/login")}
      >
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#ffffff",
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    textAlign: "center",
    color: "#2563eb",
    fontSize: 14,
  },
  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  skillTag: {
    backgroundColor: "#2563eb",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  skillText: {
    color: "#ffffff",
    fontSize: 14,
  },
  uploadRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  uploadLabel: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "500",
  },

  fileButton: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },

  fileButtonText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },

  fileName: {
    fontSize: 13,
    color: "#16a34a",
    marginBottom: 10,
  },
});
