import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AccountNavigator, { AccountStackParamList } from "./main/AccountNavigator";
import TaskBar from "../components/TaskBar";
import { NavigatorScreenParams } from "@react-navigation/native";
import HomeNavigator, { HomeStackParamList } from "./main/HomeNavigator";
import SaveNavigator, { SaveStackParamList } from "./main/SaveNavigator";
import BookingNavigator, { BookingStackParamList } from "./main/BookingNavigator";
import NotificationNavigator, { NotificationStackParamList } from "./main/NotificationNavigator";


export type TaskBarStackParamList = {
    HomeStack: NavigatorScreenParams<HomeStackParamList>,
    BookingStack: NavigatorScreenParams<BookingStackParamList>,
    SaveStack: NavigatorScreenParams<SaveStackParamList>,
    NotificationStack: NavigatorScreenParams<NotificationStackParamList>
    AccountStack: NavigatorScreenParams<AccountStackParamList>,

}

const TaskBarStack = createBottomTabNavigator<TaskBarStackParamList>();

const TaskBarNavigator: React.FC = () => {
    return (
        <TaskBarStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            tabBar={(props) => <TaskBar {...props}/>}
        >
            <TaskBarStack.Screen name="HomeStack" component={HomeNavigator} />
            <TaskBarStack.Screen name="BookingStack" component={BookingNavigator} />
            <TaskBarStack.Screen name="SaveStack" component={SaveNavigator} />
            <TaskBarStack.Screen name="NotificationStack" component={NotificationNavigator} />
            <TaskBarStack.Screen name="AccountStack" component={AccountNavigator} />
        </TaskBarStack.Navigator>
    );
};

export default TaskBarNavigator;
