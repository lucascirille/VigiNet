import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
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

  const handleEmailSubmit = () => {
    if (!email) {
      setError("Por favor, ingresa tu correo electrónico.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    setError(""); // Limpia el mensaje de error si el correo es válido
    setAuthData((prev) => ({ ...prev, email })); // Almacena el email en el contexto
    navigation.navigate("Password"); // Navega a la pantalla de contraseña
    console.log(email);
  };

  const handleRegister = () => {
    navigation.navigate("Register");
    console.log("Estas en register");
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
