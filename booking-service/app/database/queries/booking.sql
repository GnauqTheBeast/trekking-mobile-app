-- name: CreateBooking :one
INSERT INTO booking (
    id,
    user_id,
    tour_id,
    host_id,
    porter_id,
    quantity,
    total_price
) VALUES (
     $1, $2, $3, $4, $5, $6, $7
) RETURNING *;

-- name: GetBookingByID :one
SELECT * FROM booking
WHERE id = $1 LIMIT 1;

-- name: GetBookingForUpdate :one
SELECT * FROM booking
WHERE id = $1 LIMIT 1 FOR NO KEY UPDATE;

-- name: ListUserBookings :many
SELECT * FROM booking
WHERE user_id = $1
ORDER BY created_at DESC
    LIMIT $2
OFFSET $3;

-- name: ListHostBookings :many
SELECT * FROM booking
WHERE host_id = $1
ORDER BY created_at DESC
    LIMIT $2
OFFSET $3;

-- name: DeleteBooking :exec
DELETE FROM booking
WHERE id = $1;

-- name: UpdateBooking :exec
UPDATE booking
SET
    user_id = $2,
    tour_id = $3,
    porter_id = $4,
    quantity = $5,
    total_price = $6,
    updated_at = NOW()
WHERE id = $1 AND updated_at = $7;
