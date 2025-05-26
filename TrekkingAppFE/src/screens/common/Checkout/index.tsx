import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import ReturnButton from '../../../components/common/ReturnButton';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/main/UserAppNavigator';
import Calendar from '../../../assets/icons/common/calendar.svg';
import Person from '../../../assets/icons/common/person-orange.svg';
import { AuthContext } from '../../../context/AuthProvider';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { bookingService } from '../../../services/booking.service';
import { paymentService } from '../../../services/payment.service';
import { StackNavigationProp } from '@react-navigation/stack';

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

const CheckoutScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'CheckoutScreen'>>();
  const { booking } = route.params;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  console.log('Booking object:', JSON.stringify(booking, null, 2));

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('banking');
  // const [walletBalance, setWalletBalance] = useState(500000);
  const [loading, setLoading] = useState(false);

  // Handle Confirm Payment
  const handleConfirmPayment = async () => {
    // if (selectedPaymentMethod === 'wallet' && walletBalance < booking.total_amount) {
    //   Alert.alert(
    //     'Insufficient Balance',
    //     'Your wallet balance is not enough. Please top up your wallet.',
    //     [
    //       { text: 'Cancel', style: 'cancel' },
    //       {
    //         text: 'Top Up',
    //         onPress: () => navigation.navigate('TopUpScreen' as never)
    //       },
    //     ]
    //   );
    //   return;
    // }

    try {
      setLoading(true);

      console.log("Booking Id: ", booking.id)
      const response = await paymentService.processPayment(booking.id || '');

      if (response) {
        Alert.alert(
          'Success',
          'Process payment successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('MainStack',
                {
                  screen: 'HomeStack',
                  params: {screen: 'HomeScreen'}
                }
              )
            }
          ]
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ReturnButton />
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView style={{ backgroundColor: '#f2f2f2' }}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <Image source={{ uri: booking.trek.images.length > 0 ? booking.trek.images[0] : '' }} style={styles.trekImage} />
            <View style={styles.trekInfo}>
              <Text style={styles.trekName}>{booking.trek.name}</Text>

              <View style={styles.batchContainer}>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateLabel}>Date start</Text>
                  <View style={styles.dateValuesRow}>
                    <Calendar width={14} height={14} />
                    <Text style={styles.dateValue}>{formatDate(String(booking.trek.startAt))}</Text>
                  </View>
                </View>

                <View style={styles.dateLine} />

                <View style={styles.dateContainer}>
                  <Text style={styles.dateLabel}>Date end</Text>
                  <View style={styles.dateValuesRow}>
                    <Calendar width={14} height={14} />
                    <Text style={styles.dateValue}>{formatDate(String(booking.trek.endAt))}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.personsRow}>
                <Person width={20} height={20} />
                <Text style={styles.personsText}>
                  {booking.total_person} {booking.total_person === 1 ? 'person' : 'people'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{solveMoney(booking.total_amount)}đ</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentMethodCard}>
          <View style={styles.paymentMethodHeader}>
            <View style={styles.methodIconContainer}>
              <Text style={styles.methodIconText}>$</Text>
            </View>
            <Text style={styles.paymentMethodTitle}>Payment Method</Text>
          </View>
          <TouchableOpacity
            style={styles.methodOption}
            onPress={() => setSelectedPaymentMethod('wallet')}
          >
            <View style={styles.radioContainer}>
              <View style={styles.radioOuter}>
                {selectedPaymentMethod === 'wallet' && <View style={styles.radioInner} />}
              </View>
            </View>
            <Text style={styles.methodName}>
              Wallet
            </Text>
            <View style={styles.flex} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.methodOption}
            onPress={() => setSelectedPaymentMethod('banking')}
          >
            <View style={styles.radioContainer}>
              <View style={styles.radioOuter}>
                {selectedPaymentMethod === 'banking' && <View style={styles.radioInner} />}
              </View>
            </View>
            <Text style={styles.methodName}>Banking</Text>
            <View style={styles.flex} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.methodOption, {borderBottomWidth: 0}]}
            onPress={() => setSelectedPaymentMethod('card')}
          >
            <View style={styles.radioContainer}>
              <View style={styles.radioOuter}>
                {selectedPaymentMethod === 'card' && <View style={styles.radioInner} />}
              </View>
            </View>
            <Text style={styles.methodName}>Card</Text>
            <View style={styles.flex} />
          </TouchableOpacity>
        </View>

        {/* Payment Detail */}
        <View style={styles.paymentDetailCard}>
          <Text style={styles.paymentDetailTitle}>Payment Detail</Text>

          <View style={[styles.detailRow, {marginTop: 6}]}>
            <Text style={styles.detailLabelAmount}>Total Amount</Text>
            <Text style={styles.detailValueAmount}>{solveMoney(booking.total_amount)}đ</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabelPayment}>Total Payment</Text>
            <Text style={styles.detailValuePayment}>{solveMoney(booking.total_amount)}đ</Text>
          </View>

          <Text style={styles.termsText}>
            By clicking "Confirm payment", you are agreeing to{' '}
            <Text style={styles.termsLink}>DSQ's General Transaction Terms</Text>
          </Text>
        </View>
      </ScrollView>
      <View style={styles.priceConfirmPaymentContainer}>
          <View>
              <Text
                  style={{
                      fontFamily: 'OpenSans-Bold',
                      fontSize: 14
                  }}
              >Total Price</Text>
              <Text style={styles.totalPriceValue}>{solveMoney(booking.total_amount)}đ</Text>
          </View>
          <TouchableOpacity onPress={handleConfirmPayment}>
              <Text style={styles.confirmButtonText}>Confirm payment</Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CheckoutScreen;