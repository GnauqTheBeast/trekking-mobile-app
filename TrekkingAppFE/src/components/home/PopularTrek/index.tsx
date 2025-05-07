import React, { useState } from "react";
import { ImageBackground, Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SaveIcon from '../../../assets/icons/common/heart.svg';
import SaveOutlineIcon from '../../../assets/icons/common/heart-outline.svg';
import styles from "./styles";
import { TrekProps } from "../../../types/trek";

interface PopularTrekProps {
    name: string,
    location: string,
    duration: string,
    rate: number,
    booked: number,
    price: number,
    level: string
    image: string,
    host_avt: string
}

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


const PopularTrekInHome: React.FC<TrekProps> = (props) => {

    const [isSave, setIsSave] = useState(false);

    const handlePressSave = () => {
        setIsSave(!isSave)
    }

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <ImageBackground source={{uri: props.image[0]}} style={styles.image}>
                    <View style={styles.containerLevelAndSave}>
                        <View style={[styles.levelContainer, {backgroundColor: getLevelColor(props.level)}]}>
                            <Text style={styles.levelText}>{props.level}</Text>
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
                <Text style={styles.nameText}>{props.name}</Text>
                <View style={styles.commonContainer}>
                    <Icon name="map-marker" color='#FF8E4F'/>
                    <Text style={styles.commonText}>{props.location}</Text>
                </View>
                <View style={styles.commonContainer}>
                    <Icon name="progress-clock" color='#FF8E4F'/>
                    <Text style={styles.commonText}>{props.duration}</Text>
                </View>
                <View style={styles.commonContainer}>
                    <Icon name="star" color='#FFD700'/>
                    <Text style={styles.commonText}>{props.rate}</Text>
                </View>
                <Text style={[styles.commonText, {marginLeft: 2}]}>{props.booked} booked</Text>
                <Text style={styles.priceText}>{solvePrice(props.price)}đ</Text>
                <View style={styles.wrapHostAvatar}>
                    {props.host.host_avt !== '' ?
                        <ImageBackground source={{uri: props.host.host_avt}} style={styles.hostAvt} />
                    :
                        <Icon name="account" color='white' size={26} />
                    }
                </View>
            </View>
        </View>


    );
}


export default PopularTrekInHome;