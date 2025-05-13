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
import ReturnButton from '../../../../components/common/ReturnButton';
import { RootStackParamList } from '../../../../navigation/AppNavigator';

const EditAddressScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RootStackParamList, 'EditAddressScreen'>>();

    const originalAddress = route.params?.address || '';
    const [address, setAddress] = useState(originalAddress);
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);


    useEffect(() => {
        const hasChanged = address.trim() !== '' && address !== originalAddress;
        setIsSaveEnabled(hasChanged);
    }, [address, originalAddress]);

    const handleSave = () => {
        route.params.onSave(address);
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
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter your address"
                    maxLength={100}
                    autoFocus={true}
                    multiline={true}
                    textAlignVertical='top'
                />

                <Text style={styles.characterLimit}>
                    {address.length}/100 characters only
                </Text>
            </View>
        </View>
    );
};



export default EditAddressScreen;