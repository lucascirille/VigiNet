import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { NotificationProvider } from "./src/context/NotificactionContext"; // Importa el contexto de notificaciones
import AuthStack from "./src/navigation/AuthStack";
import MainTabNavigator from "./src/navigation/MainTabNavigator";

function AppContent() {
  const { authData } = useAuth();
  // authData.isAuthenticated = true; // Descomenta esto para simular autenticación

  return (
    <NavigationContainer>
      {authData.isAuthenticated ? <MainTabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider> {/* Envuelve la aplicación con NotificationProvider */}
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}