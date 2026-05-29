import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { HadithStackParamList } from "./types";
import HadithBooksScreen from "../screens/HadithBooksScreen";
import HadithChaptersScreen from "../screens/HadithChaptersScreen";
import HadithListScreen from "../screens/HadithListScreen";
import { COLORS, FONTS } from "../constants/theme";

const Stack = createNativeStackNavigator<HadithStackParamList>();

export default function HadithNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: COLORS.secondary },
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
        name="HadithBooks"
        component={HadithBooksScreen}
        options={{ title: "Hadith" }}
      />
      <Stack.Screen
        name="HadithChapters"
        component={HadithChaptersScreen}
        options={({ route }) => ({ title: route.params.bookName })}
      />
      <Stack.Screen
        name="HadithList"
        component={HadithListScreen}
        options={({ route }) => ({ title: route.params.chapterName })}
      />
    </Stack.Navigator>
  );
}
