import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import styles from './styles';
import ReturnButton from '../../../../components/common/ReturnButton';
import { RootStackParamList } from '../../../../navigation/main/UserAppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import CustomAlert from '../../../../components/common/Alert';
import { AuthContext } from '../../../../context/AuthProvider';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccountSecurityStackParamList } from '../../../../navigation/main/account/AccountSecurityNavigator';

const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const EditEmailScreen: React.FC = () => {

    const auth = useContext(AuthContext);
    const token = auth?.token;

    const navigation = useNavigation<StackNavigationProp<AccountSecurityStackParamList>>();
    const [email, setEmail] = useState("");
    const [alertVisible, setAlertVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const trimmedEmail = email.trim();
    const isEmailValid = useMemo(() => validateEmail(trimmedEmail), [trimmedEmail]);
    const isNextEnabled = trimmedEmail !== '';


    const handleConfirmNext = async() => {
        setLoading(true);
        let timeoutId: NodeJS.Timeout;

        timeoutId = setTimeout(() => {
            setLoading(false);
            setAlertVisible(true);
        }, 10000);

        try {
            await axios.post(`http://10.0.2.2:3001/auth/change-email`,
                { email},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            setLoading(false);
            clearTimeout(timeoutId);

            navigation.navigate('ChangeEmailOTPScreen', {email})
        }
        catch (error: any){
            if(error.response) {
                const errorMessage = error.response?.data?.message;
                setMessage(errorMessage)
                setAlertVisible(true);
                setLoading(false);
                clearTimeout(timeoutId)
            }
        }
    }

    const handleNextPress = () => {
        if (!isEmailValid) {
            setMessage("Invalid email, please try again.")
            setAlertVisible(true);
            return;
        }

        Alert.alert(
            "Confirmation",
            `Are you sure you want to change email?\nYou will need to re-authenticate.`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Continue",
                    onPress: () => {
                        handleConfirmNext()
                    },
                },
            ]
        );
    }


    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <ReturnButton />
                <Text style={styles.headerTitle}>Edit Email</Text>
            </View>

            <View style={styles.contentContainer}>
                <TextInput
                    style={styles.emailInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    maxLength={100}
                    autoFocus={true}
                />
                <TouchableOpacity
                    onPress={handleNextPress}
                    style={[styles.nextButtonContainer, isNextEnabled && {backgroundColor: '#FF8E4F', opacity: 1}]}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text
                            style={[styles.nextButtonText, isNextEnabled && {color: 'white'}]}
                        >
                            Confirm
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            <CustomAlert
                visible={alertVisible}
                message={message}
                onClose={() => setAlertVisible(false)}
            />
        </View>
    );
};



export default EditEmailScreen;