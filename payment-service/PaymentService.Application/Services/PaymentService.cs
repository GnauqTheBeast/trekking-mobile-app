using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PaymentService.Core.Interfaces;
using PaymentService.Core.Models;
using PaymentService.Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace PaymentService.Application.Services
{
    public class PaymentServiceImpl : IPaymentService
    {
        private readonly IAccountRepository _accountRepository;
        private readonly ITransactionRepository _transactionRepository;
        private readonly IBookingRepository _bookingRepository;
        private readonly IPaymentRepository _paymentRepository;
        private readonly ILogger<PaymentServiceImpl> _logger;

        public PaymentServiceImpl(
            IAccountRepository accountRepository,
            ITransactionRepository transactionRepository,
            IBookingRepository bookingRepository,
            IPaymentRepository paymentRepository,
            ILogger<PaymentServiceImpl> logger)
        {
            _accountRepository = accountRepository;
            _transactionRepository = transactionRepository;
            _bookingRepository = bookingRepository;
            _paymentRepository = paymentRepository;
            _logger = logger;
        }

        public async Task<Transaction> InitiateDepositAsync(Guid userId, long amount, string description)
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
                Status = "processing",
                Description = description,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            return await _transactionRepository.CreateAsync(transaction);
        }

        public async Task<Transaction> InitiateWithdrawAsync(Guid userId, long amount, string description)
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
                Status = "processing",
                Description = description,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            return await _transactionRepository.CreateAsync(transaction);
        }

        public async Task<Transaction> ConfirmTransactionAsync(Guid transactionId, bool isConfirmed, string note)
        {
            var transaction = await _transactionRepository.GetByIdAsync(transactionId);
            _logger.LogDebug($"Transaction fetched for id {transactionId}: {(transaction == null ? "null" : "found")}");
            if (transaction == null)
                throw new InvalidOperationException("Transaction not found");

            if (transaction.Status != "processing")
                throw new InvalidOperationException("Transaction is not in processing state");

            _logger.LogInformation($"Confirming transaction {transactionId} with amount {transaction.Amount}");

            if (isConfirmed)
            {
                transaction.Status = "completed";
                
                // Update account balance
                var updatedAccount = await _accountRepository.UpdateBalanceAsync(transaction.AccountId, transaction.Amount);
                _logger.LogInformation($"Updated balance for account {transaction.AccountId} to {updatedAccount.Balance}");
            }
            else
            {
                transaction.Status = "failed";
            }

            transaction.Description = string.IsNullOrEmpty(note)
                ? transaction.Description
                : $"{transaction.Description} - {note}";
            transaction.UpdatedAt = DateTime.UtcNow;

            return await _transactionRepository.UpdateAsync(transaction);
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

            transaction = await _transactionRepository.CreateAsync(transaction);
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

        public async Task<Payment> CreatePaymentFromBookingAsync(Guid bookingId)
        {
            var booking = await _bookingRepository.GetByIdAsync(bookingId);
            if (booking == null)
                throw new InvalidOperationException("Booking not found");

            var userAccount = await _accountRepository.GetByUserIdAsync(booking.UserId);
            if (userAccount == null)
                throw new InvalidOperationException("User account not found");

            var payment = new Payment
            {
                Id = Guid.NewGuid(),
                BookingId = bookingId,
                Total = booking.TotalPrice,
                Method = "wallet",
                Type = "booking",
                Status = "processing",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            return await _paymentRepository.CreateAsync(payment);
        }

        public async Task<Payment> ProcessPaymentAsync(Guid paymentId)
        {
            var payment = await _paymentRepository.GetByIdAsync(paymentId);
            if (payment == null)
                throw new InvalidOperationException("Payment not found");

            if (payment.Status != "processing")
                throw new InvalidOperationException("Payment is not in processing state");

            var booking = await _bookingRepository.GetByIdAsync(payment.BookingId);
            if (booking == null)
                throw new InvalidOperationException("Booking not found");

            var userAccount = await _accountRepository.GetByUserIdAsync(booking.UserId);
            if (userAccount == null)
                throw new InvalidOperationException("User account not found");

            // Check if user has enough balance
            if (userAccount.Balance < booking.TotalPrice)
                throw new InvalidOperationException("Insufficient balance in user's account");

            var porterAccount = await _accountRepository.GetByUserIdAsync(booking.PorterId);
            if (porterAccount == null)
                throw new InvalidOperationException("Porter account not found");

            // Calculate porter's share (20%)
            var porterShare = (long)(booking.TotalPrice * 0.2);

            // Deduct from user's account
            await _accountRepository.UpdateBalanceAsync(userAccount.Id, -booking.TotalPrice);

            // Add to porter's account
            await _accountRepository.UpdateBalanceAsync(porterAccount.Id, porterShare);

            // Update payment status
            payment.Status = "completed";
            payment.UpdatedAt = DateTime.UtcNow;
            await _paymentRepository.UpdateAsync(payment);

            // Update booking status to completed
            booking.Status = "COMPLETED";
            booking.UpdatedAt = DateTime.UtcNow;
            await _bookingRepository.UpdateAsync(booking);

            return payment;
        }
    }
} 