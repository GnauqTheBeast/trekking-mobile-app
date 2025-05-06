using Microsoft.AspNetCore.Mvc;
using ApiGateWay.Services;
using ApiGateWay.Protos;

namespace ApiGateWay.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentServiceClient _paymentServiceClient;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController(IPaymentServiceClient paymentServiceClient, ILogger<PaymentController> logger)
        {
            _paymentServiceClient = paymentServiceClient;
            _logger = logger;
        }

        [HttpPost("deposit")]
        public async Task<ActionResult<TransactionResponse>> Deposit([FromBody] DepositRequest request)
        {
            try
            {
                var response = await _paymentServiceClient.DepositAsync(request.UserId, request.Amount, request.Description);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing deposit request");
                return StatusCode(500, "Error processing deposit request");
            }
        }

        [HttpPost("withdraw")]
        public async Task<ActionResult<TransactionResponse>> Withdraw([FromBody] WithdrawRequest request)
        {
            try
            {
                var response = await _paymentServiceClient.WithdrawAsync(request.UserId, request.Amount, request.Description);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing withdraw request");
                return StatusCode(500, "Error processing withdraw request");
            }
        }

        [HttpPost("payment")]
        public async Task<ActionResult<TransactionResponse>> MakePayment([FromBody] PaymentRequest request)
        {
            try
            {
                var response = await _paymentServiceClient.MakePaymentAsync(
                    request.UserId,
                    request.Amount,
                    request.ReferenceId,
                    request.ReferenceType,
                    request.Description);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing payment request");
                return StatusCode(500, "Error processing payment request");
            }
        }

        [HttpGet("account/{userId}")]
        public async Task<ActionResult<AccountResponse>> GetAccount(string userId)
        {
            try
            {
                var response = await _paymentServiceClient.GetAccountAsync(userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting account");
                return StatusCode(500, "Error getting account");
            }
        }

        [HttpGet("transactions/{userId}")]
        public async Task<ActionResult<TransactionHistoryResponse>> GetTransactionHistory(string userId)
        {
            try
            {
                var response = await _paymentServiceClient.GetTransactionHistoryAsync(userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting transaction history");
                return StatusCode(500, "Error getting transaction history");
            }
        }
    }
} 