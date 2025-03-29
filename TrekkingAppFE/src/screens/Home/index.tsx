import React from "react";
import { Text, View } from "react-native";
import styles from "./styles";

const HomeScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}></View>
            <Text>Hello</Text>
        </View>
    );
}

export default HomeScreen;