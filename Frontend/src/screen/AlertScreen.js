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
import BookingBanner from "../components/Notification";
import { useAuth } from "../context/AuthContext";

const BASE_URL = "http://localhost:3000/api";
const VERIFY_TOKEN_API = `${BASE_URL}/auth/validate-token`;

export default function AlertScreen() {
  const { showNotification } = useNotification();
  const [userData, setUserData] = useState(null);
  const { authData } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("userToken") || authData.token;
        console.log('馃攽 Token:', token);
        const userId = localStorage.getItem("userId");

        if (!token) {
          navigation.navigate("Login");
          return;
        }
        if (!userId) {
          const { data: verifyData } = await axios.post(VERIFY_TOKEN_API, { token })
          const userId = verifyData.usuarioId.toString()
          localStorage.setItem("userId", userId)
        }




        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const { data: user } = await axios.get(`${BASE_URL}/usuarios/${userId}`);
        setUserData(user);

        // Conectar al socket con el ID del vecindario
        if (user.vecindarioId) {
          socket.connect();
          socket.emit("unirseAlVecindario", user.vecindarioId);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "No se pudo cargar la informaci贸n del usuario");
      }
    };

    fetchUserData();

    socket.on('notificacion', mensaje => {
      console.log('馃敂 Notificaci贸n recibida:', mensaje);
      showNotification("Alarma Activada", `Alguien a activado una alarma en tu vecindario`);
    });

    return () => {
      socket.disconnect();
      socket.off('notificacion');
    };
  }, []);

  const handleEmergencyCall = () => {
    Linking.openURL("tel:911").catch(() => {
      Alert.alert("Error", "No se puede realizar la llamada");
    });
  };

  const handleAlertPress = async (alertType) => {
    if (!userData?.vecindarioId) {
      Alert.alert("Error", "No perteneces a ning煤n vecindario");
      return;
    }
    showNotification("Alerta Activada", `Has activado la alerta de: ${alertLabel}`);
    try {
      const response = await axios.post(`${BASE_URL}/alarmas/activar`, {
        descripcion: `Alerta de ${alertType.label}`,
        tipo: alertType.label,
      });

      // Mostrar notificaci贸n local
      showNotification("Alarma Activada", `Has activado una alerta de ${alertType.label}`);

      // Emitir evento de socket
      socket.emit("nuevaAlarma", {
        vecindarioId: `vecindario_${userData.vecindarioId}`,
        alarma: response.data.alarma
      });



    } catch (error) {
      console.error("Error activating alarm:", error);
      Alert.alert("Error", "No se pudo activar la alarma");
    }
  };

  const handleWsp = () => {
    socket.emit('enviarNotificacion', {
      sala: userData.vecindarioId,
      mensaje: '隆Alerta de asalto en la calle 123!'
    });
    console.log(`馃摙 Notificaci贸n enviada a la sala ${userData.vecindarioId}`);
  }

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
        <TouchableOpacity style={styles.whatsappButton} onPress={handleWsp}>
          <Ionicons name="logo-whatsapp" size={24} color="white" />
        </TouchableOpacity>
        <BookingBanner />
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
  { label: "Inundaci贸n", icon: "water", color: "#2980b9" },
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
