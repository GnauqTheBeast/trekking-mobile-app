import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { TrekProps } from '../types/trek';
import { BookingProps } from '../types/booking';
import BottomBarNavigator, { BottomBarStackParamList } from './BottomBarNavigator';
import OnBoardingScreen from '../screens/common/Onboarding';
import LoginScreen from '../screens/common/Login';
import SignUpScreen from '../screens/common/Register';
import OTPScreen from '../screens/common/OTP';
import TrekDetail from '../screens/common/TrekDetail';
import BookingScreen from '../screens/common/Booking';
import CheckoutScreen from '../screens/common/Checkout';

export type RootStackParamList = {
  OnBoardingScreen: undefined,
  LoginScreen: undefined,
  SignUpScreen: undefined,
  OTPScreen: {email: string},
  TrekDetailScreen: {trek: TrekProps},
  BookingScreen: {trek: TrekProps, batchId: string | null}
  CheckoutScreen: {booking: BookingProps}
  MainStack: NavigatorScreenParams<BottomBarStackParamList>,
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} />
        <Stack.Screen name='LoginScreen' component={LoginScreen}/>
        <Stack.Screen name='SignUpScreen' component={SignUpScreen} />
        <Stack.Screen name='OTPScreen' component={OTPScreen} />
        <Stack.Screen name='TrekDetailScreen' component={TrekDetail} />
        <Stack.Screen name='BookingScreen' component={BookingScreen} />
        <Stack.Screen name='CheckoutScreen' component={CheckoutScreen} />
        <Stack.Screen name="MainStack" component={BottomBarNavigator}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
