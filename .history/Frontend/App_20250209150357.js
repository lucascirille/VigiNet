import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import AuthStack from "./navigation/AuthStack";
import MainTabNavigator from "./navigation/MainTabNavigator";

function AppContent() {
  const { authData } = useAuth();

  if (authData.loading) {
    // Puedes mostrar un splash screen o loading spinner aquí
    return null;
  }

  return (
    <NavigationContainer>
      {authData.isAuthenticated ? <MainTabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}