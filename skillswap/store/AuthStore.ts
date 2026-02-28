import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

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
  updateUser: (user: User) => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  // 🔐 Login
  login: async (user, token) => {
    await SecureStore.setItemAsync("authToken", token);

    set({
      user,
      token,
      isAuthenticated: true,
    });
  },


  logout: async () => {
    await SecureStore.deleteItemAsync("authToken");

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  loadToken: async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");

      if (token) {
        set({
          token,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.log("Error loading token:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: (user) => {
    set({ user });
  },

  // 👤 Manually set user
  setUser: (user) => {
    set({ user });
  },
}));