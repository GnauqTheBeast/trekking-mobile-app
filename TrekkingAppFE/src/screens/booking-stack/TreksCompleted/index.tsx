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
import TrekCompletedItem from "../../../components/booking/TrekCompletedItem";
import styles from "./styles";
import WorldMap from '../../../assets/icons/common/world-map.svg'
import {useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/main/UserAppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { BookingProps } from "../../../types/booking";
import { AuthContext } from "../../../context/AuthProvider";
import { bookingService } from "../../../services/booking.service";


const TreksCompleted: React.FC = () => {
  const auth = useContext(AuthContext)!;
  const {user, token, isLoggedIn} = auth

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [completedTreks, setCompletedTreks] = useState<BookingProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (token && user) {
          const userId = user.id;
          const bookings = await bookingService.getCompletedBookingByUserId(userId, token);
          setCompletedTreks(bookings);
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
          (completedTreks.length !== 0 ?
            <FlatList
              data={completedTreks}
              // keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TrekCompletedItem {...item} />
              )}
              style={styles.trekList}
              contentContainerStyle={styles.trekListContent}
            />
            :
            <View style={styles.noContainer}>
              <WorldMap height={200} width={200} />
              <Text style={styles.title}>Revisit past trips</Text>
                  <Text style={styles.description}>Here you can refer to all past trips and get inspiration for your next ones</Text>
            </View>
          )
          :
          (
            <View style={styles.noContainer}>
                <WorldMap height={200} width={200} />
                <Text style={styles.title}>No completed booking</Text>
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


export default TreksCompleted;