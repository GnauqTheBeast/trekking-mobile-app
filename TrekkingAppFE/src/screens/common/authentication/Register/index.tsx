import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, Platform, StatusBar, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import ReturnButton from '../../../../components/common/ReturnButton/index';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../navigation/main/UserAppNavigator';
import axios, { HttpStatusCode } from 'axios';
import CustomAlert from '../../../../components/common/Alert';

const providerIcons: { [key: string]: any } = {
  facebook: require('../../../../image/facebook.png'),
  google: require('../../../../image/google.png'),
  apple: require('../../../../image/apple.png'),
};

const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePassword = (password: string): boolean => {
  const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{9,}$/;
  return regex.test(password);
};

const SignUpScreen: React.FC = () => {

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const beforeScreen = useNavigationState(state => state.routes[state.index - 1]?.name);

  const [email, setEmail] = useState<string>('');
  const [fullname, setFullName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [message, setMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const trimmedEmail = email.trim();
  const isEmailValid = useMemo(() => validateEmail(trimmedEmail), [trimmedEmail]);
  const isPasswordValid = useMemo(() => validatePassword(password), [password]);
  const isMatchPassword = password === confirmPassword;
  const isSignUpEnabled = trimmedEmail !== '' && fullname !== '' && password !== '' && confirmPassword !== '';

  const handleSignUp = async() => {
    if(!isEmailValid) {
      setAlertVisible(true);
      setMessage("Email không hợp lệ, vui lòng kiểm tra lại.")
      return;
    }

    if(!isPasswordValid) {
      setMessage("Mật khẩu phải dài hơn 8 ký tự, chứa ít nhất một chữ in hoa và một ký tự đặc biệt")
      setAlertVisible(true)
      return
    }

    if(!isMatchPassword) {
      setMessage("Mật khẩu không trùng khớp, vui lòng kiểm tra lại.")
      setAlertVisible(true)
      return
    }

    setLoading(true);
    let timeoutId: NodeJS.Timeout;

    try {

      timeoutId = setTimeout(() => {
        setLoading(false);
        setMessage("Đang chờ phản hồi quá lâu. Vui lòng thử lại.");
        setAlertVisible(true);
      }, 10000);

      const response = await axios.post('http://10.0.2.2:3001/auth/register', {
        email,
        fullname,
        password,
        roleName: 'USER'
      });

      if(response.data?.status === HttpStatusCode.Ok) {
        navigation.navigate('OTPScreen', {email})
      }

    } catch (error: any) {
      console.log(error)
      const errorMessage = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      setMessage(errorMessage)
      setAlertVisible(true)
    }
  };

  const handleOnPressSignUp = () => {
    if(beforeScreen === 'LoginScreen') navigation.goBack();
    else navigation.navigate('LoginScreen')
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ReturnButton top={52} />
      <Text style={styles.title}>Hello!</Text>
      <Text style={styles.intro}>Register to get started</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <TextInput
          style={styles.input}
          placeholder="Fullname"
          value={fullname}
          onChangeText={setFullName}
          keyboardType="default"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
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
      </View>

      <TouchableOpacity
        style={[styles.signupButton, !isSignUpEnabled && {backgroundColor: '#8E8E8E', opacity: 0.3}]}
        onPress={handleSignUp}
        activeOpacity={0.8}
        disabled={!isSignUpEnabled}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text
            style={[styles.buttonText, !isSignUpEnabled && {color: 'black'}]}
          >
            SIGN UP
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.otherSignUpTitleContainer}>
        <View style={styles.otherSignUpDecorate}></View>
        <Text style={styles.otherSignUpTitle}>Or Register with</Text>
        <View style={styles.otherSignUpDecorate}></View>
      </View>

      <View style={styles.otherSignUp}>
        {Object.keys(providerIcons).map((provider) => (
          <View key={provider} style={styles.otherSignUpIconContainer}>
            <Image style={styles.otherSignUpIcon} source={providerIcons[provider]} />
          </View>
        ))}
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.text1}>Already have an account? </Text>
        <TouchableOpacity onPress={handleOnPressSignUp}>
          <Text style={styles.text2}>Login</Text>
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

export default SignUpScreen;
