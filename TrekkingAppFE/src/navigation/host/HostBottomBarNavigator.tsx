import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import HostAccountNavigator, { HostAccountStackParamList } from "./account/HostAccountNavigator";
import HostHomeNavigator, { HostHomeStackParamList } from "./home/HostHomeNaviagator";
import HostBottomBar from "../../components/common/HostBottomBar";


export type HostBottomBarStackParamList = {
    HostHomeStack: NavigatorScreenParams<HostHomeStackParamList>,
    HostAccountStack: NavigatorScreenParams<HostAccountStackParamList>,

}

const HostBottomBarStack = createBottomTabNavigator<HostBottomBarStackParamList>();

const HostBottomBarNavigator: React.FC = () => {
    return (
        <HostBottomBarStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            tabBar={(props) => <HostBottomBar {...props}/>}
        >
            <HostBottomBarStack.Screen name="HostHomeStack" component={HostHomeNavigator} />
            <HostBottomBarStack.Screen name="HostAccountStack" component={HostAccountNavigator} />
        </HostBottomBarStack.Navigator>
    );
};

export default HostBottomBarNavigator;
