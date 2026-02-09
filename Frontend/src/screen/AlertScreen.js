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
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNotification } from "../context/NotificationContext";
import axios from "axios";
import { connectSocket } from "../utils/socket";
import { useAuth } from "../context/AuthContext";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL, { USER_API, ALERTS_API } from "../config/apiConfig";

export default function AlertScreen() {
  const [userData, setUserData] = useState(null);
  const { authData } = useAuth();
  const [location, setLocation] = useState(null);
  const [loadingAlertId, setLoadingAlertId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState([]);

  let showNotification;
  try {
    const notificationContext = useNotification();
    showNotification = notificationContext.showNotification;
  } catch (error) {
    console.log(
      "NotificationContext no disponible, usando función por defecto",
    );
    showNotification = (title, message, type = "info") => {
      Alert.alert(title, message);
    };
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token =
          (await AsyncStorage.getItem("userToken")) || authData.token;
        if (!token) {
          return;
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const { data: user } = await axios.get(`${USER_API}/me`);
        setUserData(user);

        if (user.usuarioId) {
          await AsyncStorage.setItem("usuarioId", user.usuarioId.toString());
        }

        if (user.vecindarioId && !isConnected) {
          connectSocket(user.usuarioId, user.vecindarioId);
          setIsConnected(true);
          console.log(`🔌 Conectado al vecindario ${user.vecindarioId}`);
        }

        console.log(` Usuario cargado: ${user.nombre} ${user.apellido}`);

        let { status } = await Location.getForegroundPermissionsAsync();
        if (status === "granted") {
          const currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          setLocation(currentLocation.coords);
          console.log(" Ubicación obtenida:", currentLocation.coords);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          console.error(
            "Error 404: El endpoint /me no fue encontrado o el usuario no existe en la BD.",
          );
        } else {
          console.error("Error fetching initial data:", error);
        }
        Alert.alert(
          "Error",
          "No se pudo cargar tu información. Intenta reiniciar la app.",
        );
      }
    };

    fetchInitialData();
  }, [authData.token]);

  const handleEmergencyCall = () => {
    Linking.openURL("tel:911").catch(() => {
      Alert.alert("Error", "No se puede realizar la llamada");
    });
  };

  const checkCooldown = async (alertType) => {
    try {
      const cooldownKey = `alert_cooldown_${alertType}`;
      const lastPressed = await AsyncStorage.getItem(cooldownKey);

      if (lastPressed) {
        const timePassed = Date.now() - parseInt(lastPressed);
        const cooldownTime = 5 * 60 * 1000; // 5 minutes in milliseconds

        if (timePassed < cooldownTime) {
          const minutesLeft = Math.ceil((cooldownTime - timePassed) / 60000);
          Alert.alert(
            "Espera un momento",
            `Debes esperar ${minutesLeft} minuto(s) antes de enviar otra alerta de ${alertType}.`
          );
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("Error checking cooldown:", error);
      return true; // En caso de error, permitir enviar (fail open)
    }
  };

  const setCooldown = async (alertType) => {
    try {
      const cooldownKey = `alert_cooldown_${alertType}`;
      await AsyncStorage.setItem(cooldownKey, Date.now().toString());
    } catch (error) {
      console.error("Error setting cooldown:", error);
    }
  };

  const handleAlertPress = async (alertType) => {
    const isAllowed = await checkCooldown(alertType);
    if (!isAllowed) return;

    if (!userData?.vecindarioId) {
      Alert.alert("Error", "No perteneces a ningún vecindario");
      return;
    }

    let currentLocation = location;

    if (!currentLocation) {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        if (newStatus !== "granted") {
          Alert.alert(
            "Permiso requerido",
            "Es necesario activar la ubicación para enviar una alerta."
          );
          return;
        }
      }

      try {
        const locationResult = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        currentLocation = locationResult.coords;
        setLocation(currentLocation);
      } catch (error) {
        Alert.alert("Error", "No se pudo obtener la ubicación actual.");
        return;
      }
    }

    setLoadingAlertId(alertType);
    try {
      const userId = await AsyncStorage.getItem("usuarioId");
      if (!userId) {
        Alert.alert("Error", "No se pudo identificar al usuario.");
        setIsLoading(false);
        return;
      }
      const emisor = `${userData.nombre} ${userData.apellido}`;

      console.log(" Enviando alarma a /alarmas/activar:", {
        tipo: alertType,
        usuarioId: userId,
        vecindarioId: userData.vecindarioId,
        emisor: emisor,
        latitud: currentLocation.latitude,
        longitud: currentLocation.longitude,
      });

      const alarmaResponse = await axios.post(`${BASE_URL}/alarmas/activar`, {
        tipo: alertType,
        descripcion: `Alarma de ${alertType} activada por ${emisor}`,
        usuarioId: userId,
        latitud: currentLocation.latitude,
        longitud: currentLocation.longitude,
      });

      console.log("Alarma activada:", alarmaResponse.data);

      // Guardar cooldown después de éxito
      await setCooldown(alertType);

      showNotification(
        `Alarma de ${alertType}`,
        `Alarma activada exitosamente en tu vecindario`,
        "success",
      );

      // Refrescar alertas activas si existe la función
      if (typeof fetchActiveAlerts === 'function') {
        fetchActiveAlerts();
      }

    } catch (error) {
      const errorMessage = error.response
        ? JSON.stringify(error.response.data)
        : error.message;
      console.error("Error activando alarma:", errorMessage);
      Alert.alert("Error", "No se pudo activar la alarma. Intenta nuevamente.");
    } finally {
      setLoadingAlertId(null);
    }
  };

  const fetchActiveAlerts = async () => {
    try {
      const userId = await AsyncStorage.getItem("usuarioId");
      if (!userId) return;

      console.log(`Fetching active alerts for user ${userId}...`);
      // Use backend filtering for efficiency and correctness
      const response = await axios.get(ALERTS_API, {
        params: {
          usuarioId: userId,
          activo: 'true'
        }
      });

      const myActive = Array.isArray(response.data) ? response.data : [];
      console.log("Active alerts fetched:", myActive.length);

      setActiveAlerts(myActive);
    } catch (error) {
      console.error("Error fetching active alerts:", error);
    }
  };

  const handleCancelAlert = async (alarmaId) => {
    if (!alarmaId) {
      console.error("Invalid alarmaId for cancellation");
      return;
    }

    Alert.alert(
      "Cancelar Alerta",
      "¿Estás seguro de que deseas cancelar esta alerta? Esto la eliminará permanentemente.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              console.log(`Deleting alert ${alarmaId}...`);

              // Optimistically update the list to remove it immediately
              setActiveAlerts(prev => prev.filter(a => a.alarmaId !== alarmaId));

              const response = await axios.delete(`${ALERTS_API}/${alarmaId}`);
              console.log("Alert deleted successfully:", response.status);

              showNotification(
                "Alerta Eliminada",
                "Has eliminado la alerta exitosamente.",
                "success"
              );

              // Refresh data from server to ensure state is synced
              fetchActiveAlerts();
            } catch (err) {
              console.error("Error eliminando alerta:", err);
              // Revert optimistic update if needed or just show error
              fetchActiveAlerts();

              if (err.response) {
                console.error("Error details:", err.response.data);
                Alert.alert("Error", `No se pudo eliminar la alerta: ${JSON.stringify(err.response.data)}`);
              } else {
                Alert.alert("Error", "No se pudo eliminar la alerta. Error de red o servidor.");
              }
            }
          }
        }
      ]
    );
  };

  // Cargar alertas activas al iniciar y al enfocar
  useEffect(() => {
    fetchActiveAlerts();
    // Podríamos añadir un intervalo o escuchar socket si fuera necesario
    const interval = setInterval(fetchActiveAlerts, 10000); // Polling cada 10s como respaldo
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f8f9fa" }}
      edges={["bottom", "left", "right"]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* <View style={styles.header}>
          <Text style={styles.headerTitle}> Alertas de Emergencia</Text>
        </View> */}

        <View style={styles.emergencyContainer}>
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={handleEmergencyCall}
          >
            <Ionicons
              name="call"
              size={28}
              color="white"
              style={styles.emergencyIcon}
            />
            <Text style={styles.emergencyText}>Llamar Emergencias</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {alertTypes.map((alert, index) => {
            const isThisLoading = loadingAlertId === alert.label;
            const isAnyLoading = !!loadingAlertId;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.alertButton,
                  { backgroundColor: alert.color },
                  isAnyLoading && styles.alertButtonDisabled,
                  isThisLoading && styles.alertButtonLoading, // Darker style for loading
                ]}
                onPress={() => handleAlertPress(alert.label)}
                disabled={isAnyLoading}
              >
                <Ionicons name={alert.icon} size={55} color="white" />
                <Text style={styles.alertText}>{alert.label}</Text>
                {isThisLoading && (
                  <View style={styles.loadingOverlay}>
                    <Text style={styles.loadingText}>Enviando...</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
          {activeAlerts.length > 0 && (
            <View style={styles.activeAlertsContainer}>
              <Text style={styles.activeAlertsTitle}>Mis Alertas Activas</Text>
              {activeAlerts.map((alert) => (
                <View key={alert.alarmaId} style={styles.activeAlertItem}>
                  <View style={styles.activeAlertInfo}>
                    <Text style={styles.activeAlertText}>
                      {alert.tipo} - {new Date(alert.fechaHora).toLocaleTimeString()}
                    </Text>
                    <Text style={styles.activeAlertStatus}>Activa</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancelAlert(alert.alarmaId)}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>


      </ScrollView>
    </SafeAreaView>
  );
}

const alertTypes = [
  { id: 1, label: "Violencia", icon: "hand-left", color: "#C2410C" },
  { id: 2, label: "Incendio", icon: "flame", color: "#F97316" },
  { id: 3, label: "Accidente", icon: "car", color: "#EF4444" },
  { id: 4, label: "Asalto", icon: "alert-circle", color: "#F59E0B" },
  { id: 5, label: "Inundación", icon: "water", color: "#2563EB" },
  { id: 6, label: "Sospechoso", icon: "eye", color: "#475569" },
];

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    lineHeight: 22,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  alertButton: {
    width: "46%",
    height: 125,
    alignItems: "center",
    justifyContent: "center",
    margin: "2%",
    borderRadius: 20,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  alertButtonDisabled: {
    opacity: 0.6,
  },
  alertText: {
    color: "white",
    marginTop: 8,
    textAlign: "center",
    fontSize: 19,
    fontWeight: "600",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  alertButtonLoading: {
    backgroundColor: "#333", // Fallback color, will be overridden by darker opacity logic if needed or just use overlay
    opacity: 0.8,
  },
  loadingText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  emergencyContainer: {
    flexDirection: "row",
    marginBottom: 15,
    justifyContent: "center",
  },
  emergencyButton: {
    backgroundColor: "red",
    width: "90%",
    paddingVertical: 18,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emergencyIcon: {
    marginRight: 8,
  },
  emergencyText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  locationWarning: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff3cd",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffeaa7",
  },
  locationWarningText: {
    color: "#856404",
    textAlign: "center",
    fontSize: 14,
  },
  activeAlertsContainer: {
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  activeAlertsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    marginLeft: 5,
  },
  activeAlertItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: "#EF4444",
  },
  activeAlertInfo: {
    flex: 1,
  },
  activeAlertText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  activeAlertStatus: {
    fontSize: 14,
    color: "#EF4444",
    marginTop: 2,
  },
  cancelButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
