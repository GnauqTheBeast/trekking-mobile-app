package rest

import (
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/trekking-mobile-app/internal/module/booking"
	"github.com/trekking-mobile-app/internal/module/booking/entity"
)

type api struct {
	biz booking.Business
}

func NewAPI(biz booking.Business) booking.API {
	return &api{
		biz: biz,
	}
}

func (a *api) CreateBookingHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		data := new(entity.Booking)
		if err := c.ShouldBindJSON(&data); err != nil {
			responseError(c, err)
			return
		}

		createdBooking, err := a.biz.CreateBooking(c, data)
		if err != nil {
			responseError(c, err)
			return
		}

		responseSuccess(c, createdBooking)
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
