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
import { AccountSecurityStackParamList } from '../../../../../navigation/main/account/AccountSecurityNavigator';

const EditNameScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<AccountSecurityStackParamList, 'EditNameScreen'>>();
    console.log(route)

    const originalName = route.params?.name || '';
    const [name, setName] = useState(originalName);
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);


    useEffect(() => {
        const hasChanged = name.trim() !== '' && name !== originalName;
        setIsSaveEnabled(hasChanged);
    }, [name, originalName]);

    const handleSave = () => {
        route.params.onSave(name);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <ReturnButton />
                <Text style={styles.headerTitle}>Edit Name</Text>
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
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    maxLength={100}
                    autoFocus={true}
                />

                <Text style={styles.characterLimit}>
                    {name.length}/100 characters only
                </Text>
            </View>
        </View>
    );
};



export default EditNameScreen;