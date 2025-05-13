package api

import (
	"github.com/gin-gonic/gin"
	"github.com/trekking-mobile-app/internal/module/notification/transport/ws"
)

type API interface {
	GetUserNotificationsHdl() gin.HandlerFunc
}

func RegisterRoutes(router *gin.Engine, ws *ws.WS) {
	router.GET("/ws", ws.WsHandler)
	startRouteV1(router.Group("/api/v1"))
}

func startRouteV1(group *gin.RouterGroup) {
	noti := group.Group("/notifications")
	{
		noti.GET("/ping", func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "pong"})
		})
	}
}
