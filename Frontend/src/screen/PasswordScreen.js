import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext"; // Importa el contexto

export default function PasswordScreen({ navigation }) {
  const { authData, loginUser } = useAuth(); // Accede al contexto
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const [loading, setLoading] = useState(false); // Estado para la carga

  const handleLogin = async () => {
    if (!authData.email || !password) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }

    setLoading(true); // Indicamos que está cargando

    try {
      let auth = await loginUser(authData.email, password); // Llama a la función del contexto para hacer el login
      if (auth) {
        Alert.alert("Éxito", "Inicio de sesión exitoso.");
      } else {
        Alert.alert("Error", "Credenciales incorrectas.");
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un error al iniciar sesión.");
    } finally {
      setLoading(false); // Termina la carga
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ingrese su contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading} // Deshabilita el botón mientras carga
      >
        <Text style={styles.buttonText}>
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Text>
      </TouchableOpacity>
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