import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNotification } from "../context/NotificationContext";

export default function AlertScreen() {
  const { showNotification } = useNotification();

  const handleAlertPress = (alertLabel) => {
    // Aquí puedes enviar la alerta al servidor si quieres, o solo mostrar la notificación
    showNotification(alertLabel, "Descripción de la alerta");
    socket.emit("sendAlert", { neighborhoodId: 1, alertLabel }); // Enviar la alerta al backend
  };

  return (
    <View>
      <TouchableOpacity onPress={() => handleAlertPress("Ambulancia")}>
        <Text>Ambulancia</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleAlertPress("Violencia")}>
        <Text>Violencia</Text>
      </TouchableOpacity>
    </View>
  );
}
