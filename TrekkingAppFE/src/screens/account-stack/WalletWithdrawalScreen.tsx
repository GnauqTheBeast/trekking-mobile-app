import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { walletService } from '../../services/walletService';
import { WalletTransaction } from '../../types/wallet';

export const WalletWithdrawalScreen = () => {
  const [amount, setAmount] = useState('');
  const [transaction, setTransaction] = useState<WalletTransaction | null>(null);

  const handleWithdrawal = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      const response = await walletService.createWithdrawal({ amount: Number(amount) });
      setTransaction(response);
      Alert.alert(
        'Success',
        'Withdrawal request has been submitted and is pending approval'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create withdrawal request');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Rút tiền từ ví</Text>
        
        {!transaction ? (
          <>
            <Text style={styles.label}>Số tiền muốn rút (VNĐ)</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="Nhập số tiền"
            />
            <TouchableOpacity style={styles.button} onPress={handleWithdrawal}>
              <Text style={styles.buttonText}>Rút tiền</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionId}>
              Mã giao dịch: {transaction.id}
            </Text>
            <Text style={styles.amount}>
              Số tiền: {transaction.amount.toLocaleString()} VNĐ
            </Text>
            <Text style={styles.status}>
              Trạng thái: {transaction.status}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setTransaction(null)}
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
  transactionInfo: {
    alignItems: 'center',
  },
  transactionId: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 20,
  },
}); 