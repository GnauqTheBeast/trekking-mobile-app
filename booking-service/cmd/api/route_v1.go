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
	bookingService := rest.NewAPI(biz)

	booking := group.Group("/booking")
	{
		booking.POST("/create", bookingService.CreateBookingHdl())
		booking.GET("/:id", bookingService.GetBookingByID())
	}
}
