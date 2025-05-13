import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import AccountScreen from "../../screens/account-stack/Account";

export type AccountStackParamList = {
    AccountScreen: undefined,
}

const Stack = createStackNavigator<AccountStackParamList>();

const AccountNavigator: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='AccountScreen' component={AccountScreen} />
        </Stack.Navigator>
    )
}


export default AccountNavigator;