import axios from "axios";
const BASE_URL = "http://localhost:3000/api"; // Reemplaza con la URL de tu backend

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      contrasena: password,
    });
    return response.data; // Axios devuelve la data directamente
  } catch (error) {
    console.error("Error en la autenticación:", error);
    throw error; // Lanza el error para que el componente lo maneje
  }
};
