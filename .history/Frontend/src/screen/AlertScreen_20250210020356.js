import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNotification } from "../context/NotificationContext";
import axios from "axios";
import socket from "../utils/socket";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For persistent storage

const BASE_URL = "http://localhost:3000/api";

// Socket connection handler
import { connectSocket, disconnectSocket } from "../utils/socket";

const AlertScreen = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          const user = await axios.get(`${BASE_URL}/usuarios/${userId}`);
          setUserData(user.data);
          if (user.data.vecindarioId) {
            connectSocket(userId, user.data.vecindarioId);
          }
        }
      } catch (error) {
        console.error("Error initializing socket:", error);
      }
    };

    initializeSocket();

    // Cleanup socket connection when the component is unmounted
    return () => {
      if (userData && userData.vecindarioId) {
        disconnectSocket(userData.vecindarioId);
      }
    };
  }, [userData]);

  const handleEmergencyCall = () => {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      Linking.openURL("tel:911").catch(() => {
        Alert.alert("Error", "No se puede realizar la llamada");
      });
    } else {
      Alert.alert("Error", "No es posible realizar la llamada en este dispositivo.");
    }
  };

  const handleAlertPress = async (alertType) => {
    if (!userData?.vecindarioId) {
      Alert.alert("Error", "No perteneces a ningún vecindario");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/alarmas/activar`, {
        descripcion: `Alerta de ${alertType.label}`,
        tipo: alertType.label,
      });

      // Mostrar notificación local
      showNotification("Alarma Activada", `Has activado una alerta de ${alertType.label}`);

      // Emitir evento de socket
      socket.emit("nuevaAlarma", {
        vecindarioId: `vecindario_${userData.vecindarioId}`,
        alarma: response.data.alarma,
      });
    } catch (error) {
      console.error("Error activating alarm:", error);
      Alert.alert("Error", "No se pudo activar la alarma");
    }
  };

  const alertTypes = [
    { label: "Ambulancia", icon: "medical", color: "#e74c3c" },
    { label: "Violencia", icon: "hand-left", color: "#f39c12" },
    { label: "Homicidio", icon: "skull", color: "#c0392b" },
    { label: "Incendio", icon: "flame", color: "#e67e22" },
    { label: "Accidente", icon: "car-sport", color: "#3498db" },
    { label: "Asalto", icon: "shield-checkmark", color: "#9b59b6" },
    { label: "Inundación", icon: "water", color: "#2980b9" },
    { label: "Sospechoso", icon: "eye", color: "#34495e" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.grid}>
        {alertTypes.map((alert, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.alertButton, { backgroundColor: alert.color }]}
            onPress={() => handleAlertPress(alert)}
          >
            <Ionicons name={alert.icon} size={40} color="white" />
            <Text style={styles.alertText}>{alert.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.emergencyContainer}>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={handleEmergencyCall}
        >
          <Text style={styles.emergencyText}>Emergencia</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.whatsappButton}>
          <Ionicons name="logo-whatsapp" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 16 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  alertButton: {
    width: 130,
    height: 115,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
    borderRadius: 30,
  },
  alertText: {
    color: "white",
    marginTop: 8,
    textAlign: "center",
    fontSize: 16,
  },
  emergencyContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "center",
  },
  emergencyButton: {
    backgroundColor: "red",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  whatsappButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 30,
    marginLeft: 10,
    alignItems: "center",
  },
});

export default AlertScreen;
