// import { Platform } from "react-native";
// import Constants from "expo-constants";

// Extraemos la IP de la configuración de Expo (solo disponible en desarrollo)
// El hostUri suele venir como "192.168.1.10:8081"
// const debuggerHost = Constants.expoConfig?.hostUri;
// const localhostIP = debuggerHost ? debuggerHost.split(":")[0] : "localhost";

// const API_URLS = {
//   web: "http://localhost:3000/api",
//   // Si estamos en un emulador de Android "puro", 10.0.2.2 es más estable.
//   // Si es un dispositivo físico, usamos la IP detectada por Expo.
//   mobile:
//     Platform.OS === "android" && !debuggerHost
//       ? "http://10.0.2.2:3000/api"
//       : `http://${localhostIP}:3000/api`,
// };

// const getActiveUrl = () => {
//   if (Platform.OS === "web") {
//     return API_URLS.web;
//   }
//
//   console.log("$API_URLS.mobile ", API_URLS.mobile);
//   return API_URLS.mobile;
// };

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL; // getActiveUrl();

export const USER_API = `${BASE_URL}/usuarios`;
export const ALERTS_API = `${BASE_URL}/alarmas`;
export const VERIFY_TOKEN_API = `${BASE_URL}/auth/verify`;
export const NEIGHBORHOOD_API = `${BASE_URL}/vecindarios`;

export default BASE_URL;
