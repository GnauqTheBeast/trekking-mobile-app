using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PaymentService.Core.Interfaces;
using PaymentService.Core.Models;
using PaymentService.Application.Interfaces;

namespace PaymentService.Application.Services
{
    public class PaymentServiceImpl : IPaymentService
    {
        private readonly IAccountRepository _accountRepository;
        private readonly ITransactionRepository _transactionRepository;

        public PaymentServiceImpl(
            IAccountRepository accountRepository,
            ITransactionRepository transactionRepository)
        {
            _accountRepository = accountRepository;
            _transactionRepository = transactionRepository;
        }

        public async Task<Transaction> DepositAsync(Guid userId, long amount, string description)
        {
            if (amount <= 0)
                throw new ArgumentException("Amount must be greater than 0");

            var account = await _accountRepository.GetByUserIdAsync(userId);
            if (account == null)
                throw new InvalidOperationException("Account not found");

            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                AccountId = account.Id,
                Amount = amount,
                Type = "deposit",
                Status = "completed",
                Description = description,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _transactionRepository.CreateAsync(transaction);
            await _accountRepository.UpdateBalanceAsync(account.Id, amount);

            return transaction;
        }

        public async Task<Transaction> WithdrawAsync(Guid userId, long amount, string description)
        {
            if (amount <= 0)
                throw new ArgumentException("Amount must be greater than 0");

            var account = await _accountRepository.GetByUserIdAsync(userId);
            if (account == null)
                throw new InvalidOperationException("Account not found");

            if (account.Balance < amount)
                throw new InvalidOperationException("Insufficient balance");

            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                AccountId = account.Id,
                Amount = -amount,
                Type = "withdraw",
                Status = "completed",
                Description = description,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _transactionRepository.CreateAsync(transaction);
            await _accountRepository.UpdateBalanceAsync(account.Id, -amount);

            return transaction;
        }

        public async Task<Transaction> MakePaymentAsync(Guid userId, long amount, Guid referenceId, string referenceType, string description)
        {
            if (amount <= 0)
                throw new ArgumentException("Amount must be greater than 0");

            var account = await _accountRepository.GetByUserIdAsync(userId);
            if (account == null)
                throw new InvalidOperationException("Account not found");

            if (account.Balance < amount)
                throw new InvalidOperationException("Insufficient balance");

            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                AccountId = account.Id,
                Amount = -amount,
                Type = "payment",
                Status = "completed",
                Description = description,
                ReferenceId = referenceId,
                ReferenceType = referenceType,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _transactionRepository.CreateAsync(transaction);
            await _accountRepository.UpdateBalanceAsync(account.Id, -amount);

            return transaction;
        }

        public async Task<Account> GetAccountAsync(Guid userId)
        {
            return await _accountRepository.GetByUserIdAsync(userId);
        }

        public async Task<IEnumerable<Transaction>> GetTransactionHistoryAsync(Guid userId)
        {
            var account = await _accountRepository.GetByUserIdAsync(userId);
            if (account == null)
                throw new InvalidOperationException("Account not found");

            return await _transactionRepository.GetByAccountIdAsync(account.Id);
        }
    }
} 