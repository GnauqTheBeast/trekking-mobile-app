using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace PaymentService.Core.Models
{
    public class Account
    {
        [JsonProperty("id")]
        [Column("id")]
        public Guid Id { get; set; }

        [JsonProperty("user_id")]
        [Column("user_id")]
        public Guid UserId { get; set; }

        [JsonProperty("balance")]
        [Column("balance")]
        public long Balance { get; set; }

        [JsonProperty("currency")]
        [Column("currency")]
        public string Currency { get; set; }

        [JsonProperty("status")]
        [Column("status")]
        public string Status { get; set; }

        [JsonProperty("created_at")]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [JsonProperty("updated_at")]
        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }
} 