import React, { createContext, useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import socket from "../utils/socket";

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
    console.log('Mostrando notificación:', { title, message });
    setNotification({ title, message });
    Animated.sequence([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(3000), // Aumentado a 3 segundos para mejor visibilidad
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
    console.log('NotificationProvider mounted');
    
    socket.on("connect", () => {
      console.log("Socket conectado en NotificationProvider");
    });

    socket.on("nuevaAlarma", (data) => {
      console.log("Alarma recibida en NotificationProvider:", data);
      showNotification(
        "Nueva Alarma", 
        `${data.alarma?.descripcion || 'Alarma sin descripción'}`
      );
    });

    return () => {
      console.log('NotificationProvider unmounting');
      socket.off("nuevaAlarma");
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <Animated.View 
          style={[
            styles.notificationContainer, 
            { transform: [{ translateY }] }
          ]}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔔</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationMessage}>{notification.message}</Text>
          </View>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    padding: 16,
    margin: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  iconContainer: {
    marginRight: 12,
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
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666",
  },
});