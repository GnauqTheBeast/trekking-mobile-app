import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  Pressable,
  ActivityIndicator
} from 'react-native';
import styles from './styles';
import ReturnButton from '../../../../components/common/ReturnButton';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../../../../navigation/main/home/HomeNavigator';
import { RootStackParamList } from '../../../../navigation/main/UserAppNavigator';
import axios, { HttpStatusCode } from 'axios';
import CustomAlert from '../../../../components/common/Alert';

const ForgotOTPScreen:React.FC = () => {

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const route = useRoute<RouteProp<RootStackParamList, 'OTPScreen'>>()

  const { email } = route.params;
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(TextInput | null)[]>(Array(6).fill(null));
  const [timer, setTimer] = useState<number>(180);
  const minutes = Math.floor(timer / 60)
  const [timerActive, setTimerActive] = useState<boolean>(true);

  const [otpError, setOtpError] = useState<boolean>(false);
  const [otpStyleError, setOtpStyleError] = useState<boolean>(false);
  const [wrongAttempts, setWrongAttempts] = useState<number>(0);
  const [lockedOut, setLockedOut] = useState<boolean>(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
      let interval: NodeJS.Timeout | null = null;
      if(timerActive && timer > 0){
          interval = setInterval(() => {
              setTimer((prevTimer) => prevTimer - 1);
          }, 1000)
      }
      else if(timer === 0){
          setTimerActive(false)
          if(interval) clearInterval(interval)
      }
      return () => {
          if(interval) clearInterval(interval)
      }
  }, [timer, timerActive])

  const handleOtpChange = (text: string, index: number) => {

    if (otpStyleError) {
      setOtpStyleError(false);
    }
    const newOtp = [...otp];

    if (text === '' && otp[index] === '' && index > 0) {
        inputRefs.current[index - 1]?.focus();
        return;
    }
    if (text === '') {
        newOtp[index] = '';
        setOtp(newOtp);
        if (index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        return;
    }

    if (text.length > 1) {
      text = text.charAt(text.length - 1);
    }

    newOtp[index] = text;
    setOtp(newOtp);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };



  const resendOtp = async() => {
    setResendLoading(true)

    let timeoutId: NodeJS.Timeout;
    timeoutId = setTimeout(() => {
      setResendLoading(false);
      setAlertVisible(true);
    }, 10000);

    try {
      await axios.post('http://10.0.2.2:3001/auth/resend-otp', {email})
      setOtp(Array(6).fill(''));
      setTimer(180);
      setTimerActive(true);
      setOtpError(false);
      setOtpStyleError(false);
      setWrongAttempts(0);
      setLockedOut(false);
      inputRefs.current[0]?.focus();

      setResendLoading(false);
      clearTimeout(timeoutId);
    } catch (error: any) {
      if(error.response) {
        setResendLoading(false);
        clearTimeout(timeoutId);
      }
    }
  };

  const verifyOtp = async() => {

    setVerifyLoading(true);
    let timeoutId: NodeJS.Timeout;

    timeoutId = setTimeout(() => {
      setVerifyLoading(false);
      setAlertVisible(true);
    }, 10000);

    try {
      const enteredOtp = otp.join('');
      await axios.post('http://10.0.2.2:3001/auth/forgot/otp', {
        email,
        otp: enteredOtp
      })

      clearTimeout(timeoutId)
      setVerifyLoading(false)
      navigation.navigate('ResetPasswordScreen', {email});
      setWrongAttempts(0);
      setLockedOut(true)
      setIsVerified(true);

    }
    catch (error: any) {
      if(error.response) {
        setOtpError(true);
        setOtpStyleError(true);
        setWrongAttempts((prev) => {
          const newAttempts = prev + 1;
          if (newAttempts >= 5 && otpError) {
            setLockedOut(true);
            setTimerActive(false);
          }
          return newAttempts;
        })
        setVerifyLoading(false);
        clearTimeout(timeoutId)
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={styles.wrapper}
        onPress={() => Keyboard.dismiss()}
      >
        <View style={styles.header}>
          <ReturnButton />
          <Text style={styles.headerTitle}>Verification</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.messageContainer}>
            <Text style={styles.messageTitle}>
              Enter the 6-digit code sent to your email
            </Text>
            <Text style={styles.messageSubtitle}>
              We've sent the code to your email address
            </Text>
          </View>

          <View style={styles.otpContainer}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  otpStyleError && { borderColor: '#FF5341', backgroundColor: 'rgba(255, 83, 65, 0.3)'}
                ]}
                maxLength={2}
                keyboardType="number-pad"
                value={otp[index]}
                onChangeText={(text) => handleOtpChange(text, index)}
                editable={!lockedOut}
              />
            ))}
          </View>

          {!isVerified && (
            <View style={styles.timerContainer}>
              {resendLoading ?
                <ActivityIndicator size="small" color="black" />
              :
                (timerActive ? (
                  <Text style={styles.timerText}>
                    Resend code in {String(minutes).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}
                  </Text>
                ) : (
                  <TouchableOpacity onPress={resendOtp}>
                    <Text style={[styles.resendText]}>Resend Code</Text>
                  </TouchableOpacity>
                ))
              }
            </View>
          )}
          {!isVerified && (timer === 0 || (!timerActive && lockedOut) || (timerActive && otpError && wrongAttempts < 5)) && (
            <Text style={styles.errorMessage}>
              {timer === 0
                ? !resendLoading && 'The OTP has expired. Please resend a new code.'
                : !timerActive && lockedOut
                ? 'You have entered the wrong code 5 times.\nPlease resend a new code.'
                : `The OTP is incorrect. Please try again.\nYou have ${5 - wrongAttempts} attempts remaining.`}
            </Text>
          )}

          <TouchableOpacity
            style={[styles.verifyButton, (!timerActive || otp.join('').length < 6 || isVerified ) && {backgroundColor: '#FFC7A7'}]}
            onPress={verifyOtp}
            disabled={!timerActive || otp.join('').length < 6 || verifyLoading || isVerified}
          >
            {verifyLoading ?
              <ActivityIndicator size="small" color="#fff" />
            :
              <Text style={styles.verifyButtonText}>
                Verify
              </Text>
            }

          </TouchableOpacity>
        </View>
      </Pressable>
      <CustomAlert
        visible={alertVisible}
        message={"Request failed. Please try again."}
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
};



export default ForgotOTPScreen;