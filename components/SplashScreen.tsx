import { ThemedText } from "@/components/ThemedText";
import { useAudioPlayer } from "expo-audio";
import { Image } from "expo-image";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const player = useAudioPlayer(require("../assets/sounds/kicaw.mp3"));

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 4000);

    // Play audio when component mounts
    const playAudio = async () => {
      try {
        await player.play();
      } catch (error) {
        console.log("Error playing audio:", error);
      }
    };

    playAudio();

    Animated.sequence([
      // Animate in immediately
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    return () => {
      clearTimeout(timer);
    };
  }, [fadeAnim, scaleAnim, onFinish, player]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require("../assets/images/kocak.jpg")}
          style={styles.logo}
          contentFit="contain"
        />
        <ThemedText type="title" style={styles.title}>
          Wa-Hi List
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Bersiap untuk penerangan duniawi
        </ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#20232a",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 900,
    height: 720,
    marginBottom: 10,
  },
  title: {
    color: "#61dafb",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#ffffff",
    fontSize: 16,
    opacity: 0.8,
  },
});
