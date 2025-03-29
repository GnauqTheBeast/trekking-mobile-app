import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import ReturnButton from '../../components/ReturnButton/index';
import { useNavigation } from '@react-navigation/native';

const providerIcons: { [key: string]: any } = {
  facebook: require('../../image/facebook.png'),
  google: require('../../image/google.png'),
  apple: require('../../image/apple.png'),
};

const SignUpScreen: React.FC = () => {

  const navigation = useNavigation();

  const [email, setEmail] = useState<string>('');
  const [fullname, setFullName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    console.log('Email:', email);
    console.log('Password:', password);
    Alert.alert('Thành công', 'Đăng nhập thành công!');
  };

  return (
    <View style={styles.container}>
      <ReturnButton />
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
        style={styles.signupButton}
        onPress={handleLogin}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>SIGN UP</Text>
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.text2}>Login</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default SignUpScreen;
