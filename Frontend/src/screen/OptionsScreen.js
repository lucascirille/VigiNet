import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch, Linking, Platform, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import * as Notifications from 'expo-notifications';
import { Ionicons } from "@expo/vector-icons";

export default function OptionsScreen({ navigation }) {
    const { logout } = useAuth();
    const [areNotificationsEnabled, setAreNotificationsEnabled] = useState(false);

    useEffect(() => {
        checkNotificationPermissions();
        // Add listener to check permissions when app comes back to foreground
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (nextAppState === "active") {
                checkNotificationPermissions();
            }
        });

        // Also keep the notification response listener
        const notificationSubscription = Notifications.addNotificationResponseReceivedListener(() => {
            checkNotificationPermissions();
        });

        return () => {
            subscription.remove();
            notificationSubscription.remove();
        };
    }, []);

    const checkNotificationPermissions = async () => {
        const settings = await Notifications.getPermissionsAsync();
        setAreNotificationsEnabled(
            settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
        );
    };

    const handleNotificationToggle = async () => {
        Alert.alert(
            "Configuración de Notificaciones",
            "Para cambiar la configuración de notificaciones, necesitas ir a los ajustes del sistema.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Ir a Ajustes",
                    onPress: () => {
                        if (Platform.OS === 'ios') {
                            Linking.openURL('app-settings:');
                        } else {
                            Linking.openSettings();
                        }
                    }
                }
            ]
        );
    };

    const handleLogout = () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro de que quieres cerrar sesión?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Cerrar Sesión",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await logout();
                        } catch (error) {
                            console.error("Error al cerrar sesión:", error);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={['bottom', 'left', 'right']}>
            <View style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>General</Text>

                    <View style={styles.optionRow}>
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.optionTitle}>Recibir notificaciones afuera de la aplicación</Text>
                            <Text style={styles.optionSubtitle}>
                                {areNotificationsEnabled ? "Activado" : "Desactivado"}
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={areNotificationsEnabled ? "#0D99FF" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={handleNotificationToggle}
                            value={areNotificationsEnabled}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={24} color="#FF3B30" style={styles.logoutIcon} />
                        <Text style={styles.logoutText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 16,
    },
    section: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#333",
    },
    optionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    optionTextContainer: {
        flex: 1,
        paddingRight: 16,
    },
    optionTitle: {
        fontSize: 16,
        color: "#333",
        marginBottom: 4,
    },
    optionSubtitle: {
        fontSize: 14,
        color: "gray",
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
    },
    logoutText: {
        color: "#FF3B30",
        fontSize: 18,
        fontWeight: "600",
    },
    logoutIcon: {
        marginRight: 8,
    }
});
