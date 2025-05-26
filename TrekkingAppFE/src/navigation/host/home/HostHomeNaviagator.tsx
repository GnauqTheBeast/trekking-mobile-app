import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import TrekList from "../../../screens/tour-stack/TrekList";

export type HostHomeStackParamList = {
    HomeScreen: undefined,
}

const Stack = createStackNavigator<HostHomeStackParamList>();

const HostHomeNavigator: React.FC = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="HomeScreen" component={TrekList}/>
        </Stack.Navigator>
    );
}

export default HostHomeNavigator;