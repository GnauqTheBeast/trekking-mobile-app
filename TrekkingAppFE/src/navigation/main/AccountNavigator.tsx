import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import AccountScreen from "../../screens/account-stack/Account";
import { WalletDepositScreen } from "../../screens/account-stack/WalletDepositScreen";
import { WalletWithdrawalScreen } from "../../screens/account-stack/WalletWithdrawalScreen";
import { WalletHistoryScreen } from "../../screens/account-stack/WalletHistoryScreen";

export type AccountStackParamList = {
    AccountScreen: undefined,
    WalletDeposit: undefined,
    WalletWithdrawal: undefined,
    WalletHistory: undefined,
}

const Stack = createStackNavigator<AccountStackParamList>();

const AccountNavigator: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='AccountScreen' component={AccountScreen} />
            <Stack.Screen name='WalletDeposit' component={WalletDepositScreen} />
            <Stack.Screen name='WalletWithdrawal' component={WalletWithdrawalScreen} />
            <Stack.Screen name='WalletHistory' component={WalletHistoryScreen} />
        </Stack.Navigator>
    )
}

export default AccountNavigator;