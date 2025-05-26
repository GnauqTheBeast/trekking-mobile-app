import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { BookingStackParamList } from '../../../navigation/main/booking/BookingNavigator';

const tabs = [
  { id: "active", name: "Active" },
  { id: "completed", name: "Completed" },
  { id: "cancelled", name: "Cancelled" },
];

const TopBarBooking: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<BookingStackParamList>>();
  const route = useRoute<RouteProp<BookingStackParamList>>();

  const selectedTab = route.name.replace("Treks", "").replace("Screen", "");
  console.log("Sele: ", selectedTab)

  const handleTabPress = (tab: any) => {
    const screenName = `Treks${tab.name}Screen` as keyof BookingStackParamList;
    if (screenName === 'BookingDetailScreen') {
        return
    } else {
        navigation.navigate(screenName);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, selectedTab === tab.name && styles.activeTabButton]}
            onPress={() => handleTabPress(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab.name && styles.activeTabText
              ]}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 44
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF8E4F'
  },
  tabText: {
    fontFamily: 'OpenSans-Regular',
    color: '#C1C1C1'
  },
  activeTabText: {
    color: '#2A5848',
    fontFamily: 'OpenSans-Bold',
  },
});

export default TopBarBooking;
