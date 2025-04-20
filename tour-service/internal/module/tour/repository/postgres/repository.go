package postgres

import (
	"context"
	"database/sql"
	"errors"
	"github.com/google/uuid"
	"github.com/trekking-mobile-app/internal/pkg/paging"
	"time"

	"github.com/trekking-mobile-app/app/database/sqlc"
	"github.com/trekking-mobile-app/internal/module/tour/entity"
)

var (
	ErrTourNotFound    = errors.New("booking not found")
	ErrInvalidTourData = errors.New("invalid booking data")
)

type Repository interface {
	InsertNewTour(ctx context.Context, data *entity.TourCreateData) (*entity.Tour, error)
	GetTourByID(ctx context.Context, tourID string) (*entity.Tour, error)
	ListTours(ctx context.Context, paging *paging.Paging) ([]*entity.Tour, error)
	UpdateTour(ctx context.Context, tourID string, data *entity.TourPatchData) error
	DeleteTour(ctx context.Context, tourID string) error
}

type repository struct {
	queries *sqlc.Queries
}

func NewPostgresRepo(db *sqlc.SQLRepository) *repository {
	if db == nil {
		panic("db connection is required")
	}
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
		result[i] = &entity.Tour{
			ID:          t.ID,
			Name:        t.Name,
			Description: t.Description,
			Status:      entity.TourStatus(t.Status),
			CreatedAt:   t.CreatedAt,
		}
	}

	return result, nil
}

func (repo *repository) UpdateTour(ctx context.Context, tourID string, data *entity.TourPatchData) error {
	if data == nil {
		return ErrInvalidTourData
	}

	id, err := uuid.Parse(tourID)
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
		Slot:        data.Slot,
		Status:      string(data.Status),
		StartAt:     data.TimeStart,
		EndAt:       data.TimeEnd,
		UpdatedAt:   tourByID.UpdatedAt,
	})
}

func (repo *repository) DeleteTour(ctx context.Context, tourID string) error {
	id, err := uuid.Parse(tourID)
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

func (repo *repository) InsertNewTour(ctx context.Context, data *entity.TourCreateData) (*entity.Tour, error) {
	if data == nil {
		return nil, ErrInvalidTourData
	}

	createTour, err := repo.queries.CreateTour(ctx, &sqlc.CreateTourParams{
		ID:          uuid.New(),
		Name:        data.Name,
		Description: data.Description,
		HostID:      data.HostID,
		Slot:        data.Slot,
		Status:      string(data.Status),
		StartAt:     data.TimeStart,
		EndAt:       data.TimeEnd,
		UpdatedAt:   time.Now(),
		CreatedAt:   time.Now(),
	})

	return &entity.Tour{
		ID:          createTour.ID,
		Name:        createTour.Name,
		HostID:      createTour.HostID,
		Description: createTour.Description,
		Status:      entity.TourStatus(createTour.Status),
		Slot:        createTour.Slot,
		TimeStart:   createTour.StartAt,
		TimeEnd:     createTour.EndAt,
		CreatedAt:   createTour.CreatedAt,
		UpdatedAt:   createTour.UpdatedAt,
	}, err
}

func (repo *repository) GetTourByID(ctx context.Context, tourID string) (*entity.Tour, error) {
	ID, err := uuid.Parse(tourID)
	if err != nil {
		return nil, err
	}

	tourByID, err := repo.queries.GetTourByID(ctx, ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrTourNotFound
		}
		return nil, err
	}

	return &entity.Tour{
		ID:          tourByID.ID,
		Name:        tourByID.Name,
		Description: tourByID.Description,
		Status:      entity.TourStatus(tourByID.Status),
		Slot:        tourByID.Slot,
		CreatedAt:   tourByID.CreatedAt,
		UpdatedAt:   tourByID.UpdatedAt,
	}, nil
}
