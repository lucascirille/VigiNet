import React, { useEffect } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { NotificationProvider } from "./src/context/NotificationContext";
import AppNavigator from "./src/navigation/AppNavigator";
import AsyncStorage from '@react-native-async-storage/async-storage';

function AppContent() {
  const { authData, isLoading } = useAuth();

  useEffect(() => {
    const clearStorage = async () => {
      try {

        await AsyncStorage.removeItem('userId');
        console.log("Clave 'userId' removida del AsyncStorage");
      } catch (error) {
        console.error("Error limpiando storage:", error);
      }
    };

    clearStorage();
  }, []);

  console.log("Estado de autenticación:", authData.isAuthenticated);
  console.log("Cargando:", isLoading);

  if (isLoading) {
    return null;
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <SafeAreaProvider>
          <StatusBar style="light" translucent={true} backgroundColor="transparent" />
          <AppContent />
        </SafeAreaProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}