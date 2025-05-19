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
		IsRead:      false,
	})
	if err != nil {
		return nil, err
	}

	return toNotificationEntity(noti), nil
}

func (repo *repository) GetUserNotifications(ctx context.Context, userId uuid.UUID) ([]*entity.Notification, error) {
	noti, err := repo.queries.ListNotificationsByUser(ctx, userId)
	if err != nil {
		return nil, err
	}

	notifications := make([]*entity.Notification, len(noti))
	for i, n := range noti {
		notifications[i] = toNotificationEntity(n)
	}

	return notifications, nil
}

func (repo *repository) UpdateNotification(ctx context.Context, notificationId string) error {
	id, err := uuid.Parse(notificationId)
	if err != nil {
		return err
	}
	return repo.queries.ReadNotification(ctx, id)
}

func toNotificationEntity(noti *sqlc.Notification) *entity.Notification {
	return &entity.Notification{
		ID:          noti.ID,
		UserID:      noti.UserID,
		Name:        noti.Name,
		Description: noti.Description,
		IsRead:      noti.IsRead,
		CreatedAt:   noti.CreatedAt,
		UpdatedAt:   noti.UpdatedAt,
	}
}
