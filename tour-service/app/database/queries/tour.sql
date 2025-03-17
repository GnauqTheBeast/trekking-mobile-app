-- name: CreateTour :exec
INSERT INTO tour (
    id,
    name,
    description,
    host,
    slot,
    status,
    start_at,
    end_at
) VALUES (
             $1, $2, $3, $4, $5, $6, $7, $8
) RETURNING *;

-- name: GetTourByID :one
SELECT * FROM tour
WHERE id = $1 LIMIT 1;

-- name: GetTourForUpdate :one
SELECT * FROM tour
WHERE id = $1 LIMIT 1 FOR NO KEY UPDATE;

-- name: ListTours :many
SELECT * FROM tour
WHERE host = $1
ORDER BY id
    LIMIT $2
OFFSET $3;

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
    updated_at = NOW()
WHERE id = $1 and updated_at = $8;