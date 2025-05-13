import React from "react";
import { StyleSheet, ImageBackground, Text, View } from "react-native";

interface PorterProps {
    imageSource: string,
}


const PorterInHome: React.FC<PorterProps> = ({imageSource}) => {
    return (
        <View style={styles.wrapper}>
            <ImageBackground source={{uri: imageSource}} style={styles.image}>
            </ImageBackground>
        </View>

    );
}

const styles = StyleSheet.create({
    wrapper: {
        height: 60,
        width: 60,
        borderRadius: 50,
        overflow: 'hidden'
    },
    image: {
        resizeMode: "cover",
        height: '100%',
        width: '100%',
    },
})

export default PorterInHome;