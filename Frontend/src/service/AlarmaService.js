import axios from "axios";
const BASE_URL = "http://localhost:3000/api/alarmas"; // Reemplaza con la URL de tu backend



export const setAlarma = async (alarmaData) => {
  const { data } = await axios.post(BASE_URL, alarmaData);
  console.log(data);
  return data;
};


