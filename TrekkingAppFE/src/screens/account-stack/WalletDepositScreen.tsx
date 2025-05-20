import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { walletService } from '../../services/walletService';
import { DepositResponse } from '../../types/wallet';

export const WalletDepositScreen = () => {
  const [amount, setAmount] = useState('');
  const [depositInfo, setDepositInfo] = useState<DepositResponse | null>(null);

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      const response = await walletService.createDeposit(Number(amount));
      setDepositInfo(response);
    } catch (error) {
      Alert.alert('Error', 'Failed to create deposit request');
    }
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
            <TouchableOpacity style={styles.button} onPress={handleDeposit}>
              <Text style={styles.buttonText}>Tạo mã QR</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.depositInfo}>
            <Text style={styles.transactionId}>
              Mã giao dịch: {depositInfo.transactionId}
            </Text>
            <Image
              source={{ uri: depositInfo.qrCodeUrl }}
              style={styles.qrCode}
            />
            <Text style={styles.instructions}>
              Quét mã QR để chuyển tiền với nội dung:
            </Text>
            <Text style={styles.transferContent}>
              {depositInfo.transferContent}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setDepositInfo(null)}
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
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  depositInfo: {
    alignItems: 'center',
  },
  transactionId: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  transferContent: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007AFF',
  },
}); 