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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // if token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = refreshResponse.data.accessToken;

        // save new token
        await SecureStore.setItemAsync("authToken", newAccessToken);

        // update header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // retry original request
        return api(originalRequest);
      } catch (refreshError) {
        console.log("Refresh token expired. Logging out.");
        await SecureStore.deleteItemAsync("authToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
