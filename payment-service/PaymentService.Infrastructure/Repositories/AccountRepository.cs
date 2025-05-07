using System;
using System.Threading.Tasks;
using Dapper;
using Npgsql;
using PaymentService.Core.Interfaces;
using PaymentService.Core.Models;

namespace PaymentService.Infrastructure.Repositories
{
    public class AccountRepository : IAccountRepository
    {
        private readonly string _connectionString;

        public AccountRepository(string connectionString)
        {
            _connectionString = connectionString;
            // Configure Dapper to map snake_case to PascalCase
            DefaultTypeMap.MatchNamesWithUnderscores = true;
        }

        public async Task<Account> GetByIdAsync(Guid id)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryFirstOrDefaultAsync<Account>(
                "SELECT * FROM account WHERE id = @Id",
                new { Id = id });
        }

        public async Task<Account> GetByUserIdAsync(Guid userId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryFirstOrDefaultAsync<Account>(
                "SELECT * FROM account WHERE user_id = @UserId",
                new { UserId = userId });
        }

        public async Task<Account> CreateAsync(Account account)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            var sql = @"
                INSERT INTO account (id, user_id, balance, currency, status, created_at, updated_at)
                VALUES (@Id, @UserId, @Balance, @Currency, @Status, @CreatedAt, @UpdatedAt)
                RETURNING *";
            
            return await connection.QueryFirstOrDefaultAsync<Account>(sql, account);
        }

        public async Task<Account> UpdateAsync(Account account)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            var sql = @"
                UPDATE account 
                SET balance = @Balance,
                    status = @Status,
                    updated_at = @UpdatedAt
                WHERE id = @Id
                RETURNING *";
            
            return await connection.QueryFirstOrDefaultAsync<Account>(sql, account);
        }

        public async Task<Account> UpdateBalanceAsync(Guid accountId, long amount)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            var sql = @"
                UPDATE account 
                SET balance = balance + @Amount,
                    updated_at = @UpdatedAt
                WHERE id = @Id
                RETURNING *";
            
            return await connection.QueryFirstOrDefaultAsync<Account>(sql, new 
            { 
                Id = accountId, 
                Amount = amount,
                UpdatedAt = DateTime.UtcNow
            });
        }
    }
} 