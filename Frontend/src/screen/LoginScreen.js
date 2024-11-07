import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext"; // Asegúrate de importar el contexto

export default function LoginScreen({ navigation }) {
  const { setAuthData } = useAuth(); // Accede a la función para actualizar el contexto
  const [email, setEmail] = useState(""); // Estado local para almacenar el email

  const handleEmailSubmit = () => {
    setAuthData((prev) => ({ ...prev, email })); // Almacena el email en el contexto
    navigation.navigate("Password"); // Navega a la pantalla de contraseña
    console.log(email);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ingrese su email para iniciar sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="email@dominio.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail} // Llama a la función al presionar "Enter"
      />
      <Pressable style={styles.button} onPress={handleEmailSubmit}>
        <Text style={styles.buttonText}>Iniciar Sesión Con Email</Text>
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
});
