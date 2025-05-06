using System;
using System.Threading.Tasks;
using PaymentService.Core.Models;

namespace PaymentService.Application.Interfaces
{
    public interface IPaymentService
    {
        Task<Transaction> DepositAsync(Guid userId, long amount, string description);
        Task<Transaction> WithdrawAsync(Guid userId, long amount, string description);
        Task<Transaction> MakePaymentAsync(Guid userId, long amount, Guid referenceId, string referenceType, string description);
        Task<Account> GetAccountAsync(Guid userId);
        Task<IEnumerable<Transaction>> GetTransactionHistoryAsync(Guid userId);
    }
} 