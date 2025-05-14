-- name: CreateNotification :one
INSERT INTO "notification" (
    id, user_id, name, description
) VALUES (
 $1, $2, $3, $4
) RETURNING *;

-- name: GetNotificationByID :one
SELECT * FROM "notification"
WHERE id = $1;

-- name: ListNotificationsByUser :many
SELECT * FROM "notification"
WHERE user_id = $1
ORDER BY created_at DESC;

-- name: UpdateNotification :one
UPDATE "notification"
SET
    name = $2,
    description = $3,
    updated_at = now()
WHERE id = $1
RETURNING *;

-- name: DeleteNotification :exec
DELETE FROM "notification"
WHERE id = $1;
