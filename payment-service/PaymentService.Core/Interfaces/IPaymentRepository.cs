using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using PaymentService.Core.Models;

namespace PaymentService.Core.Interfaces
{
    public interface IPaymentRepository
    {
        Task<Payment> GetByIdAsync(Guid id);
        Task<Payment> GetByBookingIdAsync(Guid bookingId);
        Task<IEnumerable<Payment>> GetByUserIdAsync(Guid userId);
        Task<Payment> CreateAsync(Payment payment);
        Task<Payment> UpdateAsync(Payment payment);
        Task<bool> UpdateStatusAsync(Guid id, string status);
        Task<bool> ExistsAsync(Guid id);
    }
} 