import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import * as SecureStore from "expo-secure-store";

interface ChatState {
  socket: Socket | null;
  onlineUsers: string[];
  connectSocket: () => Promise<void>;
  disconnectSocket: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  onlineUsers: [],
  connectSocket: async () => {
    const { socket } = get();
    if (socket?.connected) return;

    const token = await SecureStore.getItemAsync("authToken");
    if (!token) return;

    // Use the backend URL provided in the API configuration
    const newSocket = io("http://10.159.208.168:3000", {
      auth: { token },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    set({ socket: newSocket });
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
