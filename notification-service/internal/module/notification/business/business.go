package business

import (
	"context"

	"github.com/google/uuid"
	"github.com/trekking-mobile-app/internal/module/notification/entity"
)

type Repository interface {
	GetUserNotifications(ctx context.Context, userId uuid.UUID) ([]*entity.Notification, error)
	InsertNotification(ctx context.Context, notification *entity.Notification) (*entity.Notification, error)
	UpdateNotification(ctx context.Context, notificationId uuid.UUID) error
	UpdateAllNotifications(ctx context.Context, notificationIds []uuid.UUID) error
}

type business struct {
	repo Repository
}

func NewBusiness(repo Repository) *business {
	return &business{
		repo: repo,
	}
}

func (b *business) CreateNotification(ctx context.Context, notification *entity.Notification) (*entity.Notification, error) {
	return b.repo.InsertNotification(ctx, notification)
}

func (b *business) GetUserNotifications(ctx context.Context, userId string) ([]*entity.Notification, error) {
	id, err := uuid.Parse(userId)
	if err != nil {
		return nil, err
	}
	return b.repo.GetUserNotifications(ctx, id)
}

func (b *business) ReadNotification(ctx context.Context, notificationId string) error {
	id := uuid.MustParse(notificationId)
	return b.repo.UpdateNotification(ctx, id)
}

func (b *business) ReadAllNotifications(ctx context.Context, notificationIds []string) error {
	ids := make([]uuid.UUID, len(notificationIds))
	var err error
	for i, id := range notificationIds {
		ids[i], err = uuid.Parse(id)
		if err != nil {
			return err
		}
	}
	return b.repo.UpdateAllNotifications(ctx, ids)
}
