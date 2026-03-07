import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { chatService } from "../../services/chatService";
import { useAuthStore } from "../../store/AuthStore";
import { useChatStore } from "../../store/ChatStore";

export default function ChatListScreen() {
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const { connectSocket } = useChatStore();

  useEffect(() => {
    connectSocket();
  }, []);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const data = await chatService.getMyConversations();
      setConversations(data);
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    let otherParticipant = null;
    if (item.participants && user) {
      otherParticipant = item.participants.find((p: any) => p._id !== user?._id);
    }
    const lastMessage = item.lastMessage;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.itemContainer}
        onPress={() => router.push(`/screens/chatScreen?conversationId=${item._id}&receiverId=${otherParticipant?._id}&receiverName=${otherParticipant?.username}`)}
      >
        <Image
          source={{ uri: otherParticipant?.profileImage || "https://ui-avatars.com/api/?name=" + (otherParticipant?.username || "A") + "&background=random" }}
          style={styles.avatar}
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{otherParticipant?.username || "Unknown"}</Text>
          <Text style={styles.itemMessage} numberOfLines={1}>
            {lastMessage ? `${lastMessage.senderId?.username === user?.username ? 'You: ' : ''}${lastMessage.text}` : "Tap to start chatting"}
          </Text>
        </View>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
         <Text style={styles.headerTitle}>Messages</Text>
      </View>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>💬</Text>
            </View>
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySubtitle}>Start a conversation to connect!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  headerTitle: { fontSize: 30, fontWeight: "800", color: "#0f172a", letterSpacing: -0.5 },
  listContent: { paddingBottom: 20 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 128 },
  emptyIconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#f1f5f9", alignItems: "center", justifyContent: "center", marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  emptyIcon: { fontSize: 36 },
  emptyTitle: { color: "#64748b", fontSize: 18, fontWeight: "500" },
  emptySubtitle: { color: "#94a3b8", fontSize: 14, marginTop: 4 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc" },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 16, backgroundColor: "#e2e8f0" },
  itemInfo: { flex: 1, justifyContent: "center" },
  itemName: { fontSize: 17, fontWeight: "600", color: "#1e293b", marginBottom: 4 },
  itemMessage: { color: "#64748b", fontSize: 14 },
  unreadBadge: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadText: { color: "#ffffff", fontSize: 12, fontWeight: "bold" },
});
