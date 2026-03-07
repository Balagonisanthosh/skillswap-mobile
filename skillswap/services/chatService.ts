import { api } from "./api";

export const chatService = {
  getMyConversations: async () => {
    const response = await api.get("/chat/conversations");
    return response.data;
  },
  getMessages: async (conversationId: string) => {
    const response = await api.get(`/chat/messages/${conversationId}`);
    return response.data;
  },
  createConversation: async (receiverId: string) => {
    const response = await api.post("/chat/conversation", { receiverId });
    return response.data;
  },
  sendMessage: async (conversationId: string, text: string) => {
    const response = await api.post("/chat/message", { conversationId, text });
    return response.data;
  }
};
