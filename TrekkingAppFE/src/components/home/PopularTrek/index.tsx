import React, { useState } from "react";
import { ImageBackground, Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SaveIcon from '../../../assets/icons/common/heart.svg';
import SaveOutlineIcon from '../../../assets/icons/common/heart-outline.svg';
import styles from "./styles";

interface PopularTrekProps {
    id: string;
    name: string;
    location: string;
    duration: string;
    rate: number;
    booked: number;
    price: number;
    level: string;
    images: string[];
}

const getLevelColor = (level: string): string => {
    switch(level.toLowerCase()) {
        case 'easy':
            return '#4CAF50';
        case 'moderate':
            return '#FF9800';
        case 'hard':
            return '#F44336';
        default:
            return '#4CAF50';
    }
}

const solvePrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const PopularTrekInHome: React.FC<PopularTrekProps> = (props) => {

    const [isSave, setIsSave] = useState(false);

    const handlePressSave = () => {
        setIsSave(!isSave)
    }

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
            {props.images && props.images.length > 0 ? (
                <ImageBackground source={{uri: props.images[0]}} style={styles.image}>
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
            ) : (
                <View style={[styles.image, { backgroundColor: '#E5E5E5', justifyContent: 'center', alignItems: 'center' }]}>
                    <Icon name="image-off" size={40} color="#999" />
                </View>
            )}
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
            </View>
        </View>
    );
}


export default PopularTrekInHome;