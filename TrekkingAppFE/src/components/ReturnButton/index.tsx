import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const ReturnButton: React.FC = () => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
        >
            <FontAwesome
                name="chevron-left"
                size={22}
                color="#2A5848" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: '6%',
        left: '4%',
        padding: 10
    }
})

export default ReturnButton;
