import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AccountNavigator, { AccountStackParamList } from "./main/AccountNavigator";
import { NavigatorScreenParams } from "@react-navigation/native";
import HomeNavigator, { HomeStackParamList } from "./main/HomeNavigator";
import SaveNavigator, { SaveStackParamList } from "./main/SaveNavigator";
import BookingNavigator, { BookingStackParamList } from "./main/BookingNavigator";
import NotificationNavigator, { NotificationStackParamList } from "./main/NotificationNavigator";
import BottomBar from "../components/common/BottomBar";


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
