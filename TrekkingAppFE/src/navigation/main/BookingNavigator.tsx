import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import BookingScreen from "../../screens/Booking";

export type BookingStackParamList = {
    BookingScreen: undefined
}

const Stack = createStackNavigator<BookingStackParamList>();

const BookingNavigator: React.FC = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen name="BookingScreen" component={BookingScreen}/>
        </Stack.Navigator>
    );
}

export default BookingNavigator;