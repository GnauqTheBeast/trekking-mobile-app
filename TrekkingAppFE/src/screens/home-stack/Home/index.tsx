import React from "react";
import { ScrollView, StatusBar, Text, View, TouchableOpacity, ImageBackground, TextInput } from "react-native";
import styles from "./styles";
import {SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import SearchIcon from '../../../assets/icons/common/search.svg'
import FilterIcon from '../../../assets/icons/common/filter.svg'
import LocationInHome from "../../../components/home/Location";
import PorterInHome from "../../../components/home/Porter";
import PopularTrekInHome from "../../../components/home/PopularTrek";
import TrekInHome from "../../../components/common/Trek";
import { useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../../../navigation/main/HomeNavigator";
import { StackNavigationProp } from "@react-navigation/stack";

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

const HomeScreen: React.FC = () => {
    const user = {id: '123', fullname: 'Vu Ngoc Son', money: 200000}
    const currentLocation = 'Ha Noi, Viet Nam'
    const listLocation = [
        {id: "1", name: 'Sơn La', image: 'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/06/07/du-lich-son-la-1-1200.jpg'},
        {id: "2", name: 'Lao Cai', image: 'https://cdn.tgdd.vn/Files/2021/07/03/1365444/kham-pha-13-dia-diem-du-lich-lao-cai-dep-noi-tieng-202303281656546137.jpg'},
        {id: "3", name: 'Quang Ning', image: 'https://sktravel.com.vn/wp-content/uploads/2022/02/binh-lieu-quang-ninh-7.jpg'},
    ]
    const listPorter = [
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
            image: [
                "https://i2.ex-cdn.com/crystalbay.com/files/content/2024/06/07/du-lich-son-la-1-1200.jpg",
                "https://vcdn1-dulich.vnecdn.net/2023/09/26/khunglong1-3113-1695701097.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=By1Wlc--m9UstI0JT9Ni6g",
                "https://vov4.vov.vn/sites/default/files/styles/large/public/2023-12/z4947662991547_0dc72032ad508e18c108cba0b9ec4021.jpg",
            ],
            description: "Tà Xùa (2.865m) là ngọn núi gồm 3 đỉnh ở xã Bản Công, Trạm Tấu, Yên Bái. Rất nhiều người nhầm lẫn giữa núi Tà Xùa với dãy Tà Xùa ở Sơn La.\nNgọn núi này được dân mê xê dịch ví như một huyền thoại, bởi khung cảnh hùng vĩ với những đỉnh núi nhô lên giữa biển mây, tảng đá đầu rùa khổng lồ vươn ra mép vực và dãy núi trập trùng tựa sống lưng khủng long. Dù không thuộc top 10 đỉnh núi cao nhất Việt Nam, Tà Xùa vẫn là một thử thách không hề dễ dàng. Địa hình nơi đây đa dạng với những con dốc dài, rừng già rêu phong bao phủ, đòi hỏi sức bền và ý chí chinh phục. Nhưng đổi lại, khung cảnh ngoạn mục từ độ cao này chắc chắn sẽ khiến mọi công sức bỏ ra trở nên xứng đáng.",
            host: {
                id: "1",
                host_name: 'taxua.trekking.vn',
                host_avt: 'https://www.nepalhimalayastrekking.com/public/uploads/261440359_4775602299167480_6993583518940422934_n.jpg',
                host_rate: 4.8,
                host_booked: 1500,
                host_number_tours: 20,
            },
            available_batches: [
                { start_date: '2 Nov', id: "1", end_date: '5 Nov', booked: 12, total_slot: 20 },
                { id: "2", start_date: '22 Nov', end_date: '25 Nov', booked: 12, total_slot: 20 },
                { id: "3", start_date: '2 Nov', end_date: '5 Nov', booked: 12, total_slot: 20 },
                { id: "4", start_date: '2 Nov', end_date: '5 Nov', booked: 12, total_slot: 20 },
                { id: "5", start_date: '2 Nov', end_date: '5 Nov', booked: 12, total_slot: 20 }
            ]
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
            image: [
                'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/06/07/du-lich-son-la-1-1200.jpg'
            ],
            description: "Tà Xùa (2.865m) là ngọn núi gồm 3 đỉnh ở xã Bản Công, Trạm Tấu, Yên Bái. Rất nhiều người nhầm lẫn giữa núi Tà Xùa với dãy Tà Xùa ở Sơn La.\nNgọn núi này được dân mê xê dịch ví như một huyền thoại, bởi khung cảnh hùng vĩ với những đỉnh núi nhô lên giữa biển mây, tảng đá đầu rùa khổng lồ vươn ra mép vực và dãy núi trập trùng tựa sống lưng khủng long. Dù không thuộc top 10 đỉnh núi cao nhất Việt Nam, Tà Xùa vẫn là một thử thách không hề dễ dàng. Địa hình nơi đây đa dạng với những con dốc dài, rừng già rêu phong bao phủ, đòi hỏi sức bền và ý chí chinh phục. Nhưng đổi lại, khung cảnh ngoạn mục từ độ cao này chắc chắn sẽ khiến mọi công sức bỏ ra trở nên xứng đáng.",
            host: {
                id: "2",
                host_name: 'taxua.trekking.vn',
                host_avt: '',
                host_rate: 4.9,
                host_booked: 1600,
                host_number_tours: 21,
            },
            available_batches: [
                { start_date: '2 Nov', id: "1", end_date: '5 Nov', booked: 12, total_slot: 20 },
                { id: "2", start_date: '22 Nov', end_date: '25 Nov', booked: 12, total_slot: 20 },
                { id: "3", start_date: '2 Nov', end_date: '5 Nov', booked: 12, total_slot: 20 },
                { id: "4", start_date: '2 Nov', end_date: '5 Nov', booked: 12, total_slot: 20 },
                { id: "5", start_date: '2 Nov', end_date: '5 Nov', booked: 12, total_slot: 20 }
            ]
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
            image: [
                'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/06/07/du-lich-son-la-1-1200.jpg'
            ],
            description: "Tà Xùa (2.865m) là ngọn núi gồm 3 đỉnh ở xã Bản Công, Trạm Tấu, Yên Bái. Rất nhiều người nhầm lẫn giữa núi Tà Xùa với dãy Tà Xùa ở Sơn La.\nNgọn núi này được dân mê xê dịch ví như một huyền thoại, bởi khung cảnh hùng vĩ với những đỉnh núi nhô lên giữa biển mây, tảng đá đầu rùa khổng lồ vươn ra mép vực và dãy núi trập trùng tựa sống lưng khủng long. Dù không thuộc top 10 đỉnh núi cao nhất Việt Nam, Tà Xùa vẫn là một thử thách không hề dễ dàng. Địa hình nơi đây đa dạng với những con dốc dài, rừng già rêu phong bao phủ, đòi hỏi sức bền và ý chí chinh phục. Nhưng đổi lại, khung cảnh ngoạn mục từ độ cao này chắc chắn sẽ khiến mọi công sức bỏ ra trở nên xứng đáng.",
            host: {
                id: "3",
                host_name: 'taxua.trekking.vn',
                host_avt: '',
                host_rate: 5.0,
                host_booked: 1800,
                host_number_tours: 25,
            },
            available_batches: [
                { start_date: '2 Nov', id: "1", end_date: '5 Nov', booked: 12, total_slot: 20 },
                { id: "2", start_date: '22 Nov', end_date: '25 Nov', booked: 12, total_slot: 20 },
                { id: "3", start_date: '2 Nov', end_date: '5 Nov', booked: 12, total_slot: 20 },
                { id: "4", start_date: '2 Nov', end_date: '5 Nov', booked: 12, total_slot: 20 },
                { id: "5", start_date: '2 Nov', end_date: '5 Nov', booked: 12, total_slot: 20 }
            ]
        }
    ]
    const listTrek = [
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
            image: [
                "https://i2.ex-cdn.com/crystalbay.com/files/content/2024/06/07/du-lich-son-la-1-1200.jpg",
                "https://vcdn1-dulich.vnecdn.net/2023/09/26/khunglong1-3113-1695701097.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=By1Wlc--m9UstI0JT9Ni6g",
                "https://vov4.vov.vn/sites/default/files/styles/large/public/2023-12/z4947662991547_0dc72032ad508e18c108cba0b9ec4021.jpg",
            ],
            description: "Tà Xùa (2.865m) là ngọn núi gồm 3 đỉnh ở xã Bản Công, Trạm Tấu, Yên Bái. Rất nhiều người nhầm lẫn giữa núi Tà Xùa với dãy Tà Xùa ở Sơn La.\nNgọn núi này được dân mê xê dịch ví như một huyền thoại, bởi khung cảnh hùng vĩ với những đỉnh núi nhô lên giữa biển mây, tảng đá đầu rùa khổng lồ vươn ra mép vực và dãy núi trập trùng tựa sống lưng khủng long. Dù không thuộc top 10 đỉnh núi cao nhất Việt Nam, Tà Xùa vẫn là một thử thách không hề dễ dàng. Địa hình nơi đây đa dạng với những con dốc dài, rừng già rêu phong bao phủ, đòi hỏi sức bền và ý chí chinh phục. Nhưng đổi lại, khung cảnh ngoạn mục từ độ cao này chắc chắn sẽ khiến mọi công sức bỏ ra trở nên xứng đáng.",
            host: {
                id: "1",
                host_name: 'taxua.trekking.vn',
                host_avt: 'https://www.nepalhimalayastrekking.com/public/uploads/261440359_4775602299167480_6993583518940422934_n.jpg',
                host_rate: 4.8,
                host_booked: 1500,
                host_number_tours: 20,
            },
            available_batches: [
                { start_date: '2 Nov', id: "1", end_date: '5 Nov', booked: 12, total_slot: 20 },
                { id: "2", start_date: '22 Nov', end_date: '25 Nov', booked: 12, total_slot: 20 },
                { id: "3", start_date: '2 Nov', end_date: '5 Nov', booked: 12, total_slot: 20 },
                { id: "4", start_date: '2 Nov', end_date: '5 Nov', booked: 12, total_slot: 20 },
                { id: "5", start_date: '2 Nov', end_date: '5 Nov', booked: 12, total_slot: 20 }
            ]
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
            image: [
                'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/06/07/du-lich-son-la-1-1200.jpg'
            ],
            description: "Tà Xùa (2.865m) là ngọn núi gồm 3 đỉnh ở xã Bản Công, Trạm Tấu, Yên Bái. Rất nhiều người nhầm lẫn giữa núi Tà Xùa với dãy Tà Xùa ở Sơn La.\nNgọn núi này được dân mê xê dịch ví như một huyền thoại, bởi khung cảnh hùng vĩ với những đỉnh núi nhô lên giữa biển mây, tảng đá đầu rùa khổng lồ vươn ra mép vực và dãy núi trập trùng tựa sống lưng khủng long. Dù không thuộc top 10 đỉnh núi cao nhất Việt Nam, Tà Xùa vẫn là một thử thách không hề dễ dàng. Địa hình nơi đây đa dạng với những con dốc dài, rừng già rêu phong bao phủ, đòi hỏi sức bền và ý chí chinh phục. Nhưng đổi lại, khung cảnh ngoạn mục từ độ cao này chắc chắn sẽ khiến mọi công sức bỏ ra trở nên xứng đáng.",
            host: {
                id: "2",
                host_name: 'taxua.trekking.vn',
                host_avt: '',
                host_rate: 4.9,
                host_booked: 1600,
                host_number_tours: 21,
            },
            available_batches: [
                { start_date: '2 Nov', id: "1", end_date: '5 Nov', booked: 12, total_slot: 20 },
                { id: "2", start_date: '22 Nov', end_date: '25 Nov', booked: 12, total_slot: 20 },
                { id: "3", start_date: '2 Nov', end_date: '5 Nov', booked: 12, total_slot: 20 },
                { id: "4", start_date: '2 Nov', end_date: '5 Nov', booked: 12, total_slot: 20 },
                { id: "5", start_date: '2 Nov', end_date: '5 Nov', booked: 12, total_slot: 20 }
            ]
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
            image: [
                'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/06/07/du-lich-son-la-1-1200.jpg'
            ],
            description: "Tà Xùa (2.865m) là ngọn núi gồm 3 đỉnh ở xã Bản Công, Trạm Tấu, Yên Bái. Rất nhiều người nhầm lẫn giữa núi Tà Xùa với dãy Tà Xùa ở Sơn La.\nNgọn núi này được dân mê xê dịch ví như một huyền thoại, bởi khung cảnh hùng vĩ với những đỉnh núi nhô lên giữa biển mây, tảng đá đầu rùa khổng lồ vươn ra mép vực và dãy núi trập trùng tựa sống lưng khủng long. Dù không thuộc top 10 đỉnh núi cao nhất Việt Nam, Tà Xùa vẫn là một thử thách không hề dễ dàng. Địa hình nơi đây đa dạng với những con dốc dài, rừng già rêu phong bao phủ, đòi hỏi sức bền và ý chí chinh phục. Nhưng đổi lại, khung cảnh ngoạn mục từ độ cao này chắc chắn sẽ khiến mọi công sức bỏ ra trở nên xứng đáng.",
            host: {
                id: "3",
                host_name: 'taxua.trekking.vn',
                host_avt: '',
                host_rate: 5.0,
                host_booked: 1800,
                host_number_tours: 25,
            },
            available_batches: [
                { start_date: '2 Nov', id: "1", end_date: '5 Nov', booked: 12, total_slot: 20 },
                { id: "2", start_date: '22 Nov', end_date: '25 Nov', booked: 12, total_slot: 20 },
                { id: "3", start_date: '2 Nov', end_date: '5 Nov', booked: 12, total_slot: 20 },
                { id: "4", start_date: '2 Nov', end_date: '5 Nov', booked: 12, total_slot: 20 },
                { id: "5", start_date: '2 Nov', end_date: '5 Nov', booked: 12, total_slot: 20 }
            ]
        }
    ]

    const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();

    const handleSeeAllLocation = () => {
        navigation.navigate('AllLocationScreen')
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="black" barStyle="dark-content" />
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.userHeader}>
                        <View>
                            <Text style={styles.welcomeText}>Hi, {user.fullname}</Text>
                            <View style={styles.currentLocationContainer}>
                                <Icon name="map-marker" style={styles.currentLocationIcon} size={14} />
                                <Text style={styles.currentLocationText}>{currentLocation}</Text>
                            </View>
                        </View>
                        <View>
                            <View style={styles.moneyContainer}>
                                <Text style={styles.moneyText}>{solveMoney(user.money)}đ</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.searchContainer}>
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
                    </View>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 50
                    }}
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
                        <Text style={styles.titleList}>Porters</Text>
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
                            {listPorter.map(porter => (
                                <PorterInHome key={porter.id} imageSource={porter.image} />
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
                        <TouchableOpacity style={styles.allDirection}>
                            <Text style={styles.allDirectionText}>See all</Text>
                            <Icon name="chevron-right" style={styles.allDirectionIcon} size={16}/>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.contentListTrek}>
                            {listTrek.map(trek => (
                                <TrekInHome key={trek.id} {...trek} />
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