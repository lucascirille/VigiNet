import React, { createContext, useState, useContext } from 'react';
import NotificationComponent from '../components/NotificationComponent';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (title, message) => {
    setNotification({ title, message });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notification && (
        <NotificationComponent
          title={notification.title}
          message={notification.message}
          onClose={hideNotification}
          autoClose={false}
        />
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);