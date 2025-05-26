import React, { useContext, useEffect, useState } from "react";
import styles from "./styles";
import { Dimensions, FlatList, Image, StatusBar, View, Text, ScrollView, ImageBackground, TouchableOpacity, Alert } from "react-native";
import ReturnButton from "../../../components/common/ReturnButton";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ReadMore from 'react-native-read-more-text';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation/main/UserAppNavigator";
import SaveIcon from '../../../assets/icons/common/heart.svg';
import SaveOutlineIcon from '../../../assets/icons/common/heart-outline.svg';
import { addTourInFavorite, removeTourFromFavorite } from "../../../services/favorites.service";
import { AuthContext } from "../../../context/AuthProvider";
import axios from "axios";

const { width, height } = Dimensions.get("window");

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

const solveLevelName = (level: string): string => {
    return level.charAt(0).toUpperCase() + level.substring(1).toLocaleLowerCase();
}

const solveSchedule = (schedule: string): string => {
    const numbers = schedule.match(/\d+/g)
    if (!numbers || numbers.length < 2) return "";
    const first = numbers[0];
    const second = numbers[1];
    return `${first}N${second}D`;

}

const formatDate = (dateString: string) => {
    console.log("Date: ", dateString)
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

const TrekHomeDetail: React.FC = () => {

    const auth = useContext(AuthContext);
    const user = auth?.user;
    // const userId = auth!.user!.id;

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'TrekDetailScreen'>>();
    const { trek } = route.params;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isSave, setIsSave] = useState(false);

    useEffect(() => {
        const checkSavedStatus = async () => {
            if (!user) {
                setIsSave(false);
                return;
            }
            try {
                const res = await axios.get(`http://10.0.2.2:3002/favourites/check/${user.id}/${trek.id}`);
                setIsSave(res.data === true);
            } catch (error) {
                console.error("Failed to check saved status:", error);
                setIsSave(false);
            }
        };

        checkSavedStatus();
    }, [user, trek.id]);

    const commonTourInfo = [
        ['Distance', `${trek.distance} km`],
        ['Elevation', `${trek.elevation} m`],
        ['Duration', `${solveSchedule(trek.duration)}`],
        ['Slot', `${(trek.total_slot - trek.available_slot)}/${trek.total_slot}`],
        ['Rating', `${trek.rate}`],
    ]

    const handleScrollImage = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(offsetX / width);
        setCurrentImageIndex(newIndex);
    }

    const handlePressBooking = () => {
        if (!user) {
            Alert.alert(
                "Login Required",
                "You need to log in to book this tour.",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate('LoginScreen')
                    }
                ]
            );
            return;
        }
        navigation.navigate('BookingScreen', {trek: trek})
    }

    const handlePressSave = async () => {
        if (!user) return;

        const userId = user.id;
        try {
            if (isSave) {
                await removeTourFromFavorite(userId, trek.id);
            } else {
                await addTourInFavorite(userId, trek.id);
            }
            setIsSave(!isSave);
        } catch (error) {
            console.error("Failed to toggle save:", error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <View style={styles.body}>
                <View style={styles.upBody}>
                    <ReturnButton top={50} color="white" />
                    <FlatList
                        data={trek.images}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={16}
                        initialNumToRender={trek.images.length}
                        maxToRenderPerBatch={trek.images.length}
                        windowSize={trek.images.length !== 0 ? trek.images.length : 1}
                        onScroll={handleScrollImage}
                        renderItem={({ item, index }) => (
                                <Image key={index} source={{ uri: item }} style={styles.imageItem} />
                        )}
                    />
                    <View style={[styles.levelContainer]}>
                        <Text style={[styles.levelText, {color: getLevelColor(trek.level || "HARD")}]}>{solveLevelName(trek.level || "HARD")}</Text>
                    </View>
                    <TouchableOpacity style={styles.saveContainer} onPress={handlePressSave}>
                        {isSave ?
                            <SaveIcon width={28} height={28} />
                        :
                            <SaveOutlineIcon width={28} height={28} />}
                    </TouchableOpacity>
                    <View style={styles.dotContainer}>
                        {trek.images.map((_, index) => (
                        <View
                            key={index}
                            style={[styles.dot, currentImageIndex === index && styles.activeDot]}
                        />
                        ))}
                    </View>
                </View>
                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 100
                    }}
                >
                    <Text style={styles.nameTrek}>{trek.name}</Text>
                    <View style={styles.locationContainer}>
                        <Icon name="map-marker" color='#FF8E4F'/>
                        <Text style={styles.locationText}>{trek.location}</Text>
                    </View>
                    <View style={styles.commonTourInfo}>
                        {commonTourInfo.map(([key, value], index) => (
                            <React.Fragment key={index}>
                                {index !== 4 ? (
                                    <>
                                        <View>
                                            <Text style={styles.infoTitle}>{key}</Text>
                                            <Text style={styles.infoData}>{value}</Text>
                                        </View>
                                        <View style={styles.split}></View>
                                    </>
                                ) : (
                                    <View>
                                        <Text style={styles.infoTitle}>{key}</Text>
                                        <View style={styles.infoDataContainer}>
                                            <Icon name="star" color="#FFD700" />
                                            <Text style={styles.infoData}>{value}</Text>
                                        </View>
                                    </View>
                                )}
                            </React.Fragment>
                        ))}
                    </View>
                    <View style={styles.descriptionContainer}>
                        <ReadMore
                            numberOfLines={4}
                            renderTruncatedFooter={(handlePress: () => void) => (
                                <Text style={styles.readMoreText} onPress={handlePress}>Read more</Text>
                            )}
                            renderRevealedFooter={(handlePress: () => void) => (
                                <Text style={styles.readMoreText} onPress={handlePress}>Read less</Text>
                            )}
                        >
                            <Text style={styles.descriptionText}>{trek.description}</Text>
                        </ReadMore>
                    </View>
                    <View style={styles.hostContainer}>
                        <View style={styles.wrapHostAvatar}>
                            {trek.host.image ?
                                <ImageBackground source={{uri: trek.host.image}} style={styles.hostAvt} />
                            :
                                <Icon name="account" color='white' size={22} />
                            }
                        </View>
                        <Text style={styles.hostName}>{trek.host.name}</Text>
                        <TouchableOpacity style={{
                            position: 'absolute',
                            right: 10,
                            top: 12
                        }}>
                            <Text style={styles.visitText}>Visit</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.dateContainer}>
                        <View style={styles.dateCard}>
                            <View style={styles.dateHeader}>
                                <Icon name="calendar-start" size={20} color="#FF8E4F" />
                                <Text style={styles.dateLabel}>Start Date</Text>
                            </View>
                            <Text style={styles.dateValue}>{formatDate(trek.startAt)}</Text>
                        </View>

                        <View style={styles.dateArrow}>
                            <Icon name="arrow-right" size={24} color="#FF8E4F" />
                        </View>

                        <View style={styles.dateCard}>
                            <View style={styles.dateHeader}>
                                <Icon name="calendar-end" size={20} color="#FF8E4F" />
                                <Text style={styles.dateLabel}>End Date</Text>
                            </View>
                            <Text style={styles.dateValue}>{formatDate(trek.endAt)}</Text>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.bookContainer}>
                    <View>
                        <Text
                            style={{
                                fontFamily: 'OpenSans-Bold',
                                fontSize: 13
                            }}
                        >Price per unit</Text>
                        <Text style={styles.priceText}>{solvePrice(trek.price)}đ/person</Text>
                    </View>
                    <TouchableOpacity onPress={handlePressBooking}>
                        <Text style={styles.btnBook}>Book Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default TrekHomeDetail