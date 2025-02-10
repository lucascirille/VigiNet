"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal } from "react-native"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import { useNotification } from '../context/NotificactionContext';

const BASE_URL = "http://localhost:3000/api"
const VERIFY_TOKEN_API = `${BASE_URL}/auth/validate-token`
const USER_API = `${BASE_URL}/usuarios`
const NEIGHBORHOOD_API = `${BASE_URL}/vecindarios`

axios.defaults.baseURL = BASE_URL

export default function ProfileScreen({ navigation }) {
  const { logout } = useAuth()
  const { showNotification } = useNotification(); // Obtener la función de notificación
  const [userData, setUserData] = useState(null)
  const [neighborhoodName, setNeighborhoodName] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("userToken")
      if (!token) {
        navigation.navigate("Login")
        return
      }

      const { data: verifyData } = await axios.post(VERIFY_TOKEN_API, { token })
      const userId = verifyData.usuarioId.toString()
      localStorage.setItem("userId", userId)

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      const { data: user } = await axios.get(`${USER_API}/${userId}`)
      setUserData(user)

      if (user.vecindarioId) {
        fetchNeighborhoodName(user.vecindarioId)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to load user data. Please try again.")
      navigation.navigate("Login")
    } finally {
      setLoading(false)
    }
  }

  const fetchNeighborhoodName = async (neighborhoodId) => {
    try {
      const { data } = await axios.get(`${NEIGHBORHOOD_API}/${neighborhoodId}`)
      setNeighborhoodName(data.nombre)
    } catch (error) {
      console.error("Error fetching neighborhood:", error)
    }
  }

  const handleLogout = () => {
    setIsLogoutModalVisible(true)
  }

  const handleShowNotification = () => {
    showNotification(
      "Título de la notificación",
      "Mensaje de la notificación"
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D99FF" />
      </View>
    )
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

      {/* Botón de cerrar sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      {/* Botón para mostrar notificación */}
      <TouchableOpacity style={styles.notificationButton} onPress={handleShowNotification}>
        <Text style={styles.notificationButtonText}>Mostrar Notificación</Text>
      </TouchableOpacity>

      {/* Modal de confirmación */}
      <Modal
        visible={isLogoutModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cerrar Sesión</Text>
            <Text style={styles.modalMessage}>¿Estás seguro de que quieres cerrar sesión?</Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsLogoutModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  logout();
                  navigation.navigate("Login");
                }}
              >
                <Text style={styles.modalButtonText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
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
  notificationButton: {
    marginTop: 20,
    backgroundColor: "orange",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 90,
    alignItems: "center",
  },
  notificationButtonText: { color: "white", fontSize: 20, textAlign: "center" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  confirmButton: {
    backgroundColor: "teal",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
})