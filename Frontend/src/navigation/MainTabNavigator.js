import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AlertScreen from "../screen/AlertScreen";
import StatisticsScreen from "../screen/StatisticsScreen";
import ProfileScreen from "../screen/ProfileScreen";
import { THEME } from "../theme/theme";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Alertas"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Alertas: "alert-circle",
            Estadísticas: "bar-chart",
            Perfil: "person-circle",
          };
          return (
            <Ionicons name={icons[route.name]} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: THEME.colors.primary,
        tabBarInactiveTintColor: THEME.colors.inactive,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerStyle: THEME.headerStyle,
        headerTitleStyle: THEME.headerTitleStyle,
      })}
    >
      <Tab.Screen name="Alertas" component={AlertScreen} />
      <Tab.Screen name="Estadísticas" component={StatisticsScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
