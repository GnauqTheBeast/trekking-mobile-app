import React, { useState } from "react";
import { ImageBackground, Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SaveIcon from '../../../assets/icons/common/heart.svg';
import SaveOutlineIcon from '../../../assets/icons/common/heart-outline.svg';
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { TrekProps } from "../../../types/trek";

const solvePrice = (price: number): string => {
    let result: string = '';
    while(price > 1000) {
        let tmp = price % 1000;
        result = '.' + tmp.toString().padStart(3, '0') + result;
        price = Math.floor(price / 1000);
    }
    result = price.toString() + result;
    return result;
}

const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
        case "easy":
            return "#0E871C";
        case "moderate":
            return "#E47507";
        case "hard":
            return "#E40505";
        default:
            return "#FFFFFF";
    }
};


const Trek: React.FC<TrekProps> = (trek) => {

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [isSave, setIsSave] = useState(false);

    const handlePressSave = () => {
        setIsSave(!isSave)
    }

    const handlePressTrek = () => {
        navigation.navigate('TrekDetailScreen', {trek: trek} )
    }

    return (
        <TouchableOpacity key={trek.id} onPress={handlePressTrek} style={styles.container}>
            <View style={styles.wrapper}>
                <ImageBackground source={{uri: trek.image[0]}} style={styles.image}>
                    <View style={styles.containerLevelAndSave}>
                        <View style={[styles.levelContainer, {backgroundColor: getLevelColor(trek.level)}]}>
                            <Text style={styles.levelText}>{trek.level}</Text>
                        </View>
                        <TouchableOpacity onPress={handlePressSave}>
                            {isSave ?
                                <SaveIcon width={28} height={28} />
                            :
                                <SaveOutlineIcon width={28} height={28} />}
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
            <View style={styles.content}>
                <Text style={styles.nameText}>{trek.name}</Text>
                <View style={styles.commonContainer}>
                    <Icon name="map-marker" color='#FF8E4F'/>
                    <Text style={styles.commonText}>{trek.location}</Text>
                </View>
                <View style={styles.commonContainer}>
                    <Icon name="progress-clock" color='#FF8E4F'/>
                    <Text style={styles.commonText}>{trek.duration}</Text>
                </View>
                <View style={styles.commonContainer}>
                    <Icon name="star" color='#FFD700'/>
                    <Text style={styles.commonText}>{trek.rate}</Text>
                </View>
                <Text style={[styles.commonText, {marginLeft: 2}]}>{trek.booked} booked</Text>
                <Text style={styles.priceText}>{solvePrice(trek.price)}đ</Text>
                <View style={styles.wrapHostAvatar}>
                    {trek.host.host_avt !== '' ?
                        <ImageBackground source={{uri: trek.host.host_avt}} style={styles.hostAvt} />
                    :
                        <Icon name="account" color='white' size={22} />
                    }
                </View>
                <Text style={styles.hostName}>{trek.host.host_name}</Text>
            </View>
        </TouchableOpacity>


    );
}


export default Trek;