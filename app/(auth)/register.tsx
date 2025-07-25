import { Feather } from "@expo/vector-icons"; // Added for icons
import { LinearGradient } from "expo-linear-gradient"; // Added for gradient button
import { router, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useMemo, useState } from "react";
import { BASE_URL } from '../../config/config';

import {
    ActivityIndicator, // For a better loading experience
    KeyboardAvoidingView,
    Modal, // For custom alerts
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// --- INTERFACES ---
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface RegisterResponse {
  accessToken?: string;
  message?: string; // Changed from 'error' for consistency
}

// --- PASSWORD REQUIREMENT COMPONENT ---
// A small, reusable component to show the status of each password rule.
const PasswordRequirement = ({ met, label }: { met: boolean; label: string }) => (
  <View style={styles.requirementRow}>
    <Feather name={met ? "check-circle" : "circle"} size={14} color={met ? "#10b981" : "#6b7280"} />
    <Text style={[styles.requirementText, { color: met ? "#10b981" : "#6b7280" }]}>{label}</Text>
  </View>
);

// --- MAIN COMPONENT ---
export default function SignupScreen() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  // State for the custom modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("error");

  // --- DYNAMIC PASSWORD VALIDATION ---
  // useMemo will re-calculate these values only when formData.password changes.
  const passwordRequirements = useMemo(() => {
    const password = formData.password;
    return {
      length: password.length >= 6,
      uppercase: /(?=.*[A-Z])/.test(password),
      lowercase: /(?=.*[a-z])/.test(password),
      number: /(?=.*\d)/.test(password),
    };
  }, [formData.password]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!Object.values(passwordRequirements).every(Boolean)) {
      newErrors.password = "Password does not meet all requirements";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const navigateToLogin = () => {
    router.push("/(auth)/login");
  };

  const showModal = (type: "success" | "error", message: string) => {
    setModalType(type);
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
     const API_BASE_URL =
            Platform.OS === "android"
            ? `${BASE_URL}`
            : "http://localhost:3000";

        const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data: RegisterResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      if (!data.accessToken) {
        throw new Error("No access token received");
      }

      await SecureStore.setItemAsync("auth_token", data.accessToken);
      showModal("success", "Account created successfully!");
    } catch (error: any) {
      showModal("error", error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Register", headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >

            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Let's get you started on your journey!</Text>
            </View>

       
            <View style={styles.form}>
     
              <View style={[styles.inputContainer, errors.name && styles.inputError]}>
                <Feather name="user" size={20} color="#6b7280" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#9ca3af"
                  value={formData.name}
                  onChangeText={(value) => updateField("name", value)}
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

     
              <View style={[styles.inputContainer, errors.email && styles.inputError]}>
                <Feather name="mail" size={20} color="#6b7280" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#9ca3af"
                  value={formData.email}
                  onChangeText={(value) => updateField("email", value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                <Feather name="lock" size={20} color="#6b7280" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#9ca3af"
                  value={formData.password}
                  onChangeText={(value) => updateField("password", value)}
                  secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <Feather name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="#6b7280" style={styles.icon} />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

     
              <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
                <Feather name="lock" size={20} color="#6b7280" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#9ca3af"
                  value={formData.confirmPassword}
                  onChangeText={(value) => updateField("confirmPassword", value)}
                  secureTextEntry={!isConfirmPasswordVisible}
                />
                <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                  <Feather name={isConfirmPasswordVisible ? "eye-off" : "eye"} size={20} color="#6b7280" style={styles.icon} />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

          
            <View style={styles.requirementsContainer}>
              <PasswordRequirement met={passwordRequirements.length} label="At least 6 characters" />
              <PasswordRequirement met={passwordRequirements.uppercase} label="Contains an uppercase letter" />
              <PasswordRequirement met={passwordRequirements.lowercase} label="Contains a lowercase letter" />
              <PasswordRequirement met={passwordRequirements.number} label="Contains a number" />
            </View>

         
            <TouchableOpacity onPress={handleSignup} disabled={loading}>
              <LinearGradient
                colors={loading ? ["#9ca3af", "#6b7280"] : ["#22c55e", "#16a34a"]}
                style={styles.button}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footer}>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={styles.footerText}>
                  Already have an account? <Text style={styles.footerLink}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Feather
                name={modalType === "success" ? "check-circle" : "alert-circle"}
                size={48}
                color={modalType === "success" ? "#10b981" : "#ef4444"}
              />
              <Text style={styles.modalTitle}>{modalType === "success" ? "Success!" : "Error"}</Text>
              <Text style={styles.modalMessage}>{modalMessage}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(false);
                  if (modalType === 'success') {
                    router.replace('/'); 
                  }
                }}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  form: {
    width: "100%",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  icon: {
    marginHorizontal: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111827",
    marginLeft: 8,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },
  requirementsContainer: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    marginLeft: 8,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    color: "#6b7280",
  },
  footerLink: {
    color: "#3b82f6",
    fontWeight: "bold",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#111827",
  },
  modalMessage: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
    elevation: 2,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
