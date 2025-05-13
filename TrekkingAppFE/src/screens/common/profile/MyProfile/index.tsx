import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import ReturnButton from '../../../../components/common/ReturnButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../navigation/AppNavigator';

const morkUser = {
  name: 'Vu Ngoc Son',
  gender: 'Male',
  dob: null,
  phone: '0343884572',
  address: 'Học viện Công nghệ Bưu chính viễn thông, Km12 Nguyễn Trãi, Hà Đông, Hà Nội',
  email: 'ngocson29112003@gmail.com',
};

const maskPhoneNumber = (phoneNumber: string | null) => {
  if (!phoneNumber) return '';
  const length = phoneNumber.length;
  const lastTwoDigits = phoneNumber.slice(-2);
  const maskedPhoneNumber = '*'.repeat(length - 2) + lastTwoDigits;
  return maskedPhoneNumber;
};

const maskEmail = (email: string) => {
  const position = email.indexOf('@');
  const maskEmail = email.charAt(0) + "*****" + email.charAt(position - 1) + email.substring(position)
  return maskEmail
}

const MyProfileScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [user, setUser] = useState<any>(morkUser);
  const [initialUser] = useState<any>(morkUser);
  const [hasChanges, setHasChanges] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedGender, setSelectedGender] = useState(user.gender || 'Set Now');
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    user.dob ? new Date(user.dob.split('-').reverse().join('-')) : null
  );

  const profileData = [
    { key: 'name', label: 'Name', value: user.name ? user.name : 'Set Now', editable: true },
    { key: 'gender', label: 'Gender', value: user.gender ? user.gender : 'Set Now', editable: true },
    { key: 'birthday', label: 'Birthday', value: user.dob ? user.dob : 'Set Now', editable: true },
    { key: 'phone', label: 'Phone', value: user.phone ? user.phone : 'Set Now', editable: true },
    { key: 'email', label: 'Email', value: user.email ? user.email : 'Set Now', editable: true },
    { key: 'address', label: 'Address', value: user.address ? user.address : 'Set Now', editable: true },
  ];

  useEffect(() => {
    const isChanged = JSON.stringify(user) !== JSON.stringify(initialUser);
    setHasChanges(isChanged);
  }, [user, initialUser]);

  const handleSave = () => {
    if (!hasChanges) return;
    console.log('Lưu thông tin:', user);
    navigation.goBack();
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
    else {
      console.log(`Pressed on ${field.label}`);
    }
  };

  const handleNameChange = () => {
    navigation.navigate('EditNameScreen', {
      name: user.name ? user.name : null,
      onSave: (newName: string) => {
        setUser({
          ...user,
          name: newName
        })
      }
    })
  }

  const handleGenderChange = (value: string) => {
    setSelectedGender(value);
    setUser({ ...user, gender: value });
    setShowGenderModal(false);
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedDate(date);
      setUser({
        ...user,
        dob: date.toLocaleDateString('en-GB'),
      });
    }
    setShowDatePicker(false);
  };

  const handlePhoneChange = () => {
    navigation.navigate('EditPhoneScreen', {
      phone: user.phone ? user.phone : null,
      onSave: (newPhone: string) => {
        setUser({
          ...user,
          phone: newPhone
        })
      }
    })
  }

  const handleAddressChange = () => {
    navigation.navigate('EditAddressScreen', {
      address: user.address ? user.address : null,
      onSave: (newAddress: string) => {
        setUser({
          ...user,
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

      {/* Cover Photo & Avatar Section */}
      <View style={styles.coverPhotoContainer}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/cats/1.jpg' }}
            style={styles.avatar}
          />
          <View style={styles.editAvatarButton}>
            <Text style={styles.editButtonText}>Edit</Text>
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
                  ? maskPhoneNumber(user.phone)
                  :field.key === 'email'
                  ? maskEmail(user.email)
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
                user.address === 'Set Now' && styles.placeholderValue,
              ]}
            >
              {user.address}
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

        {/* Spacer for bottom padding */}
        <View style={{ height: 200 }} />
      </View>
    </SafeAreaView>
  );
};

export default MyProfileScreen;