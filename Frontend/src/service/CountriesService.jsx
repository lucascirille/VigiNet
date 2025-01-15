import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";


import countriesData from "../../assets/data/countries.json";
const CountriesPicker = ({ selectedValue, onValueChange, style }) => {
  const [countryList, setCountryList] = useState([]);

  useEffect(() => {
    // Access the "countries" array inside the JSON
    if (countriesData && countriesData.countries && countriesData.countries.length > 0) {
      setCountryList(countriesData.countries);
    } else {
      console.error("Countries data is missing or invalid");
    }
  }, []);

  return (
    <View style={style}>
      <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
        <Picker.Item label="Seleccione un País" value="" />
        {countryList.map((country, index) => (
          <Picker.Item
            key={index} // Usa el índice como clave
            label={country.es_name} // Devuelve el nombre en español o el código como etiqueta
            value={country.es_name} // Devuelve el nombre en español o el código como valor
          />
        ))}
      </Picker>
    
    </View>
  );
};

export default CountriesPicker;
