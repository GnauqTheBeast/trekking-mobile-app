package rest

import (
	"github.com/gin-gonic/gin"
	"github.com/trekking-mobile-app/internal/module/booking"
	"github.com/trekking-mobile-app/internal/module/booking/entity"
	"github.com/trekking-mobile-app/internal/pkg/paging"
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

func (a *api) ListBookingHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		bookings, err := a.biz.ListBookings(c, paging.GetQueryPaging(c))
		if err != nil {
			return
		}

		responseSuccess(c, bookings)
		return
	}
}
