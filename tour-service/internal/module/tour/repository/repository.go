// package repository

// import (
// 	"context"
// 	"errors"

// 	"github.com/trekking-mobile-app/app/database/sqlc"
// 	"github.com/trekking-mobile-app/app/model"
// 	"github.com/trekking-mobile-app/internal/module/tour"
// 	"github.com/trekking-mobile-app/internal/module/tour/entity"
// )

// var (
// 	ErrTourNotFound    = errors.New("tour not found")
// 	ErrInvalidTourData = errors.New("invalid tour data")
// )

// type postgresRepo struct {
// 	querier sqlc.Querier
// }

// func NewPostgresRepo(db *sqlc.SQLRepository) tour.Repository {
// 	if db == nil {
// 		panic("db connection is required")
// 	}
// 	return &postgresRepo{
// 		querier: db.Client,
// 	}
// }

// func (repo *postgresRepo) FindTour(ctx context.Context, paging *model.Paging) ([]*entity.Tour, error) {
// 	tours, err := repo.querier.ListTours(ctx, sqlc.ListToursParams{
// 		Limit:  int32(paging.Limit),
// 		Offset: int32(paging.Offset),
// 	})
// 	if err != nil {
// 		return nil, err
// 	}

// 	result := make([]*entity.Tour, len(tours))
// 	for i, t := range tours {
// 		result[i] = &entity.Tour{
// 			Id:          t.ID,
// 			Title:       t.Title,
// 			Description: t.Description,
// 			Status:      entity.TourStatus(t.Status),
// 			CreatedAt:   t.CreatedAt,
// 			UpdatedAt:   t.UpdatedAt,
// 		}
// 	}
// 	return result, nil
// }

// func (repo *postgresRepo) UpdateTour(ctx context.Context, tourID string, data *entity.TourPatchData) error {
// 	if data == nil {
// 		return ErrInvalidTourData
// 	}

// 	var title, description, status interface{}
// 	if data.Title != nil {
// 		title = *data.Title
// 	}
// 	if data.Description != nil {
// 		description = *data.Description
// 	}
// 	if data.Status != nil {
// 		status = string(*data.Status)
// 	}

// 	rowsAffected, err := repo.querier.UpdateTour(ctx, sqlc.UpdateTourParams{
// 		Title:       title.(string),
// 		Description: description.(string),
// 		Status:      status.(string),
// 		ID:          tourID,
// 	})
// 	if err != nil {
// 		return err
// 	}
// 	if rowsAffected == 0 {
// 		return ErrTourNotFound
// 	}
// 	return nil
// }

// func (repo *postgresRepo) DeleteTour(ctx context.Context, tourID string) error {
// 	rowsAffected, err := repo.querier.DeleteTour(ctx, tourID)
// 	if err != nil {
// 		return err
// 	}
// 	if rowsAffected == 0 {
// 		return ErrTourNotFound
// 	}
// 	return nil
// }

// // InsertNewTour creates a new tour record in the database
// func (repo *postgresRepo) InsertNewTour(ctx context.Context, data *entity.Tour) error {
// 	if data == nil {
// 		return ErrInvalidTourData
// 	}

// 	return repo.querier.CreateTour(ctx, sqlc.CreateTourParams{
// 		ID:          data.Id,
// 		Title:       data.Title,
// 		Description: data.Description,
// 		Status:      string(data.Status),
// 		CreatedAt:   data.CreatedAt,
// 	})
// }

// func (repo *postgresRepo) GetTourByID(ctx context.Context, tourID string) (*entity.Tour, error) {
// 	tour, err := repo.querier.GetTourByID(ctx, tourID)
// 	if err != nil {
// 		return nil, ErrTourNotFound
// 	}

// 	return &entity.Tour{
// 		Id:          tour.ID,
// 		Title:       tour.Title,
// 		Description: tour.Description,
// 		Status:      entity.TourStatus(tour.Status),
// 		CreatedAt:   tour.CreatedAt,
// 		UpdatedAt:   tour.UpdatedAt,
// 	}, nil
// }