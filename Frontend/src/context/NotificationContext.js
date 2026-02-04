import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Alert, Platform } from 'react-native';
import socket from '../utils/socket';
import { useAuth } from './AuthContext';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from '../config/apiConfig';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Componente individual para cada notificación
const NotificationItem = ({ notification, index, onRemove }) => {
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Iniciar animación de entrada al montar
    Animated.sequence([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(4000), // Mostrar por 4 segundos
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      onRemove(notification.id);
    });
  }, []);

  return (
    <Animated.View
      style={[
        styles.notificationContainer,
        {
          transform: [{ translateY }],
          top: index * 85, // Espacio entre notificaciones
          backgroundColor: notification.type === 'alarm' ? 'rgba(220, 53, 69, 0.95)' : 'rgba(255, 255, 255, 0.95)'
        }
      ]}
    >
      <View style={styles.notificationContent}>
        <View style={styles.headerContainer}>
          <View style={styles.appIconContainer}>
            <Text style={styles.appIcon}>
              {notification.type === 'alarm' ? '🚨' : '📢'}
            </Text>
          </View>
          <Text style={[
            styles.appName,
            { color: notification.type === 'alarm' ? '#fff' : '#000' }
          ]}>
            VigiNet
          </Text>
          <Text style={[
            styles.timeText,
            { color: notification.type === 'alarm' ? 'rgba(255,255,255,0.8)' : '#666' }
          ]}>
            ahora
          </Text>
        </View>
        <Text style={[
          styles.notificationTitle,
          { color: notification.type === 'alarm' ? '#fff' : '#000' }
        ]}>
          {notification.title}
        </Text>
        <Text style={[
          styles.notificationMessage,
          { color: notification.type === 'alarm' ? 'rgba(255,255,255,0.9)' : '#333' }
        ]}>
          {notification.message}
        </Text>
      </View>
    </Animated.View>
  );
};

export const NotificationProvider = ({ children }) => {
  const { authData } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const listenersInitialized = useRef(false);

  // Clear notifications when user logs out
  useEffect(() => {
    if (!authData?.isAuthenticated) {
      setNotifications([]);
      setNotificationHistory([]);
    }
  }, [authData?.isAuthenticated]);
  const responseListener = useRef();
  const notificationListener = useRef();

  // Configuración de notificaciones en primer plano
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  // ... (other imports)

  // Función para registrar notificaciones Push
  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('¡Se requieren permisos para notificaciones push!');
        return;
      }

      try {
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.manifest2?.extra?.eas?.projectId;
        if (!projectId) {
          console.error('Project ID not found in Constants');
        }
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log('ExponentPushToken:', token);
      } catch (e) {
        console.error('Error getting push token', e);
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (token) {
      await AsyncStorage.setItem('expoPushToken', token);
    }
    return token;
  };

  // Efecto para registrar el token cuando el usuario se loguea
  useEffect(() => {
    const registerToken = async () => {
      if (authData?.userId && authData?.token) {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          try {
            console.log('Enviando push token al backend:', token);
            await axios.put(
              `${BASE_URL}/usuarios/push-token`,
              { pushToken: token },
              {
                headers: {
                  Authorization: `Bearer ${authData.token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            console.log('✅ Push token actualizado en backend');
          } catch (error) {
            console.error('Error sending push token to backend:', error);
          }
        }
      }
    };

    registerToken();
  }, [authData?.userId, authData?.token]);

  // Función para mostrar notificación
  const showNotification = (title, message, type = 'info', data = {}) => {
    try {
      console.log('🔔 showNotification llamado con:', { title, message, type });

      const newNotification = {
        id: Date.now() + Math.random(), // ID único
        title,
        message,
        type,
        data,
      };

      console.log('📝 Creando nueva notificación:', newNotification.id);

      setNotifications(prev => {
        console.log('📋 Notificaciones anteriores:', prev.length);
        return [...prev, newNotification];
      });
      setNotificationHistory(prev => [...prev, { ...newNotification, timestamp: new Date() }]);

    } catch (error) {
      console.error('Error showing notification:', error);
      // Fallback a alerta simple
      Alert.alert(title, message);
    }
  };

  const removeNotification = (id) => {
    console.log('🗑️ Removiendo notificación:', id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Función para mostrar notificación de alarma
  const showAlarmNotification = (alarmData) => {
    try {
      const { emisor, mensaje, tipo } = alarmData;
      // El tipo específico (ej: Incendio) está dentro del objeto alarma, el tipo raíz es 'alarma'
      const specificType = alarmData.alarma?.tipo || tipo;

      showNotification(
        `🚨 Alarma de ${specificType}`,
        `${mensaje} - Reportado por: ${emisor}`,
        'alarm',
        alarmData
      );
    } catch (error) {
      console.error('Error showing alarm notification:', error);
    }
  };

  // Función para mostrar notificación general
  const showGeneralNotification = (notificationData) => {
    try {
      const { titulo, mensaje, emisor, tipo } = notificationData;
      showNotification(
        titulo || 'Notificación',
        `${mensaje} - ${emisor ? `Por: ${emisor}` : ''}`,
        tipo || 'info',
        notificationData
      );
    } catch (error) {
      console.error('Error showing general notification:', error);
    }
  };

  // Configurar listeners de socket SOLO UNA VEZ
  useEffect(() => {
    try {
      if (listenersInitialized.current) {
        return; // Ya están inicializados
      }

      console.log('🔧 Configurando listeners de socket...');

      // Remover listeners existentes para evitar duplicados
      socket.off('nuevaAlarma');
      socket.off('notificacion');

      // Listener para nuevas alarmas
      socket.on('nuevaAlarma', (alarmData) => {
        console.log('🚨 Nueva alarma recibida:', alarmData);

        // Verificar si el usuario actual es el emisor (evitar duplicados)
        // Se intenta comparar con usuarioId, userId o emisorId si existen en la data
        const senderId = alarmData.usuarioId || alarmData.userId || alarmData.emisorId;

        if (authData?.userId && senderId && String(senderId) === String(authData.userId)) {
          console.log('🚫 Ignorando alarma propia (ya mostrada localmente)');
          return;
        }

        showAlarmNotification(alarmData);
      });

      // Listener para notificaciones generales
      socket.on('notificacion', (notificationData) => {
        console.log('📢 Notificación recibida:', notificationData);

        // Verificar si el usuario actual es el emisor
        const senderId = notificationData.usuarioId || notificationData.userId || notificationData.emisorId;

        if (authData?.userId && senderId && String(senderId) === String(authData.userId)) {
          console.log('🚫 Ignorando notificación propia (ya mostrada localmente)');
          return;
        }

        showGeneralNotification(notificationData);
      });

      listenersInitialized.current = true;

      // Listeners de Expo Notifications
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        /* 
           Cuando la app está abierta, recibimos la notificación aquí.
           Podemos decidir si mostrarla en la UI custom o dejar que el sistema la maneje.
           Dado que ya tenemos socket.io para tiempo real en primer plano, esto podría ser redundante si el socket llega primero.
           Sin embargo, el requerimiento es push.
           Si llega por push Y socket, podríamos tener duplicados visuales.
           Pero el push notification handler arriba está configurado para mostrar alerta (banner del sistema).
        */
        console.log('Push received via listener:', notification);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification response:', response);
        // Aquí podemos navegar a una pantalla específica
      });

      return () => {
        // Limpiar listeners al desmontar
        try {
          socket.off('nuevaAlarma');
          socket.off('notificacion');
          listenersInitialized.current = false;
          console.log('🔧 Listeners de socket limpiados');

          if (notificationListener.current) Notifications.removeNotificationSubscription(notificationListener.current);
          if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current);

        } catch (error) {
          console.error('Error cleaning up socket listeners:', error);
        }
      };
    } catch (error) {
      console.error('Error setting up socket listeners:', error);
    }
  }, [authData?.userId]); // Re-ejecutar si cambia el usuario (login/logout)

  // Función para limpiar historial
  const clearHistory = () => {
    setNotificationHistory([]);
  };

  // Función para obtener notificaciones por tipo
  const getNotificationsByType = (type) => {
    return notificationHistory.filter(n => n.type === type);
  };

  return (
    <NotificationContext.Provider value={{
      showNotification,
      showAlarmNotification,
      showGeneralNotification,
      notificationHistory,
      clearHistory,
      getNotificationsByType,
      registerForPushNotificationsAsync // Exponer si es necesario llamarlo manualmente
    }}>
      {children}
      <View style={styles.notificationsContainer}>
        {notifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            index={index}
            onRemove={removeNotification}
          />
        ))}
      </View>
    </NotificationContext.Provider>
  );
};

const styles = StyleSheet.create({
  notificationsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  notificationContainer: {
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationContent: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  appIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  appIcon: {
    fontSize: 12,
  },
  appName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  timeText: {
    fontSize: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
});
