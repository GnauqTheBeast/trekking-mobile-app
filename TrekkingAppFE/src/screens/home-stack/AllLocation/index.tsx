import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ReturnButton from "../../../components/common/ReturnButton";
import { StatusBar, View, Text, FlatList, ImageBackground, TouchableOpacity } from "react-native";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "../../../navigation/main/home/HomeNavigator";

const AllLocationScreen: React.FC = () => {

    const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();

    // api get all location

    const listLocation = [
        { id: "1", name: 'Sơn La', numberTrek: 1500, image: 'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/06/07/du-lich-son-la-1-1200.jpg' },
        { id: "2", name: 'Lào Cai', numberTrek: 1500, image: 'https://cdn.tgdd.vn/Files/2021/07/03/1365444/kham-pha-13-dia-diem-du-lich-lao-cai-dep-noi-tieng-202303281656546137.jpg' },
        { id: "3", name: 'Quảng Ninh', numberTrek: 1500, image: 'https://sktravel.com.vn/wp-content/uploads/2022/02/binh-lieu-quang-ninh-7.jpg' },
        { id: "4", name: 'Bà rịa - Vũng Tàu', numberTrek: 1500, image: 'https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/08/cao-nguyen-da-ha-giang.jpg' },
        { id: "5", name: 'Đà Lạt', numberTrek: 1500, image: 'https://media.vneconomy.vn/w800/images/upload/2023/05/23/anh-1-da-lat.jpg' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.content}>
                <View style={styles.header}>
                    <ReturnButton />
                    <Text style={styles.titleText}>Locations</Text>
                </View>
                <FlatList
                    data={listLocation}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ ...styles.listLocation, paddingBottom: 80 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.wrapper}
                            onPress={() => navigation.navigate('AllTrekInLocationScreen', {id: item.id.toString(), name: item.name})}
                        >
                            <ImageBackground source={{ uri: item.image }} style={styles.image}>
                                <Text style={styles.numberTrek}>{item.numberTrek} treks</Text>
                                <View style={styles.nameContainer}>
                                    <Text style={styles.nameText}>{item.name}</Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    )}
                />

            </View>
        </SafeAreaView>
    );
};

export default AllLocationScreen;
