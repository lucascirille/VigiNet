import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.profileImage} />
      <TouchableOpacity>
        <Text style={styles.editText}>Editar foto de perfil</Text>
      </TouchableOpacity>
      {profileInfo.map((info, index) => (
        <View key={index} style={styles.infoContainer}>
          <Text style={styles.infoLabel}>{info.label}</Text>
          <Text style={styles.infoValue}>{info.value}</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const profileInfo = [
  { label: 'Nombre', value: 'Mabel Canales' },
  { label: 'Usuario', value: 'MabelCanales' },
  { label: 'Email', value: 'mabelcanales20@gmail.com' },
  { label: 'Teléfono', value: '+54 1123456789' },
  { label: 'Dirección', value: 'Lugones 1230' },
  { label: 'Barrio', value: 'Quilmes Este' },
  { label: 'Localidad', value: 'Quilmes' },
  { label: 'Provincia', value: 'Buenos Aires' },
  { label: 'País', value: 'Argentina' },
];

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 16 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  editText: { color: 'teal', marginBottom: 20 },
  infoContainer: { width: '100%', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ecf0f1' },
  infoLabel: { fontSize: 14, color: 'gray' },
  infoValue: { fontSize: 16, fontWeight: 'bold' },
  logoutButton: { marginTop: 30, backgroundColor: 'teal', paddingHorizontal: 40, paddingVertical: 10, borderRadius: 5 },
  logoutText: { color: 'white', fontSize: 18 },
});
