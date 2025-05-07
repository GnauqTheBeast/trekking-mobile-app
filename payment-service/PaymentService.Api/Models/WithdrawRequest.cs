using System;

namespace PaymentService.Api.Models
{
    public class WithdrawRequest
    {
        public Guid AccountId { get; set; }
        public long Amount { get; set; }
        public string Description { get; set; }
    }
} 