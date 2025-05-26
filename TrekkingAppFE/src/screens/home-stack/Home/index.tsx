import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ScrollView, StatusBar, Text, View, TouchableOpacity, ImageBackground, TextInput, RefreshControl, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import styles from "./styles";
import {SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import SearchIcon from '../../../assets/icons/common/search.svg'
import FilterIcon from '../../../assets/icons/common/filter.svg'
import LocationInHome from "../../../components/home/Location";
import PorterInHome from "../../../components/home/Porter";
import { useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../../../navigation/main/home/HomeNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import TrekInHome from "../../../components/common/TrekInHome";
import PopularTrekInHome from "../../../components/home/PopularTrek";
import { TrekHostProps, TrekProps } from "../../../types/trek";
import { trekService } from "../../../services/trek.service";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import axios from "axios";
import { AuthContext } from "../../../context/AuthProvider";
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

const solveMoney = (money: number): string => {
    let result: string = '';
    while(money > 1000) {
        let tmp = money % 1000;
        result = '.' + tmp.toString().padStart(3, '0') + result;
        money = Math.floor(money / 1000);
    }
    result = money.toString() + result;
    return result;
}

const PAGE_SIZE = 5;

const HomeScreen: React.FC = () => {

    const auth = useContext(AuthContext)!;
    const {user, isLoggedIn} = auth;
    const userId = user?.id;

    const [treks, setTreks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<string>('Ha Noi, Viet Nam');

    const listLocation = [
        {id: "1", name: 'Sơn La', image: 'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/06/07/du-lich-son-la-1-1200.jpg'},
        {id: "2", name: 'Lao Cai', image: 'https://cdn.tgdd.vn/Files/2021/07/03/1365444/kham-pha-13-dia-diem-du-lich-lao-cai-dep-noi-tieng-202303281656546137.jpg'},
        {id: "3", name: 'Quang Ning', image: 'https://sktravel.com.vn/wp-content/uploads/2022/02/binh-lieu-quang-ninh-7.jpg'},
    ]
    const listPopularTrek = [
        {
            id: "1",
            name: 'Tà Xùa - Hang Chú Trek',
            location: 'Son La, Viet Nam',
            duration: '3days / 2night',
            rate: 4.8,
            booked: 150,
            price: 2000000,
            distance: 22.4,
            elevation:2865,
            level: 'Easy',
            images: [
                "https://i2.ex-cdn.com/crystalbay.com/files/content/2024/06/07/du-lich-son-la-1-1200.jpg",
                "https://vcdn1-dulich.vnecdn.net/2023/09/26/khunglong1-3113-1695701097.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=By1Wlc--m9UstI0JT9Ni6g",
                "https://vov4.vov.vn/sites/default/files/styles/large/public/2023-12/z4947662991547_0dc72032ad508e18c108cba0b9ec4021.jpg",
            ],
            description: "Tà Xùa (2.865m) là ngọn núi gồm 3 đỉnh ở xã Bản Công, Trạm Tấu, Yên Bái. Rất nhiều người nhầm lẫn giữa núi Tà Xùa với dãy Tà Xùa ở Sơn La.\nNgọn núi này được dân mê xê dịch ví như một huyền thoại, bởi khung cảnh hùng vĩ với những đỉnh núi nhô lên giữa biển mây, tảng đá đầu rùa khổng lồ vươn ra mép vực và dãy núi trập trùng tựa sống lưng khủng long. Dù không thuộc top 10 đỉnh núi cao nhất Việt Nam, Tà Xùa vẫn là một thử thách không hề dễ dàng. Địa hình nơi đây đa dạng với những con dốc dài, rừng già rêu phong bao phủ, đòi hỏi sức bền và ý chí chinh phục. Nhưng đổi lại, khung cảnh ngoạn mục từ độ cao này chắc chắn sẽ khiến mọi công sức bỏ ra trở nên xứng đáng.",
        },
        {
            id: "2",
            name: 'Tà Xùa - Hang Chú Trek',
            location: 'Son La, Viet Nam',
            duration: '3days / 2night',
            rate: 3.9,
            booked: 150,
            price: 2000000,
            distance: 30.2,
            elevation:3000,
            level: 'Moderate',
            images: [
                'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/06/07/du-lich-son-la-1-1200.jpg'
            ],
            description: "Tà Xùa (2.865m) là ngọn núi gồm 3 đỉnh ở xã Bản Công, Trạm Tấu, Yên Bái. Rất nhiều người nhầm lẫn giữa núi Tà Xùa với dãy Tà Xùa ở Sơn La.\nNgọn núi này được dân mê xê dịch ví như một huyền thoại, bởi khung cảnh hùng vĩ với những đỉnh núi nhô lên giữa biển mây, tảng đá đầu rùa khổng lồ vươn ra mép vực và dãy núi trập trùng tựa sống lưng khủng long. Dù không thuộc top 10 đỉnh núi cao nhất Việt Nam, Tà Xùa vẫn là một thử thách không hề dễ dàng. Địa hình nơi đây đa dạng với những con dốc dài, rừng già rêu phong bao phủ, đòi hỏi sức bền và ý chí chinh phục. Nhưng đổi lại, khung cảnh ngoạn mục từ độ cao này chắc chắn sẽ khiến mọi công sức bỏ ra trở nên xứng đáng.",
        },
        {
            id: "3",
            name: 'Tà Xùa - Hang Chú Trek',
            location: 'Son La, Viet Nam',
            duration: '3days / 2night',
            rate: 2.9,
            booked: 150,
            price: 22000000,
            distance: 40.4,
            elevation: 4000,
            level: 'Hard',
            images: [
                'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/06/07/du-lich-son-la-1-1200.jpg'
            ],
            description: "Tà Xùa (2.865m) là ngọn núi gồm 3 đỉnh ở xã Bản Công, Trạm Tấu, Yên Bái. Rất nhiều người nhầm lẫn giữa núi Tà Xùa với dãy Tà Xùa ở Sơn La.\nNgọn núi này được dân mê xê dịch ví như một huyền thoại, bởi khung cảnh hùng vĩ với những đỉnh núi nhô lên giữa biển mây, tảng đá đầu rùa khổng lồ vươn ra mép vực và dãy núi trập trùng tựa sống lưng khủng long. Dù không thuộc top 10 đỉnh núi cao nhất Việt Nam, Tà Xùa vẫn là một thử thách không hề dễ dàng. Địa hình nơi đây đa dạng với những con dốc dài, rừng già rêu phong bao phủ, đòi hỏi sức bền và ý chí chinh phục. Nhưng đổi lại, khung cảnh ngoạn mục từ độ cao này chắc chắn sẽ khiến mọi công sức bỏ ra trở nên xứng đáng.",
        }
    ]

    const fetchTreks = useCallback(async (pageNumber: number) => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await trekService.getTreks(pageNumber, PAGE_SIZE);
            if (!response || !response.data || !response.data.data) {
                console.log('Invalid data structure:', response);
                throw new Error('Invalid response format');
            }

            const { tours, hasNext } = response.data.data;

            const hostPromises = tours.map((tour: any) =>
                axios.get(`http://10.0.2.2:3002/user/getHost/${tour.host_id}`)
                    .then(res => res.data)
                    .catch(err => {
                        console.error(`Error fetching host for ${tour.host_id}:`, err);
                        return null;
                    })
            );

            const checkSavePromises = tours.map((tour: any) => {
                if (!userId) return Promise.resolve(false);
                return axios.get(`http://10.0.2.2:3002/favourites/check/${userId}/${tour.id}`)
                    .then(res => res.data)
                    .catch(err => {
                        console.error(`Error checking save for tour ${tour.id}:`);
                        return false;
                    });
            });

            const [hosts, checkSaves] = await Promise.all([
                Promise.all(hostPromises),
                Promise.all(checkSavePromises)
            ]);

            const transformedTreks = tours.map((tour: any, index: number) =>
            {
                const hostInfo = hosts[index];
                const saved = checkSaves[index];
                return {
                    id: tour.id,
                    name: tour.name,
                    location: tour.location,
                    duration: tour.duration,
                    rate: parseFloat(tour.rate),
                    price: tour.price,
                    distance: tour.distance,
                    elevation: tour.elevation,
                    level: tour.level,
                    description: tour.description,
                    host: {
                        id: hostInfo?.id || '',
                        name: hostInfo?.name || 'Unknown Host',
                        image: hostInfo?.image || ''
                    },
                    status: tour.status,
                    booked: tour.slot - tour.available_slot,
                    images: JSON.parse(tour.images),
                    startAt: tour.start_at,
                    endAt: tour.end_at,
                    total_slot: tour.slot,
                    available_slot: tour.available_slot,
                    created_at: new Date(tour.created_at),
                    updated_at: new Date(tour.updated_at),
                    saved: saved
                }
            });

            setTreks(prev => pageNumber === 1 ? transformedTreks : [...prev, ...transformedTreks]);
        } catch (error) {
            console.error('Error fetching treks:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const renderEmpty = () => {
        if (loading) return null;
        return (
            <LoadingSpinner />
        );
    };

    useEffect(() => {
        let mounted = true;
        const initializeTreks = async () => {
            if (mounted) {
                await fetchTreks(1);
            }
        };
        initializeTreks();
        return () => {
            mounted = false;
        };
    }, []);

    const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchTreks(1);
        });
        return unsubscribe;
    }, [navigation, fetchTreks]);

    const handleSeeAllLocation = () => {
        navigation.navigate('AllLocationScreen')
    }

    const handleSeeAllTrek = () => {
        navigation.navigate('AllTrekScreen')
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTreks([]);
        fetchTreks(1).then(() => setRefreshing(false));
    }, [fetchTreks]);

    const getCurrentLocation = useCallback(() => {
        Geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                console.log('Location:', latitude, longitude);
                try {
                    Geocoder.init("YOUR_GOOGLE_MAPS_API_KEY");
                    const response = await Geocoder.from(latitude, longitude);
                    const address = response.results[0].formatted_address;
                    setCurrentLocation(address);
                } catch (error) {
                    console.error('Error fetching address:', error);
                    setCurrentLocation('Unable to fetch location');
                }
            },
            (error) => {
                console.error('Error getting location:', error);
                setCurrentLocation('Location permission denied');
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }, []);

    // useEffect(() => {
    //     getCurrentLocation();
    // }, [getCurrentLocation]);

    if (loading) {
        return (
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <LoadingSpinner />
          </SafeAreaView>
        );
      }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="black" barStyle="dark-content" />
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.userHeader}>
                        <View>
                            <Text style={styles.welcomeText}>Hi, {isLoggedIn ? user?.fullname: "Guest!"}</Text>
                            {isLoggedIn && (<View style={styles.currentLocationContainer}>
                                <Icon name="map-marker" style={styles.currentLocationIcon} size={14} />
                                <Text style={styles.currentLocationText}>{currentLocation}</Text>
                            </View>)}
                        </View>
                        {/* {isLoggedIn && (<View>
                            <View style={styles.moneyContainer}>
                                <Text style={styles.moneyText}>{solveMoney(10000)}đ</Text>
                            </View>
                        </View>)} */}
                    </View>
                    {/* <View style={styles.searchContainer}>
                        <SearchIcon width={20} height={20} />
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search trails or destination..."
                                multiline={false}
                                numberOfLines={1}
                            />
                        </View>
                        <FilterIcon width={20} height={20}/>
                    </View> */}
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 50
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={["#0000ff"]}
                            tintColor="#0000ff"
                        />
                    }
            >
                <View style={styles.listContainer}>
                    <View style={styles.headerList}>
                        <Text style={styles.titleList}>Locations</Text>
                        <TouchableOpacity style={styles.allDirection} onPress={handleSeeAllLocation}>
                            <Text style={styles.allDirectionText}>See all</Text>
                            <Icon name="chevron-right" style={styles.allDirectionIcon} size={16}/>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={styles.contentList}>
                            {listLocation.map(location => (
                                <LocationInHome key={location.id} locationName={location.name} imageSource={location.image} />
                            ))}
                        </View>
                        <TouchableOpacity style={styles.btnSeeAll} >
                            <Icon name="chevron-right" style={styles.btnSeeAllIcon} size={36}/>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <View style={styles.listContainer}>
                    <View style={styles.headerList}>
                        <Text style={styles.titleList}>Popular Treks</Text>
                        <TouchableOpacity style={styles.allDirection}>
                            <Text style={styles.allDirectionText}>See all</Text>
                            <Icon name="chevron-right" style={styles.allDirectionIcon} size={16}/>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={styles.contentList}>
                            {listPopularTrek.map(trek => (
                                <PopularTrekInHome key={trek.id} {...trek} />
                            ))}
                        </View>
                        <TouchableOpacity style={styles.btnSeeAll} >
                            <Icon name="chevron-right" style={styles.btnSeeAllIcon} size={36}/>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <View style={styles.listContainer}>
                    <View style={styles.headerList}>
                        <Text style={styles.titleList}>Explore Treks</Text>
                        <TouchableOpacity style={styles.allDirection} onPress={handleSeeAllTrek}>
                            <Text style={styles.allDirectionText}>See all</Text>
                            <Icon name="chevron-right" style={styles.allDirectionIcon} size={16}/>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.contentListTrek}>
                            {treks.map((trek, index) => (
                                <TrekInHome key={trek.id} {...trek} saved={trek.saved}/>
                            ))}
                        </View>
                    </ScrollView>
                </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default HomeScreen;