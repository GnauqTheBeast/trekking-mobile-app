using System;

namespace PaymentService.Api.Models
{
    public class PaymentNotification
    {
        public Guid Id { get; set; }
        public Guid BookingId { get; set; }
        public long Total { get; set; }
        public string Method { get; set; }
        public string Type { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public Guid UserId { get; set; }    
    }
}