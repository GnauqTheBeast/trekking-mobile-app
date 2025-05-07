import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, ScrollView, Image, SafeAreaView, StatusBar } from 'react-native';
import styles from "./styles";
import ReturnButton from '../../../components/common/ReturnButton';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { BookingProps } from '../../../types/booking';

const BookingScreen:React.FC = () => {

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'BookingScreen'>>();
  const {trek, batchId} = route.params;

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [selectedBatchId, setSelectedBatchId] = useState(batchId);
  const selectedBatch = trek.available_batches.find(batch => batch.id === selectedBatchId);

  const availableSlots = selectedBatch ? selectedBatch.total_slot - selectedBatch.booked : 0;
  const [participants, setParticipants] = useState(1);

  const incrementParticipants = () => {
    if (participants < availableSlots) {
      setParticipants(participants + 1);
    }
  };

  const decrementParticipants = () => {
    if (participants > 1) {
      setParticipants(participants - 1);
    }
  };

  const totalPrice = participants * trek.price;

  const booking: BookingProps = {
    id: "naksfndj",
    trek: {
      id: trek.id,
      name: trek.name,
      location: trek.location,
      duration: trek.duration,
      price: trek.price,
      level: trek.level,
      host: {
        id: trek.host.id,
        host_name: trek.host.host_name,
        host_avt: trek.host.host_avt,
      },
      image: trek.image,
      available_batches: trek.available_batches
    },
    batch: {
      id: selectedBatch?.id ?? "0",
      start_date: selectedBatch?.start_date ?? '',
      end_date: selectedBatch?.end_date ?? '',
      total_slot: selectedBatch?.total_slot ?? 0,
      booked: selectedBatch?.booked ?? 0,
    },
    total_amount: totalPrice,
    total_person: participants,
    status: ""
  }

  const handlePressBooking = () => {
    navigation.navigate('CheckoutScreen', {booking})
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
                  {trek.host.host_avt ?
                      <ImageBackground source={{uri: trek.host.host_avt}} style={styles.hostAvt} />
                  :
                      <Icon name="account" color='white' size={20} />
                  }
              </View>
            <Text style={styles.businessName}>{trek.host.host_name}</Text>
          </View>
          <View style={styles.trekContent}>
            <Image
              source={{ uri: trek.image[0]}}
              style={styles.trekImage}
            />
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
              <Text style={styles.pricePerPerson}>{trek.price.toLocaleString()}đ/person</Text>
            </View>
          </View>
        </View>

        {/* Available Batches */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available batches</Text>
            <View style={styles.batchesContent}>
              {trek.available_batches.map((batch, index) => (
                  <TouchableOpacity onPress={() => setSelectedBatchId(batch.id)} key={index}>
                  <Text style={[
                      styles.infoBatch,
                      selectedBatchId === batch.id && styles.selectedBatch
                  ]}>
                      {batch.start_date} - {batch.end_date} ({batch.booked}/{batch.total_slot})
                  </Text>
              </TouchableOpacity>
              ))}
            </View>
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amount</Text>
          <Text style={styles.availableSlots}>Available slot: {availableSlots}</Text>
          <View style={styles.participantsRow}>
            <Text style={styles.participantsLabel}>Participants:</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={decrementParticipants}
              >
                <Icon name="minus" color='white' size={13} />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{participants}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={incrementParticipants}
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
            onChange={() => setFullname(fullname)}
            value={fullname}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChange={() => setEmail(email)}
            style={styles.input}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Phone"
            value={phone}
            onChange={() => setPhone(phone)}
            style={styles.input}
            keyboardType="phone-pad"
          />
          <TextInput
            placeholder="Address"
            value={address}
            onChange={() => setAddress(address)}
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
              <Text style={styles.totalPriceValue}>{totalPrice.toLocaleString()}đ</Text>
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