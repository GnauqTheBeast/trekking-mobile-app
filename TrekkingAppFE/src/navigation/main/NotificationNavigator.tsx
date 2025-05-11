import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import NotificationsScreen from "../../screens/notification-stack/Notification";

export type NotificationStackParamList = {
    NotificationNavigator: undefined
}

const Stack = createStackNavigator<NotificationStackParamList>();

const NotificationNavigator: React.FC = () => {
    return(
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="NotificationNavigator" component={NotificationsScreen}/>
        </Stack.Navigator>
    );
}

export default NotificationNavigator;