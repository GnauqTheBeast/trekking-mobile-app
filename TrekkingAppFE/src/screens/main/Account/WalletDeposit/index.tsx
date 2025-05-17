import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, ScrollView } from 'react-native';
import { paymentService } from '../../../../services/payment.service';
import { useNavigation } from '@react-navigation/native';

const WalletDeposit = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [depositInfo, setDepositInfo] = useState<{
    transactionId: string;
    transferContent: string;
  } | null>(null);

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ');
      return;
    }

    try {
      setLoading(true);
      const transaction = await paymentService.deposit(
        Number(amount),
        'Nạp tiền vào ví'
      );
      
      setDepositInfo({
        transactionId: transaction.id,
        transferContent: `NAP ${transaction.id}`
      });
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tạo giao dịch nạp tiền. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setDepositInfo(null);
    setAmount('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Nạp tiền vào ví</Text>
        
        {!depositInfo ? (
          <>
            <Text style={styles.label}>Số tiền muốn nạp (VNĐ)</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="Nhập số tiền"
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleDeposit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Đang xử lý...' : 'Tạo mã QR'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.depositInfo}>
            <Text style={styles.transactionId}>
              Mã giao dịch: {depositInfo.transactionId}
            </Text>
            
            <View style={styles.qrContainer}>
              <Image
                source={require('../../../../assets/images/qr-code.png')}
                style={styles.qrCode}
                resizeMode="contain"
              />
            </View>

            <View style={styles.instructions}>
              <Text style={styles.instructionTitle}>
                Hướng dẫn chuyển khoản:
              </Text>
              <Text style={styles.instructionText}>
                1. Mở ứng dụng ngân hàng của bạn
              </Text>
              <Text style={styles.instructionText}>
                2. Quét mã QR hoặc chuyển khoản thủ công
              </Text>
              <Text style={styles.instructionText}>
                3. Số tiền: {Number(amount).toLocaleString('vi-VN')} VNĐ
              </Text>
              <Text style={styles.instructionText}>
                4. Nội dung chuyển khoản: {depositInfo.transferContent}
              </Text>
              <Text style={styles.instructionText}>
                5. Ngân hàng: Vietcombank
              </Text>
              <Text style={styles.instructionText}>
                6. Số tài khoản: 1234567890
              </Text>
              <Text style={styles.instructionText}>
                7. Chủ tài khoản: CONG TY ABC
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleCreateNew}
            >
              <Text style={styles.buttonText}>Tạo giao dịch mới</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
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
    fontSize: 16,
    marginBottom: 20
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
  },
  depositInfo: {
    alignItems: 'center'
  },
  transactionId: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666'
  },
  qrContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  qrCode: {
    width: 200,
    height: 200
  },
  instructions: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333'
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 24
  },
  secondaryButton: {
    backgroundColor: '#6c757d'
  }
});

export default WalletDeposit; 