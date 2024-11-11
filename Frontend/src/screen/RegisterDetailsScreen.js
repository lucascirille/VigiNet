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

export default function RegisterDetailsScreen({ navigation }) {
  const [paises, setPaises] = useState([]);

  useEffect(() => {
    const llamadaPaises = async () => {
      // Llamada a la API para obtener los paises
      try {
        let paises = await setPais();
        setPaises(paises);
      } catch (error) {
        console.error("Error al obtener los paises", error);
      }
    };

    llamadaPaises();
  }, []);

  const [formData, setFormData] = useState({
    nombre: "",
    usuario: "",
    telefono: "",
    pais: "",
    provincia: "",
    localidad: "",
    vecindario: "",
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
        <Picker
          selectedValue={formData.pais}
          onValueChange={(pais) => handleLoad("pais", pais)}
          style={styles.input}
        >
          <Picker.Item label="Selecciona un país" value="" />
          {paises.map((pais) => (
            <Picker.Item key={pais.paisId} label={pais.nombre} value={pais} />
          ))}
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="vecindario"
          value={formData.vecindario}
          onChangeText={(vecindario) => handleLoad("vecindario", vecindario)}
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
