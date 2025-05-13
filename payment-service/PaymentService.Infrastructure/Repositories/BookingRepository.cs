using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Dapper;
using Npgsql;
using PaymentService.Core.Interfaces;
using PaymentService.Core.Models;

namespace PaymentService.Infrastructure.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly string _connectionString;

        public BookingRepository(string connectionString)
        {
            _connectionString = connectionString;
            // Configure Dapper to map snake_case to PascalCase
            DefaultTypeMap.MatchNamesWithUnderscores = true;
        }

        public async Task<Booking> GetByIdAsync(Guid id)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            const string sql = @"
                SELECT id, user_id, porter_id, total_price, status, created_at, updated_at
                FROM booking
                WHERE id = @Id";

            return await connection.QueryFirstOrDefaultAsync<Booking>(sql, new { Id = id });
        }

        public async Task<IEnumerable<Booking>> GetByUserIdAsync(Guid userId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            const string sql = @"
                SELECT id, user_id, porter_id, total_price, status, created_at, updated_at
                FROM booking
                WHERE user_id = @UserId
                ORDER BY created_at DESC";

            return await connection.QueryAsync<Booking>(sql, new { UserId = userId });
        }

        public async Task<IEnumerable<Booking>> GetByPorterIdAsync(Guid porterId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            const string sql = @"
                SELECT id, user_id, porter_id, total_price, status, created_at, updated_at
                FROM booking
                WHERE porter_id = @PorterId
                ORDER BY created_at DESC";

            return await connection.QueryAsync<Booking>(sql, new { PorterId = porterId });
        }

        public async Task<Booking> CreateAsync(Booking booking)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            const string sql = @"
                INSERT INTO booking (id, user_id, porter_id, total_price, status, created_at, updated_at)
                VALUES (@Id, @UserId, @PorterId, @TotalPrice, @Status, @CreatedAt, @UpdatedAt)
                RETURNING id, user_id, porter_id, total_price, status, created_at, updated_at";

            return await connection.QueryFirstOrDefaultAsync<Booking>(sql, new
            {
                booking.Id,
                UserId = booking.UserId,
                PorterId = booking.PorterId,
                TotalPrice = booking.TotalPrice,
                Status = booking.Status,
                CreatedAt = booking.CreatedAt,
                UpdatedAt = booking.UpdatedAt
            });
        }

        public async Task<Booking> UpdateAsync(Booking booking)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            const string sql = @"
                UPDATE booking
                SET user_id = @UserId,
                    porter_id = @PorterId,
                    total_price = @TotalPrice,
                    status = @Status,
                    updated_at = @UpdatedAt
                WHERE id = @Id
                RETURNING id, user_id, porter_id, total_price, status, created_at, updated_at";

            return await connection.QueryFirstOrDefaultAsync<Booking>(sql, new
            {
                booking.Id,
                UserId = booking.UserId,
                PorterId = booking.PorterId,
                TotalPrice = booking.TotalPrice,
                Status = booking.Status,
                UpdatedAt = booking.UpdatedAt
            });
        }

        public async Task<bool> UpdateStatusAsync(Guid id, string status)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            const string sql = @"
                UPDATE booking
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

        public async Task<bool> DeleteAsync(Guid id)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            const string sql = "DELETE FROM booking WHERE id = @Id";

            var rowsAffected = await connection.ExecuteAsync(sql, new { Id = id });
            return rowsAffected > 0;
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            const string sql = "SELECT COUNT(1) FROM booking WHERE id = @Id";

            var count = await connection.ExecuteScalarAsync<int>(sql, new { Id = id });
            return count > 0;
        }
    }
}