import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ingrese su email para iniciar sesión</Text>
      <TextInput style={styles.input} placeholder="email@dominio.com" keyboardType="email-address" />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Password')}
      >
        <Text style={styles.buttonText}>Iniciar Sesión Con Email</Text>
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
