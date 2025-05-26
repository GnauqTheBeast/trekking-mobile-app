import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { color } from "@rneui/base";

interface ReturnButtonProps {
    top?: number,
    color?: string
}

const ReturnButton: React.FC<ReturnButtonProps> = ({top, color}) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={[styles.button, {top}]}
            onPress={() => navigation.goBack()}
        >
            <FontAwesome
                name="chevron-left"
                size={22}
                color={color ? color : "#2A5848"} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        left: 16,
        zIndex: 1000
    }
})

export default ReturnButton;
