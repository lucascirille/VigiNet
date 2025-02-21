// import { useState, useEffect } from "react";
// import { View, Text, StyleSheet, FlatList, ActivityIndicator, Platform } from "react-native";
// import { useIsFocused } from "@react-navigation/native";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// const BASE_URL = "http://localhost:3000/api";
// const ALERTS_API = `${BASE_URL}/alarmas`;

// const formatDate = (dateString) => {
//   try {
//     const date = new Date(dateString);
    
//     if (isNaN(date.getTime())) {
//       return "Fecha no disponible";
//     }

//     return date.toLocaleString('es-ES', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: false
//     });
//   } catch (error) {
//     console.error("Error formatting date:", error);
//     return "Fecha no disponible";
//   }
// };

// export default function HistoryScreen() {
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { authData } = useAuth();
//   const isFocused = useIsFocused();

//   useEffect(() => {
//     if (isFocused) {
//       fetchAlerts();
//     }
//   }, [isFocused]);

//   const fetchAlerts = async () => {
//     try {
//       setError(null);
//       const token = window.localStorage.getItem("userToken") || authData?.token;
      
//       if (!token) {
//         setError("No se encontró token de autenticación");
//         setLoading(false);
//         return;
//       }

//       const response = await axios.get(ALERTS_API, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       const alertsData = Array.isArray(response.data) ? response.data : [];
      
//       // Ordenar las alertas por fecha en orden descendente
//       const sortedAlerts = alertsData.sort((a, b) => {
//         const dateA = new Date(a.fechaHora);
//         const dateB = new Date(b.fechaHora);
//         return dateB - dateA;
//       });
      
//       setAlerts(sortedAlerts);
//     } catch (error) {
//       console.error("Error fetching alerts:", error);
//       setError(error.response?.data?.message || "Error al cargar las alertas");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderAlertItem = ({ item }) => (
//     <View style={styles.alertItem}>
//       <Text style={styles.alertType}>{item.tipo}</Text>
//       <Text style={styles.alertDate}>{formatDate(item.fechaHora)}</Text>
//       <Text style={[styles.alertStatus, { color: item.activo ? '#4CAF50' : '#FF5722' }]}>
//         {item.activo ? 'Activa' : 'Inactiva'}
//       </Text>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0D99FF" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Historial de Alertas</Text>
//       {alerts.length > 0 ? (
//         <FlatList
//           data={alerts}
//           renderItem={renderAlertItem}
//           keyExtractor={(item, index) => item.id?.toString() || index.toString()}
//           contentContainerStyle={styles.listContainer}
//           onRefresh={fetchAlerts}
//           refreshing={loading}
//         />
//       ) : (
//         <Text style={styles.noAlertsText}>No hay alertas para mostrar.</Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#f5f5f5",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//     color: "#333",
//   },
//   listContainer: {
//     flexGrow: 1,
//   },
//   alertItem: {
//     backgroundColor: "white",
//     padding: 16,
//     marginBottom: 8,
//     borderRadius: 8,
//     ...Platform.select({
//       web: {
//         boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
//       },
//       default: {
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.2,
//         shadowRadius: 2,
//         elevation: 2,
//       },
//     }),
//   },
//   alertType: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#0D99FF",
//   },
//   alertDate: {
//     fontSize: 14,
//     color: "#666",
//     marginTop: 4,
//   },
//   alertStatus: {
//     fontSize: 14,
//     marginTop: 4,
//     fontWeight: "500",
//   },
//   noAlertsText: {
//     fontSize: 16,
//     color: "#666",
//     textAlign: "center",
//     marginTop: 20,
//   },
//   errorText: {
//     fontSize: 16,
//     color: "#ff4444",
//     textAlign: "center",
//     marginTop: 20,
//   },
// });
//================================middle version================================

// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
// import axios from "axios";
// import { useNavigation } from "@react-navigation/native";
// import * as Linking from "expo-linking";

// const HistoryScreen = () => {
//   const [alerts, setAlerts] = useState([]);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const fetchAlerts = async () => {
//       try {
//         const response = await axios.get("http://your-api-url/api/ubicacion");
//         console.log("API Response:", JSON.stringify(response.data, null, 2)); // Debugging
//         setAlerts(response.data);
//       } catch (error) {
//         console.error("Error fetching alerts:", error);
//       }
//     };

//     fetchAlerts();
//   }, []);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("es-ES", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//     }) + `, ${date.toLocaleTimeString("es-ES")}`;
//   };

//   const openGoogleMaps = (lat, lon) => {
//     const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
//     Linking.openURL(url);
//   };

//   const renderAlertItem = ({ item }) => {
//     console.log("Rendering Alert:", item); // Debugging

//     return (
//       <View style={styles.alertItem}>
//         <Text style={styles.alertType}>{item.tipo}</Text>
//         <Text style={styles.alertDate}>{formatDate(item.fechaHora)}</Text>
//         <Text style={[styles.alertStatus, { color: item.activo ? "#4CAF50" : "#FF5722" }]}>
//           {item.activo ? "Activa" : "Inactiva"}
//         </Text>

//         {item.ubicacion && item.ubicacion.length > 0 ? (
//           <>
//             <Text style={styles.alertLocation}>
//               📍 {item.ubicacion[0].latitud}, {item.ubicacion[0].longitud}
//             </Text>
//             <TouchableOpacity
//               style={styles.mapButton}
//               onPress={() => openGoogleMaps(item.ubicacion[0].latitud, item.ubicacion[0].longitud)}
//             >
//               <Text style={styles.mapButtonText}>Ver en Google Maps</Text>
//             </TouchableOpacity>
//           </>
//         ) : (
//           <Text style={{ color: "red" }}>Ubicación no disponible</Text>
//         )}
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Historial de Alertas</Text>
//       {alerts.length === 0 ? (
//         <Text style={styles.noAlerts}>No hay alertas registradas.</Text>
//       ) : (
//         <FlatList
//           data={alerts}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={renderAlertItem}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f4f4f4",
//     padding: 20,
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   alertItem: {
//     backgroundColor: "#fff",
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   alertType: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   alertDate: {
//     fontSize: 14,
//     color: "#666",
//   },
//   alertStatus: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginTop: 5,
//   },
//   alertLocation: {
//     fontSize: 16,
//     color: "#007AFF",
//     marginTop: 5,
//   },
//   mapButton: {
//     marginTop: 5,
//     backgroundColor: "#007AFF",
//     padding: 8,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   mapButtonText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   noAlerts: {
//     textAlign: "center",
//     fontSize: 16,
//     color: "#666",
//     marginTop: 20,
//   },
// });

// export default HistoryScreen;

//================================version fixed================================
// import { useState, useEffect } from "react";
// import { View, Text, StyleSheet, FlatList, ActivityIndicator, Platform } from "react-native";
// import { useIsFocused } from "@react-navigation/native";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// const BASE_URL = "http://localhost:3000/api"; // Para emulador Android, usar localhost para web
// const ALERTS_API = `${BASE_URL}/alarmas`;

// const formatDate = (dateString) => {
//   try {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) {
//       return "Fecha no disponible";
//     }
//     return date.toLocaleString('es-ES', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: false
//     });
//   } catch (error) {
//     console.error("Error formatting date:", error);
//     return "Fecha no disponible";
//   }
// };

// export default function HistoryScreen() {
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { authData } = useAuth();
//   const isFocused = useIsFocused();

//   useEffect(() => {
//     if (isFocused) {
//       fetchAlerts();
//     }
//   }, [isFocused]);

//   const fetchAlerts = async () => {
//     try {
//       setError(null);
//       setLoading(true);
//       const token = authData?.token;
//       if (!token) {
//         setError("No se encontró token de autenticación");
//         setLoading(false);
//         return;
//       }
//       const response = await axios.get(ALERTS_API, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       const alertsData = Array.isArray(response.data) ? response.data : [];
//       const sortedAlerts = alertsData.sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));
//       setAlerts(sortedAlerts);
//     } catch (error) {
//       console.error("Error fetching alerts:", error);
//       setError("Error al cargar las alertas");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderAlertItem = ({ item }) => (
//     <View style={styles.alertItem}>
//       <Text style={styles.alertType}>{item.tipo}</Text>
//       <Text style={styles.alertDate}>{formatDate(item.fechaHora)}</Text>
//       <Text style={[styles.alertStatus, { color: item.activo ? '#4CAF50' : '#FF5722' }]}>
//         {item.activo ? 'Activa' : 'Inactiva'}
//       </Text>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0D99FF" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Historial de Alertas</Text>
//       {alerts.length > 0 ? (
//         <FlatList
//           data={alerts}
//           renderItem={renderAlertItem}
//           keyExtractor={(item, index) => item.id?.toString() || index.toString()}
//           contentContainerStyle={styles.listContainer}
//           onRefresh={fetchAlerts}
//           refreshing={loading}
//         />
//       ) : (
//         <Text style={styles.noAlertsText}>No hay alertas para mostrar.</Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#f5f5f5",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//     color: "#333",
//   },
//   listContainer: {
//     flexGrow: 1,
//   },
//   alertItem: {
//     backgroundColor: "white",
//     padding: 16,
//     marginBottom: 8,
//     borderRadius: 8,
//     ...Platform.select({
//       web: {
//         boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
//       },
//       default: {
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.2,
//         shadowRadius: 2,
//         elevation: 2,
//       },
//     }),
//   },
//   alertType: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#0D99FF",
//   },
//   alertDate: {
//     fontSize: 14,
//     color: "#666",
//     marginTop: 4,
//   },
//   alertStatus: {
//     fontSize: 14,
//     marginTop: 4,
//     fontWeight: "500",
//   },
//   noAlertsText: {
//     fontSize: 16,
//     color: "#666",
//     textAlign: "center",
//     marginTop: 20,
//   },
//   errorText: {
//     fontSize: 16,
//     color: "#ff4444",
//     textAlign: "center",
//     marginTop: 20,
//   },
// });

//button google maps added

// import { useState, useEffect } from "react";
// import { View, Text, StyleSheet, FlatList, ActivityIndicator, Platform, Linking, TouchableOpacity } from "react-native";
// import { useIsFocused } from "@react-navigation/native";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// const BASE_URL = "http://localhost:3000/api"; // Para emulador Android, usar localhost para web
// const ALERTS_API = `${BASE_URL}/alarmas`;

// const formatDate = (dateString) => {
//   try {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) {
//       return "Fecha no disponible";
//     }
//     return date.toLocaleString('es-ES', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: false
//     });
//   } catch (error) {
//     console.error("Error formatting date:", error);
//     return "Fecha no disponible";
//   }
// };

// export default function HistoryScreen() {
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { authData } = useAuth();
//   const isFocused = useIsFocused();

//   useEffect(() => {
//     if (isFocused) {
//       fetchAlerts();
//     }
//   }, [isFocused]);

//   const fetchAlerts = async () => {
//     try {
//       setError(null);
//       setLoading(true);
//       const token = authData?.token;
//       if (!token) {
//         setError("No se encontró token de autenticación");
//         setLoading(false);
//         return;
//       }
//       const response = await axios.get(ALERTS_API, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       const alertsData = Array.isArray(response.data) ? response.data : [];
//       const sortedAlerts = alertsData.sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));
//       setAlerts(sortedAlerts);
//     } catch (error) {
//       console.error("Error fetching alerts:", error);
//       setError("Error al cargar las alertas");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenMap = (latitud, longitud) => {
//     const url = `https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}`;
//     Linking.openURL(url).catch(err => console.error("Error opening Google Maps:", err));
//   };

//   const renderAlertItem = ({ item }) => (
//     <View style={styles.alertItem}>
//       <Text style={styles.alertType}>{item.tipo}</Text>
//       <Text style={styles.alertDate}>{formatDate(item.fechaHora)}</Text>
//       <Text style={[styles.alertStatus, { color: item.activo ? '#4CAF50' : '#FF5722' }]}>
//         {item.activo ? 'Activa' : 'Inactiva'}
//       </Text>
//       {item.ubicacion && item.ubicacion.length > 0 && (
//         <TouchableOpacity
//           style={styles.mapButton}
//           onPress={() => handleOpenMap(item.ubicacion[0].latitud, item.ubicacion[0].longitud)}
//         >
//           <Text style={styles.mapButtonText}>Ver en Mapa</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0D99FF" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Historial de Alertas</Text>
//       {alerts.length > 0 ? (
//         <FlatList
//           data={alerts}
//           renderItem={renderAlertItem}
//           keyExtractor={(item, index) => item.id?.toString() || index.toString()}
//           contentContainerStyle={styles.listContainer}
//           onRefresh={fetchAlerts}
//           refreshing={loading}
//         />
//       ) : (
//         <Text style={styles.noAlertsText}>No hay alertas para mostrar.</Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#f5f5f5",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//     color: "#333",
//   },
//   listContainer: {
//     flexGrow: 1,
//   },
//   alertItem: {
//     backgroundColor: "white",
//     padding: 16,
//     marginBottom: 8,
//     borderRadius: 8,
//     ...Platform.select({
//       web: {
//         boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
//       },
//       default: {
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.2,
//         shadowRadius: 2,
//         elevation: 2,
//       },
//     }),
//   },
//   alertType: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#0D99FF",
//   },
//   alertDate: {
//     fontSize: 14,
//     color: "#666",
//     marginTop: 4,
//   },
//   alertStatus: {
//     fontSize: 14,
//     marginTop: 4,
//     fontWeight: "500",
//   },
//   noAlertsText: {
//     fontSize: 16,
//     color: "#666",
//     textAlign: "center",
//     marginTop: 20,
//   },
//   errorText: {
//     fontSize: 16,
//     color: "#ff4444",
//     textAlign: "center",
//     marginTop: 20,
//   },
//   mapButton: {
//     marginTop: 10,
//     backgroundColor: "#0D99FF",
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   mapButtonText: {
//     color: "white",
//     fontWeight: "bold",
//   },
// });
//version with button (supposed to be the final version)

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
  Linking,
  TouchableOpacity,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const BASE_URL = "http://localhost:3000/api";
const ALERTS_API = `${BASE_URL}/alarmas`;
const USER_API = `${BASE_URL}/usuarios`;

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
      setLoading(true);
      
      const token = localStorage.getItem("userToken") || authData?.token;
      const userId = localStorage.getItem("userId") || authData?.userId;
      
      if (!token || !userId) {
        setError("No se encontró información de autenticación");
        setLoading(false);
        return;
      }
      
      // First, get current user info to get vecindarioId
      // Change the endpoint to get a specific user by ID
      const userResponse = await axios.get(`${USER_API}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      console.log("User data:", JSON.stringify(userResponse.data, null, 2));
      
      // Check the structure of the user data and get vecindarioId
      const userVecindarioId = userResponse.data.vecindarioId;
      if (!userVecindarioId) {
        setError("No se pudo determinar el vecindario del usuario");
        setLoading(false);
        return;
      }
      
      // Now fetch all alerts
      const response = await axios.get(ALERTS_API, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      const allAlerts = Array.isArray(response.data) ? response.data : [];
      console.log(`Total alerts fetched: ${allAlerts.length}`);
      
      // Filter alerts to only include those from users in the same neighborhood
      const neighborhoodAlerts = allAlerts.filter(alert => {
        return alert.usuario && alert.usuario.vecindarioId === userVecindarioId;
      });
      
      console.log(`Filtered alerts: ${neighborhoodAlerts.length} of ${allAlerts.length}`);
      
      const sortedAlerts = neighborhoodAlerts.sort(
        (a, b) => new Date(b.fechaHora) - new Date(a.fechaHora)
      );
      
      setAlerts(sortedAlerts);
    } catch (error) {
      console.error("Error fetching alerts:", error.response || error);
      setError(`Error al cargar las alertas: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMap = (latitud, longitud) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}`;
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
            { color: item.activo ? "#4CAF50" : "#FF5722" },
          ]}
        >
          {item.activo ? "Activa" : "Inactiva"}
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
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={fetchAlerts}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alertas del Vecindario</Text>
      {alerts.length > 0 ? (
        <FlatList
          data={alerts}
          renderItem={renderAlertItem}
          keyExtractor={(item, index) => item.alarmaId?.toString() || index.toString()}
          contentContainerStyle={styles.listContainer}
          onRefresh={fetchAlerts}
          refreshing={loading}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.noAlertsText}>No hay alertas en tu vecindario.</Text>
          <Text style={styles.noAlertsSubtext}>Las alertas de tu vecindario aparecerán aquí.</Text>
        </View>
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