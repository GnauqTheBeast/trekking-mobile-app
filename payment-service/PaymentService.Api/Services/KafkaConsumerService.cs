using System;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Confluent.Kafka;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using PaymentService.Application.Interfaces;
using PaymentService.Core.Models;

namespace PaymentService.Api.Services
{
    public class KafkaConsumerService : BackgroundService
    {
        private readonly IConsumer<string, string> _consumer;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly ILogger<KafkaConsumerService> _logger;
        private const string Topic = "booking_request";

        public KafkaConsumerService(
            IConsumer<string, string> consumer,
            IServiceScopeFactory serviceScopeFactory,
            ILogger<KafkaConsumerService> logger)
        {
            _consumer = consumer;
            _serviceScopeFactory = serviceScopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _consumer.Subscribe(Topic);

            try
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    try
                    {
                        var consumeResult = _consumer.Consume(stoppingToken);
                        if (consumeResult?.Message?.Value == null) continue;

                        _logger.LogInformation($"Received message: {consumeResult.Message.Value}");

                        var bookingMessage = JsonSerializer.Deserialize<BookingMessage>(consumeResult.Message.Value);
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
                    catch (ConsumeException ex)
                    {
                        _logger.LogError(ex, "Error consuming message");
                    }
                }
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("Consumer operation was cancelled");
            }
            finally
            {
                _consumer.Close();
            }
        }
    }
} 