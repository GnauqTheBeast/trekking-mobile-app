using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using PaymentService.Core.Models;

namespace PaymentService.Application.Interfaces
{
    public interface IPaymentService
    {
        Task<Transaction> InitiateDepositAsync(Guid userId, long amount, string description);
        Task<Transaction> InitiateWithdrawAsync(Guid userId, long amount, string description);
        Task<Transaction> ConfirmTransactionAsync(Guid transactionId, bool isConfirmed, string note);
        Task<Transaction> MakePaymentAsync(Guid userId, long amount, Guid referenceId, string referenceType, string description);
        Task<Account> GetAccountAsync(Guid userId);
        Task<IEnumerable<Transaction>> GetTransactionHistoryAsync(Guid userId);
        
        // Booking payment methods
        Task<Payment> CreatePaymentFromBookingAsync(Guid bookingId);
        Task<Payment> ProcessPaymentAsync(Guid paymentId);

        // Get user id by payment id
        Task<Guid> GetUserIdByPaymentIdAsync(Guid paymentId);
        
        Task<Guid> GetPaymentIdByBookingIdAsync(Guid bookingId);
    }
} 