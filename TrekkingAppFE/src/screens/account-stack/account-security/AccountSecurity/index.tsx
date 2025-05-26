import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Switch
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import styles from './styles';
import ReturnButton from '../../../../components/common/ReturnButton';
import { AccountSecurityStackParamList } from '../../../../navigation/main/account/AccountSecurityNavigator';
import { AuthContext } from '../../../../context/AuthProvider';

type AccountSecurityScreenProps = {};

const maskEmail = (email: string) => {
  const position = email.indexOf('@');
  const maskEmail = email.charAt(0) + "*".repeat(position - 2) + email.charAt(position - 1) + email.substring(position);
  return maskEmail;
};

const AccountSecurityScreen: React.FC<AccountSecurityScreenProps> = () => {
  const auth = useContext(AuthContext);
  const user = auth?.user;

  const navigation = useNavigation<StackNavigationProp<AccountSecurityStackParamList>>();
  const [faceIdEnabled, setFaceIdEnabled] = useState<boolean>(true);

  const toggleFaceID = () => {
    setFaceIdEnabled(previousState => !previousState);
  };

  const navigateToMyProfile = () => {
    navigation.navigate('MyProfileScreen');
  };


  const navigateToEmail = () => {
    navigation.navigate('EditEmailScreen');
  };

  const navigateToChangePassword = () => {
    navigation.navigate('ChangePasswordScreen');
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <ReturnButton />
        <Text style={styles.headerTitle}>Account & Security</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Account</Text>
        </View>
        <View style={styles.section}>
          {/* My Profile */}
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={navigateToMyProfile}
          >
            <Text style={styles.itemLabel}>My Profile</Text>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>

          <View style={styles.separator} />

          {/* Email */}
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={navigateToEmail}
          >
            <Text style={styles.itemLabel}>Email</Text>
            <View style={styles.rightContainer}>
              <Text style={styles.itemValue}>{maskEmail(user!.email)}</Text>
              <Icon name="chevron-right" size={20} color="#999" />
            </View>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.itemContainer}
            onPress={navigateToChangePassword}
          >
            <Text style={styles.itemLabel}>Change Password</Text>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.itemContainer}
          >
            <Text style={styles.itemLabel}>Social Media Accounts</Text>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>

          <View style={styles.separator} />



          {/* Face ID Authentication */}
          <View style={styles.switchContainer}>
            <View>
              <Text style={styles.itemLabel}>Face ID Authentication</Text>
              <Text style={styles.itemNote}>
                Your Face ID data is on your device and Shopee does not store it
              </Text>
            </View>
            <Switch
              value={faceIdEnabled}
              onValueChange={toggleFaceID}
              trackColor={{ false: '#d8d8d8', true: '#4CD964' }}
              thumbColor="#FFFFFF"
              style={styles.switchBtn}
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Security</Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.itemContainer}
          >
            <View>
              <Text style={styles.itemLabel}>Check Account Activity</Text>
              <Text style={styles.itemNote}>Check your login and account changes in the last 30 days</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.itemContainer}
          >
            <View>
              <Text style={styles.itemLabel}>Manage Login Device</Text>
              <Text style={styles.itemNote}>Review the devices that you have logged in Shopee account.</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AccountSecurityScreen;