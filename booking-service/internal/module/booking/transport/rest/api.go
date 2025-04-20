package rest

import (
	"context"
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/trekking-mobile-app/internal/module/booking/entity"
)

type Business interface {
	RequestBooking(ctx context.Context, booking *entity.Booking) error
	GetBookingByID(ctx context.Context, bookingID string) (*entity.Booking, error)
}

type api struct {
	biz Business
}

func NewAPI(biz Business) *api {
	return &api{
		biz: biz,
	}
}

func (a *api) CreateBookingHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		data := new(entity.Booking)
		data.ID = uuid.New()
		if err := c.ShouldBindJSON(&data); err != nil {
			responseError(c, err)
			return
		}

		err := a.biz.RequestBooking(c, data)
		if err != nil {
			responseError(c, err)
			return
		}

		responseAccepted(c, data)
		return
	}
}

func (a *api) GetBookingByID() gin.HandlerFunc {
	return func(c *gin.Context) {
		bookingID := c.Param("id")
		if bookingID == "" {
			responseError(c, errors.New("bookingByID id required"))
			return
		}

		_, err := uuid.Parse(bookingID)
		if err != nil {
			responseError(c, errors.New("invalid bookingByID id"))
			return
		}

		bookingByID, err := a.biz.GetBookingByID(c, bookingID)
		if err != nil {
			responseNotFound(c, err)
			return
		}

		responseSuccess(c, bookingByID)
		return
	}
}
