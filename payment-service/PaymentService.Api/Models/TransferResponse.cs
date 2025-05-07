using System;
using PaymentService.Core.Models;

namespace PaymentService.Api.Models
{
    public class TransferResponse
    {
        public Transaction WithdrawTransaction { get; set; }
        public Transaction DepositTransaction { get; set; }
    }
} 