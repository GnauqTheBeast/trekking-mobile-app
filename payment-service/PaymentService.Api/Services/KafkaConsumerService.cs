using System;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Confluent.Kafka;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PaymentService.Application.Interfaces;
using PaymentService.Core.Models;

namespace PaymentService.Api.Services
{
    public class KafkaConsumerService : BackgroundService
    {
        private readonly IConsumer<string, string> _consumer;
        private readonly IPaymentService _paymentService;
        private readonly ILogger<KafkaConsumerService> _logger;
        private const string Topic = "booking_request";

        public KafkaConsumerService(
            IConsumer<string, string> consumer,
            IPaymentService paymentService,
            ILogger<KafkaConsumerService> logger)
        {
            _consumer = consumer;
            _paymentService = paymentService;
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

                        var booking = JsonSerializer.Deserialize<Booking>(consumeResult.Message.Value);
                        if (booking != null)
                        {
                            try
                            {
                                var payment = await _paymentService.CreatePaymentFromBookingAsync(booking.Id);
                                _logger.LogInformation($"Created payment for booking {booking.Id}: {payment.Id}");
                            }
                            catch (Exception ex)
                            {
                                _logger.LogError(ex, $"Error creating payment for booking {booking.Id}");
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