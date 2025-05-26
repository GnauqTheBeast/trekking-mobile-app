import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AccountNavigator, { AccountStackParamList } from "./account/AccountNavigator";
import { NavigatorScreenParams } from "@react-navigation/native";
import HomeNavigator, { HomeStackParamList } from "./home/HomeNavigator";
import SaveNavigator, { SaveStackParamList } from "./save/SaveNavigator";
import BookingNavigator, { BookingStackParamList } from "./booking/BookingNavigator";
import NotificationNavigator, { NotificationStackParamList } from "./notification/NotificationNavigator";
import BottomBar from "../../components/common/BottomBar";


export type BottomBarStackParamList = {
    HomeStack: NavigatorScreenParams<HomeStackParamList>,
    BookingStack: NavigatorScreenParams<BookingStackParamList>,
    SaveStack: NavigatorScreenParams<SaveStackParamList>,
    NotificationStack: NavigatorScreenParams<NotificationStackParamList>
    AccountStack: NavigatorScreenParams<AccountStackParamList>,

}

const BottomBarStack = createBottomTabNavigator<BottomBarStackParamList>();

const BottomBarNavigator: React.FC = () => {
    return (
        <BottomBarStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            tabBar={(props) => <BottomBar {...props}/>}
        >
            <BottomBarStack.Screen name="HomeStack" component={HomeNavigator} />
            <BottomBarStack.Screen name="BookingStack" component={BookingNavigator} />
            <BottomBarStack.Screen name="SaveStack" component={SaveNavigator} />
            <BottomBarStack.Screen name="NotificationStack" component={NotificationNavigator} />
            <BottomBarStack.Screen name="AccountStack" component={AccountNavigator} />
        </BottomBarStack.Navigator>
    );
};

export default BottomBarNavigator;
