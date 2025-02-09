import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "http://localhost:3000/api";

// Configuración por defecto de axios
axios.defaults.baseURL = BASE_URL;

// Interceptor para incluir el token en todas las peticiones
axios.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const login = async (email, password) => {
  try {
    const response = await axios.post('/auth/login', {
      email,
      contrasena: password,
    });

    if (response.data.token) {
      await AsyncStorage.multiSet([
        ['userToken', response.data.token],
        ['userData', JSON.stringify(response.data.user)]
      ]);
    }

    return response.data;
  } catch (error) {
    console.error("Error en la autenticación:", error);
    throw error;
  }
};

const getToken = async () => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.error("Error al obtener el token:", error);
    return null;
  }
};

const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    return null;
  }
};

const logout = async () => {
  try {
    await AsyncStorage.multiRemove(['userToken', 'userData']);
    delete axios.defaults.headers.common['Authorization'];
    return true;
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error;
  }
};

const validateToken = async () => {
  try {
    const token = await getToken();
    if (!token) return false;

    const response = await axios.post('/auth/validate-token', { token });
    return response.data.valid;
  } catch (error) {
    console.error("Error al validar el token:", error);
    return false;
  }
};

export {
  login,
  getToken,
  getUserData,
  logout,
  validateToken
};