// frontend/context/NotificationProvider.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import PushNotification from "react-native-push-notification";
import socket from "../utils/socket";

export const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification debe usarse dentro de NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const translateY = new Animated.Value(-100);

  const showNotification = (title, message) => {
    setNotification({ title, message });

    // Animación de aparición y desaparición
    Animated.sequence([
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(translateY, { toValue: -100, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      setNotification(null);
    });

    // Notificación push en segundo plano
    PushNotification.localNotification({
      title,
      message,
      playSound: true,
      soundName: "default",
    });
  };

  useEffect(() => {
    socket.on("nuevaAlarma", (data) => {
      showNotification(data.title, data.message);
    });

    return () => {
      socket.off("nuevaAlarma");
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <Animated.View style={[styles.notificationContainer, { transform: [{ translateY }] }]}>
          <View style={styles.textContainer}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationMessage}>{notification.message}</Text>
          </View>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  notificationContainer: {
    position: "absolute",
    top: 0,
    width: width,
    backgroundColor: "#fff",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666",
  },
});
