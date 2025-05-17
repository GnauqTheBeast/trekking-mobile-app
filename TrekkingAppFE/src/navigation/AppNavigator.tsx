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
import MyProfileScreen from '../screens/common/profile/MyProfile';
import EditNameScreen from '../screens/common/profile/EditName';
import EditPhoneScreen from '../screens/common/profile/EditPhone';
import EditAddressScreen from '../screens/common/profile/EditAddress';

export type RootStackParamList = {
  Dev: undefined,
  OnBoardingScreen: undefined,
  LoginScreen: undefined,
  SignUpScreen: undefined,
  OTPScreen: {email: string},
  TrekDetailScreen: {trek: TrekProps},
  BookingScreen: {trek: TrekProps, batchId: string | null}
  CheckoutScreen: {booking: BookingProps}
  MyProfileScreen: undefined
  EditNameScreen: {name: string, onSave: (newName: string) => void},
  EditPhoneScreen: {phone: string, onSave: (newPhone: string) => void}
  EditAddressScreen: {address: string, onSave: (newAddress: string) => void}
  MainStack: NavigatorScreenParams<BottomBarStackParamList>,
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="Dev" component={MyProfileScreen} /> */}
        <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} />
        <Stack.Screen name='LoginScreen' component={LoginScreen}/>
        <Stack.Screen name='SignUpScreen' component={SignUpScreen} />
        <Stack.Screen name='OTPScreen' component={OTPScreen} />

        <Stack.Screen name='TrekDetailScreen' component={TrekDetail} />
        <Stack.Screen name='BookingScreen' component={BookingScreen} />
        <Stack.Screen name='CheckoutScreen' component={CheckoutScreen} />

        <Stack.Screen name="MyProfileScreen" component={MyProfileScreen} />
        <Stack.Screen name='EditNameScreen' component={EditNameScreen} />
        <Stack.Screen name='EditPhoneScreen' component={EditPhoneScreen} />
        <Stack.Screen name='EditAddressScreen' component={EditAddressScreen} />
        <Stack.Screen name="MainStack" component={BottomBarNavigator}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
