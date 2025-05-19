package postgres

import (
	"context"
	"database/sql"
	"errors"
	"github.com/google/uuid"
	"github.com/trekking-mobile-app/internal/pkg/paging"

	"github.com/trekking-mobile-app/app/database/sqlc"
	"github.com/trekking-mobile-app/internal/module/tour/entity"
)

var (
	ErrTourNotFound    = errors.New("booking not found")
	ErrInvalidTourData = errors.New("invalid booking data")
)

type repository struct {
	queries *sqlc.Queries
}

func NewPostgresRepo(db *sqlc.SQLRepository) *repository {
	return &repository{
		queries: sqlc.New(db.Client),
	}
}

func (repo *repository) ListTours(ctx context.Context, paging *paging.Paging) ([]*entity.Tour, error) {
	tours, err := repo.queries.ListTours(ctx, &sqlc.ListToursParams{
		Limit:  int32(paging.Limit),
		Offset: int32(paging.Offset),
	})
	if err != nil {
		return nil, err
	}

	result := make([]*entity.Tour, len(tours))
	for i, t := range tours {
		result[i] = toEntityTour(t)
	}

	return result, nil
}

func (repo *repository) ListToursByHostId(ctx context.Context, hostId string) ([]*entity.Tour, error) {
	id, err := uuid.Parse(hostId)
	if err != nil {
		return nil, err
	}

	tours, err := repo.queries.GetTourByHostId(ctx, id)
	if err != nil {
		return nil, err
	}

	result := make([]*entity.Tour, len(tours))
	for i, t := range tours {
		result[i] = toEntityTour(t)
	}
	return result, nil
}

func (repo *repository) UpdateTour(ctx context.Context, tourId string, data *entity.TourPatchData) error {
	if data == nil {
		return ErrInvalidTourData
	}

	id, err := uuid.Parse(tourId)
	if err != nil {
		return ErrInvalidTourData
	}

	tourByID, err := repo.queries.GetTourByID(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ErrTourNotFound
		}
		return err
	}

	return repo.queries.UpdateTour(ctx, &sqlc.UpdateTourParams{
		ID:          id,
		Name:        data.Name,
		Description: data.Description,
		Slot:        int32(data.Slot),
		Price:       int32(data.Price),
		Status:      string(data.Status),
		StartAt:     data.TimeStart,
		EndAt:       data.TimeEnd,
		UpdatedAt:   tourByID.UpdatedAt,
	})
}

func (repo *repository) DeleteTour(ctx context.Context, tourId string) error {
	id, err := uuid.Parse(tourId)
	if err != nil {
		return ErrInvalidTourData
	}

	err = repo.queries.DeleteTour(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ErrTourNotFound
		}
		return err
	}
	return nil
}

func (repo *repository) InsertNewTour(ctx context.Context, data *entity.Tour) (*entity.Tour, error) {
	if data == nil {
		return nil, ErrInvalidTourData
	}

	createTour, err := repo.queries.CreateTour(ctx, &sqlc.CreateTourParams{
		ID:            uuid.New(),
		Name:          data.Name,
		Description:   data.Description,
		HostID:        data.HostID,
		Slot:          int32(data.Slot),
		AvailableSlot: int32(data.AvailableSlot),
		Price:         int32(data.Price),
		Status:        string(data.Status),
		StartAt:       data.TimeStart,
		EndAt:         data.TimeEnd,
	})
	if err != nil {
		return nil, err
	}

	return toEntityTour(createTour), nil
}

func (repo *repository) GetTourById(ctx context.Context, tourId string) (*entity.Tour, error) {
	ID, err := uuid.Parse(tourId)
	if err != nil {
		return nil, err
	}

	tourById, err := repo.queries.GetTourByID(ctx, ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrTourNotFound
		}
		return nil, err
	}

	return toEntityTour(tourById), nil
}

func (repo *repository) UpdateTourAvailableSlot(ctx context.Context, tourId string, availableSlot int) (*entity.Tour, error) {
	ID, err := uuid.Parse(tourId)
	if err != nil {
		return nil, err
	}

	args := &sqlc.UpdateAvailableSlotParams{
		ID:            ID,
		AvailableSlot: int32(availableSlot),
	}

	tour, err := repo.queries.UpdateAvailableSlot(ctx, args)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrTourNotFound
		}
		return nil, err
	}

	return toEntityTour(tour), nil
}

func toEntityTour(t *sqlc.Tour) *entity.Tour {
	return &entity.Tour{
		ID:            t.ID,
		Name:          t.Name,
		Description:   t.Description,
		HostID:        t.HostID,
		Slot:          int(t.Slot),
		AvailableSlot: int(t.AvailableSlot),
		Price:         int(t.Price),
		Level:         t.Level,
		Distance:      int(t.Distance),
		Elevation:     int(t.Elevation),
		Duration:      t.Duration,
		Location:      t.Location,
		Images:        t.Images,
		Rate:          t.Rate,
		Status:        entity.TourStatus(t.Status),
		TimeStart:     t.StartAt,
		TimeEnd:       t.EndAt,
		CreatedAt:     t.CreatedAt,
		UpdatedAt:     t.UpdatedAt,
	}
}
