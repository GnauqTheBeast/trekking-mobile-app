import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, StatusBar } from 'react-native';
import { paymentService } from '../../../../services/payment.service';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReturnButton from '../../../../components/common/ReturnButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { WalletStackParamList } from '../../../../navigation/main/account/WalletNavigator';
import { AuthContext } from '../../../../context/AuthProvider';

const WalletWithdrawal = () => {

  const auth = useContext(AuthContext);
  const id = auth!.user!.id;

  const navigation = useNavigation<StackNavigationProp<WalletStackParamList>>();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ');
      return;
    }

    try {
      setLoading(true);
      const transaction = await paymentService.withdraw(
        id,
        Number(amount),
        'Rút tiền từ ví'
      );

      Alert.alert(
        'Thành công',
        'Yêu cầu rút tiền đã được gửi. Chúng tôi sẽ xử lý trong thời gian sớm nhất.',
        [
          {
            text: 'Xem chi tiết',
            onPress: () => navigation.navigate('WalletHistory')
          },
          {
            text: 'Đóng',
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tạo yêu cầu rút tiền. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content"/>
      <View style={styles.header}>
          <ReturnButton />
          <Text style={styles.headerTitle}>Nạp tiền vào ví</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Số tiền (VNĐ)</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Nhập số tiền"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleWithdraw}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Đang xử lý...' : 'Rút tiền'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  content: {
    padding: 16
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold'
  },
  inputContainer: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default WalletWithdrawal;