using System;

namespace PaymentService.Api.Models
{
    public class ConfirmTransactionRequest
    {
        public Guid TransactionId { get; set; }
        public bool IsConfirmed { get; set; }
        public string Note { get; set; }
    }
}