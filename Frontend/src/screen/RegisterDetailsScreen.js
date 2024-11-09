import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";

export default function RegisterDetailsScreen({ navigation }) {
  const [formData, setFormData] = useState({
    nombre: "",
    usuario: "",
    telefono: "",
    pais: "",
    provincia: "",
    localidad: "",
    barrio: "",
  });

  const handleLoad = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleRegister = () => {
    if (
      !formData.barrio ||
      !formData.usuario ||
      !formData.localidad ||
      !formData.pais ||
      !formData.provincia ||
      !formData.telefono ||
      !formData.nombre
    ) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }
    console.log("Registro completado con los siguientes datos:", formData);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={formData.nombre}
          onChangeText={(nombre) => handleLoad("nombre", nombre)}
        />
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={formData.usuario}
          onChangeText={(usuario) => handleLoad("usuario", usuario)}
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          keyboardType="phone-pad"
          value={formData.telefono}
          onChangeText={(telefono) => handleLoad("telefono", telefono)}
        />
        <TextInput
          style={styles.input}
          placeholder="País"
          value={formData.pais}
          onChangeText={(pais) => handleLoad("pais", pais)}
        />
        <TextInput
          style={styles.input}
          placeholder="Provincia"
          value={formData.provincia}
          onChangeText={(provincia) => handleLoad("provincia", provincia)}
        />
        <TextInput
          style={styles.input}
          placeholder="Localidad"
          value={formData.localidad}
          onChangeText={(localidad) => handleLoad("localidad", localidad)}
        />
        <TextInput
          style={styles.input}
          placeholder="Barrio"
          value={formData.barrio}
          onChangeText={(barrio) => handleLoad("barrio", barrio)}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontSize: 16 },
});
