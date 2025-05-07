import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import ReturnButton from '../../../components/common/ReturnButton';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeStackParamList } from '../../../navigation/main/HomeNavigator';

const providerIcons: { [key: string]: any } = {
  facebook: require('../../../image/facebook.png'),
  google: require('../../../image/google.png'),
  apple: require('../../../image/apple.png'),
};

const LoginScreen: React.FC = () => {

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const beforeScreen = useNavigationState(state => state.routes[state.index - 1]?.name);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = async() => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      const response = await axios.post('http://10.0.2.2:3001/auth/login', {
        email,
        password,
      });
      console.log(response)
      const token = response.data?.token;
      const user = response.data?.user;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user))

      Alert.alert('Thành công', 'Đăng nhập thành công!');

      navigation.navigate('MainStack', {
        screen: 'HomeStack',
        params: {screen: 'HomeScreen'}
      });
    } catch (error: any) {
      // Xử lý lỗi từ API
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      Alert.alert('Lỗi', errorMessage);
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
        <Image style={styles.logo} source={require('../../../image/logo.png')} />
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

      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>LOGIN</Text>
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
    </View>
  );
};

export default LoginScreen;
