package business

import (
	"context"
	"github.com/trekking-mobile-app/internal/module/booking"
	"github.com/trekking-mobile-app/internal/module/booking/entity"
	"github.com/trekking-mobile-app/internal/pkg/paging"
)

type business struct {
	repository booking.Repository
}

func NewBusiness(repository booking.Repository) booking.Business {
	if repository == nil {
		panic("repository is required")
	}
	return &business{
		repository: repository,
	}
}

func (b *business) ListBookings(ctx context.Context, paging *paging.Paging) ([]*entity.Booking, error) {
	// Todo: Validate paging
	return b.repository.ListBookings(ctx, paging)
}

func (b *business) CreateBooking(ctx context.Context, booking *entity.Booking) (*entity.Booking, error) {
	// Todo: Validate booking object
	return b.repository.InsertNewBooking(ctx, booking)
}
