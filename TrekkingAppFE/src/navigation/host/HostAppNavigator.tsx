import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {NavigatorScreenParams } from '@react-navigation/native';
import TrekStackNavigator from '../host/TrekStackNavigator';
import { TrekStackParamList } from '../../types/navigation';
import ForgotOTPScreen from '../../screens/common/authentication/ForgotOTP';
import ChangeEmailOTPScreen from '../../screens/common/authentication/ChangeEmailOTP';
import CreateTrek from '../../screens/tour-stack/CreateTrek';
import EditTrek from '../../screens/tour-stack/EditTrek';
import TrekDetail from '../../screens/tour-stack/TrekDetail';
import HostBottomBarNavigator, { HostBottomBarStackParamList } from './HostBottomBarNavigator';
export type RootStackParamList = {
  Dev: undefined,
  TrekStack: NavigatorScreenParams<TrekStackParamList>;
  MainStack: NavigatorScreenParams<HostBottomBarStackParamList>,
  CreateTrek: undefined;
  EditTrek: { trekId: string };
  TrekDetail: { trekId: string };
//   AccountSecurityStack: NavigatorScreenParams<AccountSecurityStackParamList>
};

const Stack = createStackNavigator<RootStackParamList>();

const HostAppNavigator: React.FC = () => {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="Dev" component={MyWalletScreen} /> */}

        <Stack.Screen name="MainStack" component={HostBottomBarNavigator}/>
        <Stack.Screen name='TrekStack' component={TrekStackNavigator} />
        <Stack.Screen name="CreateTrek" component={CreateTrek}/>
        <Stack.Screen name="EditTrek" component={EditTrek} />
        <Stack.Screen name="TrekDetail" component={TrekDetail} />

      </Stack.Navigator>
  );
};

export default HostAppNavigator;
