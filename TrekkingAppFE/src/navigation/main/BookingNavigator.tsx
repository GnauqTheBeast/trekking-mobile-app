import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import BookingDetail from "../../screens/booking-stack/BookingDetail";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TreksActive from "../../screens/booking-stack/TreksActive";
import TreksCompleted from "../../screens/booking-stack/TreksCompleted";
import TreksCancelled from "../../screens/booking-stack/TreksCancelled";
import { BookingProps } from "../../types/booking";

export type BookingStackParamList = {
    BookingDetailScreen: {booking: BookingProps},
    TreksActiveScreen: undefined,
    TreksCompletedScreen: undefined,
    TreksCancelledScreen: undefined
}

const Stack = createBottomTabNavigator<BookingStackParamList>();

const BookingNavigator: React.FC = () => {
    return(
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="TreksActiveScreen" component={TreksActive}/>
            <Stack.Screen name="TreksCompletedScreen" component={TreksCompleted}/>
            <Stack.Screen name="TreksCancelledScreen" component={TreksCancelled}/>
            <Stack.Screen name="BookingDetailScreen" component={BookingDetail}/>
        </Stack.Navigator>
    );
}

export default BookingNavigator;