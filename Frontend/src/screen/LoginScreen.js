import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import Icon from "react-native-vector-icons/Feather";

export default function LoginScreen({ navigation }) {
  const { setAuthData, loginUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    setError("");

    if (!email) {
      setError("Por favor, ingresa tu correo electrónico.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    if (!password) {
      setError("Por favor, ingresa tu contraseña.");
      return;
    }

    setLoading(true);
    try {
      console.log("Iniciando proceso de login...");
      const auth = await loginUser(email, password);

      if (auth) {
        console.log("Login exitoso, navegando...");

      } else {
        console.log("Login fallido");
        setError("Correo electrónico o contraseña no válidos.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Hubo un error al iniciar sesión. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate("Register");
    console.log("Estas en register");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Iniciar sesión</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="email@dominio.com"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError("");
          }}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Contraseña"
          secureTextEntry={secureText}
          onChangeText={(text) => {
            setPassword(text);
            setError("");
          }}
          value={password}
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Icon name={secureText ? "eye" : "eye-off"} size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable style={[styles.button, styles.marginBottom]} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Text>
      </Pressable>

      <Pressable style={[styles.button, styles.marginTop, styles.buttonRegister]} onPress={handleRegister}>
        <Text style={styles.buttonText}>Crear Cuenta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  label: { fontSize: 20, marginBottom: 20, textAlign: "center", fontWeight: "bold" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    height: 50, // Fixed height for consistency
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    paddingVertical: 0, // Remove default Android padding
    color: '#000',
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  marginBottom: { marginBottom: 20 },
  marginTop: { marginTop: 20 },
  buttonRegister: { backgroundColor: "#007BFF" },
  errorText: { color: "red", marginBottom: 10, textAlign: "center" },
});