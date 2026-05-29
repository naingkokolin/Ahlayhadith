import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { QuranStackParamList } from "./types";
import SurahListScreen from "../screens/SurahListScreen";
import AyahListScreen from "../screens/AyahListScreen";
import { COLORS, FONTS } from "../constants/theme";

const Stack = createNativeStackNavigator<QuranStackParamList>();

export default function QuranNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: "#fff",
        headerTitleStyle: { fontFamily: FONTS.bold, fontSize: 18 },
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        ),
        contentStyle: { backgroundColor: COLORS.background },
      })}
    >
      <Stack.Screen
        name="SurahList"
        component={SurahListScreen}
        options={{ title: "Al-Quran" }}
      />
      <Stack.Screen
        name="AyahList"
        component={AyahListScreen}
        options={({ route }) => ({
          title: `${route.params.surahNumber}. ${route.params.surahName}`,
        })}
      />
    </Stack.Navigator>
  );
}
