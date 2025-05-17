export interface WalletBalance {
  balance: number;
  currency: string;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  description: string;
  referenceId: string;
  failureReason?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: string;
  name: string;
  icon: string;
  isDefault: boolean;
}

export interface DepositRequest {
  amount: number;
  method: string;
}

export interface WithdrawalRequest {
  amount: number;
  bankAccountId: string;
}

export interface DepositResponse {
  transactionId: string;
  status: string;
  message: string;
}

export interface WithdrawalResponse {
  transactionId: string;
  status: string;
  message: string;
}

export type WalletTransaction = Transaction; 