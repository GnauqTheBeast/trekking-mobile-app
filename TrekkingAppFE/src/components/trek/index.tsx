import React, { useState } from "react";
import { ImageBackground, Text, View, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SaveIcon from '../../assets/icons/common/heart.svg';
import SaveOutlineIcon from '../../assets/icons/common/heart-outline.svg';
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '../../navigation/main/UserAppNavigator';
import { TrekHostProps } from '../../types/trek';
import { trekService } from "../../services/trek.service";

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

interface TrekComponentProps extends TrekHostProps {
    isManagementView?: boolean;
    isHost?: boolean;
}

const Trek: React.FC<TrekComponentProps> = (props) => {
    const {
        isManagementView = false,
        isHost = false,
        start_date = new Date().toISOString(),
        end_date = new Date().toISOString(),
        total_slot = 20,
        ...trek
    } = props;
    console.log('Trek props:', props);
    console.log('Trek object after destructure:', trek);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [isSave, setIsSave] = useState(false);

    const handlePressSave = () => {
        setIsSave(!isSave)
    }

    const handlePressTrek = () => {
        console.log(trek.images);
        navigation.navigate('TrekStack', {
            screen: 'TrekDetail',
            params: { trekId: trek.id }
        });
    }

    const handleEdit = (e: any) => {
        e.stopPropagation();
        navigation.navigate('TrekStack', {
            screen: 'EditTrek',
            params: { trekId: trek.id }
        });
    }

    const handleDelete = async (e: any) => {
        e.stopPropagation();
        Alert.alert(
            'Xóa Tour',
            'Bạn có chắc chắn muốn xóa tour này?',
            [
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await trekService.deleteTrek(trek.id);
                            navigation.navigate('TrekStack', {
                                screen: 'TrekList'
                            });
                        } catch (error) {
                            console.error('Error deleting trek:', error);
                            Alert.alert('Lỗi', 'Có lỗi xảy ra khi xóa tour');
                        }
                    },
                },
            ]
        );
    }

    return (
        <TouchableOpacity key={trek.id} onPress={handlePressTrek} style={styles.container}>
            <View style={styles.wrapper}>
                <ImageBackground source={{uri: trek.images?.[0]}} style={styles.image}>
                    <View style={styles.containerLevelAndSave}>
                        <View style={[styles.levelContainer, {backgroundColor: getLevelColor(trek.level)}]}>
                            <Text style={styles.levelText}>{trek.level}</Text>
                        </View>
                        <View style={styles.actionButtons}>
                            {isManagementView && isHost ? (
                                <>
                                    <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
                                        <Icon name="pencil" size={20} color="#2A5848" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
                                        <Icon name="delete" size={20} color="#E40505" />
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <TouchableOpacity onPress={handlePressSave}>
                                    {isSave ? <SaveIcon width={28} height={28} /> : <SaveOutlineIcon width={28} height={28} />}
                                </TouchableOpacity>
                            )}
                        </View>
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
            </View>
        </TouchableOpacity>
    );
}

export default Trek;
