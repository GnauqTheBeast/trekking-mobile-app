import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import NotificationManager from './components/NotificationManager';
import { wsService } from './services/websocket.service';
import { AuthProvider } from './context/AuthProvider';
import { RoleProvider } from './context/RoleProvider';
import AppNavigator from './navigation/AppNavigator';

const App = () => {

  return (
    <AuthProvider>
      <RoleProvider>
        <AppNavigator />
        <NotificationManager />
      </RoleProvider>
    </AuthProvider>
  );
};

export default App;
