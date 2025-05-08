package ws

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, ws *WS) {
	r.GET("/ws", ws.wsHandler)
}
