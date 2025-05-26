import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import styles from './styles';
import ReturnButton from '../../../../../components/common/ReturnButton';
import { RootStackParamList } from '../../../../../navigation/main/UserAppNavigator';
import { AccountSecurityStackParamList } from '../../../../../navigation/main/account/AccountSecurityNavigator';

const EditPhoneScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<AccountSecurityStackParamList, 'EditPhoneScreen'>>();

    const originalPhone = route.params?.phone || '';
    const [phone, setPhone] = useState(originalPhone);
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);


    useEffect(() => {
        const hasChanged = phone.trim() !== '' && phone !== originalPhone;
        setIsSaveEnabled(hasChanged);
    }, [phone, originalPhone]);

    const handleSave = () => {
        route.params.onSave(phone);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <ReturnButton />
                <Text style={styles.headerTitle}>Edit Phone</Text>
                <TouchableOpacity
                    onPress={handleSave}
                    style={[styles.saveButton, !isSaveEnabled && { opacity: 0.5 }]}
                    disabled={!isSaveEnabled}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                <TextInput
                    style={styles.nameInput}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter your phone"
                    maxLength={12}
                    autoFocus={true}
                    keyboardType='number-pad'
                />

                <Text style={styles.characterLimit}>
                    {phone.length}/12 characters only
                </Text>
            </View>
        </View>
    );
};



export default EditPhoneScreen;