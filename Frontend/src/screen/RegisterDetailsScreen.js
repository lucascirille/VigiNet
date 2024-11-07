import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function RegisterDetailsScreen({ navigation }) {
 
    const [nombre, setNombre] = useState('');
    const [usuario, setUsuario] = useState('');
    const [telefono, setTelefono] = useState('');
    const [pais, setPais] = useState('');
    const [provincia, setProvincia] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [barrio, setBarrio] = useState('');

 
    const handleRegister = () => {
     
        if (!nombre || !usuario || !telefono || !pais || !provincia || !localidad || !barrio) {
            Alert.alert("Error", "Por favor, complete todos los campos.");
            return;
        }
        
    
        console.log("Registro completado con los siguientes datos:", {
            nombre, usuario, telefono, pais, provincia, localidad, barrio
        });
        
     
        navigation.navigate('HomeScreen');
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
            />
            <TextInput
                style={styles.input}
                placeholder="Usuario"
                value={usuario}
                onChangeText={setUsuario}
            />
            <TextInput
                style={styles.input}
                placeholder="Teléfono"
                keyboardType="phone-pad"
                value={telefono}
                onChangeText={setTelefono}
            />
            <TextInput
                style={styles.input}
                placeholder="País"
                value={pais}
                onChangeText={setPais}
            />
            <TextInput
                style={styles.input}
                placeholder="Provincia"
                value={provincia}
                onChangeText={setProvincia}
            />
            <TextInput
                style={styles.input}
                placeholder="Localidad"
                value={localidad}
                onChangeText={setLocalidad}
            />
            <TextInput
                style={styles.input}
                placeholder="Barrio"
                value={barrio}
                onChangeText={setBarrio}
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10 },
    button: { backgroundColor: '#000', paddingVertical: 10, borderRadius: 5, alignItems: 'center' },
    buttonText: { color: '#FFF', fontSize: 16 },
});
