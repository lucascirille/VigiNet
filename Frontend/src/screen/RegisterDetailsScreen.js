import React, { useEffect, useState } from "react";
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
import { Picker } from "@react-native-picker/picker";
import {
  setPais,
  setProvincia,
  setLocalidad,
} from "../service/EnumGeoNamesService.js";

import VecindariosPicker from "../service/GeoJsonVecindarios.jsx";
import CountriesPicker from "../service/CountriesService.jsx";



export default function RegisterDetailsScreen({ navigation }) {
  

  const [formData, setFormData] = useState({
    nombre: "",
    usuario: "",
    telefono: "",
    pais: "",
    provincia: "",
    localidad: "",
    vecindario: "",
    email: "",
  });

  const handleLoad = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleRegister = () => {
    if (
      !formData.vecindario ||
      !formData.usuario ||
      !formData.localidad ||
      !formData.pais ||
      !formData.provincia ||
      !formData.telefono ||
      !formData.nombre ||
      !formData.email
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
          placeholder="Email"
          value={formData.email}
          onChangeText={(email) => handleLoad("email", email)}
          keyboardType="email-address"
          autoCapitalize="none"
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
        <CountriesPicker
          selectedValue={formData.pais}
          onValueChange={(pais) => handleLoad("pais", pais)}
          style={styles.input}
        />
        <VecindariosPicker
          selectedValue={formData.vecindario}
          onValueChange={(vecindario) => {
            console.log("Selected vecindario:", vecindario); // Debug log
            handleLoad("vecindario", vecindario);
          }}
          style={styles.input}
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
