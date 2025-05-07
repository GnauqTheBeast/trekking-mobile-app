using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Dapper;
using Npgsql;
using PaymentService.Core.Interfaces;
using PaymentService.Core.Models;

namespace PaymentService.Infrastructure.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly string _connectionString;

        public PaymentRepository(string connectionString)
        {
            _connectionString = connectionString;
            // Configure Dapper to map snake_case to PascalCase
            DefaultTypeMap.MatchNamesWithUnderscores = true;
        }

        public async Task<Payment> GetByIdAsync(Guid id)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            const string sql = @"
                SELECT id, booking_id, total, method, type, status, created_at, updated_at
                FROM payment
                WHERE id = @Id";

            return await connection.QueryFirstOrDefaultAsync<Payment>(sql, new { Id = id });
        }

        public async Task<Payment> GetByBookingIdAsync(Guid bookingId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            const string sql = @"
                SELECT id, booking_id, total, method, type, status, created_at, updated_at
                FROM payment
                WHERE booking_id = @BookingId";

            return await connection.QueryFirstOrDefaultAsync<Payment>(sql, new { BookingId = bookingId });
        }

        public async Task<IEnumerable<Payment>> GetByUserIdAsync(Guid userId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            const string sql = @"
                SELECT p.id, p.booking_id, p.total, p.method, p.type, p.status, p.created_at, p.updated_at
                FROM payment p
                JOIN booking b ON p.booking_id = b.id
                WHERE b.user_id = @UserId
                ORDER BY p.created_at DESC";

            return await connection.QueryAsync<Payment>(sql, new { UserId = userId });
        }

        public async Task<Payment> CreateAsync(Payment payment)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            const string sql = @"
                INSERT INTO payment (id, booking_id, total, method, type, status, created_at, updated_at)
                VALUES (@Id, @BookingId, @Total, @Method, @Type, @Status, @CreatedAt, @UpdatedAt)
                RETURNING id, booking_id, total, method, type, status, created_at, updated_at";

            return await connection.QueryFirstOrDefaultAsync<Payment>(sql, new
            {
                payment.Id,
                payment.BookingId,
                payment.Total,
                payment.Method,
                payment.Type,
                payment.Status,
                payment.CreatedAt,
                payment.UpdatedAt
            });
        }

        public async Task<Payment> UpdateAsync(Payment payment)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            const string sql = @"
                UPDATE payment
                SET booking_id = @BookingId,
                    total = @Total,
                    method = @Method,
                    type = @Type,
                    status = @Status,
                    updated_at = @UpdatedAt
                WHERE id = @Id
                RETURNING id, booking_id, total, method, type, status, created_at, updated_at";

            return await connection.QueryFirstOrDefaultAsync<Payment>(sql, new
            {
                payment.Id,
                payment.BookingId,
                payment.Total,
                payment.Method,
                payment.Type,
                payment.Status,
                payment.UpdatedAt
            });
        }

        public async Task<bool> UpdateStatusAsync(Guid id, string status)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            const string sql = @"
                UPDATE payment
                SET status = @Status,
                    updated_at = @UpdatedAt
                WHERE id = @Id";

            var rowsAffected = await connection.ExecuteAsync(sql, new 
            { 
                Id = id, 
                Status = status,
                UpdatedAt = DateTime.UtcNow
            });

            return rowsAffected > 0;
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            const string sql = "SELECT COUNT(1) FROM payment WHERE id = @Id";

            var count = await connection.ExecuteScalarAsync<int>(sql, new { Id = id });
            return count > 0;
        }
    }
}