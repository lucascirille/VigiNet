import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import SplashScreen from './SRC/Componentes/SplashScreen';
import LoginScreen from './SRC/Componentes/LoginScreen';
import PasswordScreen from './SRC/Componentes/PasswordScreen';
import RegisterScreen from './SRC/Componentes/RegisterScreen';
import RegisterDetailsScreen from './SRC/Componentes/RegisterDetailsScreen';
import AlertScreen from './SRC/Componentes/AlertScreen';
import StatisticsScreen from './SRC/Componentes/StatisticsScreen';
import ProfileScreen from './SRC/Componentes/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const THEME = {
  colors: {
    primary: 'teal',
    inactive: 'gray',
    background: 'white',
  },
  headerStyle: {
    backgroundColor: 'white',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitleStyle: {
    fontWeight: '600',
  },
};

function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: THEME.headerStyle,
        headerTitleStyle: THEME.headerTitleStyle,
        cardStyle: { backgroundColor: THEME.colors.background },
      }}
    >
      <Stack.Screen 
        name="Viginet" 
        component={SplashScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: 'Iniciar Sesión' }} 
      />
      <Stack.Screen 
        name="Password" 
        component={PasswordScreen} 
        options={{ title: 'Ingresar Contraseña' }} 
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ title: 'Crear Cuenta' }} 
      />
      <Stack.Screen 
        name="RegisterDetails" 
        component={RegisterDetailsScreen} 
        options={{ title: 'Detalles del Registro' }} 
      />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Alertas"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Alertas: 'alert-circle',
            Estadísticas: 'bar-chart',
            Perfil: 'person-circle',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: THEME.colors.primary,
        tabBarInactiveTintColor: THEME.colors.inactive,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
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

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  
  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}