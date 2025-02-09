import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { setAuthData } = useAuth(); // Accede a la función para actualizar el contexto
  const [email, setEmail] = useState(""); // Estado local para almacenar el email
  const [error, setError] = useState(""); // Estado para manejar el mensaje de error

  const validateEmail = (email) => {
    // Expresión regular para validar el formato del correo electrónico
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailSubmit = async () => {
    if (!email) {
      setError("Por favor, ingresa tu correo electrónico.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    try {
      // Verificar si el correo electrónico está registrado
      const response = await fetch(`https://api.example.com/users?email=${email}`);
      const data = await response.json();

      if (!data || data.length === 0) {
        setError("El correo electrónico no está registrado.");
        return;
      }

      // Si el correo está registrado, obtenemos los datos del usuario
      const user = data[0]; // Suponiendo que la API devuelve un arreglo de usuarios, tomamos el primero

      setError(""); // Limpia el mensaje de error si el correo está registrado
      setAuthData((prev) => ({
        ...prev,
        email: user.email,
        id: user.id,
        name: user.name, // O cualquier otro dato que tu API retorne
        // Puedes agregar más datos si los necesitas
      })); // Almacena los datos del usuario en el contexto

      navigation.navigate("Password"); // Navega a la pantalla de contraseña
    } catch (error) {
      setError("Hubo un error al verificar el correo. Intenta nuevamente.");
    }
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ingrese su email para iniciar sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="email@dominio.com"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError(""); // Limpia el mensaje de error cuando el usuario comienza a escribir
        }}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Pressable style={[styles.button, styles.marginBottom]} onPress={handleEmailSubmit}>
        <Text style={styles.buttonText}>Iniciar Sesión Con Email</Text>
      </Pressable>
      <Pressable style={[styles.button, styles.marginTop, styles.buttonRegister]} onPress={handleRegister}>
        <Text style={styles.buttonText}>Crear Cuenta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontSize: 16 },
  marginBottom: { marginBottom: 20 },
  marginTop: { marginTop: 20 },
  buttonRegister: { backgroundColor: "#007BFF" }, // Color azul para el botón de Crear Cuenta
  errorText: { color: "red", marginBottom: 10 },
});
