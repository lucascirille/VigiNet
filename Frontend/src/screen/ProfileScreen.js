import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/100'); // Estado para la imagen de perfil

  // Función para seleccionar una imagen
  const pickImage = async () => {
    // Pedir permiso para acceder a la galería
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert('Se necesita permiso para acceder a la galería!');
      return;
    }

    // Abrir la galería para seleccionar una imagen
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Asegúrate de acceder a la URI correctamente
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri); // Actualizar la imagen de perfil usando la URI correcta
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: profileImage }} style={styles.profileImage} />
      <TouchableOpacity onPress={pickImage}>
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
    </ScrollView>
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
  container: { flexGrow: 1, alignItems: 'center', padding: 16 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  editText: { color: '#0D99FF', marginBottom: 20 },
  infoContainer: { width: '100%', padding: 10, borderBottomWidth: 10, borderBottomColor: '#ecf0f1' },
  infoLabel: { fontSize: 14, color: 'gray' },
  infoValue: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  logoutButton: { marginTop: 30, backgroundColor: 'teal', paddingHorizontal: 40, paddingVertical: 10, borderRadius: 90, alignItems:'center' },
  logoutText: { color: 'white', fontSize: 20,textAlign: 'center' },
}); 
