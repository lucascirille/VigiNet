import React, { createContext, useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Platform } from "react-native";
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [neighborhoodId, setNeighborhoodId] = useState(null);
  const [userData, setUserData] = useState(null);

  // Inicializar Socket.IO y obtener datos del usuario
  useEffect(() => {
    const initializeSocket = async () => {
      try {
        // Obtener token y datos del usuario
        const token = await AsyncStorage.getItem('userToken');
        const userDataString = await AsyncStorage.getItem('userData');
        const parsedUserData = JSON.parse(userDataString);
        setUserData(parsedUserData);
        setNeighborhoodId(parsedUserData.neighborhoodId);

        // Inicializar socket con el token
        const newSocket = io('TU_URL_DEL_SERVIDOR', {
          auth: {
            token
          }
        });

        // Unirse al room del vecindario
        newSocket.emit('joinNeighborhood', parsedUserData.neighborhoodId);

        // Escuchar alertas
        newSocket.on('newAlert', (alertData) => {
          showNotification(alertData.title, alertData.message, alertData.userName);
        });

        setSocket(socket);
      } catch (error) {
        console.error('Error initializing socket:', error);
      }
    };

    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const showNotification = (title, message, userName) => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      userName,
      translateY: new Animated.Value(-100)
    };

    setNotifications(prev => [...prev, newNotification]);
    
    Animated.sequence([
      Animated.timing(newNotification.translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(newNotification.translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    });
  };

  const sendAlertToNeighborhood = (alertType, message) => {
    if (socket && userData) {
      socket.emit('sendAlert', {
        neighborhoodId,
        title: alertType,
        message,
        userName: userData.name,
        userId: userData.id
      });
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification, sendAlertToNeighborhood }}>
      {children}
      <View style={styles.notificationsContainer}>
        {notifications.map((notification, index) => (
          <Animated.View 
            key={notification.id}
            style={[
              styles.notificationContainer,
              {
                transform: [{ translateY: notification.translateY }],
                top: index * 85
              }
            ]}
          >
            <View style={styles.notificationContent}>
              <View style={styles.headerContainer}>
                <View style={styles.appIconContainer}>
                  <Text style={styles.appIcon}>🚨</Text>
                </View>
                <Text style={styles.appName}>VigiNet</Text>
                <Text style={styles.timeText}>ahora</Text>
              </View>
              <Text style={styles.userName}>{notification.userName}</Text>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationMessage} numberOfLines={1}>
                {notification.message}
              </Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </NotificationContext.Provider>
  );
};