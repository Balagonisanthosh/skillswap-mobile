import { useAuthStore } from "@/store/AuthStore";
import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { updateProfile } from "@/services/authService";

export default function EditProfile() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [skillsKnown, setSkillsKnown] = useState(
    user?.skillsYouKnown?.join(", ") || ""
  );
  const [skillsLearn, setSkillsLearn] = useState(
    user?.skillsYouWantToLearn?.join(", ") || ""
  );
  const [image, setImage] = useState<string | null>(
    user?.profileImage || null
  );
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Allow access to gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      if (!user) return;

      setLoading(true);

      const formData = new FormData();

      formData.append("username", username);
      formData.append("email", email);

      formData.append(
        "skillsYouKnown",
        JSON.stringify(
          skillsKnown
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        )
      );

      formData.append(
        "skillsYouWantToLearn",
        JSON.stringify(
          skillsLearn
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        )
      );

      // 👇 must match multer field name: upload.single("photo")
      if (image && image !== user.profileImage) {
        const fileType = image.split(".").pop() || "jpg";

        formData.append("photo", {
          uri: image,
          type: `image/${fileType}`,
          name: `profile.${fileType}`,
        } as any);
      }

      const response = await updateProfile(formData);

      // assuming backend returns updated user
      updateUser(response.user);

      Alert.alert("Success", "Profile updated successfully ✅");
      router.back();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Profile update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TouchableOpacity onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>
              {username.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.changePhoto}>Change Photo</Text>
      </TouchableOpacity>

      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholder="Username"
      />

      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
      />

      <TextInput
        value={skillsKnown}
        onChangeText={setSkillsKnown}
        style={styles.input}
        placeholder="Skills You Know (comma separated)"
      />

      <TextInput
        value={skillsLearn}
        onChangeText={setSkillsLearn}
        style={styles.input}
        placeholder="Skills You Want To Learn (comma separated)"
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Saving..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#f8fafc",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#111827",
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#2563eb",
  },

  avatarFallback: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
  },

  avatarText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#ffffff",
  },

  changePhoto: {
    textAlign: "center",
    color: "#2563eb",
    fontSize: 14,
    marginBottom: 25,
    fontWeight: "500",
  },

  input: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 15,
    color: "#111827",
  },

  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});