import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { paymentService, Transaction } from '../../../../services/payment.service';

const WalletHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await paymentService.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionType}>
          {item.type === 'DEPOSIT' ? 'Nạp tiền' : 
           item.type === 'WITHDRAW' ? 'Rút tiền' : 'Thanh toán'}
        </Text>
        <Text style={styles.transactionDate}>
          {new Date(item.createdAt).toLocaleDateString('vi-VN')}
        </Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={[
          styles.amount,
          item.type === 'DEPOSIT' ? styles.positive : styles.negative
        ]}>
          {item.type === 'DEPOSIT' ? '+' : '-'}{item.amount.toLocaleString('vi-VN')} VNĐ
        </Text>
        <Text style={styles.status}>
          {item.status === 'PENDING' ? 'Đang xử lý' :
           item.status === 'COMPLETED' ? 'Hoàn thành' : 'Thất bại'}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử giao dịch</Text>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20
  },
  listContainer: {
    padding: 20
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  transactionInfo: {
    flex: 1
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  transactionDate: {
    fontSize: 14,
    color: '#666'
  },
  transactionAmount: {
    alignItems: 'flex-end'
  },
  amount: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  positive: {
    color: '#34C759'
  },
  negative: {
    color: '#FF3B30'
  },
  status: {
    fontSize: 12,
    color: '#666'
  }
});

export default WalletHistory; 