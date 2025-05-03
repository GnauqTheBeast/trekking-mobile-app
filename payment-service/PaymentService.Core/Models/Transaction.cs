using System;

namespace PaymentService.Core.Models
{
    public class Transaction
    {
        public Guid Id { get; set; }
        public Guid AccountId { get; set; }
        public long Amount { get; set; }
        public string Type { get; set; } // deposit, withdraw, transfer, payment
        public string Status { get; set; } // pending, completed, failed
        public string Description { get; set; }
        public Guid? ReferenceId { get; set; }
        public string ReferenceType { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
} 