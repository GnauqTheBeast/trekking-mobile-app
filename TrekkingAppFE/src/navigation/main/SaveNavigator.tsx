import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import SaveScreen from "../../screens/Save";

export type SaveStackParamList = {
    SaveScreen: undefined
}

const Stack = createStackNavigator<SaveStackParamList>();

const SaveNavigator: React.FC = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen name="SaveScreen" component={SaveScreen}/>
        </Stack.Navigator>
    );
}

export default SaveNavigator;