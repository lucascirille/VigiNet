import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function PasswordScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ingrese su contraseña</Text>
      <TextInput style={styles.input} placeholder="contraseña" secureTextEntry={true} />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 20 },
  button: { backgroundColor: '#000', paddingVertical: 10, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 16 },
});
