package repository

import (
	"context"
	"github.com/trekking-mobile-app/app/database/sqlc"
	"github.com/trekking-mobile-app/app/model"
	"github.com/trekking-mobile-app/internal/module/tour"
	"github.com/trekking-mobile-app/internal/module/tour/entity"
)

type postgresRepo struct {
	db *sqlc.SQLRepository
}

func NewPostgresRepo(db *sqlc.SQLRepository) tour.Repository {
	return &postgresRepo{
		db: db,
	}
}

func (repo *postgresRepo) FindTour(ctx context.Context, paging *model.Paging) ([]*entity.Tour, error) {
	//TODO implement me
	panic("implement me")
}

func (repo *postgresRepo) UpdateTour(ctx context.Context, tourID int64, data *entity.TourPatchData) error {
	//TODO implement me
	panic("implement me")
}

func (repo *postgresRepo) DeleteTour(ctx context.Context, tourID int64) error {
	//TODO implement me
	panic("implement me")
}

func (repo *postgresRepo) InsertNewTour(ctx context.Context, data *entity.Tour) error {
	repo.db.Client.QueryRow(data.TableName())
	return nil
}

func (repo *postgresRepo) GetTourByID(ctx context.Context, tourID int64) (*entity.Tour, error) {
	//TODO implement me
	panic("implement me")
}
