import React, { createContext, useState, useContext } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Platform } from "react-native";

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
  const translateY = new Animated.Value(-100);

  const showNotification = (title, message) => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
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

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <View style={styles.notificationsContainer}>
        {notifications.map((notification, index) => (
          <Animated.View
            key={notification.id}
            style={[
              styles.notificationContainer,
              {
                transform: [{ translateY: notification.translateY }],
                top: index * 85 // Espacio entre notificaciones
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

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  notificationsContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 0,
    width: width,
    zIndex: 1000,
    padding: 10,
  },
  notificationContainer: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 8,
  },
  notificationContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 14,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  appIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  appIcon: {
    fontSize: 16,
  },
  appName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  timeText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 'auto',
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#333',
  },
});
