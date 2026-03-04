import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { api } from "@/services/api";

export default function MentorRequestForm() {
  const [videoName, setVideoName] = useState("No file chosen");
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const fileName = uri.split("/").pop();

      setVideoUri(uri);
      setVideoName(fileName || "Video selected");
    }
  };

  const handleCancel = () => {
    setLinkedinUrl("");
    setVideoName("No file chosen");
    setVideoUri(null);
    router.back();
  };

  const handleSubmit = async () => {
    try {
      if (!linkedinUrl || !videoUri) {
        alert("Please provide LinkedIn URL and video");
        return;
      }

      setLoading(true);

      const formData = new FormData();

      formData.append("linkedInURL", linkedinUrl);

      formData.append("uploadVideo", {
        uri: videoUri,
        name: videoName,
        type: "video/*",
      } as any);

      await api.post("/auth/user/applyMentor", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Mentor request submitted successfully");

      router.back();
    } catch (error: any) {
      console.log("STATUS:", error?.response?.status);
      console.log("DATA:", error?.response?.data);
      console.log("FULL ERROR:", error);

      alert(error?.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mentor Request Form</Text>

      <View style={styles.cardContainer}>
        <Text style={styles.label}>LinkedIn URL</Text>

        <TextInput
          placeholder="Enter your LinkedIn profile URL"
          style={styles.textInput}
          placeholderTextColor="#888"
          value={linkedinUrl}
          onChangeText={setLinkedinUrl}
        />

        <Text style={styles.label}>Upload Demo Video</Text>

        <View style={styles.fileRow}>
          <TouchableOpacity style={styles.fileButton} onPress={pickVideo}>
            <Text style={styles.fileButtonText}>Select Video</Text>
          </TouchableOpacity>

          <Text style={styles.fileName}>{videoName}</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={loading}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  cardContainer: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },

  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 15,
    fontWeight: "500",
    color: "#333",
  },

  textInput: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: "#fafafa",
  },

  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  fileButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
  },

  fileButtonText: {
    fontWeight: "500",
    color: "#333",
  },

  fileName: {
    marginLeft: 12,
    color: "#555",
    flexShrink: 1,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: "#e5e5e5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },

  cancelText: {
    color: "#333",
    fontWeight: "500",
  },

  submitButton: {
    flex: 1,
    backgroundColor: "#4a6cf7",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  submitText: {
    color: "#fff",
    fontWeight: "600",
  },
});
