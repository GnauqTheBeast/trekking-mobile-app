import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Calendar from '../../../assets/icons/common/calendar.svg';
import styles from './styles';
import { BookingProps } from '../../../types/booking';


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

const TrekCancelledItem: React.FC<BookingProps> = (booking) => {

    return (
        <View style={styles.trekItem}>
            <View style={styles.top}>
                <View style={styles.hostContainer}>
                {/* <View style={styles.wrapHostAvatar}>
                    {booking.trek.host.host_avt !== '' ?
                        <ImageBackground source={{uri: booking.trek.host.host_avt}} style={styles.hostAvt} />
                    :
                        <Icon name="account" color='white' size={20} />
                    }
                </View>
                <Text style={styles.hostName}>{booking.trek.host.host_name}</Text> */}
                </View>
                <Text style={styles.statusLabel}>{booking.status}</Text>
            </View>
            <View style={styles.trekInfoContainer}>
                <Image source={{uri: booking.trek.images[0]}} style={styles.trekImage} />
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
                    <Text style={styles.trekDetailText}>{booking.trek.start_date} - {booking.trek.end_date}</Text>
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
                        style={styles.detailButton}
                    >
                        <Text style={styles.detailText}>Cancellation Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.bookAgainButton}
                    >
                        <Text style={styles.bookAgainText}>Book again</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};



export default TrekCancelledItem;