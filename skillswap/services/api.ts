import axios from "axios";
import * as SecureStore from "expo-secure-store";
const LOCAL_URL = "http://10.159.208.168:3000/api";
const PROD_URL = "https://skill-swap-fullstack-1-8y82.onrender.com/api";
const BASE_URL = __DEV__ ? LOCAL_URL : PROD_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
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
  },
);


