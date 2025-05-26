import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, ScrollView, Image, SafeAreaView, StatusBar, Alert } from 'react-native';
import styles from "./styles";
import ReturnButton from '../../../components/common/ReturnButton';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/main/UserAppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { BookingProps } from '../../../types/booking';
import { bookingService } from '../../../services/booking.service';
import { AuthContext } from '../../../context/AuthProvider';
import { LoadingSpinner } from '../../../components/LoadingSpinner';


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

const BookingScreen:React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'BookingScreen'>>();
  const {trek} = route.params;
  const auth = useContext(AuthContext);
  const user = auth?.user
  const id = auth!.user!.id;
  const token = auth!.token;


  const [fullname, setFullname] = useState(user?.fullname);
  const [email, setEmail] = useState(user?.email);
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [address, setAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(false);

  const [participants, setParticipants] = useState(1);

  const incrementParticipants = () => {
    if (participants < trek.available_slot) {
      const newValue = participants + 1;
      setParticipants(newValue);
    }
  };

  const decrementParticipants = () => {
    if (participants > 1) {
      const newValue = participants - 1;
      console.log('Setting new value:', newValue);
      setParticipants(newValue);
    }
  };

  const totalPrice = participants * trek.price;

  const booking: BookingProps = {
    trek: {
      ...trek
    },
    porter_id: 'c5c3b007-3342-45aa-8012-78c03d7ec0e1',
    total_amount: totalPrice,
    total_person: participants,
    status: "PENDING",
    created_at: new Date().toISOString()
  }

  console.log('🚀 [BookingScreen] booking:', booking);

  const handlePressBooking = async () => {
    try {
      setLoading(true);
      const bookingData = {
        user_id: id,
        tour_id: trek.id,
        porter_id: 'c5c3b007-3342-45aa-8012-78c03d7ec0e1',
        quantity: participants,
        total_price: totalPrice,
        status: "PENDING"
      };
      console.log("User Id: ", id)

      console.log("Token: ", token)
      const response = await bookingService.createBooking(bookingData, token || '');

      if (response.data) {
        const bookingForNavigation = {
          ...booking,
          id: response.data.id,
          trek: {
            ...booking.trek,
            start_date: String(booking.trek.startAt),
            end_date: String(booking.trek.endAt)
          },
          created_at: new Date().toISOString()
        };

        navigation.navigate('CheckoutScreen', {
          booking: bookingForNavigation
        });
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
          <ReturnButton />
          <Text style={styles.headerTitle}>Booking</Text>
      </View>
      <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
      <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
              paddingBottom: 10
          }}
      >
        <View style={styles.trekCard}>
          <View style={styles.trekHeader}>
            <View style={styles.wrapHostAvatar}>
                {trek.host.image ?
                    <ImageBackground source={{uri: trek.host.image}} style={styles.hostAvt} />
                :
                    <Icon name="account" color='white' size={20} />
                }
              </View>
            <Text style={styles.businessName}>{trek.host.name}</Text>
          </View>
          <View style={styles.trekContent}>
            {trek.images && trek.images.length > 0 ? (
              <Image
                source={{ uri: trek.images[0] }}
                style={styles.trekImage}
              />
            ) : (
              <View style={[styles.trekImage, { backgroundColor: '#E5E5E5', justifyContent: 'center', alignItems: 'center' }]}>
                <Icon name="image-off" size={40} color="#999" />
              </View>
            )}

            <View style={styles.trekInfo}>
              <Text style={styles.trekName}>{trek.name}</Text>
              <View style={styles.commonRow}>
              <Icon name="map-marker" color='#FF8E4F' size={14}/>
                <Text style={styles.commonText}>{trek.location}</Text>
              </View>
              <View style={styles.commonRow}>
              <Icon name="progress-clock" color='#FF8E4F' size={14}/>
                <Text style={styles.commonText}>{trek.duration}</Text>
              </View>
              <Text style={styles.pricePerPerson}>{solveMoney(trek.price)}đ/person</Text>
            </View>
          </View>
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amount</Text>
          <Text style={styles.availableSlots}>Available slot: {trek.available_slot}</Text>
          <View style={styles.participantsRow}>
            <Text style={styles.participantsLabel}>Participants:</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => decrementParticipants()}
                activeOpacity={0.7}
              >
                <Icon name="minus" color='white' size={13} />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{participants}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => incrementParticipants()}
                activeOpacity={0.7}
              >
                <Icon name="plus" color='white' size={13} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <TextInput
            placeholder="Fullname"
            onChangeText={setFullname}
            value={fullname}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
          />
          <TextInput
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
          />
        </View>
      </ScrollView>
      <View style={styles.priceCheckoutContainer}>
          <View>
              <Text
                  style={{
                      fontFamily: 'OpenSans-Bold',
                      fontSize: 14
                  }}
              >Total Price</Text>
              <Text style={styles.totalPriceValue}>{solveMoney(totalPrice)}đ</Text>
          </View>
          <TouchableOpacity onPress={handlePressBooking}>
              <Text style={styles.checkoutButtonText}>Book Now</Text>
          </TouchableOpacity>
      </View>
      </View>
    </SafeAreaView>
  );
};

export default BookingScreen;