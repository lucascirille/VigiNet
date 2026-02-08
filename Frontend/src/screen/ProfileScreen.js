"use client";

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { USER_API, NEIGHBORHOOD_API } from "../config/apiConfig";
import BASE_URL from '../config/apiConfig';

axios.defaults.baseURL = BASE_URL;

export default function ProfileScreen({ navigation }) {
  const { logout } = useAuth(); // Keep logout for now in case we need to handle token expiry within fetchUserData, though catch block handles it. Actually, the original code used logout in fetchUserData.
  const [userData, setUserData] = useState(null);
  const [neighborhoodName, setNeighborhoodName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        logout();
        return;
      }

      // Aseguramos que el token esté en las cabeceras para la petición
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Hacemos una única y más eficiente llamada al endpoint '/me'
      const { data: user } = await axios.get(`${USER_API}/me`);
      setUserData(user);

      // Guardamos el ID del usuario para otros usos si es necesario
      if (user.usuarioId) {
        await AsyncStorage.setItem("usuarioId", user.usuarioId.toString());
      }

      if (user.vecindarioId) {
        fetchNeighborhoodName(user.vecindarioId);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Failed to load user data. Please try again.");
      logout();
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



  const formatLabel = (label) => {
    return label
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D99FF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        {userData &&
          Object.entries(userData)
            .filter(([key]) => !["vecindarioid", "usuarioid", "calle1", "calle2", "pushtoken"].includes(key.toLowerCase()))
            .map(([key, value], index) => (
              <View key={index} style={styles.infoContainer}>
                <Text style={styles.infoLabel}>{formatLabel(key)}</Text>
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

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile", {
            userData: userData,
            onUpdate: (updatedUser) => {
              setUserData(updatedUser);
              fetchUserData();
            }
          })}
        >
          <Text style={styles.editText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionsButton}
          onPress={() => navigation.navigate("Options")}
        >
          <Text style={styles.optionsText}>Opciones</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", padding: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  infoContainer: { width: "100%", padding: 10, borderBottomWidth: 1, borderBottomColor: "#ecf0f1" },
  infoLabel: { fontSize: 14, color: "gray" },
  infoValue: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  optionsButton: {
    marginTop: 30,
    backgroundColor: "#2c3e50", // Dark blue/grey for options
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionsText: { color: "white", fontSize: 20, textAlign: "center" },
  editButton: {
    marginTop: 20,
    backgroundColor: "#0D99FF",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editText: { color: "white", fontSize: 20, textAlign: "center" },
});