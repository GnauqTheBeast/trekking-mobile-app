import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StatusBar,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import styles from "./styles";
import {useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/main/UserAppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import SaveCard from '../../../assets/icons/common/save-card.svg'
import TrekInSave from "../../../components/save/TrekInSave";
import { AuthContext } from "../../../context/AuthProvider";
import { getAllFavorite } from "../../../services/favorites.service";
import { TrekHostProps, TrekProps } from "../../../types/trek";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

const SaveScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const auth = useContext(AuthContext);
  const isLoggedIn = auth?.isLoggedIn;
  const userId = auth?.user?.id ;
  const [saveTreks, setSaveTreks] = useState<TrekHostProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleLoginPress = () => {
    navigation.navigate('LoginScreen')
  }

  const fetchFavorites = async () => {
    if (isLoggedIn && userId) {
      setLoading(true);
      try {
        const favorites = await getAllFavorite(userId);
        console.log(favorites);
        setSaveTreks(favorites || []);
      } catch (error) {
        console.log("Failed to load favorites:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setSaveTreks([]);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [isLoggedIn, userId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFavorites();
    });
    return unsubscribe;
}, [navigation, fetchFavorites]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
          <Text style={styles.headerTitle}>Saved</Text>
      </View>
      <View style={styles.content}>
        {isLoggedIn ?
          (saveTreks.length !== 0 ?
            <FlatList
              data={saveTreks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TrekInSave {...item} />
              )}
              style={styles.trekList}
              contentContainerStyle={styles.trekListContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#0000ff"]}
                  tintColor="#0000ff"
                />
              }
            />
            :
            <View style={styles.noContainer}>
                <SaveCard height={150} width={150} />
                <Text style={styles.title}>Save what you like for later</Text>
                <Text style={styles.description}>Create lists of your favorite properties to help you share, compare, and book.</Text>
            </View>
          )
          :
          (
            <View style={styles.noContainer}>
                <SaveCard height={150} width={150} />
                <Text style={styles.title}>No save yet</Text>
                <Text style={styles.description}>Sign in or create an account to get started.</Text>
                <TouchableOpacity onPress={handleLoginPress}>
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
          )
        }
      </View>
    </SafeAreaView>
  );
};


export default SaveScreen;