import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const api = axios.create({
  baseURL: "http://10.159.208.168:3000/api", 
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



