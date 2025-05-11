import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ReturnButton from "../../../components/common/ReturnButton";
import { StatusBar, View, Text, FlatList } from "react-native";
import styles from "./styles";
import { RouteProp, useRoute } from "@react-navigation/native";
import { HomeStackParamList } from "../../../navigation/main/HomeNavigator";
import Trek from "../../../components/common/Trek";

const AllTrekInLocationScreen:React.FC = () => {

    const route = useRoute<RouteProp<HomeStackParamList, "AllTrekInLocationScreen">>();
    const {id, name} = route.params;

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

    return(
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.content}>
                <View style={styles.header}>
                    <ReturnButton />
                    <Text style={styles.titleText}>{name}</Text>
                </View>
                <FlatList
                    data={listTrek}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ ...styles.listLocation, paddingBottom: 80 }}
                    renderItem={({ item }) => (
                        <Trek {...item}/>
                    )}
                />

            </View>
        </SafeAreaView>
    );
}

export default AllTrekInLocationScreen;