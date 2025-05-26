import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StatusBar,
  SafeAreaView,
  FlatList,
  Text,
  Image,
  TouchableOpacity
} from "react-native";
import TopBarBooking from "../../../components/common/TopBarBooking";
import styles from "./styles";
import {useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/main/UserAppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import TrekActiveItem from "../../../components/booking/TrekActiveItem";
import { BookingProps } from "../../../types/booking";
import { AuthContext } from "../../../context/AuthProvider";
import { bookingService } from "../../../services/booking.service";


const activeTreks: BookingProps[] = [
];

const TreksActive: React.FC = () => {

  const auth = useContext(AuthContext)!;
  const {user, token, isLoggedIn} = auth

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTreks, setActiveTreks] = useState<BookingProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (token && user) {
          const userId = user.id;
          const bookings = await bookingService.getPendingBookingByUserId(userId, token);
          setActiveTreks(bookings);
        } else {
          return;
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setIsLoading(false);
      }
  };

    fetchBookings();
  }, []);

  const handleLoginPress = () => {
    navigation.navigate('LoginScreen')
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <TopBarBooking />
        {isLoggedIn ?
          (activeTreks.length !== 0 ?
            <FlatList
              data={activeTreks}
              // keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TrekActiveItem {...item} />
              )}
              style={styles.trekList}
              contentContainerStyle={styles.trekListContent}
            />
            :
            <View style={styles.noContainer}>
              <Image style={{height: 180, width: 180, marginVertical: 16}} source={require('../../../assets/icons/common/globe.png')}/>
              <Text style={styles.title}>Where to next?</Text>
                  <Text style={styles.description}>You haven’t started any treks yet. Once you make a booking, it’ll appear here.</Text>
            </View>
          )
          :
          (
            <View style={styles.noContainer}>
                <Image style={{height: 180, width: 180, marginVertical: 16}} source={require('../../../assets/icons/common/globe.png')}/>
                <Text style={styles.title}>No bookings yet</Text>
                <Text style={styles.description}>Sign in or create an account to get started.</Text>
                <TouchableOpacity onPress={handleLoginPress}>
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
            </View>
          )
        }
      </View>
    </SafeAreaView>
  );
};


export default TreksActive;