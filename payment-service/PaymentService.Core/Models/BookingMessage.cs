using System;
using System.Text.Json.Serialization;

namespace PaymentService.Core.Models
{
    public class BookingMessage
    {
        [JsonPropertyName("id")]
        public Guid Id { get; set; }

        [JsonPropertyName("user_id")]
        public Guid UserId { get; set; }

        [JsonPropertyName("tour_id")]
        public Guid TourId { get; set; }

        [JsonPropertyName("porter_id")]
        public Guid? PorterId { get; set; }

        [JsonPropertyName("quantity")]
        public int Quantity { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; }

        [JsonPropertyName("total_price")]
        public long TotalPrice { get; set; }

        [JsonPropertyName("expired_at")]
        public DateTime ExpiredAt { get; set; }

        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }
} 