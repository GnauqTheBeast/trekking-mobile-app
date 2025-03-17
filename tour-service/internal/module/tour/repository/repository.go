package repository

import (
	"context"
	"database/sql"
	"errors"
	"github.com/google/uuid"

	"github.com/trekking-mobile-app/app/database/sqlc"
	"github.com/trekking-mobile-app/app/model"
	"github.com/trekking-mobile-app/internal/module/tour"
	"github.com/trekking-mobile-app/internal/module/tour/entity"
)

var (
	ErrTourNotFound    = errors.New("tour not found")
	ErrInvalidTourData = errors.New("invalid tour data")
)

type postgresRepo struct {
	queries *sqlc.Queries
}

func NewPostgresRepo(db *sqlc.SQLRepository) tour.Repository {
	if db == nil {
		panic("db connection is required")
	}
	return &postgresRepo{
		queries: sqlc.New(db.Client),
	}
}

func (repo *postgresRepo) ListTours(ctx context.Context, paging *model.Paging) ([]*entity.Tour, error) {
	tours, err := repo.queries.ListTours(ctx, &sqlc.ListToursParams{
		Limit:  paging.Limit,
		Offset: paging.Offset,
	})
	if err != nil {
		return nil, err
	}

	result := make([]*entity.Tour, len(tours))
	for i, t := range tours {
		result[i] = &entity.Tour{
			ID:          t.ID,
			Name:        t.Name,
			Description: t.Description.String,
			Status:      entity.TourStatus(t.Status),
			CreatedAt:   t.CreatedAt,
		}
	}

	return result, nil
}

func (repo *postgresRepo) UpdateTour(ctx context.Context, tourID string, data *entity.TourPatchData) error {
	if data == nil {
		return ErrInvalidTourData
	}

	id, err := uuid.Parse(tourID)
	if err != nil {
		return ErrInvalidTourData
	}

	tourByID, err := repo.queries.GetTourByID(ctx, id)
	if err != nil {
		return ErrTourNotFound
	}

	return repo.queries.UpdateTour(ctx, &sqlc.UpdateTourParams{
		ID:   id,
		Name: data.Name,
		Description: sql.NullString{
			String: data.Description,
			Valid:  true,
		},
		Slot:   data.Slot,
		Status: string(data.Status),
		StartAt: sql.NullTime{
			Valid: true,
			Time:  data.TimeStart,
		},
		EndAt: sql.NullTime{
			Valid: true,
			Time:  data.TimeEnd,
		},
		UpdatedAt: tourByID.UpdatedAt,
	})
}

func (repo *postgresRepo) DeleteTour(ctx context.Context, tourID string) error {
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

func (repo *postgresRepo) InsertNewTour(ctx context.Context, data *entity.Tour) error {
	if data == nil {
		return ErrInvalidTourData
	}

	return repo.queries.CreateTour(ctx, &sqlc.CreateTourParams{
		ID:   data.ID,
		Name: data.Name,
		Description: sql.NullString{
			String: data.Description,
			Valid:  true,
		},
		Host: data.HostID,
		Slot: data.Slot,
		StartAt: sql.NullTime{
			Valid: true,
			Time:  data.TimeStart,
		},
		EndAt: sql.NullTime{
			Valid: true,
			Time:  data.TimeEnd,
		},
	})
}

func (repo *postgresRepo) GetTourByID(ctx context.Context, tourID string) (*entity.Tour, error) {
	ID, err := uuid.Parse(tourID)
	if err != nil {
		return nil, err
	}

	tourByID, err := repo.queries.GetTourByID(ctx, ID)
	if err != nil {
		return nil, ErrTourNotFound
	}

	return &entity.Tour{
		ID:          tourByID.ID,
		Name:        tourByID.Name,
		Description: tourByID.Description.String,
		Status:      entity.TourStatus(tourByID.Status),
		Slot:        tourByID.Slot,
		CreatedAt:   tourByID.CreatedAt,
		UpdatedAt:   tourByID.UpdatedAt.Time,
	}, nil
}
