import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { TrekHostProps, TrekProps } from '../../types/trek';
import { BookingProps } from '../../types/booking';
import BottomBarNavigator, { BottomBarStackParamList } from './BottomBarNavigator';
import OnBoardingScreen from '../../screens/common/Onboarding';
import LoginScreen from '../../screens/common/authentication/Login';
import SignUpScreen from '../../screens/common/authentication/Register';
import OTPScreen from '../../screens/common/authentication/OTP';
import TrekHomeDetail from '../../screens/common/TrekDetail';
import BookingScreen from '../../screens/common/Booking';
import CheckoutScreen from '../../screens/common/Checkout';
import ForgotPasswordScreen from '../../screens/common/authentication/ForgotPassword';
import ResetPasswordScreen from '../../screens/common/authentication/ResetPassword';
import TrekStackNavigator from '../host/TrekStackNavigator';
import { TrekStackParamList } from '../../types/navigation';
import ForgotOTPScreen from '../../screens/common/authentication/ForgotOTP';
import WalletStackNavigator, { WalletStackParamList } from './account/WalletNavigator';
import AccountSecurityStackNavigator, { AccountSecurityStackParamList } from './account/AccountSecurityNavigator';
export type RootStackParamList = {
  Dev: undefined,
  OnBoardingScreen: undefined,
  LoginScreen: undefined,
  SignUpScreen: undefined,
  ForgotPasswordScreen: undefined,
  ResetPasswordScreen: {email: string},
  OTPScreen: {email: string},
  ForgotOTPScreen: {email: string},


  TrekDetailScreen: {trek: TrekHostProps},
  BookingScreen: {trek: TrekHostProps}
  CheckoutScreen: {booking: BookingProps}

  TrekStack: NavigatorScreenParams<TrekStackParamList>;
  MainStack: NavigatorScreenParams<BottomBarStackParamList>,
  WalletStack: NavigatorScreenParams<WalletStackParamList>
  AccountSecurityStack: NavigatorScreenParams<AccountSecurityStackParamList>
};

const Stack = createStackNavigator<RootStackParamList>();

const UserAppNavigator: React.FC = () => {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="Dev" component={MyWalletScreen} /> */}
        <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} />
        <Stack.Screen name='LoginScreen' component={LoginScreen}/>
        <Stack.Screen name='SignUpScreen' component={SignUpScreen} />
        <Stack.Screen name='ForgotPasswordScreen' component={ForgotPasswordScreen} />
        <Stack.Screen name='ResetPasswordScreen' component={ResetPasswordScreen} />
        <Stack.Screen name='OTPScreen' component={OTPScreen} />
        <Stack.Screen name='ForgotOTPScreen' component={ForgotOTPScreen} />

        <Stack.Screen name='TrekDetailScreen' component={TrekHomeDetail} />
        <Stack.Screen name='BookingScreen' component={BookingScreen} />
        <Stack.Screen name='CheckoutScreen' component={CheckoutScreen} />

        <Stack.Screen name="MainStack" component={BottomBarNavigator}/>
        <Stack.Screen name='TrekStack' component={TrekStackNavigator} />
        <Stack.Screen name='WalletStack' component={WalletStackNavigator} />
        <Stack.Screen name='AccountSecurityStack' component={AccountSecurityStackNavigator} />

      </Stack.Navigator>
  );
};

export default UserAppNavigator;
