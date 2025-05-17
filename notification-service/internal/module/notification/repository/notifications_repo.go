package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/trekking-mobile-app/app/database/sqlc"
	"github.com/trekking-mobile-app/internal/module/notification/entity"
)

type repository struct {
	queries *sqlc.Queries
}

func NewPostgresRepo(db *sqlc.SQLRepository) *repository {
	return &repository{
		queries: sqlc.New(db.Client),
	}
}

func (repo *repository) InsertNotification(ctx context.Context, notification *entity.Notification) (*entity.Notification, error) {
	noti, err := repo.queries.CreateNotification(ctx, &sqlc.CreateNotificationParams{
		ID:          uuid.New(),
		UserID:      notification.UserID,
		Name:        notification.Name,
		Description: notification.Description,
	})
	if err != nil {
		return nil, err
	}

	return &entity.Notification{
		ID:          noti.ID,
		UserID:      noti.UserID,
		Name:        noti.Name,
		Description: noti.Description,
		CreatedAt:   noti.CreatedAt,
		UpdatedAt:   noti.UpdatedAt,
	}, nil
}

func (repo *repository) GetUserNotifications(ctx context.Context, userId uuid.UUID) ([]*entity.Notification, error) {
	noti, err := repo.queries.ListNotificationsByUser(ctx, userId)
	if err != nil {
		return nil, err
	}

	notifications := make([]*entity.Notification, len(noti))
	for i, n := range noti {
		notifications[i] = &entity.Notification{
			ID:          n.ID,
			UserID:      n.UserID,
			Name:        n.Name,
			Description: n.Description,
			CreatedAt:   n.CreatedAt,
			UpdatedAt:   n.UpdatedAt,
		}
	}

	return notifications, nil
}
