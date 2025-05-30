// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0
// source: tour.sql

package sqlc

import (
	"context"
	"time"

	"github.com/google/uuid"
)

const countTours = `-- name: CountTours :one
SELECT COUNT(*) FROM tour
`

func (q *Queries) CountTours(ctx context.Context) (int64, error) {
	row := q.db.QueryRowContext(ctx, countTours)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const createTour = `-- name: CreateTour :one
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
) RETURNING id, name, description, host_id, price, level, distance, elevation, duration, location, images, rate, slot, available_slot, status, start_at, end_at, created_at, updated_at
`

type CreateTourParams struct {
	ID            uuid.UUID `json:"id"`
	Name          string    `json:"name"`
	Description   string    `json:"description"`
	HostID        uuid.UUID `json:"host_id"`
	Slot          int32     `json:"slot"`
	AvailableSlot int32     `json:"available_slot"`
	Price         int32     `json:"price"`
	Level         string    `json:"level"`
	Distance      int32     `json:"distance"`
	Elevation     int32     `json:"elevation"`
	Duration      string    `json:"duration"`
	Location      string    `json:"location"`
	Images        string    `json:"images"`
	Rate          string    `json:"rate"`
	Status        string    `json:"status"`
	StartAt       time.Time `json:"start_at"`
	EndAt         time.Time `json:"end_at"`
}

func (q *Queries) CreateTour(ctx context.Context, arg *CreateTourParams) (*Tour, error) {
	row := q.db.QueryRowContext(ctx, createTour,
		arg.ID,
		arg.Name,
		arg.Description,
		arg.HostID,
		arg.Slot,
		arg.AvailableSlot,
		arg.Price,
		arg.Level,
		arg.Distance,
		arg.Elevation,
		arg.Duration,
		arg.Location,
		arg.Images,
		arg.Rate,
		arg.Status,
		arg.StartAt,
		arg.EndAt,
	)
	var i Tour
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.HostID,
		&i.Price,
		&i.Level,
		&i.Distance,
		&i.Elevation,
		&i.Duration,
		&i.Location,
		&i.Images,
		&i.Rate,
		&i.Slot,
		&i.AvailableSlot,
		&i.Status,
		&i.StartAt,
		&i.EndAt,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return &i, err
}

const deleteTour = `-- name: DeleteTour :exec
DELETE FROM tour
WHERE id = $1
`

func (q *Queries) DeleteTour(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteTour, id)
	return err
}

const getTourByHostId = `-- name: GetTourByHostId :many
SELECT id, name, description, host_id, price, level, distance, elevation, duration, location, images, rate, slot, available_slot, status, start_at, end_at, created_at, updated_at FROM tour
WHERE host_id = $1
`

func (q *Queries) GetTourByHostId(ctx context.Context, hostID uuid.UUID) ([]*Tour, error) {
	rows, err := q.db.QueryContext(ctx, getTourByHostId, hostID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []*Tour{}
	for rows.Next() {
		var i Tour
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Description,
			&i.HostID,
			&i.Price,
			&i.Level,
			&i.Distance,
			&i.Elevation,
			&i.Duration,
			&i.Location,
			&i.Images,
			&i.Rate,
			&i.Slot,
			&i.AvailableSlot,
			&i.Status,
			&i.StartAt,
			&i.EndAt,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, &i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getTourByID = `-- name: GetTourByID :one
SELECT id, name, description, host_id, price, level, distance, elevation, duration, location, images, rate, slot, available_slot, status, start_at, end_at, created_at, updated_at FROM tour
WHERE id = $1 LIMIT 1
`

func (q *Queries) GetTourByID(ctx context.Context, id uuid.UUID) (*Tour, error) {
	row := q.db.QueryRowContext(ctx, getTourByID, id)
	var i Tour
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.HostID,
		&i.Price,
		&i.Level,
		&i.Distance,
		&i.Elevation,
		&i.Duration,
		&i.Location,
		&i.Images,
		&i.Rate,
		&i.Slot,
		&i.AvailableSlot,
		&i.Status,
		&i.StartAt,
		&i.EndAt,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return &i, err
}

const listTours = `-- name: ListTours :many
SELECT id, name, description, host_id, price, level, distance, elevation, duration, location, images, rate, slot, available_slot, status, start_at, end_at, created_at, updated_at FROM tour
ORDER BY id
    LIMIT $1
OFFSET $2
`

type ListToursParams struct {
	Limit  int32 `json:"limit"`
	Offset int32 `json:"offset"`
}

func (q *Queries) ListTours(ctx context.Context, arg *ListToursParams) ([]*Tour, error) {
	rows, err := q.db.QueryContext(ctx, listTours, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []*Tour{}
	for rows.Next() {
		var i Tour
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Description,
			&i.HostID,
			&i.Price,
			&i.Level,
			&i.Distance,
			&i.Elevation,
			&i.Duration,
			&i.Location,
			&i.Images,
			&i.Rate,
			&i.Slot,
			&i.AvailableSlot,
			&i.Status,
			&i.StartAt,
			&i.EndAt,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, &i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateAvailableSlot = `-- name: UpdateAvailableSlot :one
UPDATE tour
SET
    available_slot = $2,
    updated_at = NOW()
WHERE id = $1 RETURNING id, name, description, host_id, price, level, distance, elevation, duration, location, images, rate, slot, available_slot, status, start_at, end_at, created_at, updated_at
`

type UpdateAvailableSlotParams struct {
	ID            uuid.UUID `json:"id"`
	AvailableSlot int32     `json:"available_slot"`
}

func (q *Queries) UpdateAvailableSlot(ctx context.Context, arg *UpdateAvailableSlotParams) (*Tour, error) {
	row := q.db.QueryRowContext(ctx, updateAvailableSlot, arg.ID, arg.AvailableSlot)
	var i Tour
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.HostID,
		&i.Price,
		&i.Level,
		&i.Distance,
		&i.Elevation,
		&i.Duration,
		&i.Location,
		&i.Images,
		&i.Rate,
		&i.Slot,
		&i.AvailableSlot,
		&i.Status,
		&i.StartAt,
		&i.EndAt,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return &i, err
}

const updateTour = `-- name: UpdateTour :exec
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
WHERE id = $1 AND updated_at = $17
`

type UpdateTourParams struct {
	ID            uuid.UUID `json:"id"`
	Name          string    `json:"name"`
	Description   string    `json:"description"`
	Slot          int32     `json:"slot"`
	AvailableSlot int32     `json:"available_slot"`
	Price         int32     `json:"price"`
	Level         string    `json:"level"`
	Distance      int32     `json:"distance"`
	Elevation     int32     `json:"elevation"`
	Duration      string    `json:"duration"`
	Location      string    `json:"location"`
	Images        string    `json:"images"`
	Rate          string    `json:"rate"`
	Status        string    `json:"status"`
	StartAt       time.Time `json:"start_at"`
	EndAt         time.Time `json:"end_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

func (q *Queries) UpdateTour(ctx context.Context, arg *UpdateTourParams) error {
	_, err := q.db.ExecContext(ctx, updateTour,
		arg.ID,
		arg.Name,
		arg.Description,
		arg.Slot,
		arg.AvailableSlot,
		arg.Price,
		arg.Level,
		arg.Distance,
		arg.Elevation,
		arg.Duration,
		arg.Location,
		arg.Images,
		arg.Rate,
		arg.Status,
		arg.StartAt,
		arg.EndAt,
		arg.UpdatedAt,
	)
	return err
}
