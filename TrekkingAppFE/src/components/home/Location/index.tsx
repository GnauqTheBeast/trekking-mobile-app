import React from "react";
import { StyleSheet, ImageBackground, Text, View } from "react-native";

interface LocationProps {
    imageSource: string,
    locationName: string
}


const LocationInHome: React.FC<LocationProps> = ({imageSource, locationName}) => {
    return (
        <View style={styles.wrapper}>
            <ImageBackground source={{uri: imageSource}} style={styles.image}>
                <View style={styles.nameContainer}>
                  <Text style={styles.nameText}>{locationName}</Text>
                </View>
            </ImageBackground>
        </View>

    );
}

const styles = StyleSheet.create({
    wrapper: {
        height: 150,
        width: 120,
        borderRadius: 15,
        overflow: 'hidden'
    },
    image: {
        resizeMode: "cover",
        height: '100%',
        width: '100%',
        justifyContent: 'flex-end'
    },
    nameContainer: {
        width: '100%',
        height: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    nameText: {
        color: 'white',
        fontFamily: 'OpenSans-Bold',
        fontSize: 16,
        letterSpacing: 0.5
    }
})

export default LocationInHome;