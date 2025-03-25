package booking

import (
	"context"
	"github.com/gin-gonic/gin"
	"github.com/trekking-mobile-app/internal/module/booking/entity"
)

type Repository interface {
	InsertNewBooking(ctx context.Context, booking *entity.Booking) (*entity.Booking, error)
	GetBookingByID(ctx context.Context, bookingID string) (*entity.Booking, error)
}

type Business interface {
	CreateBooking(ctx context.Context, booking *entity.Booking) (*entity.Booking, error)
	GetBookingByID(ctx context.Context, bookingID string) (*entity.Booking, error)
}

type RPCBusiness interface {
	CheckBooking(ctx context.Context, booking *entity.Booking) (*entity.Booking, error)
}

type API interface {
	CreateBookingHdl() gin.HandlerFunc
	GetBookingByID() gin.HandlerFunc
}
