import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import HomeScreen from "../../../screens/home-stack/Home";
import AllLocationScreen from "../../../screens/home-stack/AllLocation";
import AllTrekInLocationScreen from "../../../screens/home-stack/AllTrekInLocation";
import AllTrekScreen from '../../../screens/home-stack/AllTrek';

export type HomeStackParamList = {
    HomeScreen: undefined,
    AllLocationScreen: undefined,
    AllTrekInLocationScreen: {id: string, name: string},
    AllTrekScreen: undefined
}

const Stack = createStackNavigator<HomeStackParamList>();

const HomeNavigator: React.FC = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="HomeScreen" component={HomeScreen}/>
            <Stack.Screen name="AllLocationScreen" component={AllLocationScreen}/>
            <Stack.Screen name="AllTrekInLocationScreen" component={AllTrekInLocationScreen}/>
            <Stack.Screen name="AllTrekScreen" component={AllTrekScreen}/>
        </Stack.Navigator>
    );
}

export default HomeNavigator;