package api

import (
	"github.com/gin-gonic/gin"
	"github.com/trekking-mobile-app/internal/context"
	"github.com/trekking-mobile-app/internal/module/tour/business"
	"github.com/trekking-mobile-app/internal/module/tour/repository"
	"github.com/trekking-mobile-app/internal/module/tour/transport/rest"
)

func startRouteV1(group *gin.RouterGroup) {
	tourService := rest.NewAPI(business.NewBusiness(repository.NewPostgresRepo(context.GetSQLClient())))
	group.Use()
	{
		group.GET("/ping", tourService.Ping())
		group.GET("/tour", tourService.GetTourHdl())
	}
}
