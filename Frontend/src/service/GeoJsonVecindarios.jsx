import React, { useState, useEffect } from "react";
import { View, Picker, Text } from "react-native";
import barriosData from "../../assets/data/vecindarios.json";

const LocalidadesPicker = ({ selectedValue, onValueChange, style }) => {
  const [barriosList, setBarriosList] = useState([]);

  useEffect(() => {
    // Access the "barrios" array inside the JSON
    if (barriosData && barriosData.barrios && barriosData.barrios.length > 0) {
      console.log("Barrios loaded:", barriosData.barrios); // Debug log
      setBarriosList(barriosData.barrios);
    } else {
      console.error("Barrios data is missing or invalid");
    }
  }, []);

  return (
    <View style={style}>
      <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
        <Picker.Item label="Seleccione un Barrio" value="" />
        {barriosList.map((localidades, index) => (
          <Picker.Item
            key={index}
            label={localidades.properties.localidad || "Unknown"}
            value={localidades.properties.localidad || ""}
          />
        ))}
      </Picker>
    </View>
  );
};

export default LocalidadesPicker;
