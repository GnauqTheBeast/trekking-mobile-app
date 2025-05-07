using System;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.Extensions.Logging;
using PaymentService.Application.Interfaces;
using PaymentService.Core.Models;

namespace PaymentService.GrpcService.Services
{
    public class PaymentGrpcService : PaymentService.PaymentServiceBase
    {
        private readonly ILogger<PaymentGrpcService> _logger;
        private readonly IPaymentService _paymentService;

        public PaymentGrpcService(ILogger<PaymentGrpcService> logger, IPaymentService paymentService)
        {
            _logger = logger;
            _paymentService = paymentService;
        }

        public override async Task<TransactionResponse> Deposit(DepositRequest request, ServerCallContext context)
        {
            try
            {
                var transaction = await _paymentService.InitiateDepositAsync(
                    Guid.Parse(request.UserId),
                    request.Amount,
                    request.Description);

                return MapToTransactionResponse(transaction);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing deposit request");
                throw new RpcException(new Status(StatusCode.Internal, "Error processing deposit request"));
            }
        }

        public override async Task<TransactionResponse> Withdraw(WithdrawRequest request, ServerCallContext context)
        {
            try
            {
                var transaction = await _paymentService.InitiateWithdrawAsync(
                    Guid.Parse(request.UserId),
                    request.Amount,
                    request.Description);

                return MapToTransactionResponse(transaction);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing withdraw request");
                throw new RpcException(new Status(StatusCode.Internal, "Error processing withdraw request"));
            }
        }

        public override async Task<TransactionResponse> MakePayment(PaymentRequest request, ServerCallContext context)
        {
            try
            {
                var transaction = await _paymentService.MakePaymentAsync(
                    Guid.Parse(request.UserId),
                    request.Amount,
                    Guid.Parse(request.ReferenceId),
                    request.ReferenceType,
                    request.Description);

                return MapToTransactionResponse(transaction);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing payment request");
                throw new RpcException(new Status(StatusCode.Internal, "Error processing payment request"));
            }
        }

        public override async Task<AccountResponse> GetAccount(GetAccountRequest request, ServerCallContext context)
        {
            try
            {
                var account = await _paymentService.GetAccountAsync(Guid.Parse(request.UserId));
                if (account == null)
                {
                    throw new RpcException(new Status(StatusCode.NotFound, "Account not found"));
                }

                return new AccountResponse
                {
                    Id = account.Id.ToString(),
                    UserId = account.UserId.ToString(),
                    Balance = account.Balance,
                    Currency = account.Currency,
                    Status = account.Status,
                    CreatedAt = account.CreatedAt.ToString("o"),
                    UpdatedAt = account.UpdatedAt.ToString("o")
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting account");
                throw new RpcException(new Status(StatusCode.Internal, "Error getting account"));
            }
        }

        public override async Task<TransactionHistoryResponse> GetTransactionHistory(GetTransactionHistoryRequest request, ServerCallContext context)
        {
            try
            {
                var transactions = await _paymentService.GetTransactionHistoryAsync(Guid.Parse(request.UserId));
                var response = new TransactionHistoryResponse();
                response.Transactions.AddRange(transactions.Select(MapToTransactionResponse));
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting transaction history");
                throw new RpcException(new Status(StatusCode.Internal, "Error getting transaction history"));
            }
        }

        private static TransactionResponse MapToTransactionResponse(Transaction transaction)
        {
            return new TransactionResponse
            {
                Id = transaction.Id.ToString(),
                AccountId = transaction.AccountId.ToString(),
                Amount = transaction.Amount,
                Type = transaction.Type,
                Status = transaction.Status,
                Description = transaction.Description,
                ReferenceId = transaction.ReferenceId?.ToString(),
                ReferenceType = transaction.ReferenceType,
                CreatedAt = transaction.CreatedAt.ToString("o"),
                UpdatedAt = transaction.UpdatedAt.ToString("o")
            };
        }
    }
} 