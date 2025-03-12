package api

import (
	"github.com/gin-gonic/gin"
	"github.com/trekking-mobile-app/internal/module/tour/business"
	"github.com/trekking-mobile-app/internal/module/tour/repository/mock"
	"github.com/trekking-mobile-app/internal/module/tour/transport/rest"
)

func startRouteV1(group *gin.RouterGroup) {
	tourService := rest.NewAPI(business.NewBusiness(mock.New()))

	tours := group.Group("/tours")
	{
		tours.POST("", tourService.CreateTourHdl())
		tours.GET("", tourService.ListTourHdl())
		tours.GET("/:id", tourService.GetTourHdl())
		tours.PATCH("/:id", tourService.UpdateTourHdl())
		tours.DELETE("/:id", tourService.DeleteTourHdl())
	}

	group.GET("/ping", tourService.Ping())
}
