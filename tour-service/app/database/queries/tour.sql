-- name: CreateTour :one
INSERT INTO tour (
    id,
    name,
    description,
    host_id,
    slot,
    available_slot,
    price,
    level,
    distance,
    elevation,
    duration,
    location,
    images,
    rate,
    status,
    start_at,
    end_at
) VALUES (
             $1, $2, $3, $4, $5, $6, $7,
             $8, $9, $10, $11, $12, $13, $14,
             $15, $16, $17
) RETURNING *;


-- name: GetTourByID :one
SELECT * FROM tour
WHERE id = $1 LIMIT 1;

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
    available_slot = $5,
    price = $6,
    level = $7,
    distance = $8,
    elevation = $9,
    duration = $10,
    location = $11,
    images = $12,
    rate = $13,
    status = $14,
    start_at = $15,
    end_at = $16,
    updated_at = NOW()
WHERE id = $1 AND updated_at = $17;

-- name: UpdateAvailableSlot :one
UPDATE tour
SET
    available_slot = $2,
    updated_at = NOW()
WHERE id = $1 RETURNING *;
