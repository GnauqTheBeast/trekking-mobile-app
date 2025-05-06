using System;
using System.Threading.Tasks;
using PaymentService.Core.Models;

namespace PaymentService.Core.Interfaces
{
    public interface IAccountRepository
    {
        Task<Account> GetByIdAsync(Guid id);
        Task<Account> GetByUserIdAsync(Guid userId);
        Task<Account> CreateAsync(Account account);
        Task<Account> UpdateAsync(Account account);
        Task<bool> UpdateBalanceAsync(Guid accountId, long amount);
    }
} 