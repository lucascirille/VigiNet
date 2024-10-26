
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function RegisterScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ingrese su email para registrarse</Text>
      <TextInput style={styles.input} placeholder="email@dominio.com" keyboardType="email-address" />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RegisterDetails')}
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
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 20 },
  button: { backgroundColor: '#000', paddingVertical: 10, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 16 },
  disclaimer: { fontSize: 12, color: '#777', textAlign: 'center', marginTop: 20 },
});
