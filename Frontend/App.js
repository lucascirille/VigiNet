import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import AuthStack from "./src/navigation/AuthStack";
import MainTabNavigator from "./src/navigation/MainTabNavigator";
import { NotificationProvider } from "./src/context/NotificationContext";

function AppContent() {
  const { authData } = useAuth();
  // authData.isAuthenticated = true;

  return (
    <NavigationContainer>
      {authData.isAuthenticated ? <MainTabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider >
    </AuthProvider>
  );
}
