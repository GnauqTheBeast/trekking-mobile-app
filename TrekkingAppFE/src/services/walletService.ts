import { DepositResponse, WalletTransaction, WithdrawalRequest } from '../types/wallet';

// Mock data for testing
const mockWalletData = {
  balance: 5000000, // 5 triệu VND
  currency: 'VND',
  lastUpdated: new Date().toISOString(),
};

const mockTransactions = [
  {
    id: '1',
    type: 'deposit',
    amount: 2000000,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 ngày trước
    description: 'Nạp tiền qua VNPay',
    referenceId: 'VNPAY123456',
  },
  {
    id: '2',
    type: 'withdrawal',
    amount: 1000000,
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 phút trước
    description: 'Rút tiền về tài khoản ngân hàng',
    referenceId: 'BANK789012',
  },
  {
    id: '3',
    type: 'deposit',
    amount: 5000000,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 ngày trước
    description: 'Nạp tiền qua Momo',
    referenceId: 'MOMO345678',
  },
  {
    id: '4',
    type: 'withdrawal',
    amount: 2000000,
    status: 'failed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 ngày trước
    description: 'Rút tiền về tài khoản ngân hàng',
    referenceId: 'BANK901234',
    failureReason: 'Số dư không đủ',
  },
  {
    id: '5',
    type: 'deposit',
    amount: 1000000,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 ngày trước
    description: 'Nạp tiền qua ZaloPay',
    referenceId: 'ZALO567890',
  },
];

// Mock data for bank accounts
const mockBankAccounts = [
  {
    id: '1',
    bankName: 'Vietcombank',
    accountNumber: '1234567890',
    accountHolder: 'NGUYEN VAN A',
    isDefault: true,
  },
  {
    id: '2',
    bankName: 'Techcombank',
    accountNumber: '0987654321',
    accountHolder: 'NGUYEN VAN A',
    isDefault: false,
  },
];

// Mock data for payment methods
const mockPaymentMethods = [
  {
    id: '1',
    type: 'bank_transfer',
    name: 'Chuyển khoản ngân hàng',
    icon: 'bank',
    isDefault: true,
  },
  {
    id: '2',
    type: 'vnpay',
    name: 'VNPay',
    icon: 'credit-card',
    isDefault: false,
  },
  {
    id: '3',
    type: 'momo',
    name: 'Ví MoMo',
    icon: 'wallet',
    isDefault: false,
  },
  {
    id: '4',
    type: 'zalopay',
    name: 'ZaloPay',
    icon: 'wallet',
    isDefault: false,
  },
];

export const walletService = {
  async createDeposit(amount: number): Promise<DepositResponse> {
    // TODO: Replace with actual API call
    return {
      transactionId: `DEP${Date.now()}`,
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=your-payment-data',
      transferContent: `NAP_TIEN_${amount}_${Date.now()}`,
    };
  },

  async createWithdrawal(request: WithdrawalRequest): Promise<WalletTransaction> {
    // TODO: Replace with actual API call
    return {
      id: `WD${Date.now()}`,
      amount: request.amount,
      type: 'WITHDRAWAL',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async getTransactionHistory(): Promise<WalletTransaction[]> {
    // TODO: Replace with actual API call
    return mockTransactions;
  },

  async getWalletBalance(): Promise<WalletBalance> {
    // TODO: Replace with actual API call
    return mockWalletData;
  },

  async deposit(amount: number, method: string): Promise<Transaction> {
    // TODO: Replace with actual API call
    const newTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'deposit',
      amount,
      status: 'completed',
      createdAt: new Date().toISOString(),
      description: `Nạp tiền qua ${method}`,
      referenceId: `${method.toUpperCase()}${Math.random().toString(36).substr(2, 6)}`,
    };
    mockTransactions.unshift(newTransaction);
    mockWalletData.balance += amount;
    return newTransaction;
  },

  async withdraw(amount: number, bankAccountId: string): Promise<Transaction> {
    // TODO: Replace with actual API call
    const newTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'withdrawal',
      amount,
      status: 'pending',
      createdAt: new Date().toISOString(),
      description: 'Rút tiền về tài khoản ngân hàng',
      referenceId: `BANK${Math.random().toString(36).substr(2, 6)}`,
    };
    mockTransactions.unshift(newTransaction);
    mockWalletData.balance -= amount;
    return newTransaction;
  },

  async getBankAccounts(): Promise<BankAccount[]> {
    // TODO: Replace with actual API call
    return mockBankAccounts;
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    // TODO: Replace with actual API call
    return mockPaymentMethods;
  },
}; 