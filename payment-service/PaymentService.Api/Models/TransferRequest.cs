using System;

namespace PaymentService.Api.Models
{
    public class TransferRequest
    {
        public Guid FromAccountId { get; set; }
        public Guid ToAccountId { get; set; }
        public long Amount { get; set; }
        public string Description { get; set; }
    }
} 