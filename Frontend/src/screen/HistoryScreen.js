import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Platform, Linking, TouchableOpacity, Alert, } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { ALERTS_API, USER_API } from "../config/apiConfig";

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Fecha no disponible";
    }
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Fecha no disponible";
  }
};

const alertTypes = [
  "Todas",
  "Ambulancia",
  "Violencia",
  "Homicidio",
  "Incendio",
  "Accidente",
  "Asalto",
  "Inundación",
  "Sospechoso",
];

export default function HistoryScreen() {
  const [masterAlerts, setMasterAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [selectedType, setSelectedType] = useState("Todas");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authData } = useAuth();

  useFocusEffect(
    useCallback(() => {
      fetchAlerts();
    }, [])
  );

  useEffect(() => {
    if (selectedType && selectedType !== "Todas") {
      const newData = masterAlerts.filter((item) => {
        return item.tipo === selectedType;
      });
      setFilteredAlerts(newData);
    } else {
      setFilteredAlerts(masterAlerts);
    }
  }, [selectedType, masterAlerts]);

  const fetchAlerts = async () => {
    try {
      setError(null);
      setLoading(true);

      const token = await AsyncStorage.getItem("userToken") || authData?.token;
      const userId = await AsyncStorage.getItem("usuarioId") || authData?.userId;

      if (!token || !userId) {
        setError("No se encontró información de autenticación");
        setLoading(false);
        return;
      }

      const userResponse = await axios.get(`${USER_API}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const userVecindarioId = userResponse.data.vecindarioId;
      if (!userVecindarioId) {
        setError("No se pudo determinar el vecindario del usuario");
        setLoading(false);
        return;
      }

      const response = await axios.get(ALERTS_API, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const allAlerts = Array.isArray(response.data) ? response.data : [];

      const neighborhoodAlerts = allAlerts.filter(alert => {
        return alert.usuario && alert.usuario.vecindarioId === userVecindarioId;
      });

      const sortedAlerts = neighborhoodAlerts.sort(
        (a, b) => new Date(b.fechaHora) - new Date(a.fechaHora)
      );

      setMasterAlerts(sortedAlerts);
      setFilteredAlerts(sortedAlerts);

    } catch (error) {
      console.error("Error fetching alerts:", error.response || error);
      setError(`Error al cargar las alertas: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMap = (latitud, longitud) => {
    const url = `http://maps.google.com/maps?q=${latitud},${longitud}`;
    Linking.openURL(url).catch((err) =>
      console.error("Error opening Google Maps:", err)
    );
  };

  const renderAlertItem = ({ item }) => {
    return (
      <View style={styles.alertItem}>
        <Text style={styles.alertType}>{item.tipo}</Text>
        {item.descripcion && (
          <Text style={styles.alertDescription}>{item.descripcion}</Text>
        )}
        <Text style={styles.alertDate}>{formatDate(item.fechaHora)}</Text>
        <Text
          style={[
            styles.alertStatus,
            { color: (item.activo && (new Date() - new Date(item.fechaHora) < 3600000)) ? "#4CAF50" : "#FF5722" },
          ]}
        >
          {(item.activo && (new Date() - new Date(item.fechaHora) < 3600000)) ? "Activa" : "Inactiva"}
        </Text>
        {item.ubicaciones && item.ubicaciones.length > 0 ? (
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() =>
              handleOpenMap(
                item.ubicaciones[0].latitud,
                item.ubicaciones[0].longitud
              )
            }
          >
            <Text style={styles.mapButtonText}>Ver en Mapa</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.noLocationText}>No hay ubicación disponible</Text>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D99FF" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchAlerts}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <Text style={styles.title}>Alertas del Vecindario</Text>

        {/* Filter Dropdown */}
        <View style={styles.pickerContainer}>
          <Text style={styles.filterLabel}>Filtrar por tipo:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedType}
              onValueChange={(itemValue) => setSelectedType(itemValue)}
              style={styles.picker}
              mode="dropdown" // Android only
            >
              {alertTypes.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
        </View>

        {filteredAlerts.length > 0 ? (
          <FlatList
            data={filteredAlerts}
            renderItem={renderAlertItem}
            keyExtractor={(item, index) => item.alarmaId?.toString() || index.toString()}
            contentContainerStyle={styles.listContainer}
            onRefresh={fetchAlerts}
            refreshing={loading}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            {masterAlerts.length > 0 && selectedType !== "Todas" ? (
              <Text style={styles.noAlertsText}>No se encontraron alertas de tipo "{selectedType}".</Text>
            ) : (
              <>
                <Text style={styles.noAlertsText}>No hay alertas en tu vecindario.</Text>
                <Text style={styles.noAlertsSubtext}>Las alertas de tu vecindario aparecerán aquí.</Text>
              </>
            )}
          </View>
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  filterLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    marginLeft: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#fafafa",
    overflow: "hidden", // Helps on iOS to clip border radius
  },
  picker: {
    height: 50,
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  listContainer: {
    flexGrow: 1,
  },
  alertItem: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    ...Platform.select({
      web: {
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
      },
    }),
  },
  alertType: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0D99FF",
    textTransform: "capitalize",
  },
  alertDescription: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
  },
  alertDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  alertStatus: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: "500",
  },
  noAlertsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    textAlign: "center",
  },
  noAlertsSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#ff4444",
    textAlign: "center",
    marginTop: 20,
  },
  mapButton: {
    marginTop: 10,
    backgroundColor: "#0D99FF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  mapButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  noLocationText: {
    marginTop: 10,
    color: "#666",
    fontStyle: "italic",
  },
  retryButton: {
    backgroundColor: "#0D99FF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    alignSelf: "center",
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
