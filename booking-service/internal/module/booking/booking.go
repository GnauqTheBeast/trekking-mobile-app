package booking

import (
	"context"
	"github.com/trekking-mobile-app/internal/pkg/paging"

	"github.com/gin-gonic/gin"
	"github.com/trekking-mobile-app/internal/module/booking/entity"
)

type Repository interface {
	InsertNewBooking(ctx context.Context, booking *entity.Booking) (*entity.Booking, error)
	ListBookings(ctx context.Context, paging *paging.Paging) ([]*entity.Booking, error)
}

type Business interface {
	CreateBooking(ctx context.Context, booking *entity.Booking) (*entity.Booking, error)
	ListBookings(ctx context.Context, paging *paging.Paging) ([]*entity.Booking, error)
}

type API interface {
	CreateBookingHdl() gin.HandlerFunc
	ListBookingHdl() gin.HandlerFunc
}
