import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import WalletDeposit from "../../../screens/account-stack/wallet/WalletDeposit";
import WalletWithdrawal from "../../../screens/account-stack/wallet/WalletWithdrawal";
import WalletHistory from "../../../screens/account-stack/wallet/WalletHistory";
import MyWalletScreen from "../../../screens/account-stack/wallet/MyWallet";
import AccountSecurityScreen from "../../../screens/account-stack/account-security/AccountSecurity";
import MyProfileScreen from "../../../screens/account-stack/account-security/profile/MyProfile";
import EditNameScreen from "../../../screens/account-stack/account-security/profile/EditName";
import EditPhoneScreen from "../../../screens/account-stack/account-security/profile/EditPhone";
import EditEmailScreen from "../../../screens/account-stack/account-security/EditEmail";
import EditAddressScreen from "../../../screens/account-stack/account-security/profile/EditAddress";
import ChangePasswordScreen from "../../../screens/account-stack/account-security/ChangePassword";
import ChangeEmailOTPScreen from "../../../screens/common/authentication/ChangeEmailOTP";

export type AccountSecurityStackParamList = {
    AccountSecurityScreen: undefined,
    MyProfileScreen: undefined,
    EditNameScreen: {name: string, onSave: (newName: string) => void},
    EditPhoneScreen: {phone: string | null, onSave: (newPhone: string) => void},
    EditEmailScreen: undefined,
    EditAddressScreen: {address: string | null, onSave: (newAddress: string) => void}
    ChangePasswordScreen: undefined,
    ChangeEmailOTPScreen: {email: string}
}

const Stack = createStackNavigator<AccountSecurityStackParamList>();

const AccountSecurityStackNavigator: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='AccountSecurityScreen' component={AccountSecurityScreen} />
            <Stack.Screen name="MyProfileScreen" component={MyProfileScreen} />
            <Stack.Screen name='EditNameScreen' component={EditNameScreen} />
            <Stack.Screen name='EditPhoneScreen' component={EditPhoneScreen} />
            <Stack.Screen name='EditEmailScreen' component={EditEmailScreen} />
            <Stack.Screen name='EditAddressScreen' component={EditAddressScreen} />
            <Stack.Screen name='ChangePasswordScreen' component={ChangePasswordScreen} />
            <Stack.Screen name='ChangeEmailOTPScreen' component={ChangeEmailOTPScreen} />
        </Stack.Navigator>
    )
}

export default AccountSecurityStackNavigator;