"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from "react-native"
import * as ImagePicker from "expo-image-picker"
import axios from "axios"

// Actualiza estas URLs con tus endpoints reales
const BASE_URL = "http://localhost:3000/api"
const VERIFY_TOKEN_API = `${BASE_URL}/auth/validate-token`
const USER_API = `${BASE_URL}/usuarios`

// Configuración global de Axios
axios.defaults.baseURL = BASE_URL

export default function ProfileScreen({ navigation }) {
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/100")
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

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

      // Verificar el token
      const { data: verifyData } = await axios.post(VERIFY_TOKEN_API, { token })
      const userId = verifyData.usuarioId.toString()
      localStorage.setItem("userId", userId)

      // Configurar el token para todas las solicitudes futuras
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      // Fetch user data
      const { data: userData } = await axios.get(`${USER_API}/${userId}`)
      setUserData(userData)
    } catch (error) {
      console.error("Error:", error)
      if (axios.isAxiosError(error)) {
        // Manejar errores específicos de Axios
        if (error.response) {
          // El servidor respondió con un estado fuera del rango de 2xx
          console.error("Response data:", error.response.data)
          console.error("Response status:", error.response.status)
        } else if (error.request) {
          // La solicitud fue hecha pero no se recibió respuesta
          console.error("No response received:", error.request)
        } else {
          // Algo sucedió en la configuración de la solicitud que provocó un error
          console.error("Error message:", error.message)
        }
      }
      alert("Failed to load user data. Please try again.")
      navigation.navigate("Login")
    } finally {
      setLoading(false)
    }
  }

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      alert("Se necesita permiso para acceder a la galería!")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userToken")
    localStorage.removeItem("userId")
    delete axios.defaults.headers.common["Authorization"]
    //navigation.navigate("Login")
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D99FF" />
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: profileImage }} style={styles.profileImage} />
      <TouchableOpacity onPress={pickImage}>
        <Text style={styles.editText}>Editar foto de perfil</Text>
      </TouchableOpacity>
      {userData &&
        Object.entries(userData).map(([key, value], index) => (
          <View key={index} style={styles.infoContainer}>
            <Text style={styles.infoLabel}>{key}</Text>
            {key.toLowerCase() === "contrasena" ? (
              <Text style={styles.infoValue}>{"•".repeat(8)}</Text>
            ) : (
              <Text style={styles.infoValue}>{value?.toString() ?? ""}</Text>
            )}
          </View>
        ))}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", padding: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  editText: { color: "#0D99FF", marginBottom: 20 },
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
})


