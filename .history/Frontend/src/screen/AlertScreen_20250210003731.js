import React from "react";
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
import { useNotification } from "../context/NotificationContext"; // Importa el contexto de notificaciones

export default function AlertScreen() {
  const { showNotification } = useNotification(); // Usa el hook de notificaciones

  const handleEmergencyCall = () => {
    // Intentar realizar una llamada al 911
    Linking.openURL("tel:911").catch(() => {
      Alert.alert("Error", "No se puede realizar la llamada");
    });
  };

  const handleAlertPress = (alertLabel) => {
    // Lógica para manejar el evento de alerta, por ejemplo, mostrar una notificación
    showNotification(alertLabel); // Llama a la función de notificación con la etiqueta de alerta
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.grid}>
        {alertTypes.map((alert, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.alertButton, { backgroundColor: alert.color }]}
            onPress={() => handleAlertPress(alert.label)} // Llama a handleAlertPress con el nombre de la alerta
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
