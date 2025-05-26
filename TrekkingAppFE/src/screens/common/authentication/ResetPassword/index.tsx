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
import CustomAlert from '../../../../components/common/Alert';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReturnButton from '../../../../components/common/ReturnButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const validatePassword = (password: string): boolean => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{9,}$/;
    return regex.test(password);
};

const ResetPasswordScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'ForgotOTPScreen'>>()
    const {email} = route.params;

    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [alertVisible, setAlertVisible] = useState(false);
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const isPasswordValid = useMemo(() => validatePassword(password), [password]);
    const isMatchPassword = password === confirmPassword;
    const isButtonEnabled = password !== '' && confirmPassword !== '';


    const handleNextPress = async() => {

        if(!isPasswordValid) {
            setMessage("Password must be longer than 8 characters, contain at least one uppercase letter and one special character")
            setAlertVisible(true)
            return
        }

        if(!isMatchPassword) {
            setMessage("Passwords do not match, please check again.")
            setAlertVisible(true)
            return
        }

        setLoading(true)

        let timeoutId: NodeJS.Timeout;
        timeoutId = setTimeout(() => {
            setLoading(false);
            setMessage("Request failed. Please try again.");
            setAlertVisible(true);
        }, 10000);

        try {

            await axios.post(`http://10.0.2.2:3002/user/reset-password`, {
                email,
                newPassword: password
            })

            setLoading(false);
            clearTimeout(timeoutId);

            Alert.alert("Success", "Password changed successfully, continue to log in.")
            navigation.navigate('LoginScreen')
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


    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <ReturnButton />
                <Text style={styles.headerTitle}>Reset Password</Text>
            </View>

            <View style={styles.contentContainer}>

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="New password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Icon name={showPassword ? 'eye-off' : 'eye'} size={22} color="#3C3E3B" />
                    </TouchableOpacity>
                </View>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Icon name={showPassword ? 'eye-off' : 'eye'} size={22} color="#3C3E3B" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={handleNextPress}
                    style={[styles.buttonContainer, isButtonEnabled && {backgroundColor: '#FF8E4F', opacity: 1}]}
                >
                    {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                    ) : (
                    <Text
                        style={[styles.buttonText, isButtonEnabled && {color: 'white'}]}
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



export default ResetPasswordScreen;