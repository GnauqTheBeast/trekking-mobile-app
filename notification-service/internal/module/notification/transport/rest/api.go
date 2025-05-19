package rest

import (
	"context"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/trekking-mobile-app/internal/module/notification/entity"
)

type Business interface {
	GetUserNotifications(ctx context.Context, userId string) ([]*entity.Notification, error)
	ReadNotification(ctx context.Context, notificationId string) error
}

type api struct {
	biz Business
}

func NewAPI(biz Business) *api {
	return &api{
		biz: biz,
	}
}

// PingHealthCheckHdl godoc
// @Summary Kiểm tra trạng thái hoạt động của API
// @Description Trả về "pong" nếu API đang hoạt động
// @Tags Health
// @Accept json
// @Produce json
// @Success 200 {object} map[string]string
// @Router /api/v1/notifications/ping [get]
func (a *api) PingHealthCheckHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	}
}

// GetUserNotificationsHdl godoc
// @Summary Lấy danh sách thông báo của người dùng
// @Description Trả về danh sách thông báo dựa theo userId
// @Tags Notifications
// @Accept json
// @Produce json
// @Param userId path string true "User ID"
// @Success 200 {array} entity.Notification
// @Failure 400 {object} map[string]string
// @Security BearerAuth
// @Router /api/v1/notifications/{userId} [get]
func (a *api) GetUserNotificationsHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		userId := c.Param("userId")
		if userId == "" {
			responseErrorWithMessage(c, "userId is required")
			return
		}

		noti, err := a.biz.GetUserNotifications(c, userId)
		if err != nil {
			fmt.Println("error:", err)
			responseErrorWithMessage(c, err.Error())
			return
		}

		responseSuccess(c, noti)
		return
	}
}

func (a *api) ReadNotificationHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		notificationId := c.Param("notificationId")
		if notificationId == "" {
			responseErrorWithMessage(c, "notificationId is required")
			return
		}

		err := a.biz.ReadNotification(c, notificationId)
		if err != nil {
			fmt.Println("error reading notification:", err)
			responseErrorWithMessage(c, err.Error())
			return
		}

		responseSuccessWithMessage(c, "notification successfully read")
		return
	}
}
