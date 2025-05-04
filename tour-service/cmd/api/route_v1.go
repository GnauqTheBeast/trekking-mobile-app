package api

import (
	"github.com/gin-gonic/gin"
	"github.com/trekking-mobile-app/internal/context"
	"github.com/trekking-mobile-app/internal/module/tour/business"
	"github.com/trekking-mobile-app/internal/module/tour/repository/postgres"
	"github.com/trekking-mobile-app/internal/module/tour/transport/rest"
)

type API interface {
	CreateTourHdl() gin.HandlerFunc
	ListTourHdl() gin.HandlerFunc
	GetTourHdl() gin.HandlerFunc
	UpdateTourHdl() gin.HandlerFunc
	DeleteTourHdl() gin.HandlerFunc
}

func startRouteV1(group *gin.RouterGroup) {
	repo := postgres.NewPostgresRepo(context.GetSQLClient())
	biz := business.NewBusiness(repo)
	tourService := rest.NewAPI(biz)

	tours := group.Group("/tours")
	{
		tours.POST("", tourService.CreateTourHdl())
		tours.GET("", tourService.ListTourHdl())
		tours.GET("/:id", tourService.GetTourHdl())
		tours.PATCH("/:id", tourService.UpdateTourHdl())
		tours.DELETE("/:id", tourService.DeleteTourHdl())
	}
}
