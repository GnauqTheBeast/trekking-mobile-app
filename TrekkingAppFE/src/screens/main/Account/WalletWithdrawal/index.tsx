import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { paymentService } from '../../../../services/payment.service';
import { useNavigation } from '@react-navigation/native';

const WalletWithdrawal = () => {
  const navigation = useNavigation();
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
    <View style={styles.container}>
      <Text style={styles.title}>Rút tiền từ ví</Text>
      
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
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