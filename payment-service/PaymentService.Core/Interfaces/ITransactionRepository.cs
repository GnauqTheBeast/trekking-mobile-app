using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PaymentService.Core.Models;

namespace PaymentService.Core.Interfaces
{
    public interface ITransactionRepository
    {
        Task<Transaction> GetByIdAsync(Guid id);
        Task<IEnumerable<Transaction>> GetByAccountIdAsync(Guid accountId);
        Task<Transaction> CreateAsync(Transaction transaction);
        Task<Transaction> UpdateAsync(Transaction transaction);
    }
} 