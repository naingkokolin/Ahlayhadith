import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  StatusBar,
  Dimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { COLORS, FONTS, SPACING } from "../constants/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

const { width } = Dimensions.get("window");

export default function SplashScreen({ navigation }: Props) {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo pop-in then text fade
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
          friction: 7,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to Home after 2.5s
    const timer = setTimeout(() => {
      navigation.replace("Home");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <Animated.View
        style={[
          styles.logoWrapper,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        {/* Replace with your actual logo asset */}
        <Image
          source={require("../../assets/splash_circle.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View style={[styles.textWrapper, { opacity: textOpacity }]}>
        <Text style={styles.title}>ကုရ်အာန် နှင့် ဟဒီးဆ် (မြန်မာ)</Text>
        <Text style={styles.subtitle}>Quran & Hadith — Myanmar</Text>
      </Animated.View>

      {/* Decorative Arabic text */}
      <Animated.Text style={[styles.bismillah, { opacity: textOpacity }]}>
        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.xl,
  },
  logoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
  },
  logo: {
    width: 110,
    height: 110,
  },
  textWrapper: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 26,
    color: "#fff",
    marginBottom: SPACING.xs,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 1.2,
  },
  bismillah: {
    position: "absolute",
    bottom: SPACING.xl,
    fontFamily: FONTS.arabic,
    fontSize: 22,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 1,
  },
});
