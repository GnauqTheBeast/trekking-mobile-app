using Dapper;
using Npgsql;
using PaymentService.Core.Interfaces;
using PaymentService.Core.Models;

namespace PaymentService.Infrastructure.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly string _connectionString;

        public TransactionRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<Transaction> GetByIdAsync(Guid id)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryFirstOrDefaultAsync<Transaction>(
                "SELECT * FROM transaction WHERE id = @Id",
                new { Id = id });
        }

        public async Task<IEnumerable<Transaction>> GetByAccountIdAsync(Guid accountId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryAsync<Transaction>(
                "SELECT * FROM transaction WHERE account_id = @AccountId ORDER BY created_at DESC",
                new { AccountId = accountId });
        }

        public async Task<Transaction> CreateAsync(Transaction transaction)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            var sql = @"
                INSERT INTO transaction (
                    id, account_id, amount, type, status, description,
                    reference_id, reference_type, created_at, updated_at
                )
                VALUES (
                    @Id, @AccountId, @Amount, @Type, @Status, @Description,
                    @ReferenceId, @ReferenceType, @CreatedAt, @UpdatedAt
                )
                RETURNING *";
            
            return await connection.QueryFirstOrDefaultAsync<Transaction>(sql, transaction);
        }

        public async Task<Transaction> UpdateAsync(Transaction transaction)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            var sql = @"
                UPDATE transaction 
                SET status = @Status,
                    updated_at = @UpdatedAt
                WHERE id = @Id
                RETURNING *";
            
            return await connection.QueryFirstOrDefaultAsync<Transaction>(sql, transaction);
        }

        public async Task<IEnumerable<Transaction>> GetByReferenceIdAsync(Guid referenceId, string referenceType)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryAsync<Transaction>(
                "SELECT * FROM transaction WHERE reference_id = @ReferenceId AND reference_type = @ReferenceType ORDER BY created_at DESC",
                new { ReferenceId = referenceId, ReferenceType = referenceType });
        }
    }
} 