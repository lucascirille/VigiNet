import React, { useState, useEffect } from "react";
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
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons"; // Asegúrate de tener este paquete instalado
const { width } = Dimensions.get("window");
const BASE_URL = "http://localhost:3000/api"; // Asegurate de usar la IP de tu backend

export default function RegisterDetailsScreen({ navigation, route }) {
  const { email } = route.params;
  const [vecindarios, setVecindarios] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    contrasena: "",
    confirmarContrasena: "",
    direccion: "",
    telefono: "",
    vecindarioId: "",
  });
  const [showPassword, setShowPassword] = useState(false); // Para la visibilidad de la contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Para la visibilidad de la confirmación de contraseña
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const fetchVecindarios = () => {
      const barrios = [
        { id: "1", nombre: "Quilmes Oeste" },
        { id: "2", nombre: "Quilmes Centro" },
        { id: "3", nombre: "Quilmes Este" },
        { id: "4", nombre: "La Colonia" },
        { id: "5", nombre: "Solano" },
        { id: "6", nombre: "San Francisco Solano" },
        { id: "7", nombre: "San Juan" },
        { id: "8", nombre: "Ezpeleta" },
        { id: "9", nombre: "Ezpeleta Oeste" },
      ];
      setVecindarios(barrios);
    };
    fetchVecindarios();
  }, []);

  const handleLoad = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleRegister = async () => {
    // Verificación de que todas las contraseñas coincidan
    if (formData.contrasena !== formData.confirmarContrasena) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.contrasena ||
      !formData.confirmarContrasena ||
      !formData.direccion ||
      !formData.telefono ||
      !formData.vecindarioId
    ) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }

    const usuario = {
      ...formData,
      email,
      vecindarioId: parseInt(formData.vecindarioId, 10),
    };
    try {
      const response = await axios.post(`${BASE_URL}/usuarios`, usuario, {
        headers: { "Content-Type": "application/json" },
      });
      Alert.alert("Éxito", "Usuario registrado correctamente");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error en el registro:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "No se pudo registrar el usuario.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Completa tus datos</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={formData.nombre}
          onChangeText={(value) => handleLoad("nombre", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={formData.apellido}
          onChangeText={(value) => handleLoad("apellido", value)}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
            value={formData.contrasena}
            onChangeText={(value) => handleLoad("contrasena", value)}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirmar Contraseña"
            secureTextEntry={!showConfirmPassword}
            value={formData.confirmarContrasena}
            onChangeText={(value) => handleLoad("confirmarContrasena", value)}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <FontAwesome name={showConfirmPassword ? "eye-slash" : "eye"} size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Dirección"
          value={formData.direccion}
          onChangeText={(value) => handleLoad("direccion", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          keyboardType="phone-pad"
          value={formData.telefono}
          onChangeText={(value) => handleLoad("telefono", value)}
        />
        <TouchableOpacity style={styles.pickerContainer} onPress={() => setShowPicker(true)}>
          <Text style={styles.pickerText}>
            {formData.vecindarioId
              ? vecindarios.find((v) => v.id === formData.vecindarioId)?.nombre
              : "Seleccione un vecindario"}
          </Text>
        </TouchableOpacity>
        <Modal
          visible={showPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Picker
              selectedValue={formData.vecindarioId}
              onValueChange={(itemValue) => {
                handleLoad("vecindarioId", itemValue);
                setShowPicker(false);
              }}
            >
              <Picker.Item label="Seleccione un vecindario" value="" />
              {vecindarios.map((vecindario) => (
                <Picker.Item key={vecindario.id} label={vecindario.nombre} value={vecindario.id} />
              ))}
            </Picker>
          </View>
        </Modal>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingTop: 30,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    height: 50,
    fontSize: 18,
    borderRadius: 5,
    marginBottom: 15,
    width: width * 0.85,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width * 0.85,
    marginBottom: 15,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  pickerContainer: {
    width: width * 0.85,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    justifyContent: "center",
  },
  pickerText: {
    fontSize: 18,
    color: "#000",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    width: width * 0.5,
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});
