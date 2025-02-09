import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from "../service/AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    email: "",
    isAuthenticated: false,
    token: null,
    loading: true // Agregar estado de carga
  });

  // Cargar datos de autenticación al iniciar la app
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Cargar datos almacenados en AsyncStorage
  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      const storedEmail = await AsyncStorage.getItem('userEmail');
      
      if (storedToken && storedEmail) {
        setAuthData({
          email: storedEmail,
          isAuthenticated: true,
          token: storedToken,
          loading: false
        });
      } else {
        setAuthData(prev => ({
          ...prev,
          loading: false
        }));
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
      setAuthData(prev => ({
        ...prev,
        loading: false
      }));
    }
  };

  const loginUser = async (email, password) => {
    try {
      const response = await login(email, password);
      
      if (response && response.token) {
        // Guardar en AsyncStorage
        await AsyncStorage.multiSet([
          ['userToken', response.token],
          ['userEmail', email]
        ]);

        // Actualizar estado
        setAuthData({
          email,
          isAuthenticated: true,
          token: response.token,
          loading: false
        });
        
        return true;
      } else {
        throw new Error(response?.message || 'Error en la autenticación');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Limpiar AsyncStorage
      await AsyncStorage.multiRemove(['userToken', 'userEmail']);
      
      // Resetear estado
      setAuthData({
        email: "",
        isAuthenticated: false,
        token: null,
        loading: false
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Utilidad para actualizar el token si es necesario
  const updateToken = async (newToken) => {
    try {
      await AsyncStorage.setItem('userToken', newToken);
      setAuthData(prev => ({
        ...prev,
        token: newToken
      }));
    } catch (error) {
      console.error('Error updating token:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        authData, 
        loginUser, 
        logout,
        updateToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;