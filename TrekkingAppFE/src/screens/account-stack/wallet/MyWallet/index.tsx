import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AccountStackParamList } from '../../../../navigation/main/account/AccountNavigator';
import ReturnButton from '../../../../components/common/ReturnButton';
import { WalletStackParamList } from '../../../../navigation/main/account/WalletNavigator';
import { paymentService, Account } from '../../../../services/payment.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../../../context/AuthProvider';

const solveMoney = (money: number): string => {
    let result: string = '';
    while(money > 1000) {
        let tmp = money % 1000;
        result = '.' + tmp.toString().padStart(3, '0') + result;
        money = Math.floor(money / 1000);
    }
    result = money.toString() + result;
    return result;
}

const MyWalletScreen: React.FC = () => {

    const auth = useContext(AuthContext);
    const id = auth!.user!.id;

    const navigation = useNavigation<StackNavigationProp<WalletStackParamList>>();
    const [account, setAccount] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccount();
    }, []);

    const fetchAccount = async () => {
        try {
            console.log("User Id: ", id)
            const userId = id;
            if (userId) {
                const accountData = await paymentService.getAccount(userId);
                setAccount(accountData);
            }
        } catch (error) {
            console.error('Error fetching account:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePressMenuItem = (title: string) => {
        switch(title) {
        case 'Nạp tiền':
            navigation.navigate('WalletDeposit');
            break;
        case 'Rút tiền':
            navigation.navigate('WalletWithdrawal');
            break;
        case 'Lịch sử giao dịch':
            navigation.navigate('WalletHistory');
            break;
        default:
            console.log(title);
        }
    }

  const MenuItem = ({ icon, size, title, showArrow = true }: { icon: string, size: number, title: string, showArrow?: boolean }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => handlePressMenuItem(title)}
    >
      <View style={styles.menuItemLeft}>
        <Icon name={icon} size={size} color="#FF8E4F" />
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      {showArrow && <Icon name="chevron-right" size={24} color="#999" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <View style={styles.header}>
          <ReturnButton />
          <Text style={styles.headerTitle}>My Wallet</Text>
        </View>
        <View style={styles.content}>
            <View style={styles.headerX}>
                <View style={{gap: 2}}>
                    <Text style={styles.textTitle}>Tổng số dư</Text>
                    <Text style={styles.money}>
                        {loading ? 'Loading...' : account ? `${solveMoney(account.balance)} ${account.currency}` : '0 đ'}
                    </Text>
                </View>
            </View>

            <View style={styles.menuContainer}>
                <MenuItem icon="cash-plus" size={26} title="Nạp tiền" />
                <MenuItem icon="cash-minus" size={26} title="Rút tiền" />
                <MenuItem icon="history" size={26} title="Lịch sử giao dịch" />
            </View>
        </View>
    </SafeAreaView>
  );
};

export default MyWalletScreen;
