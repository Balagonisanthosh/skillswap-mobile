import { useEffect } from "react";
import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/AuthStore";

export default function Index() {
  const { isAuthenticated, loadToken, isLoading } = useAuthStore();

  useEffect(() => {
    loadToken();
  }, []);

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/home" />;
}