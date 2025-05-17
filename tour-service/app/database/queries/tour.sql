-- name: CreateTour :one
INSERT INTO tour (
    id,
    name,
    description,
    host_id,
    slot,
    available_slot,
    price,
    status,
    start_at,
    end_at,
    created_at,
    updated_at
) VALUES (
             $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
) RETURNING *;

-- name: GetTourByID :one
SELECT * FROM tour
WHERE id = $1 LIMIT 1;

-- name: GetTourForUpdate :one
SELECT * FROM tour
WHERE id = $1 LIMIT 1 FOR NO KEY UPDATE;

-- name: ListTours :many
SELECT * FROM tour
ORDER BY id
    LIMIT $1
OFFSET $2;

-- name: DeleteTour :exec
DELETE FROM tour
WHERE id = $1;

-- name: UpdateTour :exec
UPDATE tour
SET
    name = $2,
    description = $3,
    slot = $4,
    status = $5,
    start_at = $6,
    end_at = $7,
    price = $9,
    updated_at = NOW()
WHERE id = $1 and updated_at = $8;

-- name: UpdateAvailableSlot :one
UPDATE tour
SET
    available_slot = $2,
    updated_at = NOW()
WHERE id = $1 RETURNING *;
