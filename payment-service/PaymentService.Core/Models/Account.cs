using System;

namespace PaymentService.Core.Models
{
    public class Account
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public long Balance { get; set; }
        public string Currency { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
} 