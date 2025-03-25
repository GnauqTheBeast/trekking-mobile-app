package business

import (
	"context"
	"github.com/trekking-mobile-app/internal/module/booking"
	"github.com/trekking-mobile-app/internal/module/booking/entity"
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

func (b *business) GetBookingByID(ctx context.Context, bookingID string) (*entity.Booking, error) {
	return b.repository.GetBookingByID(ctx, bookingID)
}

func (b *business) CreateBooking(ctx context.Context, booking *entity.Booking) (*entity.Booking, error) {
	return b.repository.InsertNewBooking(ctx, booking)
}
