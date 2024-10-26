import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AlertScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.grid}>
        {alertTypes.map((alert, index) => (
          <TouchableOpacity key={index} style={[styles.alertButton, { backgroundColor: alert.color }]}>
            <Ionicons name={alert.icon} size={40} color="white" />
            <Text style={styles.alertText}>{alert.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.emergencyContainer}>
        <TouchableOpacity style={styles.emergencyButton}>
          <Text style={styles.emergencyText}>Emergencia</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.whatsappButton}>
          <Ionicons name="logo-whatsapp" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const alertTypes = [
  { label: 'Ambulancia', icon: 'medical', color: '#e74c3c' },
  { label: 'Violencia', icon: 'hand-left', color: '#f39c12' },
  { label: 'Homicidio', icon: 'skull', color: '#c0392b' },
  { label: 'Incendio', icon: 'flame', color: '#e67e22' },
  { label: 'Accidente', icon: 'car-sport', color: '#3498db' },
  { label: 'Asalto', icon: 'shield-checkmark', color: '#9b59b6' },
  { label: 'Inundación', icon: 'water', color: '#2980b9' },
  { label: 'Sospechoso', icon: 'eye', color: '#34495e' },
];

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  alertButton: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center', margin: 8, borderRadius: 10 },
  alertText: { color: 'white', marginTop: 8, textAlign: 'center' },
  emergencyContainer: { flexDirection: 'row', marginTop: 20 },
  emergencyButton: { backgroundColor: 'red', paddingHorizontal: 40, paddingVertical: 10, borderRadius: 5 },
  emergencyText: { color: 'white', fontSize: 20,fontWeight: 'bold'},
  whatsappButton: { backgroundColor: 'green', padding: 10, borderRadius: 30, marginLeft: 20 },
});
