import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { RootStackParamList } from "./types";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import GlobalSearchScreen from "../screens/GlobalSearchScreen";
import QuranNavigator from "./QuranNavigator";
import HadithNavigator from "./HadithNavigator";
import { COLORS } from "../constants/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: "fade_from_bottom",
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="GlobalSearch" component={GlobalSearchScreen} />
        <Stack.Screen name="QuranStack" component={QuranNavigator} />
        <Stack.Screen name="HadithStack" component={HadithNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
