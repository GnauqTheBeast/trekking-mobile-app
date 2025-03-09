package business

import (
	"context"
	"github.com/trekking-mobile-app/app/model"
	"github.com/trekking-mobile-app/internal/module/tour"
	"github.com/trekking-mobile-app/internal/module/tour/entity"
)

type business struct {
	repository tour.Repository
}

func NewBusiness(repository tour.Repository) tour.Business {
	return &business{
		repository: repository,
	}
}

func (b *business) CreateNewTour(ctx context.Context, data *entity.Tour) error {
	//TODO implement me
	panic("implement me")
}

func (b *business) ListTours(ctx context.Context, paging *model.Paging) ([]*entity.Tour, error) {
	//TODO implement me
	panic("implement me")
}

func (b *business) GetTourDetails(ctx context.Context, tourID string) (*entity.Tour, error) {
	//TODO implement me
	panic("implement me")
}

func (b *business) UpdateTour(ctx context.Context, tourID string, data *entity.TourPatchData) error {
	//TODO implement me
	panic("implement me")
}

func (b *business) DeleteTour(ctx context.Context, tourID string) error {
	//TODO implement me
	panic("implement me")
}
