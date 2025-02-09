import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../hooks/useAuth";

const BASE_URL = "http://localhost:3000/api";
const VERIFY_TOKEN_API = `${BASE_URL}/auth/validate-token`;
const USER_API = `${BASE_URL}/usuarios`;
const NEIGHBORHOOD_API = `${BASE_URL}/vecindarios`;

axios.defaults.baseURL = BASE_URL;

export default function ProfileScreen({ navigation }) {
  const { logout } = useAuth(); // Assuming the useAuth hook provides logout
  const [userData, setUserData] = useState(null);
  const [neighborhoodName, setNeighborhoodName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        navigation.navigate("Login");
        return;
      }

      const { data: verifyData } = await axios.post(VERIFY_TOKEN_API, { token });
      const userId = verifyData.usuarioId.toString();
      await AsyncStorage.setItem("userId", userId);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const { data: user } = await axios.get(`${USER_API}/${userId}`);
      setUserData(user);

      if (user.vecindarioId) {
        fetchNeighborhoodName(user.vecindarioId);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to load user data. Please try again.");
      navigation.navigate("Login");
    } finally {
      setLoading(false);
    }
  };

  const fetchNeighborhoodName = async (neighborhoodId) => {
    try {
      const { data } = await axios.get(`${NEIGHBORHOOD_API}/${neighborhoodId}`);
      setNeighborhoodName(data.nombre);
    } catch (error) {
      console.error("Error fetching neighborhood:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await new Promise((resolve) => setTimeout(resolve, 1000));

              // Use the logout function from the useAuth hook
              await logout();
              // Optionally reset AsyncStorage if necessary
              await AsyncStorage.removeItem("userToken");
              await AsyncStorage.removeItem("userId");

              // Reiniciar la navegación y redirigir a "Splash"
              navigation.reset({
                index: 0,
                routes: [{ name: "Splash" }],
              });
            } catch (error) {
              console.error("Error during logout:", error);
              Alert.alert("Error", "No se pudo cerrar la sesión. Inténtalo de nuevo.");
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D99FF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {userData &&
        Object.entries(userData)
          .filter(([key]) => key.toLowerCase() !== "vecindarioid" && key.toLowerCase() !== "usuarioid")
          .map(([key, value], index) => (
            <View key={index} style={styles.infoContainer}>
              <Text style={styles.infoLabel}>{key}</Text>
              {key.toLowerCase() === "contrasena" ? (
                <Text style={styles.infoValue}>{"•".repeat(8)}</Text>
              ) : (
                <Text style={styles.infoValue}>{value?.toString() ?? ""}</Text>
              )}
            </View>
          ))}

      {neighborhoodName && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Vecindario</Text>
          <Text style={styles.infoValue}>{neighborhoodName}</Text>
        </View>
      )}

      {isLoggingOut ? (
        <View style={styles.loggingOutContainer}>
          <ActivityIndicator size="large" color="#0D99FF" />
          <Text style={styles.loggingOutText}>Cerrando sesión...</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", padding: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  infoContainer: { width: "100%", padding: 10, borderBottomWidth: 1, borderBottomColor: "#ecf0f1" },
  infoLabel: { fontSize: 14, color: "gray" },
  infoValue: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "teal",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 90,
    alignItems: "center",
  },
  logoutText: { color: "white", fontSize: 20, textAlign: "center" },
  loggingOutContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  loggingOutText: {
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
});
