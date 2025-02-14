import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Platform } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const BASE_URL = "http://localhost:3000/api";
const ALERTS_API = `${BASE_URL}/alarmas`;

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return "Fecha no disponible";
    }

    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Fecha no disponible";
  }
};

export default function HistoryScreen() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authData } = useAuth();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchAlerts();
    }
  }, [isFocused]);

  const fetchAlerts = async () => {
    try {
      setError(null);
      const token = window.localStorage.getItem("userToken") || authData?.token;
      
      if (!token) {
        setError("No se encontró token de autenticación");
        setLoading(false);
        return;
      }

      const response = await axios.get(ALERTS_API, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const alertsData = Array.isArray(response.data) ? response.data : [];
      
      // Ordenar las alertas por fecha en orden descendente
      const sortedAlerts = alertsData.sort((a, b) => {
        const dateA = new Date(a.fechaHora);
        const dateB = new Date(b.fechaHora);
        return dateB - dateA;
      });
      
      setAlerts(sortedAlerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      setError(error.response?.data?.message || "Error al cargar las alertas");
    } finally {
      setLoading(false);
    }
  };

  const renderAlertItem = ({ item }) => (
    <View style={styles.alertItem}>
      <Text style={styles.alertType}>{item.tipo}</Text>
      <Text style={styles.alertDate}>{formatDate(item.fechaHora)}</Text>
      <Text style={[styles.alertStatus, { color: item.activo ? '#4CAF50' : '#FF5722' }]}>
        {item.activo ? 'Activa' : 'Inactiva'}
      </Text>
    </View>
  );

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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Alertas</Text>
      {alerts.length > 0 ? (
        <FlatList
          data={alerts}
          renderItem={renderAlertItem}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={styles.listContainer}
          onRefresh={fetchAlerts}
          refreshing={loading}
        />
      ) : (
        <Text style={styles.noAlertsText}>No hay alertas para mostrar.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
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
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff4444",
    textAlign: "center",
    marginTop: 20,
  },
});