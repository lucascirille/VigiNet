import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../config/apiConfig";
import { disconnectSocket } from "../utils/socket";

const login = async (email, password) => {
  try {
    console.log("Intentando login con:", email);
    console.log("URL del backend:", BASE_URL);

    const response = await axios.post(
      `${BASE_URL}/auth/login`,
      {
        email,
        contrasena: password,
      },
      {
        timeout: 15000,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Respuesta del servidor:", response.status);
    console.log("Datos de respuesta:", response.data);

    if (response.status === 200 && response.data) {
      if (response.data.token) {
        await AsyncStorage.setItem("userToken", response.data.token);
        await AsyncStorage.setItem(
          "usuarioId",
          response.data.user.usuarioId.toString(),
        );
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify(response.data.user),
        );
        console.log("Datos guardados en AsyncStorage");
      }

      return response.data;
    } else {
      console.log("Respuesta inválida del servidor");
      return null;
    }
  } catch (error) {
    console.error("Error en la autenticación:", error);

    if (error.response) {
      console.log(
        "Error del servidor:",
        error.response.status,
        error.response.data,
      );
      throw new Error(error.response.data?.message || "Error del servidor");
    } else if (error.request) {
      console.log("Error de red: No se recibió respuesta del servidor");
      console.log("Verifica que el backend esté ejecutándose en:", BASE_URL);
      throw new Error(
        "No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.",
      );
    } else {
      console.log("Error:", error.message);
      throw new Error("Error de conexión: " + error.message);
    }
  }
};

const getToken = async () => {
  try {
    return await AsyncStorage.getItem("userToken");
  } catch (error) {
    console.error("Error obteniendo token:", error);
    return null;
  }
};

const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error obteniendo datos del usuario:", error);
    return null;
  }
};

const logout = async () => {
  try {
    // 0. Desconectar socket y servicios en tiempo real
    disconnectSocket();

    // Notify backend to clear push token
    try {
      const pushToken = await AsyncStorage.getItem("expoPushToken");

      if (pushToken) {
        console.log("Desregistrando push token:", pushToken);
        await axios.post(
          `${BASE_URL}/auth/unregister-push`,
          { pushToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 5000
          }
        );
        console.log("Backend notificado para eliminar push token");
        await AsyncStorage.removeItem("expoPushToken");
      }
    } catch (error) {
      console.log("Error desregistrando push token:", error.message);
    }
    delete axios.defaults.headers.common["Authorization"];

    // 2. Remover claves específicas primero (por seguridad)
    const keys = ["userToken", "userData", "usuarioId", "userId"];
    await AsyncStorage.multiRemove(keys);

    // 3. Limpiar TODO el almacenamiento
    await AsyncStorage.clear();
    console.log("Logout exitoso: Cabeceras y AsyncStorage limpiados completamente");
  } catch (error) {
    console.error("Error en logout:", error);
    // Intentar limpiar todo de todas formas si falla lo anterior
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error("Error crítico limpiando AsyncStorage:", e);
    }
  }
};

const updateUserProfile = async (userId, userData, token) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/usuarios/${userId}`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const updatedUser = response.data;
    await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));

    return updatedUser;
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return null;
  }
};

const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log("AsyncStorage limpiado completamente");
  } catch (error) {
    console.error("Error limpiando AsyncStorage:", error);
  }
};

export {
  login,
  getToken,
  getUserData,
  logout,
  updateUserProfile,
  clearAllStorage,
};

