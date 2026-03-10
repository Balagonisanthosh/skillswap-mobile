import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { api } from "../services/api";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  mentorStatus: string;
  profileImage: string | null;
  skillsYouKnown: string[];
  skillsYouWantToLearn: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  // 🔐 LOGIN
  login: async (user, token) => {
    await SecureStore.setItemAsync("authToken", token);

    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  // 🚪 LOGOUT
  logout: async () => {
    await SecureStore.deleteItemAsync("authToken");

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  // 🔄 LOAD TOKEN WHEN APP STARTS
  loadToken: async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");

      if (!token) {
        set({ isLoading: false });
        return;
      }

      set({
        token,
        isAuthenticated: true,
      });

      try {
        await useAuthStore.getState().fetchProfile();
      } catch (err: any) {
        if (err.response?.status === 401) {
          console.log("Refreshing access token...");

          const res = await api.post("/auth/refresh");

          const newAccessToken = res.data.accessToken;

          await SecureStore.setItemAsync("authToken", newAccessToken);

          set({
            token: newAccessToken,
            isAuthenticated: true,
          });

          await useAuthStore.getState().fetchProfile();
        }
      }
    } catch (error) {
      console.log("Token load error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 👤 FETCH USER PROFILE
  fetchProfile: async () => {
    try {
      const res = await api.get("/auth/profile");

      set({
        user: res.data.user,
        isAuthenticated: true,
      });
    } catch (error) {
      console.log("Profile fetch failed:", error);
      throw error; // important
    }
  },

  // 🔄 UPDATE USER
  updateUser: (user) => {
    set({ user });
  },
}));
