import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import AccountScreen from "../../screens/account-stack/Account";
import WalletDeposit from "../../screens/main/Account/WalletDeposit";
import WalletWithdrawal from "../../screens/main/Account/WalletWithdrawal";
import WalletHistory from "../../screens/main/Account/WalletHistory";

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
            <Stack.Screen name='WalletDeposit' component={WalletDeposit} />
            <Stack.Screen name='WalletWithdrawal' component={WalletWithdrawal} />
            <Stack.Screen name='WalletHistory' component={WalletHistory} />
        </Stack.Navigator>
    )
}

export default AccountNavigator;