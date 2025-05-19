package api

import (
	"github.com/gin-gonic/gin"
	"github.com/trekking-mobile-app/internal/context"
	"github.com/trekking-mobile-app/internal/module/notification/business"
	"github.com/trekking-mobile-app/internal/module/notification/repository"
	"github.com/trekking-mobile-app/internal/module/notification/transport/rest"
	"github.com/trekking-mobile-app/internal/module/notification/transport/ws"
)

type API interface {
	PingHealthCheckHdl() gin.HandlerFunc
	GetUserNotificationsHdl() gin.HandlerFunc
	ReadNotificationHdl() gin.HandlerFunc
}

func RegisterRoutes(router *gin.Engine, ws *ws.WS) {
	router.GET("/ws", ws.WsHandler)
	startRouteV1(router.Group("/api/v1"))
}

func startRouteV1(group *gin.RouterGroup) {
	repo := repository.NewPostgresRepo(context.GetSQLClient())
	biz := business.NewBusiness(repo)
	api := rest.NewAPI(biz)

	noti := group.Group("/notifications")
	{
		noti.GET("/ping", api.PingHealthCheckHdl())
		noti.GET("/:userId", api.GetUserNotificationsHdl())
		noti.POST("/:notificationId", api.ReadNotificationHdl())
	}
}
