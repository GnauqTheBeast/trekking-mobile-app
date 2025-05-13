import React, { useState } from "react";
import styles from "./styles";
import { Dimensions, FlatList, Image, StatusBar, View, Text, ScrollView, ImageBackground, TouchableOpacity } from "react-native";
import ReturnButton from "../../../components/common/ReturnButton";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ReadMore from 'react-native-read-more-text';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { HomeStackParamList } from "../../../navigation/main/HomeNavigator";


const { width, height } = Dimensions.get("window");

const TrekDetail: React.FC = () => {

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'TrekDetailScreen'>>();
    const { trek } = route.params;


    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectBatch, setSelectBatch] = useState<string | null>(null)

    const commonTourInfo = [
        ['Distance', `${trek.distance} km`],
        ['Elevation', `${trek.elevation} m`],
        ['Schedule', `3N2D`],
        ['Booked', `${trek.booked}`],
        ['Rating', `${trek.rate}`],
    ]

    const handleScrollImage = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(offsetX / width);
        setCurrentImageIndex(newIndex);
    }

    const handleSelectBatch = (id: string) => {
        setSelectBatch(id);
    }

    const handlePressBooking = () => {
        navigation.navigate('BookingScreen', {trek: trek, batchId: selectBatch})
    }


    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <View style={styles.body}>
                <FlatList
                    data={trek.image}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={handleScrollImage}
                    renderItem={({ item }) => (
                        <View>
                            <ReturnButton top={50} />
                            <Image source={{ uri: item }} style={styles.imageItem} />
                        </View>
                    )}
                />
                 <View style={styles.dotContainer}>
                    {trek.image.map((_, index) => (
                    <View
                        key={index}
                        style={[styles.dot, currentImageIndex === index && styles.activeDot]}
                    />
                    ))}
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
                        <View style={styles.hostNameContainer}>
                            <View style={styles.wrapHostAvatar}>
                                {trek.host.host_avt ?
                                    <ImageBackground source={{uri: trek.host.host_avt}} style={styles.hostAvt} />
                                :
                                    <Icon name="account" color='white' size={16} />
                                }
                            </View>
                            <Text style={{
                                fontFamily: 'OpenSans-SemiBold',
                                fontSize: 13
                            }}>{trek.host.host_name}</Text>
                        </View>
                        <TouchableOpacity style={{
                            position: 'absolute',
                            right: 10,
                            top: 8
                        }}>
                            <Text style={styles.visitText}>Visit</Text>
                        </TouchableOpacity>
                        <View style={styles.commonTrekInfo}>
                            <View style={{alignItems: 'center'}}>
                                <View style={styles.infoDataContainer}>
                                    <Text style={styles.infoData}>{trek.host.host_rate}</Text>
                                    <Icon name="star" color="#FFD700" />
                                </View>
                                <Text style={styles.infoTitle}>Rating</Text>
                            </View>
                            <View style={styles.split}></View>
                            <View style={{alignItems: 'center'}}>
                                <Text style={styles.infoData}>{trek.host.host_number_tours}</Text>
                                <Text style={styles.infoTitle}>Tours</Text>
                            </View>
                            <View style={styles.split}></View>
                            <View style={{alignItems: 'center'}}>
                                <Text style={styles.infoData}>{trek.host.host_booked}</Text>
                                <Text style={styles.infoTitle}>Booked</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.availableContainer}>
                        <Text
                            style={{
                                fontFamily: 'OpenSans-Bold',
                                marginBottom: 10
                            }}
                        >Available batches</Text>
                        <View style={styles.batchContainer}>
                            {trek.available_batches.map((batch, index) => (
                                <TouchableOpacity onPress={() => handleSelectBatch(batch.id)} key={index}>
                                    <Text style={[
                                        styles.infoBatch,
                                        selectBatch === batch.id && styles.selectedBatch
                                    ]}>
                                        {batch.start_date} - {batch.end_date} ({batch.booked} / {batch.total_slot})
                                    </Text>
                                </TouchableOpacity>
                            ))}
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
                        <Text style={styles.priceText}>{trek.price.toLocaleString()}đ/person</Text>
                    </View>
                    <TouchableOpacity onPress={handlePressBooking}>
                        <Text style={styles.btnBook}>Book Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default TrekDetail