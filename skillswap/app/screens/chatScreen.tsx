import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { chatService } from "../../services/chatService";
import { useAuthStore } from "../../store/AuthStore";
import { useChatStore } from "../../store/ChatStore";

export default function ChatScreen() {
  const { conversationId, receiverId, receiverName } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const { socket, connectSocket } = useChatStore();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    connectSocket();
  }, []);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
      if (socket) {
        socket.emit("joinRoom", conversationId);
        socket.emit("messagesRead", { conversationId, readerId: user?._id });
      }
    } else if (receiverId) {
      createAndFetchConversation();
    }
  }, [conversationId, socket]);

  useEffect(() => {
    if (!socket) return;
    
    const handleReceiveMessage = (newMessage: any) => {
      if (newMessage.conversationId === conversationId) {
        setMessages((prev) => [...prev, newMessage]);
        socket.emit("messagesRead", { conversationId, readerId: user?._id });
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, conversationId, user]);

  const createAndFetchConversation = async () => {
    setLoading(true);
    try {
      const conv = await chatService.createConversation(receiverId as string);
      router.setParams({ conversationId: conv._id }); // Update params
      // Let the dependency arrays fetch messages and join room respectively.
    } catch (error) {
      console.error("Failed to create conversation", error);
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const data = await chatService.getMessages(conversationId as string);
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 200);
    }
  };

  const handleSend = async () => {
    if (!text.trim() || !conversationId) return;

    const messageText = text;
    setText("");

    if (socket) {
      socket.emit("sendMessage", { conversationId, text: messageText });
    } else {
      // API fallback
      try {
        const newMessage = await chatService.sendMessage(conversationId as string, messageText);
        setMessages((prev) => [...prev, newMessage]);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isMe = item.senderId?._id === user?._id || item.senderId === user?._id;
    return (
      <View style={isMe ? styles.messageBubbleMine : styles.messageBubbleTheirs}>
        <Text style={isMe ? styles.messageTextMine : styles.messageTextTheirs}>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#334155" />
          </TouchableOpacity>
          <View style={styles.headerUserContainer}>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>{(receiverName as string)?.charAt(0)?.toUpperCase() || "C"}</Text>
            </View>
            <View>
              <Text style={styles.headerNameText}>{receiverName || "Chat"}</Text>
            </View>
          </View>
        </View>

        {/* Messages */}
        <View style={styles.messagesContainer}>
          {loading ? (
             <ActivityIndicator size="large" color="#6366f1" style={styles.loadingIndicator} />
          ) : (
             <FlatList
               ref={flatListRef}
               data={messages}
               keyExtractor={(item, index) => item._id || String(index)}
               renderItem={renderItem}
               showsVerticalScrollIndicator={false}
               contentContainerStyle={styles.messagesListContent}
               onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
               onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
             />
          )}
        </View>

        {/* Input Block */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="add" size={26} color="#64748b" />
          </TouchableOpacity>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Message..."
              value={text}
              onChangeText={setText}
              placeholderTextColor="#94a3b8"
              multiline
            />
          </View>
          {text.trim().length > 0 ? (
            <TouchableOpacity onPress={handleSend} style={styles.sendBtn} activeOpacity={0.8}>
              <Ionicons name="send" size={16} color="#fff" style={styles.sendBtnIcon} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.micBtn}>
               <Ionicons name="mic-outline" size={24} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8fafc" },
  keyboardAvoidingView: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    paddingTop: 48,
    zIndex: 10,
  },
  backButton: { marginRight: 12, width: 40, height: 40, backgroundColor: "#f8fafc", alignItems: "center", justifyContent: "center", borderRadius: 20 },
  headerUserContainer: { flex: 1, flexDirection: "row", alignItems: "center" },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#e0e7ff", alignItems: "center", justifyContent: "center", marginRight: 12 },
  headerAvatarText: { color: "#4f46e5", fontWeight: "bold", fontSize: 18 },
  headerNameText: { fontSize: 18, fontWeight: "bold", color: "#0f172a" },
  messagesContainer: { flex: 1, paddingHorizontal: 16 },
  loadingIndicator: { marginTop: 40 },
  messagesListContent: { paddingVertical: 20, paddingBottom: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 5,
  },
  attachBtn: { marginRight: 12, padding: 8, marginBottom: 4 },
  textInputWrapper: {
    flex: 1,
    backgroundColor: "rgba(241, 245, 249, 0.8)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.6)",
    minHeight: 44,
  },
  textInput: { flex: 1, fontSize: 15, color: "#1e293b", maxHeight: 96, paddingTop: 0, paddingBottom: 0 },
  sendBtn: {
    marginLeft: 12,
    backgroundColor: "#6366f1",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 2,
  },
  micBtn: {
    marginLeft: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    marginBottom: 2,
  },
  sendBtnIcon: { marginLeft: 3 },
  messageBubbleMine: {
    marginVertical: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: "#6366f1",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  messageBubbleTheirs: {
    marginVertical: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  messageTextMine: { color: "#ffffff", fontSize: 15, lineHeight: 24 },
  messageTextTheirs: { color: "#1e293b", fontSize: 15, lineHeight: 24 },
});
