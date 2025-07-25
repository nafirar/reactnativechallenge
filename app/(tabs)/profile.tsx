import { useAuth } from "@/contexts/AuthContext"; // Adjust the import path as necessary
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface User {
  email: [];
}

const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync("accessToken");
    return token;
  } catch (error) {
    console.log("Error checking auth status:", error);
    return null;
  }
};

export default function ProfileScreen({ email }: User) {
  const { isAuthenticated } = useAuth();
  //   const { getToken } = useAuth();
  const [data, setData] = useState(email);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    newErrors?: string;
  }>({});

  const API_URL = "http://192.168.227.73:3000/users";
  const AUTH_TOKEN = getToken();
  //   console.log("AUTH_TOKEN", AUTH_TOKEN);

  if (!isAuthenticated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Please log in to view your profile.</Text>
      </View>
    );
  }

  const handleChange = async () => {
    setLoading(true);
    try {
      const dataPost = { email };
    } catch (error) {
      console.log("error", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const newErrors: { name?: string } = {};
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading

        // --- Using Fetch API ---
        const response = await fetch(API_URL, {
          method: "GET", // Or 'POST', 'PUT', etc.
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const emailsMap = result.map((user: User) => user.email);
        const resultString = JSON.stringify(result);
        setData(emailsMap);
        console.log("result", data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false); // End loading, regardless of success or failure
      }
    };

    fetchData(); // Call the async function when the component mounts
  }, [API_URL]);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 50, paddingHorizontal: 20 }}>
      <Text style={styles.header}>Profile Screen</Text>
      <View style={styles.card}>
        <Image
          source={require("@/assets/images/react-logo.png")} // Replace with your profile image URL
          style={styles.profileImage}
        />
        <View style={styles.divider} />
        <Text style={styles.username}>USER NAME</Text>
        <Text style={styles.description}>EMAIL INI HARUS</Text>

        <Text style={styles.description}>
          {" "}
          `{data} ` || "No name available"
        </Text>
        <Button title="Change Username" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,

    padding: 20,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // For Android shadow
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    alignSelf: "center",
    borderRadius: 60, // Makes the image circular
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#eee",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
  },
  username: {
    fontSize: 26,
    color: "#666",
    alignSelf: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#555",
    textAlign: "left",
    lineHeight: 20,
  },
});
