import React, { useContext, useState } from "react";
import { ImageBackground, Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SaveIcon from '../../../assets/icons/common/heart.svg';
import SaveOutlineIcon from '../../../assets/icons/common/heart-outline.svg';
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation/main/UserAppNavigator";
import { TrekHostProps, TrekProps } from "../../../types/trek";
import { addTourInFavorite, removeTourFromFavorite } from "../../../services/favorites.service";
import { AuthContext } from "../../../context/AuthProvider";
import { solveImageUrl } from "../../../utils/image.util";

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
            return "#000000";
    }
};


const TrekInSave: React.FC<TrekHostProps> = (trek) => {
    const auth = useContext(AuthContext);
    const userId = auth!.user!.id;

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [isSave, setIsSave] = useState(true);

    const handlePressSave = async() => {
        if(isSave) await removeTourFromFavorite(userId, trek.id)
        else await addTourInFavorite(userId, trek.id);
        setIsSave(!isSave)
    }

    const handlePressTrek = () => {
        navigation.navigate('TrekDetailScreen', {trek: trek} )
    }


    return (
        <TouchableOpacity key={trek.id} onPress={handlePressTrek} style={styles.container}>
            <View style={styles.wrapper}>
                <ImageBackground source={{uri: trek.images[0]}} style={styles.image}>
                    <View style={styles.containerLevelAndSave}>
                        <View style={[styles.levelContainer, {backgroundColor: getLevelColor(trek.level || "HARD")}]}>
                            <Text style={styles.levelText}>{trek.level || "HARD"}</Text>
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
                <Text style={styles.priceText}>{solvePrice(trek.price)}đ</Text>
                <View style={styles.wrapHostAvatar}>
                    {trek.host.image ?
                        <ImageBackground source={{uri: trek.host.image}} style={styles.hostAvt} />
                    :
                        <Icon name="account" color='white' size={22} />
                    }
                </View>
                <Text style={styles.hostName}>{trek.host.name}</Text>
            </View>
        </TouchableOpacity>


    );
}


export default TrekInSave;