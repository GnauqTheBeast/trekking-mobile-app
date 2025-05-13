using System;
using System.Text;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using PaymentService.Application.Interfaces;
using PaymentService.Core.Models;
using StackExchange.Redis;

namespace PaymentService.Api.Services
{
    public class RedisConsumerService : BackgroundService
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly ILogger<RedisConsumerService> _logger;
        private const string Topic = "booking_request";

        public RedisConsumerService(
            IConnectionMultiplexer redis,
            IServiceScopeFactory serviceScopeFactory,
            ILogger<RedisConsumerService> logger)
        {
            _redis = redis;
            _serviceScopeFactory = serviceScopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var subscriber = _redis.GetSubscriber();
            await subscriber.SubscribeAsync(Topic, async (channel, message) =>
            {
                try
                {
                    _logger.LogInformation($"Received message: {message}");

                    // Clean the message by finding the first '{' character
                    string messageStr = message.ToString();
                    int jsonStartIndex = messageStr.IndexOf('{');
                    if (jsonStartIndex >= 0)
                    {
                        string cleanJson = messageStr.Substring(jsonStartIndex);
                        var bookingMessage = JsonConvert.DeserializeObject<BookingMessage>(cleanJson);
                        if (bookingMessage != null)
                        {
                            using (var scope = _serviceScopeFactory.CreateScope())
                            {
                                var paymentService = scope.ServiceProvider.GetRequiredService<IPaymentService>();
                                try
                                {
                                    var payment = await paymentService.CreatePaymentFromBookingAsync(bookingMessage.Id);
                                    _logger.LogInformation($"Created payment for booking {bookingMessage.Id}: {payment.Id}");
                                }
                                catch (Exception ex)
                                {
                                    _logger.LogError(ex, $"Error creating payment for booking {bookingMessage.Id}");
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing message");
                }
            });

            // Keep the service running
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(TimeSpan.FromSeconds(1), stoppingToken);
            }
        }
    }
} 