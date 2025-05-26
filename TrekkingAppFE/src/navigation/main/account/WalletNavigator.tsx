import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import WalletDeposit from "../../../screens/account-stack/wallet/WalletDeposit";
import WalletWithdrawal from "../../../screens/account-stack/wallet/WalletWithdrawal";
import WalletHistory from "../../../screens/account-stack/wallet/WalletHistory";
import MyWalletScreen from "../../../screens/account-stack/wallet/MyWallet";

export type WalletStackParamList = {
    MyWalletScreen: undefined,
    WalletDeposit: undefined,
    WalletWithdrawal: undefined,
    WalletHistory: undefined,
}

const Stack = createStackNavigator<WalletStackParamList>();

const WalletStackNavigator: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='MyWalletScreen' component={MyWalletScreen} />
            <Stack.Screen name='WalletDeposit' component={WalletDeposit} />
            <Stack.Screen name='WalletWithdrawal' component={WalletWithdrawal} />
            <Stack.Screen name='WalletHistory' component={WalletHistory} />
        </Stack.Navigator>
    )
}

export default WalletStackNavigator;