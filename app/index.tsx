import SplashScreen from "@/components/SplashScreen";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function Index() {
  const { isAuthenticated, loading } = useAuth();
  const [splashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
    if (!loading && splashFinished) {
      if (isAuthenticated) {
        router.replace("/(tabs)");
        router.replace("/(tabs)");
      } else {
        router.replace("/login");
        router.replace("/login");
      }
    }
  }, [isAuthenticated, loading, splashFinished]);

  const handleSplashFinish = () => {
    setSplashFinished(true);
  };
  // Show loading spinner while checking auth status
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <SplashScreen onFinish={handleSplashFinish} />
    </View>
  );
}
