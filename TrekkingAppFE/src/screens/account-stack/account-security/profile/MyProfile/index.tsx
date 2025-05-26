import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import styles from './styles';
import ReturnButton from '../../../../../components/common/ReturnButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import { StackNavigationProp } from '@react-navigation/stack';
import { AccountSecurityStackParamList } from '../../../../../navigation/main/account/AccountSecurityNavigator';
import axios from 'axios';
import { AuthContext } from '../../../../../context/AuthProvider';

const maskPhoneNumber = (phoneNumber: string | null) => {
  if (!phoneNumber) return 'Set Now';
  const length = phoneNumber.length;
  const lastTwoDigits = phoneNumber.slice(-2);
  const maskedPhoneNumber = '*'.repeat(length - 2) + lastTwoDigits;
  return maskedPhoneNumber;
};

const MyProfileScreen: React.FC = () => {

  const auth = useContext(AuthContext)!;
  const {user, setUser} = auth;
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading user data...</Text>
      </SafeAreaView>
    );
  }

  const navigation = useNavigation<StackNavigationProp<AccountSecurityStackParamList>>();
  const [initialUser, setInitialUser] = useState<any>(user);
  const [tempUser, setTempUser] = useState<any>(user);
  const [hasChanges, setHasChanges] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedGender, setSelectedGender] = useState<any>(user?.gender || 'Set Now');
  const [selectedDate, setSelectedDate] = useState<Date | null>(user?.dob ? new Date(user.dob.split('-').reverse().join('-')) : null);
  const [showImagePickerModal, setShowImagePickerModal] = useState(true);

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log('Screen focused, resetting states');
  //     const resetStates = async () => {
  //       try {
  //         // Kiểm tra AsyncStorage để đồng bộ
  //         const storedUser = await AsyncStorage.getItem('user');
  //         const userToUse = storedUser ? JSON.parse(storedUser) : user;
  //         console.log('User to reset:', userToUse);

  //         setTempUser(userToUse);
  //         setInitialUser(userToUse);
  //         setSelectedGender(userToUse?.gender || 'Set Now');
  //         setSelectedDate(userToUse?.dob ? new Date(userToUse.dob.split('-').reverse().join('-')) : null);
  //         setHasChanges(false);
  //       } catch (error) {
  //         console.error('Error loading user from AsyncStorage:', error);
  //         // Fallback to context user
  //         setTempUser(user);
  //         setInitialUser(user);
  //         setSelectedGender(user?.gender || 'Set Now');
  //         setSelectedDate(user?.dob ? new Date(user.dob.split('-').reverse().join('-')) : null);
  //         setHasChanges(false);
  //       }
  //     };
  //     resetStates();
  //     return () => {
  //       console.log('Screen unfocused, cleaning up');
  //     };
  //   }, [user])
  // );


  const profileData: {key: string, label: string, value: string, editable: boolean}[] = useMemo(
    () => [
      { key: 'name', label: 'Name', value: tempUser?.fullname || 'Set Now', editable: true },
      { key: 'gender', label: 'Gender', value: selectedGender, editable: true },
      {
        key: 'birthday',
        label: 'Birthday',
        value: selectedDate ? selectedDate.toLocaleDateString('en-GB') : 'Set Now',
        editable: true,
      },
      { key: 'phone', label: 'Phone', value: maskPhoneNumber(tempUser?.phoneNumber ?? null), editable: true },
      { key: 'address', label: 'Address', value: tempUser?.address || 'Set Now', editable: true },
    ],
    [tempUser, selectedGender, selectedDate]
  );

  useEffect(() => {
    const isChanged = JSON.stringify(tempUser) !== JSON.stringify(initialUser);
    setHasChanges(isChanged);
  }, [tempUser, initialUser]);

  const handleSave = async() => {
    if (!hasChanges) return;
    try {
      console.log('Lưu thông tin:', tempUser);
      const {role, permissions, ...updateUser} = tempUser;
      console.log("Update user: ", updateUser)
      console.log(`http://10.0.2.2:3002/user/update/${updateUser.id}`)

      await axios.put(`http://10.0.2.2:3002/user/update/${updateUser.id}`, updateUser);

      console.log("Update successfully")

      setUser(tempUser);
      setInitialUser(tempUser);
      setHasChanges(false);

      await AsyncStorage.setItem('user', JSON.stringify(tempUser));
      }
    catch (error:any) {
      console.error('Lỗi khi lưu:', error);
    }
  };

  const handleFieldPress = (field: any) => {
    if (field.key === 'gender') {
      setShowGenderModal(true);
      setShowDatePicker(false);
    }
    else if (field.key === 'birthday') {
      setShowDatePicker(!showDatePicker);
      setShowGenderModal(false);
    }
    else if (field.key === 'name') {
      handleNameChange()
    }
    else if (field.key === 'phone') {
      handlePhoneChange()
    }
    else if(field.key === 'email'){
      handleEmailChange()
    }
  };



  const handleNameChange = () => {
    navigation.navigate('EditNameScreen', {
      name: tempUser!.fullname,
      onSave: (newName: string) => {
        setTempUser({
          ...tempUser,
          fullname: newName
        })
      }
    })
  }

  const handleGenderChange = (value: string) => {
    setSelectedGender(value);
    setTempUser({ ...tempUser, gender: value });
    setShowGenderModal(false);
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedDate(date);
      setTempUser({
        ...tempUser,
        dob: date.toLocaleDateString('en-GB'),
      });
    }
    setShowDatePicker(false);
  };

  const handlePhoneChange = () => {
    navigation.navigate('EditPhoneScreen', {
      phone: tempUser.phoneNumber,
      onSave: (newPhone: string) => {
        setTempUser({
          ...tempUser,
          phoneNumber: newPhone
        })
      }
    })
  }

  const handleEmailChange = () => {
    navigation.navigate('EditEmailScreen')
  }

  const handleAddressChange = () => {
    navigation.navigate('EditAddressScreen', {
      address: tempUser.address,
      onSave: (newAddress: string) => {
        setTempUser({
          ...tempUser,
          address: newAddress
        })
      }
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <ReturnButton />
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveButton]}
            disabled={!hasChanges}
        >
          <Text style={[styles.saveButtonText, !hasChanges && styles.saveButtonTextDisabled]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.coverPhotoContainer}>
        <View style={styles.avatarWrapper}>
          {user?.image ?
            <Image
              source={{ uri: user && user.image }}
              style={styles.avatar}
            />
            :
              <Icon2 name="account" size={100} style={styles.icon} />
          }
          <View style={styles.editAvatarButton}>
            <TouchableOpacity onPress={() => setShowImagePickerModal(true)}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        {profileData.map((field, index) => field.key !== 'address' && (
          <React.Fragment key={field.key}>
            <TouchableOpacity
              style={styles.fieldContainer}
              onPress={() => handleFieldPress(field)}
            >
              <Text style={styles.fieldLabel}>{field.label}</Text>
              <Text
                style={[
                  styles.fieldValue,
                  field.value === 'Set Now' && styles.placeholderValue,
                ]}
              >
                {field.key === 'gender'
                  ? selectedGender
                  : field.key === 'birthday'
                  ? selectedDate
                    ? selectedDate.toLocaleDateString('en-GB')
                    : "Set Now"
                  : field.key === 'phone'
                  ? maskPhoneNumber(tempUser.phoneNumber)
                  : field.value}
              </Text>
              <Icon name="chevron-right" size={20} style={{ position: 'absolute', right: 4, top: 16 }} />
            </TouchableOpacity>

            {field.key === 'birthday' && showDatePicker && (
              <DateTimePicker
                value={selectedDate ? selectedDate : new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            {index < profileData.length - 1 && <View style={styles.separator} />}
          </React.Fragment>

        ))}
        <TouchableOpacity
          style={styles.addressContainer}
          onPress={handleAddressChange}
        >
          <Text style={styles.addressLabel}>Address</Text>
          <View style={styles.addressValueContainer}>
            <Text
              numberOfLines={3}
              style={[
                styles.addressValue,
                user && user.address === 'Set Now' && styles.placeholderValue,
              ]}
            >
              {user && user.address}
            </Text>
            <Icon name="chevron-right" size={20} />
          </View>
        </TouchableOpacity>
        <Modal
          isVisible={showGenderModal}
          onBackdropPress={() => setShowGenderModal(false)}
          style={styles.modal}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            <Picker
              selectedValue={selectedGender}
              onValueChange={(itemValue) => handleGenderChange(itemValue)}
              style={styles.picker}
              dropdownIconColor="transparent"

            >
              <Picker.Item
                style={selectedGender === 'Male' ? styles.selectedItem : styles.pickItem}
                label="Male"
                value="Male"
              />
              <Picker.Item
                style={selectedGender === 'Female' ? styles.selectedItem : styles.pickItem}
                label="Female"
                value="Female"
              />
              <Picker.Item
                style={selectedGender === 'Other' ? styles.selectedItem : styles.pickItem}
                label="Other"
                value="Other"
              />
            </Picker>
          </View>
        </Modal>

        <View style={{ height: 200 }} />
      </View>
    </SafeAreaView>
  );
};

export default MyProfileScreen;
