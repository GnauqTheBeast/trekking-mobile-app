import React, { useState } from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation/AppNavigator";

const OnBoardingScreen: React.FC = () => {

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    return (
        <ImageBackground
            source={require('../../../image/onboarding.png')}
            style={styles.background}
        >
            <LinearGradient
                colors={[
                    'rgba(0, 0, 0, 0)',
                    'rgba(0, 0, 0, 0.8)',
                    'rgba(0, 0, 0, 1)',
                    'rgba(0, 0, 0, 1)',
                ]}
                locations={[0, 0.2, 0.85, 1]}
                style={styles.overlay}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Adventure Awaits!</Text>
                    <Text style={styles.intro}>Fast & easy trekking booking</Text>
                    <TouchableOpacity
                        style={styles.btnStart}
                        activeOpacity={0.8}
                        onPress={() =>
                            navigation.replace("MainStack", {
                                screen: "HomeStack",
                                params: {
                                    screen: "HomeScreen",
                                },
                            })
                        }
                    >
                        <Text style={[styles.textButton]}>
                            Get Started
                        </Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </ImageBackground>
    );
}

export default OnBoardingScreen;