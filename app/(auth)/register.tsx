import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface dataType {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  onNavigateToLogIn: () => void;
}

export default function LoginScreen({
  email,
  username,
  password,
  confirmPassword,
  onNavigateToLogIn,
}: dataType) {
  const router = useRouter();
  const { login } = useAuth();
  const [newEmail, setNewEmail] = useState(email);
  const [newUsername, setNewUsername] = useState(username);
  const [newPassword, setNewPassword] = useState(password);
  const [newConfirmPassword, setNewConfirmPassword] = useState(confirmPassword);
  const [errors, setErrors] = useState<{
    errEmail?: string;
    errUsername?: string;
    errPassword?: string;
    errCPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: {
      errEmail?: string;
      errUsername?: string;
      errPassword?: string;
      errCPassword?: string;
    } = {};

    // Email validation
    if (!newEmail.trim()) {
      newErrors.errEmail = "Email is required";
    } else if (!newEmail.includes("@") || !newEmail.includes(".")) {
      newErrors.errEmail = "Please enter a valid email";
    }

    // username validation
    if (!newUsername.trim()) {
      newErrors.errUsername = "Username is required";
    }

    // Password validation
    if (!newPassword) {
      newErrors.errPassword = "Password is required";
    } else if (newPassword.length < 6) {
      newErrors.errPassword = "Password must be at least 6 characters";
    }
    // Confirm Password validation
    if (!newConfirmPassword) {
      newErrors.errCPassword = "Confirm Password is required";
    } else if (newConfirmPassword !== newPassword) {
      newErrors.errCPassword = "Password must be same";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return console.log("Validation failed:", errors);

    setLoading(true);
    try {
      setLoading(true);

      const API_BASE_URL =
        Platform.OS === "android"
          ? "http://192.168.227.135:3000"
          : "http://localhost:3000";

      const dataPost = { email: newEmail, password: newPassword };
      console.log("Attempting login with: data");

      const response = await axios.post(`${API_BASE_URL}/register`, dataPost);

      alert("Sign Up successful!");

      setNewEmail("");

      await login(response.data.accessToken);
    } catch (error) {
      alert("Login failed. Please try again.");
    } finally {
      setNewPassword("");
      setNewConfirmPassword("");
      setLoading(false);
    }
  };

  onNavigateToLogIn = () => {
    router.push("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>Sign up</Text>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.errEmail && styles.inputError]}
              placeholder="Enter your email"
              value={newEmail}
              onChangeText={setNewEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.errEmail && (
              <Text style={styles.errorText}>{errors.errEmail}</Text>
            )}
          </View>

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={[styles.input, errors.errUsername && styles.inputError]}
              placeholder="Enter your username"
              value={newUsername}
              onChangeText={setNewUsername}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.errUsername && (
              <Text style={styles.errorText}>{errors.errUsername}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, errors.errPassword && styles.inputError]}
              placeholder="Enter your password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={true}
              autoCapitalize="none"
            />
            {errors.errPassword && (
              <Text style={styles.errorText}>{errors.errPassword}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={[styles.input, errors.errCPassword && styles.inputError]}
              placeholder="Enter your password"
              value={newConfirmPassword}
              onChangeText={setNewConfirmPassword}
              secureTextEntry={true}
              autoCapitalize="none"
            />
            {errors.errCPassword && (
              <Text style={styles.errorText}>{errors.errCPassword}</Text>
            )}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkContainer}
            onPress={onNavigateToLogIn}
          >
            <Text style={styles.linkText}>
              Already have an account?{" "}
              <Text style={styles.linkTextBold}>Log In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "white",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  linkContainer: {
    alignItems: "center",
  },
  linkText: {
    fontSize: 16,
    color: "#6b7280",
  },
  linkTextBold: {
    color: "#3b82f6",
    fontWeight: "600",
  },
});
