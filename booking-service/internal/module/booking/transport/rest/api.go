package rest

import (
	"context"
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/trekking-mobile-app/internal/module/booking/entity"
)

type Business interface {
	RequestBooking(ctx context.Context, booking *entity.Booking) (*entity.Booking, error)
	GetBookingByID(ctx context.Context, bookingId string) (*entity.Booking, error)
	CancelBooking(ctx context.Context, bookingId string) (*entity.Booking, error)
}

type api struct {
	biz Business
}

func NewAPI(biz Business) *api {
	return &api{
		biz: biz,
	}
}

// CreateBookingHdl godoc
// @Summary Tạo booking mới
// @Description Gửi yêu cầu đặt tour
// @Tags Booking
// @Accept json
// @Produce json
// @Param booking body entity.Booking true "Thông tin booking"
// @Success 202 {object} entity.Booking
// @Failure 400 {object} map[string]string
// @Router /bookings [post]
func (a *api) CreateBookingHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		data := new(entity.Booking)
		data.Id = uuid.New()
		if err := c.ShouldBindJSON(&data); err != nil {
			responseError(c, err)
			return
		}

		booking, err := a.biz.RequestBooking(c, data)
		if err != nil {
			responseError(c, err)
			return
		}

		responseAccepted(c, booking)
		return
	}
}

// GetBookingByIdHdl godoc
// @Summary Lấy thông tin booking
// @Description Truy vấn chi tiết booking theo ID
// @Tags Booking
// @Accept json
// @Produce json
// @Param id path string true "Booking ID"
// @Success 200 {object} entity.Booking
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /bookings/{id} [get]
func (a *api) GetBookingByIdHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		bookingId := c.Param("id")
		if bookingId == "" {
			responseError(c, errors.New("bookingId id required"))
			return
		}

		_, err := uuid.Parse(bookingId)
		if err != nil {
			responseError(c, errors.New("invalid bookingId"))
			return
		}

		bookingByID, err := a.biz.GetBookingByID(c, bookingId)
		if err != nil {
			responseNotFound(c, err)
			return
		}

		responseSuccess(c, bookingByID)
		return
	}
}

// CancelBookingHdl godoc
// @Summary Hủy booking
// @Description Hủy booking theo ID
// @Tags Booking
// @Accept json
// @Produce json
// @Param id path string true "Booking ID"
// @Success 200 {object} entity.Booking
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /bookings/{id}/cancel [post]
func (a *api) CancelBookingHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		bookingId := c.Param("id")
		if bookingId == "" {
			responseError(c, errors.New("bookingId id required"))
			return
		}

		_, err := uuid.Parse(bookingId)
		if err != nil {
			responseError(c, errors.New("invalid bookingId id"))
			return
		}

		bookingById, err := a.biz.CancelBooking(c, bookingId)
		if err != nil {
			responseError(c, err)
		}

		responseSuccess(c, bookingById)
		return
	}
}
