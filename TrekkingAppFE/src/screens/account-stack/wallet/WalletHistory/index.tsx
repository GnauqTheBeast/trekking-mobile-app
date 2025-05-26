import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { paymentService, Transaction } from '../../../../services/payment.service';
import ReturnButton from '../../../../components/common/ReturnButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../../../context/AuthProvider';

const WalletHistory = () => {

  const auth = useContext(AuthContext);
  const id = auth!.user!.id;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await paymentService.getTransactions(id);
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
          {item.type === 'deposit' ? 'Nạp tiền' :
           item.type === 'withdraw' ? 'Rút tiền' : 'Thanh toán'}
        </Text>
        <Text style={styles.transactionDate}>
          {new Date(item.createdAt).toLocaleDateString('vi-VN')}
        </Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={[
          styles.amount,
          item.type === 'deposit' ? styles.positive : styles.negative
        ]}>
          {item.type === 'deposit' ? '+' : ''}{item.amount.toLocaleString('vi-VN')} VNĐ
        </Text>
        <Text style={styles.status}>
          {item.status === 'processing' ? 'Đang xử lý' :
           item.status === 'completed' ? 'Hoàn thành' : 'Thất bại'}
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content"/>
      <View style={styles.header}>
          <ReturnButton />
          <Text style={styles.headerTitle}>Nạp tiền vào ví</Text>
      </View>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
  headerTitle: {
      fontSize: 20,
      fontFamily: 'OpenSans-Bold'
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