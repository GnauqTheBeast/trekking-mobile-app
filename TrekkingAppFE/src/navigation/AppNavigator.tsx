import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import OnBoardingScreen from '../screens/Onboarding';
import TaskBarNavigator, { TaskBarStackParamList } from './TaskBarNavigator';
import LoginScreen from '../screens/Login';
import SignUpScreen from '../screens/Register';

export type RootStackParamList = {
  OnBoardingScreen: undefined,
  LoginScreen: undefined,
  SignUpScreen: undefined,
  MainStack: NavigatorScreenParams<TaskBarStackParamList>,
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} />
        <Stack.Screen name='LoginScreen' component={LoginScreen}/>
        <Stack.Screen name='SignUpScreen' component={SignUpScreen} />
        <Stack.Screen name="MainStack" component={TaskBarNavigator}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
