import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Dev: undefined;
  OnBoardingScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ForgotPasswordScreen: undefined;
  ChangePasswordScreen: undefined;
  HomeScreen: undefined;
  TrekDetail: { id: string };
  CheckoutScreen: { booking: any };
  TopUpScreen: undefined;
  BookingList: undefined;
  Home: undefined;
  TrekStack: NavigatorScreenParams<TrekStackParamList>;
  Profile: undefined;
  Notifications: undefined;
};

export type TrekStackParamList = {
  TrekList: undefined;
  CreateTrek: undefined;
  EditTrek: { trekId: string };
  TrekDetail: { trekId: string };
}; 
