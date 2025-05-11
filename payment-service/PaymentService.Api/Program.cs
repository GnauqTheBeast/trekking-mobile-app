using PaymentService.Application.Interfaces;
using PaymentService.Application.Services;
using PaymentService.Core.Interfaces;
using PaymentService.Infrastructure.Repositories;
using PaymentService.Api.Services;
using Confluent.Kafka;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Get connection string from configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
}

// Register services
builder.Services.AddScoped<IPaymentService, PaymentServiceImpl>();
builder.Services.AddScoped<IAccountRepository>(sp => new AccountRepository(connectionString));
builder.Services.AddScoped<ITransactionRepository>(sp => new TransactionRepository(connectionString));
builder.Services.AddScoped<IBookingRepository>(sp => new BookingRepository(connectionString));
builder.Services.AddScoped<IPaymentRepository>(sp => new PaymentRepository(connectionString));

// Configure Kafka Consumer
/*
var consumerConfig = new ConsumerConfig
{
    BootstrapServers = builder.Configuration["Kafka:BootstrapServers"] ?? "localhost:9092",
    GroupId = "payment-service-group",
    AutoOffsetReset = AutoOffsetReset.Earliest,
    EnableAutoCommit = false
};

builder.Services.AddSingleton<IConsumer<string, string>>(sp =>
    new ConsumerBuilder<string, string>(consumerConfig).Build());

// Register Kafka Consumer Service with IServiceScopeFactory
builder.Services.AddHostedService<KafkaConsumerService>();
*/

// Add health checks
builder.Services.AddHealthChecks();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();

app.MapControllers();

// Add health check endpoint
app.MapHealthChecks("/health");

app.Run();
