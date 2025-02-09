// AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "./src/context/AuthContext"; // Traemos el contexto de autenticación
import AuthStack from "./AuthStack";
import MainTabNavigator from "./MainTabNavigator";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { authData } = useAuth(); // Obtenemos el estado de autenticación desde el contexto

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Si el usuario está autenticado, mostramos MainTabNavigator; sino, AuthStack */}
        {authData.isAuthenticated ? (
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
