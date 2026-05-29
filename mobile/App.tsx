import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import {
  NotoSansMyanmar_400Regular,
  NotoSansMyanmar_700Bold,
} from "@expo-google-fonts/noto-sans-myanmar";
import {
  ScheherazadeNew_400Regular,
  ScheherazadeNew_700Bold,
} from "@expo-google-fonts/scheherazade-new";

import RootNavigator from "./src/navigation/RootNavigator";
import { COLORS } from "./src/constants/theme";

export default function App() {
  const [fontsLoaded] = useFonts({
    NotoSansMyanmar_400Regular,
    NotoSansMyanmar_700Bold,
    ScheherazadeNew_400Regular,
    ScheherazadeNew_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.primary }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return <RootNavigator />;
}
