CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp
);
