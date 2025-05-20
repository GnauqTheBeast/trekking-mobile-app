import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { WalletDepositScreen } from './WalletDepositScreen';
import { WalletWithdrawalScreen } from './WalletWithdrawalScreen';

const Stack = createStackNavigator();

export const AccountStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="WalletDeposit"
        component={WalletDepositScreen}
        options={{ title: 'Nạp tiền' }}
      />
      <Stack.Screen
        name="WalletWithdrawal"
        component={WalletWithdrawalScreen}
        options={{ title: 'Rút tiền' }}
      />
    </Stack.Navigator>
  );
}; 