using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PaymentService.Application.Interfaces;
using PaymentService.Core.Models;

namespace PaymentService.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly ILogger<PaymentController> _logger;
        private readonly IPaymentService _paymentService;

        public PaymentController(ILogger<PaymentController> logger, IPaymentService paymentService)
        {
            _logger = logger;
            _paymentService = paymentService;
        }

        /// <summary>
        /// Initiate a deposit transaction
        /// </summary>
        [HttpPost("deposit")]
        [ProducesResponseType(typeof(Transaction), 200)]
        [ProducesResponseType(typeof(ErrorResponse), 400)]
        [ProducesResponseType(typeof(ErrorResponse), 404)]
        [ProducesResponseType(typeof(ErrorResponse), 500)]
        public async Task<IActionResult> Deposit([FromBody] DepositRequest request)
        {
            try
            {
                _logger.LogInformation($"Processing deposit request for user {request.UserId}");
                var transaction = await _paymentService.InitiateDepositAsync(
                    request.UserId,
                    request.Amount,
                    request.Description);
                return Ok(transaction);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning($"Invalid deposit request: {ex.Message}");
                return BadRequest(new ErrorResponse { Message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning($"Account not found: {ex.Message}");
                return NotFound(new ErrorResponse { Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing deposit request");
                return StatusCode(500, new ErrorResponse { Message = "An unexpected error occurred" });
            }
        }

        /// <summary>
        /// Initiate a withdrawal transaction
        /// </summary>
        [HttpPost("withdraw")]
        [ProducesResponseType(typeof(Transaction), 200)]
        [ProducesResponseType(typeof(ErrorResponse), 400)]
        [ProducesResponseType(typeof(ErrorResponse), 404)]
        [ProducesResponseType(typeof(ErrorResponse), 500)]
        public async Task<IActionResult> Withdraw([FromBody] WithdrawRequest request)
        {
            try
            {
                _logger.LogInformation($"Processing withdraw request for user {request.UserId}");
                var transaction = await _paymentService.InitiateWithdrawAsync(
                    request.UserId,
                    request.Amount,
                    request.Description);
                return Ok(transaction);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning($"Invalid withdraw request: {ex.Message}");
                return BadRequest(new ErrorResponse { Message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning($"Account not found or insufficient balance: {ex.Message}");
                return NotFound(new ErrorResponse { Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing withdraw request");
                return StatusCode(500, new ErrorResponse { Message = "An unexpected error occurred" });
            }
        }

        /// <summary>
        /// Confirm a transaction
        /// </summary>
        [HttpPost("confirm/{transactionId}")]
        [ProducesResponseType(typeof(Transaction), 200)]
        [ProducesResponseType(typeof(ErrorResponse), 400)]
        [ProducesResponseType(typeof(ErrorResponse), 404)]
        [ProducesResponseType(typeof(ErrorResponse), 500)]
        public async Task<IActionResult> ConfirmTransaction(Guid transactionId, [FromBody] ConfirmTransactionRequest request)
        {
            try
            {
                _logger.LogInformation($"Confirming transaction {transactionId}");
                var transaction = await _paymentService.ConfirmTransactionAsync(
                    transactionId,
                    request.IsConfirmed,
                    request.Note);
                return Ok(transaction);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning($"Transaction not found or invalid state: {ex.Message}");
                return NotFound(new ErrorResponse { Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error confirming transaction");
                return StatusCode(500, new ErrorResponse { Message = "An unexpected error occurred" });
            }
        }

        /// <summary>
        /// Make a payment
        /// </summary>
        [HttpPost("payment")]
        [ProducesResponseType(typeof(Transaction), 200)]
        [ProducesResponseType(typeof(ErrorResponse), 400)]
        [ProducesResponseType(typeof(ErrorResponse), 404)]
        [ProducesResponseType(typeof(ErrorResponse), 500)]
        public async Task<IActionResult> MakePayment([FromBody] PaymentRequest request)
        {
            try
            {
                _logger.LogInformation($"Processing payment request for user {request.UserId}");
                var transaction = await _paymentService.MakePaymentAsync(
                    request.UserId,
                    request.Amount,
                    request.ReferenceId,
                    request.ReferenceType,
                    request.Description);
                return Ok(transaction);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning($"Invalid payment request: {ex.Message}");
                return BadRequest(new ErrorResponse { Message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning($"Account not found or insufficient balance: {ex.Message}");
                return NotFound(new ErrorResponse { Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing payment request");
                return StatusCode(500, new ErrorResponse { Message = "An unexpected error occurred" });
            }
        }

        /// <summary>
        /// Get account information
        /// </summary>
        [HttpGet("account/{userId}")]
        [ProducesResponseType(typeof(Account), 200)]
        [ProducesResponseType(typeof(ErrorResponse), 404)]
        [ProducesResponseType(typeof(ErrorResponse), 500)]
        public async Task<IActionResult> GetAccount(Guid userId)
        {
            try
            {
                _logger.LogInformation($"Getting account information for user {userId}");
                var account = await _paymentService.GetAccountAsync(userId);
                if (account == null)
                {
                    return NotFound(new ErrorResponse { Message = "Account not found" });
                }
                return Ok(account);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting account information");
                return StatusCode(500, new ErrorResponse { Message = "An unexpected error occurred" });
            }
        }

        /// <summary>
        /// Get transaction history
        /// </summary>
        [HttpGet("transactions/{userId}")]
        [ProducesResponseType(typeof(IEnumerable<Transaction>), 200)]
        [ProducesResponseType(typeof(ErrorResponse), 404)]
        [ProducesResponseType(typeof(ErrorResponse), 500)]
        public async Task<IActionResult> GetTransactions(Guid userId)
        {
            try
            {
                _logger.LogInformation($"Getting transaction history for user {userId}");
                var transactions = await _paymentService.GetTransactionHistoryAsync(userId);
                return Ok(transactions);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning($"Account not found: {ex.Message}");
                return NotFound(new ErrorResponse { Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting transaction history");
                return StatusCode(500, new ErrorResponse { Message = "An unexpected error occurred" });
            }
        }

        [HttpPost("booking/{bookingId}")]
        [ProducesResponseType(typeof(Payment), 200)]
        [ProducesResponseType(typeof(ErrorResponse), 404)]
        [ProducesResponseType(typeof(ErrorResponse), 500)]
        public async Task<ActionResult<Payment>> CreatePaymentFromBooking(Guid bookingId)
        {
            try
            {
                var payment = await _paymentService.CreatePaymentFromBookingAsync(bookingId);
                return Ok(payment);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new ErrorResponse { Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating payment from booking");
                return StatusCode(500, new ErrorResponse { Message = "An error occurred while creating payment" });
            }
        }

        [HttpPost("process/{paymentId}")]
        [ProducesResponseType(typeof(Payment), 200)]
        [ProducesResponseType(typeof(ErrorResponse), 404)]
        [ProducesResponseType(typeof(ErrorResponse), 500)]
        public async Task<ActionResult<Payment>> ProcessPayment(Guid paymentId)
        {
            try
            {
                var payment = await _paymentService.ProcessPaymentAsync(paymentId);
                return Ok(payment);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new ErrorResponse { Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing payment");
                return StatusCode(500, new ErrorResponse { Message = "An error occurred while processing payment" });
            }
        }
    }

    public class DepositRequest
    {
        public Guid UserId { get; set; }
        public long Amount { get; set; }
        public string Description { get; set; }
    }

    public class WithdrawRequest
    {
        public Guid UserId { get; set; }
        public long Amount { get; set; }
        public string Description { get; set; }
    }

    public class ConfirmTransactionRequest
    {
        public bool IsConfirmed { get; set; }
        public string Note { get; set; }
    }

    public class PaymentRequest
    {
        public Guid UserId { get; set; }
        public long Amount { get; set; }
        public Guid ReferenceId { get; set; }
        public string ReferenceType { get; set; }
        public string Description { get; set; }
    }

    public class ErrorResponse
    {
        public string Message { get; set; }
    }
} 