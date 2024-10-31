import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function StatisticsScreen() {
  // Datos para el gráfico de torta
  const pieData = [
    { name: 'Robos', population: 25, color: '#3498db', legendFontColor: '#3498db', legendFontSize: 12 },
    { name: 'Emergencias', population: 20, color: '#e74c3c', legendFontColor: '#e74c3c', legendFontSize: 12 },
    { name: 'Sospechosos', population: 15, color: '#f39c12', legendFontColor: '#f39c12', legendFontSize: 12 },
    { name: 'Incendios', population: 10, color: '#e67e22', legendFontColor: '#e67e22', legendFontSize: 12 },
  ];

  // Extraer los valores del gráfico de torta
  const pieValues = pieData.map(item => item.population);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.subtitle}>Alertas en el último tiempo</Text>
      <PieChart
        data={pieData}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      <Text style={styles.subtitle}>Delitos en tu cuadra</Text>
      <LineChart
        data={{
          labels: ['Robos', 'Emergencias', 'Sospechosos', 'Incendios'], // Etiquetas de cada sección del gráfico
          datasets: [
            {
              data: pieValues, // Usar los valores extraídos del gráfico de torta
              color: () => `rgba(52, 152, 219, 1)`,
              strokeWidth: 3, // Aumentar el grosor de la línea
            },
          ],
        }}
        width={screenWidth - -60} // Aumentar el margen para hacer más ancho el gráfico
        height={350} // Mantener la altura del gráfico
        chartConfig={{
          backgroundGradientFrom: '#f7f7f7',
          backgroundGradientTo: '#f7f7f7',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
          labelColor: () => '#34495e',
          style: { borderRadius: 16 },
          propsForLabels: {
            fontSize: 10, // Tamaño de la fuente para las etiquetas
          },
        }}
        bezier
        style={styles.chart}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  subtitle: { 
    fontSize: 18, 
    marginVertical: 8, 
    textAlign: 'center', // Alinear el texto a la izquierda
    width: '100%', // Hacer que el texto ocupe todo el ancho para alineación adecuada
    fontWeight: 'bold', // Poner el texto en negrita
  },
  chart: { borderRadius: 16, marginVertical: 8 },
});
