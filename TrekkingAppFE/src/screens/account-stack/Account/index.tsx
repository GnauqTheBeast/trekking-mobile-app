import React, { useEffect, useState } from 'react';
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
import { RootStackParamList } from '../../../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fixed user data
const user = {
  name: 'Afsar Hossen',
  email: 'imafsar97@gmail.com',
  avt_image: null, // Set to null to test icon display, or use a URL like 'https://via.placeholder.com/60'
};

const AccountScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

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
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      setIsLoggedIn(false);
      setUser(null);
  };

  const handlePressMenuItem = (title: string) => {
    switch(title) {
      case 'My profile':
        navigation.navigate('MyProfileScreen');
        break;
      case 'Rewards & Wallet':
        // Show wallet options
        break;
      case 'Nạp tiền':
        navigation.navigate('WalletDeposit');
        break;
      case 'Rút tiền':
        navigation.navigate('WalletWithdrawal');
        break;
      case 'Lịch sử giao dịch':
        navigation.navigate('WalletHistory');
        break;
      default:
        console.log(title);
    }
  }

  const MenuItem = ({ icon, size, title, showArrow = true }: { icon: string, size: number, title: string, showArrow?: boolean }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => handlePressMenuItem(title)}
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
                {isLoggedIn ?
                <>
                    <View style={styles.profileImageContainer}>
                        <View style={styles.profileImage}>
                        {user.avt_image ? (
                            <Image
                            source={{ uri: user.avt_image }}
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
                            onPress={() => navigation.navigate('LoginScreen')}
                        >
                            <Text style={styles.authText}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.authTextContainer}
                            onPress={() => navigation.navigate('SignUpScreen')}
                        >
                            <Text style={styles.authText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            </View>

        {/* Menu Items */}
            <View style={styles.menuContainer}>
                <MenuItem icon="account" size={28} title="My profile" />
                <MenuItem icon="credit-card-outline" size={26} title="Rewards & Wallet" />
                {isLoggedIn && (
                  <>
                    <MenuItem icon="cash-plus" size={26} title="Nạp tiền" />
                    <MenuItem icon="cash-minus" size={26} title="Rút tiền" />
                    <MenuItem icon="history" size={26} title="Lịch sử giao dịch" />
                  </>
                )}
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