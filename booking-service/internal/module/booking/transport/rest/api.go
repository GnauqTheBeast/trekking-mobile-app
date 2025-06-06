package rest

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	"github.com/trekking-mobile-app/internal/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/trekking-mobile-app/internal/module/booking/entity"
)

const (
	createBookingPermission = "create_booking"
)

type Business interface {
	RequestBooking(ctx context.Context, booking *entity.Booking) (*entity.Booking, error)
	GetBookingByID(ctx context.Context, bookingId string) (*entity.Booking, error)
	CancelBooking(ctx context.Context, bookingId string) (*entity.Booking, error)
	GetBookingByUserId(ctx context.Context, userId string) ([]*entity.Booking, error)
	PingNotificationService(ctx context.Context) error
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
// @Security BearerAuth
// @Router /api/v1/booking/create [post]
func (a *api) CreateBookingHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		_, exist := c.Get("userRole")
		if !exist {
			responseUnauthorized(c, fmt.Errorf("user role not found in context"))
			return
		}

		userPermissions, exist := c.Get("userPermissions")
		if !exist {
			responseUnauthorized(c, fmt.Errorf("user permissions not found in context"))
			return
		}

		if !utils.CheckUserPermission(createBookingPermission, userPermissions.([]string)) {
			responseForbidden(c, fmt.Errorf("user does not have permission to create tour"))
			return
		}

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
// @Security BearerAuth
// @Router /api/v1/booking/{id} [get]
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
// @Security BearerAuth
// @Router /api/v1/booking/{id}/cancel [post]
func (a *api) CancelBookingHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		_, exist := c.Get("userRole")
		if !exist {
			responseUnauthorized(c, fmt.Errorf("user role not found in context"))
			return
		}

		userPermissions, exist := c.Get("userPermissions")
		if !exist {
			responseUnauthorized(c, fmt.Errorf("user permissions not found in context"))
			return
		}

		if !utils.CheckUserPermission(createBookingPermission, userPermissions.([]string)) {
			responseForbidden(c, fmt.Errorf("user does not have permission to create tour"))
			return
		}

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

// PingNotificationServiceHdl godoc
// @Summary      Ping notification service
// @Description  Send a ping message to notification service via Redis
// @Tags         Notification
// @Accept       json
// @Produce      json
// @Success      200   {object} map[string]interface{}
// @Failure      400   {object} map[string]string
// @Router /api/v1/booking/ping-notification [get]
func (a *api) PingNotificationServiceHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		err := a.biz.PingNotificationService(c)
		if err != nil {
			responseError(c, err)
			return
		}
		c.JSON(http.StatusOK, gin.H{"status": "pong", "message": "pong"})
		return
	}
}

func (a *api) GetBookingByUserIdHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		userId := c.Param("userId")
		if userId == "" {
			responseError(c, errors.New("userId id required"))
			return
		}

		bookings, err := a.biz.GetBookingByUserId(c, userId)
		if err != nil {
			responseError(c, err)
			return
		}

		responseSuccess(c, bookings)
		return
	}
}
