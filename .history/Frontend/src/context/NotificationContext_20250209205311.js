import React, { createContext, useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import socket from "../socket";

export const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const translateY = new Animated.Value(-100);

  const showNotification = (title, message) => {
    setNotification({ title, message });
    Animated.sequence([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setNotification(null);
      translateY.setValue(-100);
    });
  };

  useEffect(() => {
    socket.on("nuevaAlarma", (data) => {
      showNotification("Alarma Activada", `${data.alarma.descripcion} - ${data.alarma.tipo}`);
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
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔔</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.notificationTitle} numberOfLines={1}>{notification.title}</Text>
            <Text style={styles.notificationMessage} numberOfLines={2}>{notification.message}</Text>
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
    backgroundColor: "#ffffff",
    flexDirection: "row",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: "center",
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666666",
  },
});
