import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import NotificationScreen from "../../screens/Notification";

export type NotificationStackParamList = {
    NotificationNavigator: undefined
}

const Stack = createStackNavigator<NotificationStackParamList>();

const NotificationNavigator: React.FC = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen name="NotificationNavigator" component={NotificationScreen}/>
        </Stack.Navigator>
    );
}

export default NotificationNavigator;