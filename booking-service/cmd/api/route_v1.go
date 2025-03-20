package api

import (
	"github.com/gin-gonic/gin"
	"github.com/trekking-mobile-app/internal/context"
	"github.com/trekking-mobile-app/internal/module/booking/business"
	"github.com/trekking-mobile-app/internal/module/booking/repository"
	"github.com/trekking-mobile-app/internal/module/booking/transport/rest"
)

func startRouteV1(group *gin.RouterGroup) {
	repo := repository.NewPostgresRepo(context.GetSQLClient())
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
