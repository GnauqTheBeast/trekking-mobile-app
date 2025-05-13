using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using Newtonsoft.Json;
using PaymentService.Core.Models;

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

        public async Task PublishPaymentSuccessAsync(Payment payment)
        {
            try
            {
                var subscriber = _redis.GetSubscriber();
                var message = JsonConvert.SerializeObject(payment);
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