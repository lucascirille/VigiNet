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
import Icon from "react-native-vector-icons/Feather"; // Importa el ícono

export default function PasswordScreen({ navigation }) {
  const { authData, loginUser } = useAuth(); // Accede al contexto
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const [loading, setLoading] = useState(false); // Estado para la carga
  const [secureText, setSecureText] = useState(true); // Estado para mostrar/ocultar la contraseña
  const [errorMessage, setErrorMessage] = useState(""); // Estado para el mensaje de error

  const handleLogin = async () => {
    if (!authData.email || !password) {
      setErrorMessage("Por favor, complete todos los campos.");
      return;
    }

    setLoading(true); // Indicamos que está cargando
    setErrorMessage(""); // Reseteamos el mensaje de error

    try {
      let auth = await loginUser(authData.email, password); 
      if (auth) {
        Alert.alert("Éxito", "Inicio de sesión exitoso.");
      } else {
        setErrorMessage("Correo electronico o contraseña no válido.");
      }
    } catch (error) {
      setErrorMessage("Hubo un error al iniciar sesión.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ingrese su contraseña</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry={secureText} // Controla si la contraseña está oculta o visible
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Icon name={secureText ? "eye" : "eye-off"} size={24} color="#000" />
        </TouchableOpacity>
      </View>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
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
  label: { fontSize: 16, marginBottom: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  input: { flex: 1, fontSize: 16 },
  button: {
    backgroundColor: "#000",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontSize: 16 },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
  },
});
