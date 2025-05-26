import React, { useEffect, useMemo, useState } from 'react';
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
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../navigation/main/UserAppNavigator';
import ReturnButton from '../../../../components/common/ReturnButton';
import CustomAlert from '../../../../components/common/Alert';
import axios from 'axios';

const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const ForgotPasswordScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [email, setEmail] = useState("");
    const [alertVisible, setAlertVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const trimmedEmail = email.trim();
    const isEmailValid = useMemo(() => validateEmail(trimmedEmail), [trimmedEmail]);
    const isNextEnabled = trimmedEmail !== '';


    const handleNextPress = async () => {
        if (!isEmailValid) {
            setMessage("Email không hợp lệ. Vui lòng nhập lại.")
            setAlertVisible(true);
            return;
        }

        setLoading(true);
        let timeoutId: NodeJS.Timeout;

        timeoutId = setTimeout(() => {
            setLoading(false);
            setMessage("Request failed. Please try again.");
            setAlertVisible(true);
        }, 10000);

        try{
            await axios.post(`http://10.0.2.2:3001/auth/forgot-password`, {
                email,
            })

            clearTimeout(timeoutId)
            setLoading(false)
            navigation.navigate('ForgotOTPScreen', {email: trimmedEmail})

        }
        catch(error: any) {
            if(error.response) {
                const errorMessage = error.response?.data?.message;
                setMessage(errorMessage)
                setAlertVisible(true);
                setLoading(false);
                clearTimeout(timeoutId)
            }
        }
    }


    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <ReturnButton />
                <Text style={styles.headerTitle}>Forgot Password</Text>
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
                    ) :
                        <Text style={[styles.nextButtonText, isNextEnabled && {color: 'white'}]}>
                            Next
                        </Text>
                    }
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



export default ForgotPasswordScreen;