import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import styles from './styles';
import { RouteProp, useRoute } from '@react-navigation/native';
import { BookingStackParamList } from '../../../navigation/main/booking/BookingNavigator';
import ReturnButton from '../../../components/common/ReturnButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Calendar from '../../../assets/icons/common/calendar.svg';
import Person from '../../../assets/icons/common/person-orange.svg';


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

const formatDate = (dateInput: string | Date): string => {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const BookingDetail:React.FC = () => {
    const route = useRoute<RouteProp<BookingStackParamList, 'BookingDetailScreen'>>();
    const {booking} = route.params;

    console.log('Created at type:', typeof booking.created_at);
    console.log('Created at value:', booking.created_at);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

            <View style={styles.header}>
                <ReturnButton top={16}/>
                <Text style={styles.headerTitle}>Booking Details</Text>
            </View>

            <ScrollView style={styles.scrollView}>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryContent}>
                        <Image source={{ uri: booking.trek.images[0] }} style={styles.trekImage} />
                        <View style={styles.trekInfo}>
                        <Text style={styles.trekName}>{booking.trek.name}</Text>
                        <View style={styles.trekDetailRow}>
                            <Icon name="map-marker" color='#FF8E4F'/>
                            <Text style={styles.trekDetailText}>{booking.trek.location}</Text>
                        </View>
                        <View style={styles.trekDetailRow}>
                            <Icon name="progress-clock" color='#FF8E4F'/>
                            <Text style={styles.trekDetailText}>{booking.trek.duration}</Text>
                        </View>

                        <View style={styles.batchContainer}>
                            <View style={styles.dateContainer}>
                                <Text style={styles.dateLabel}>Date start</Text>
                                <View style={styles.dateValuesRow}>
                                    <Calendar width={12} height={12} />
                                    <Text style={styles.dateValue}>{booking.trek.start_date}</Text>
                                </View>
                            </View>

                            <View style={styles.dateLine} />

                            <View style={styles.dateContainer}>
                                <Text style={styles.dateLabel}>Date end</Text>
                                <View style={styles.dateValuesRow}>
                                    <Calendar width={12} height={12} />
                                    <Text style={styles.dateValue}>{booking.trek.end_date}</Text>
                                </View> 
                            </View>
                        </View>
                        <View style={styles.personsRow}>
                            <Person width={16} height={16} />
                            <Text style={styles.personsText}>
                            {booking.total_person} {booking.total_person === 1 ? 'person' : 'people'}
                            </Text>
                        </View>
                    </View>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Full Name</Text>
                        <Text style={styles.infoValue}>Vũ Ngọc Sơn</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Email</Text>
                        <Text style={styles.infoValue}>vns@outlook.com</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Phone</Text>
                        <Text style={styles.infoValue}>0123456789</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Address</Text>
                        <Text style={styles.infoValue}>
                        Học viện Công nghệ Bưu chính viễn thông, Km12 Nguyễn Trãi, Hà Đông, Hà Nội
                        </Text>
                    </View>
                </View>

                {/* Payment Details */}
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Payment Detail</Text>

                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Total Amount</Text>
                        <Text style={styles.paymentValue}>{solveMoney(booking.total_amount)}đ</Text>
                    </View>

                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Total Payment</Text>
                        <Text style={[styles.paymentValue, styles.totalValue]}>{solveMoney(booking.payment?.total_payment ?? 0)}đ</Text>
                    </View>

                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Payment Method</Text>
                        <Text style={styles.paymentValue}>{booking.payment?.payment_method}</Text>
                    </View>

                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Book at</Text>
                        <Text style={styles.paymentValue}>{formatDate(booking.created_at)}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancel booking</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};



export default BookingDetail;