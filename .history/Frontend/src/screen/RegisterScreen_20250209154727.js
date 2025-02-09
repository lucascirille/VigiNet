import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";  // O puedes usar fetch

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [existingEmails, setExistingEmails] = useState([]); // Para almacenar los correos existentes

  useEffect(() => {
    // Obtener todos los correos electrónicos existentes de la API cuando la pantalla se cargue
    const fetchEmails = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/usuarios"); // Reemplaza con la URL de tu API
        const emails = response.data.map(user => user.email); // Suponiendo que la respuesta tiene una propiedad 'email'
        setExistingEmails(emails);
      } catch (error) {
        console.error("Error al obtener correos", error);
      }
    };
    
    fetchEmails();
  }, []);

  const handleRegister = () => {
    if (!email) {
      alert("Por favor, ingrese un email válido.");
      return;
    }

    // Verificar si el correo ya existe en la lista
    if (existingEmails.includes(email)) {
      alert("El correo electrónico ya está registrado.");
      return;
    }

    // Navegar a la siguiente pantalla con el email
    navigation.navigate("RegisterDetails", { email });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ingrese su email para registrarse</Text>
      <TextInput
        style={styles.input}
        placeholder="email@dominio.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      <Text style={styles.disclaimer}>
        Tocando, está aceptando los Términos del Servicio y las Políticas de Privacidad.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 20 },
  button: { backgroundColor: "#000", paddingVertical: 10, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "#FFF", fontSize: 16 },
  disclaimer: { fontSize: 12, color: "#777", textAlign: "center", marginTop: 20 },
});
