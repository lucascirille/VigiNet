import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNotification } from "../context/NotificationContext";
import axios from "axios";
import socket from "../utils/socket";

const BASE_URL = "http://localhost:3000/api";

export default function AlertScreen() {
  const { showNotification } = useNotification();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const userId = localStorage.getItem("userId");
        
        console.log('Token:', token);
        console.log('UserId:', userId);

        if (!token || !userId) {
          console.log('No token or userId found');
          return;
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const { data: user } = await axios.get(`${BASE_URL}/usuarios/${userId}`);
        console.log('User data fetched:', user);
        setUserData(user);

        // Conectar al socket con el ID del vecindario
        if (user.vecindarioId) {
          console.log('Connecting to socket with vecindarioId:', user.vecindarioId);
          socket.connect();
          socket.emit("unirseAlVecindario", `vecindario_${user.vecindarioId}`);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleAlertPress = async (alertType) => {
    if (!userData?.vecindarioId) {
      Alert.alert("Error", "No perteneces a ningún vecindario");
      return;
    }

    try {
      console.log('Sending alarm:', alertType);
      const response = await axios.post(`${BASE_URL}/alarmas/activar`, {
        descripcion: `Alerta de ${alertType.label}`,
        tipo: alertType.label,
      });

      console.log('Alarm response:', response.data);

      // Emitir evento de socket
      const socketData = {
        vecindarioId: `vecindario_${userData.vecindarioId}`,
        alarma: response.data.alarma
      };
      console.log('Emitting socket event:', socketData);
      socket.emit("nuevaAlarma", socketData);

      // Mostrar notificación local para confirmar
      showNotification("Alarma Enviada", `Has activado una alerta de ${alertType.label}`);
    } catch (error) {
      console.error("Error activating alarm:", error);
      Alert.alert("Error", "No se pudo activar la alarma");
    }
  };
  
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
}

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
