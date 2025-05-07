import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground
} from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Calendar from '../../../assets/icons/common/calendar.svg';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BookingStackParamList } from '../../../navigation/main/BookingNavigator';
import { BookingProps } from '../../../types/booking';


const getStatusColor = (status: string): string => {
    if (status === 'Active') {
      return '#0E871C';
    } else if (status === 'Cancelable') {
      return '#FF8E4F';
    }
    return '#000';
};

const solveMoney = (money: number | 0): string => {
    let result: string = '';
    while(money > 1000) {
        let tmp = money % 1000;
        result = '.' + tmp.toString().padStart(3, '0') + result;
        money = Math.floor(money / 1000);
    }
    result = money.toString() + result;
    return result;
}

const TrekActiveItem: React.FC<BookingProps> = (booking) => {

    const navigation = useNavigation<StackNavigationProp<BookingStackParamList>>();

    const handleViewDetail = () => {
        navigation.navigate('BookingDetailScreen', { booking })
    }

    const statusColor = getStatusColor(booking.status);
    return (
        <View style={styles.trekItem}>
            <View style={styles.top}>
                <View style={styles.hostContainer}>
                <View style={styles.wrapHostAvatar}>
                    {booking.trek.host.host_avt !== '' ?
                        <ImageBackground source={{uri: booking.trek.host.host_avt}} style={styles.hostAvt} />
                    :
                        <Icon name="account" color='white' size={20} />
                    }
                </View>
                <Text style={styles.hostName}>{booking.trek.host.host_name}</Text>
                </View>
                <Text style={[styles.statusLabel, { color: statusColor }]}>{booking.status}</Text>
            </View>
            <View style={styles.trekInfoContainer}>
                <Image source={{uri: booking.trek.image[0]}} style={styles.trekImage} />
                <View style={styles.trekDetails}>
                <Text style={styles.trekName}>{booking.trek.name}</Text>
                <View style={styles.trekDetailRow}>
                    <Icon name="map-marker" color='#FF8E4F'/>
                    <Text style={styles.trekDetailText}>{booking.trek.location}</Text>
                </View>
                <View style={styles.trekDetailRow}>
                    <Icon name="progress-clock" color='#FF8E4F'/>
                    <Text style={styles.trekDetailText}>{booking.trek.duration}</Text>
                </View>
                <View style={styles.trekDetailRow}>
                    <Calendar width={14} height={14} />
                    <Text style={styles.trekDetailText}>{booking.batch.start_date} - {booking.batch.end_date}</Text>
                </View>

                <Text style={styles.trekPrice}>{solveMoney(booking.trek.price)}đ/person</Text>
                </View>
            </View>

            <View style={styles.trekPaymentContainer}>
                <Text style={styles.trekPaymentText}>
                Total payment ({booking.total_person} people): <Text style={styles.trekPaymentAmount}>{solveMoney(booking.payment?.total_payment ?? 0)}đ</Text>
                </Text>

                <View style={styles.trekActionButtons}>
                    <TouchableOpacity
                        style={styles.viewDetailButton}
                        onPress={handleViewDetail}
                    >
                        <Text style={styles.viewDetailText}>View Detail</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};



export default TrekActiveItem;