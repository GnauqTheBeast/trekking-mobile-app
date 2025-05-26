import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/main/UserAppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wsService } from '../../../services/websocket.service';
import { AuthContext, AuthProvider } from '../../../context/AuthProvider';
import { AccountStackParamList } from '../../../navigation/main/account/AccountNavigator';
import { RoleContext } from '../../../context/RoleProvider';

type AccountScreenNavigationProp = StackNavigationProp<RootStackParamList>;


const AccountScreen: React.FC = () => {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const auth = useContext(AuthContext)!;
  const {user, isLoggedIn, setUser, setToken, setIsLoggedIn} = auth;
  const role = user?.role.name;

  useEffect(() => {
      const fetchUserData = async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            const userInfoString = await AsyncStorage.getItem('user');

            if (token && userInfoString) {
              setIsLoggedIn(true);
              setUser(JSON.parse(userInfoString));
            } else {
              setIsLoggedIn(false);
              setUser(null);
            }
          } catch (error) {
            console.error('Failed to fetch user data:', error);
          }
        };

        fetchUserData();
  }, []);

  const handleLogout = async () => {
    wsService.disconnect();
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
  };

  const handlePressMenuItem = (title: string) => {
    // if (!isLoggedIn) {
    //   rootNavigation.navigate('LoginScreen');
    //   return;
    // }
    switch(title) {
      case 'Trekking Management':
        rootNavigation.navigate('TrekStack', {
          screen: 'TrekList'
        });
        break;
      case 'Account & Security':
        rootNavigation.navigate('AccountSecurityStack', {screen: 'AccountSecurityScreen'});
        break;
      case 'My Wallet':
        rootNavigation.navigate('WalletStack', {screen: 'MyWalletScreen'})
        break;
      default:
        console.log(title);
    }
  }

  const MenuItem = ({ icon, size, title, showArrow = true }: { icon: string, size: number, title: string, showArrow?: boolean }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => handlePressMenuItem(title)}
      disabled={!isLoggedIn}
    >
      <View style={styles.menuItemLeft}>
        <Icon name={icon} size={size} color="#FF8E4F" />
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      {showArrow && <Icon name="chevron-right" size={24} color="#999" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <View style={styles.content}>
            <View style={styles.header}>
                {isLoggedIn && user ?
                <>
                    <View style={styles.profileImageContainer}>
                        <View style={styles.profileImage}>
                        {user.image ? (
                            <Image
                            source={{ uri: user.image }}
                            style={{ width: '100%', height: '100%', borderRadius: 30 }}
                            />
                        ) : (
                            <Icon name="account" size={56} color="#2A5848" />
                        )}
                        </View>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{user.fullname}</Text>
                        <Text style={styles.profileEmail}>{user.email}</Text>
                    </View>
                </>
                :
                <View style={styles.noLoginContainer}>
                    <Text style={styles.introText}>Register account, enjoy many benefits</Text>
                    <View style={styles.authContainer}>
                        <TouchableOpacity
                            style={styles.authTextContainer}
                            onPress={() => rootNavigation.navigate('LoginScreen')}
                        >
                            <Text style={styles.authText}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.authTextContainer}
                            onPress={() => rootNavigation.navigate('SignUpScreen')}
                        >
                            <Text style={styles.authText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            </View>

            <View style={styles.menuContainer}>
                {role === 'HOST' && (
                  <MenuItem icon="map-marker-path" size={26} title="Trekking Management" />
                )}
                <MenuItem icon="account" size={28} title="Account & Security" />
                <MenuItem icon="credit-card-outline" size={26} title="My Wallet" />
                <MenuItem icon="star-box" size={28} title="My reviews" />
                <MenuItem icon="bell" size={26} title="Notifications" />
                <MenuItem icon="help-circle" size={26} title="Help" />
                <MenuItem icon="information" size={26} title="About us" />
            </View>

            {isLoggedIn &&
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Icon name="logout-variant" size={22} color="white" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            }
        </View>
    </SafeAreaView>
  );
};

export default AccountScreen;
