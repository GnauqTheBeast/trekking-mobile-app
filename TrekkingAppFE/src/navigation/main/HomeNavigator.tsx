import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import HomeScreen from "../../screens/Home";

export type HomeStackParamList = {
    HomeScreen: undefined
}

const Stack = createStackNavigator<HomeStackParamList>();

const HomeNavigator: React.FC = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="HomeScreen" component={HomeScreen}/>
        </Stack.Navigator>
    );
}

export default HomeNavigator;