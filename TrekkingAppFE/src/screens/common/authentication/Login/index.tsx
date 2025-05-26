import React, { useContext, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StatusBar, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../navigation/main/UserAppNavigator';
import ReturnButton from '../../../../components/common/ReturnButton';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeStackParamList } from '../../../../navigation/main/home/HomeNavigator';
import CustomAlert from '../../../../components/common/Alert';
import { wsService } from '../../../../services/websocket.service';
import { AuthContext } from '../../../../context/AuthProvider';

const providerIcons: { [key: string]: any } = {
  facebook: require('../../../../image/facebook.png'),
  google: require('../../../../image/google.png'),
  apple: require('../../../../image/apple.png'),
};

const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const LoginScreen: React.FC = () => {

  const authContext = useContext(AuthContext)!;
  const { setUser, setToken, setIsLoggedIn } = authContext;

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const beforeScreen = useNavigationState(state => state.routes[state.index - 1]?.name);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [message, setMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);


  const trimmedEmail = email.trim();
  const isEmailValid = useMemo(() => validateEmail(trimmedEmail), [trimmedEmail]);
  const isLoginEnabled = trimmedEmail !== '' && password !== '';

  const handleLogin = async() => {
    if(!isEmailValid) {
      setAlertVisible(true);
      setMessage("Invalid email. Please try again.")
      return;
    }

    setLoading(true);
    let timeoutId: NodeJS.Timeout;
    timeoutId = setTimeout(() => {
      setLoading(false);
      setMessage("Login failed. Please try again.");
      setAlertVisible(true);
    }, 10000);

    try {

      const response = await axios.post('http://10.0.2.2:3001/auth/login', {
        email,
        password,
      });

      clearTimeout(timeoutId);

      const token = response.data?.token;
      const user = response.data?.user;
      console.log(user)

      console.log('Login successful, saving token:', token);
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      setToken(token);
      setUser(user);
      setIsLoggedIn(true);

      const userId= user.id;

      // Connect to WebSocket after successful login
      console.log('Attempting to connect to WebSocket...');
      try {
        await wsService.connect(userId);
        console.log('WebSocket connection initiated');
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        // Continue with navigation even if WebSocket fails
      }

      navigation.navigate('MainStack', {
        screen: 'HomeStack',
        params: {screen: 'HomeScreen'}
      });
    } catch (error: any) {
      if(error.response) {
        const errorMessage = error.response?.data?.message;
        setMessage(errorMessage)
        setAlertVisible(true);
        setLoading(false);
        clearTimeout(timeoutId)
      }
    }
  };

  const handleOnPressSignUp = () => {
    if(beforeScreen === 'SignUpScreen'){
      navigation.goBack()
    }
    else navigation.navigate('SignUpScreen')
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ReturnButton top={52} />
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('../../../../image/logo.png')} />
      </View>
      <Text style={styles.title}>Welcome back!</Text>
      <Text style={styles.intro}>Login to your account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          textContentType="emailAddress"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'eye-off' : 'eye'} size={22} color="#3C3E3B" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => navigation.navigate('ForgotPasswordScreen')}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.loginButton, !isLoginEnabled && {backgroundColor: '#8E8E8E', opacity: 0.3}]}
        onPress={handleLogin}
        activeOpacity={0.8}
        disabled={loading || !isLoginEnabled}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text
            style={[styles.buttonText, !isLoginEnabled && {color: 'black'}]}
          >
            LOGIN
          </Text>
        )}
      </TouchableOpacity>


      <View style={styles.otherLoginTitleContainer}>
        <View style={styles.otherLoginDecorate}></View>
        <Text style={styles.otherLoginTitle}>Or Login with</Text>
        <View style={styles.otherLoginDecorate}></View>
      </View>

      <View style={styles.otherLogin}>
        {Object.keys(providerIcons).map((provider) => (
          <View key={provider} style={styles.otherLoginIconContainer}>
            <Image style={styles.otherLoginIcon} source={providerIcons[provider]} />
          </View>
        ))}
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.text1}>Don't have account? </Text>
        <TouchableOpacity onPress={handleOnPressSignUp}>
          <Text style={styles.text2}>Sign up</Text>
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

export default LoginScreen;
