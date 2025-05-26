import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { RoleContext } from '../context/RoleProvider';
import UserAppNavigator from './main/UserAppNavigator';
import HostAppNavigator from './host/HostAppNavigator';


const AppNavigator: React.FC = () => {
    const roleContext = useContext(RoleContext);
    const role = roleContext?.role;

    console.log("current Role: ", role)

    return (
        <NavigationContainer>
            {role === 'HOST' ? <HostAppNavigator /> : <UserAppNavigator />}
        </NavigationContainer>
  );
};

export default AppNavigator;
