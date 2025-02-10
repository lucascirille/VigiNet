import React, { createContext, useState, useContext, useEffect } from "react";
import { Animated, Dimensions } from "react-native";
import socket from "../utils/socket";  // Este es tu cliente de socket.io

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
          <Text>{notification.title}</Text>
          <Text>{notification.message}</Text>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  );
};

const { width } = Dimensions.get("window");

const styles = {
  notificationContainer: {
    position: "absolute",
    top: 0,
    width: width,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    padding: 16,
    zIndex: 1000,
  },
};
