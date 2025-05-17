using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using Newtonsoft.Json;
using PaymentService.Core.Models;
using PaymentService.Api.Models;

namespace PaymentService.Api.Services
{
    public class RedisPublisherService
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly ILogger<RedisPublisherService> _logger;
        private const string PaymentSuccessTopic = "payment_result";

        public RedisPublisherService(
            IConnectionMultiplexer redis,
            ILogger<RedisPublisherService> logger)
        {
            _redis = redis;
            _logger = logger;
        }

        public async Task PublishPaymentSuccessAsync(Payment payment, Guid userId)
        {
            try
            {
                var subscriber = _redis.GetSubscriber();
                var message = JsonConvert.SerializeObject(new PaymentNotification
                {
                    Id = payment.Id,
                    BookingId = payment.BookingId,
                    Total = payment.Total,
                    Method = payment.Method,
                    Type = payment.Type,
                    Status = payment.Status,
                    CreatedAt = payment.CreatedAt,
                    UpdatedAt = payment.UpdatedAt,
                    UserId = userId
                });
                await subscriber.PublishAsync(PaymentSuccessTopic, message);
                _logger.LogInformation($"Published payment success message for payment {payment.Id}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error publishing payment success message for payment {payment.Id}");
                throw;
            }
        }
    }
} 