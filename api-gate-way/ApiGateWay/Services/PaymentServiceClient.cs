using Grpc.Core;
using Grpc.Net.Client;
using ApiGateWay.Protos;
using System.Text.Json;

namespace ApiGateWay.Services
{
    public interface IPaymentServiceClient
    {
        Task<TransactionResponse> DepositAsync(string userId, long amount, string description);
        Task<TransactionResponse> WithdrawAsync(string userId, long amount, string description);
        Task<TransactionResponse> MakePaymentAsync(string userId, long amount, string referenceId, string referenceType, string description);
        Task<AccountResponse> GetAccountAsync(string userId);
        Task<TransactionHistoryResponse> GetTransactionHistoryAsync(string userId);
    }

    public class PaymentServiceClient : IPaymentServiceClient
    {
        private readonly PaymentService.PaymentServiceClient _client;
        private readonly ILogger<PaymentServiceClient> _logger;

        public PaymentServiceClient(IConfiguration configuration, ILogger<PaymentServiceClient> logger)
        {
            try
            {
                var serviceUrl = configuration["PaymentService:Url"] ?? "http://localhost:5239";
                _logger = logger;
                _logger.LogInformation("Initializing PaymentServiceClient with URL: {ServiceUrl}", serviceUrl);
                
                var channel = GrpcChannel.ForAddress(serviceUrl);
                _client = new PaymentService.PaymentServiceClient(channel);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error initializing PaymentServiceClient");
                throw;
            }
        }

        public async Task<TransactionResponse> DepositAsync(string userId, long amount, string description)
        {
            try
            {
                _logger.LogInformation("Calling Deposit with parameters: UserId={UserId}, Amount={Amount}, Description={Description}", 
                    userId, amount, description);

                var request = new DepositRequest
                {
                    UserId = userId,
                    Amount = amount,
                    Description = description
                };

                var response = await _client.DepositAsync(request);
                _logger.LogInformation("Deposit successful. Response: {Response}", 
                    JsonSerializer.Serialize(response));
                
                return response;
            }
            catch (RpcException ex)
            {
                _logger.LogError(ex, "gRPC error calling Deposit. Status: {Status}, Detail: {Detail}", 
                    ex.StatusCode, ex.Status.Detail);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error calling Deposit");
                throw;
            }
        }

        public async Task<TransactionResponse> WithdrawAsync(string userId, long amount, string description)
        {
            try
            {
                _logger.LogInformation("Calling Withdraw with parameters: UserId={UserId}, Amount={Amount}, Description={Description}", 
                    userId, amount, description);

                var request = new WithdrawRequest
                {
                    UserId = userId,
                    Amount = amount,
                    Description = description
                };

                var response = await _client.WithdrawAsync(request);
                _logger.LogInformation("Withdraw successful. Response: {Response}", 
                    JsonSerializer.Serialize(response));
                
                return response;
            }
            catch (RpcException ex)
            {
                _logger.LogError(ex, "gRPC error calling Withdraw. Status: {Status}, Detail: {Detail}", 
                    ex.StatusCode, ex.Status.Detail);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error calling Withdraw");
                throw;
            }
        }

        public async Task<TransactionResponse> MakePaymentAsync(string userId, long amount, string referenceId, string referenceType, string description)
        {
            try
            {
                _logger.LogInformation("Calling MakePayment with parameters: UserId={UserId}, Amount={Amount}, ReferenceId={ReferenceId}, ReferenceType={ReferenceType}, Description={Description}", 
                    userId, amount, referenceId, referenceType, description);

                var request = new PaymentRequest
                {
                    UserId = userId,
                    Amount = amount,
                    ReferenceId = referenceId,
                    ReferenceType = referenceType,
                    Description = description
                };

                var response = await _client.MakePaymentAsync(request);
                _logger.LogInformation("MakePayment successful. Response: {Response}", 
                    JsonSerializer.Serialize(response));
                
                return response;
            }
            catch (RpcException ex)
            {
                _logger.LogError(ex, "gRPC error calling MakePayment. Status: {Status}, Detail: {Detail}", 
                    ex.StatusCode, ex.Status.Detail);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error calling MakePayment");
                throw;
            }
        }

        public async Task<AccountResponse> GetAccountAsync(string userId)
        {
            try
            {
                _logger.LogInformation("Calling GetAccount with parameters: UserId={UserId}", userId);

                var request = new GetAccountRequest
                {
                    UserId = userId
                };

                var response = await _client.GetAccountAsync(request);
                _logger.LogInformation("GetAccount successful. Response: {Response}", 
                    JsonSerializer.Serialize(response));
                
                return response;
            }
            catch (RpcException ex)
            {
                _logger.LogError(ex, "gRPC error calling GetAccount. Status: {Status}, Detail: {Detail}", 
                    ex.StatusCode, ex.Status.Detail);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error calling GetAccount");
                throw;
            }
        }

        public async Task<TransactionHistoryResponse> GetTransactionHistoryAsync(string userId)
        {
            try
            {
                _logger.LogInformation("Calling GetTransactionHistory with parameters: UserId={UserId}", userId);

                var request = new GetTransactionHistoryRequest
                {
                    UserId = userId
                };

                var response = await _client.GetTransactionHistoryAsync(request);
                _logger.LogInformation("GetTransactionHistory successful. Response: {Response}", 
                    JsonSerializer.Serialize(response));
                
                return response;
            }
            catch (RpcException ex)
            {
                _logger.LogError(ex, "gRPC error calling GetTransactionHistory. Status: {Status}, Detail: {Detail}", 
                    ex.StatusCode, ex.Status.Detail);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error calling GetTransactionHistory");
                throw;
            }
        }
    }
} 