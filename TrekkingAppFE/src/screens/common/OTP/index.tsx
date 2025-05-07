import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  Pressable
} from 'react-native';
import styles from './styles';
import ReturnButton from '../../../components/common/ReturnButton';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../../../navigation/main/HomeNavigator';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import axios, { HttpStatusCode } from 'axios';

const OTPScreen:React.FC = () => {

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const route = useRoute<RouteProp<RootStackParamList, 'OTPScreen'>>()

  const { email } = route.params;
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(TextInput | null)[]>(Array(6).fill(null));
  const [timer, setTimer] = useState<number>(180);
  const minutes = Math.floor(timer / 60)
  const [timerActive, setTimerActive] = useState<boolean>(true);

  const [otpError, setOtpError] = useState<boolean>(false);
  const [wrongAttempts, setWrongAttempts] = useState<number>(0);
  const [lockedOut, setLockedOut] = useState<boolean>(false);

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
    try {
      await axios.post('http://10.0.2.2:3001/auth/resend-otp', {email})
      setOtp(Array(6).fill(''));
      setTimer(180);
      setTimerActive(true);
      setOtpError(false);
      setWrongAttempts(0);
      setLockedOut(false);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.log(error)
    }
  };

  const verifyOtp = async() => {
    try {
      const enteredOtp = otp.join('');
      const response = await axios.post('http://10.0.2.2:3001/auth/otp', {
        email,
        otp: enteredOtp
      })
      const result = response?.data?.status
      console.log('reponse: ',response)
      if(result === HttpStatusCode.Created){
        navigation.navigate('LoginScreen');
        setWrongAttempts(0)
      }
      else {
        setOtpError(true);
        setWrongAttempts((prev) => {
        const newAttempts = prev + 1;
        if (newAttempts >= 5 && otpError) {
          setLockedOut(true);
          setTimerActive(false);
        }
        return newAttempts;
      });
      }
    } catch (error) {
      console.log(error)
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
                  otpError && { borderColor: '#FF5341', backgroundColor: 'rgba(255, 83, 65, 0.3)'}
                ]}
                maxLength={2}
                keyboardType="number-pad"
                value={otp[index]}
                onChangeText={(text) => handleOtpChange(text, index)}
              />
            ))}
          </View>

          {/* Timer and Resend */}
          <View style={styles.timerContainer}>
            {timerActive ? (
              <Text style={styles.timerText}>
                Resend code in {String(minutes).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}
              </Text>
            ) : (
              <TouchableOpacity onPress={resendOtp}>
                <Text style={[styles.resendText]}>Resend Code</Text>
              </TouchableOpacity>
            )}
          </View>
          {(timer === 0 || (!timerActive && lockedOut) || (timerActive && otpError && wrongAttempts < 5)) && (
            <Text style={styles.errorMessage}>
              {timer === 0
                ? 'The OTP has expired. Please resend a new code.'
                : !timerActive && lockedOut
                ? 'You have entered the wrong code 5 times.\nPlease resend a new code.'
                : `The OTP is incorrect. Please try again.\nYou have ${5 - wrongAttempts} attempts remaining.`}
            </Text>
          )}

          {/* Verify Button */}
          <TouchableOpacity
            style={[styles.verifyButton, (!timerActive || otp.join('').length < 6) && {backgroundColor: '#FFC7A7'}]}
            onPress={verifyOtp}
            disabled={!timerActive || otp.join('').length < 6}
          >
            <Text style={styles.verifyButtonText}>
              Verify
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </SafeAreaView>
  );
};



export default OTPScreen;