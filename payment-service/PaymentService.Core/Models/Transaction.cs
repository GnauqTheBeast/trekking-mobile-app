using System;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;
namespace PaymentService.Core.Models
{
    public class Transaction
    {
        [JsonProperty("id")]
        [Column("id")]
        public Guid Id { get; set; }

        [JsonProperty("account_id")]
        [Column("account_id")]
        public Guid AccountId { get; set; }

        [JsonProperty("amount")]
        [Column("amount")]
        public long Amount { get; set; }

        [JsonProperty("type")]
        [Column("type")]
        public string Type { get; set; } // deposit, withdraw, transfer, payment

        [JsonProperty("status")]
        [Column("status")]
        public string Status { get; set; } // pending, completed, failed

        [JsonProperty("description")]
        [Column("description")]
        public string Description { get; set; }

        [JsonProperty("reference_id")]
        [Column("reference_id")]
        public Guid? ReferenceId { get; set; }

        [JsonProperty("reference_type")]
        [Column("reference_type")]
        public string ReferenceType { get; set; }

        [JsonProperty("created_at")]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [JsonProperty("updated_at")]
        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }
} 