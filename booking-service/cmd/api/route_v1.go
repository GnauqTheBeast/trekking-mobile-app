package api

import (
	"github.com/gin-gonic/gin"
	"github.com/trekking-mobile-app/internal/context"
	"github.com/trekking-mobile-app/internal/module/booking/business"
	"github.com/trekking-mobile-app/internal/module/booking/repository"
	"github.com/trekking-mobile-app/internal/module/booking/transport/rest"
	"github.com/trekking-mobile-app/middleware"
)

type API interface {
	CreateBookingHdl() gin.HandlerFunc
	GetBookingByIdHdl() gin.HandlerFunc
	CancelBookingHdl() gin.HandlerFunc
	PingNotificationServiceHdl() gin.HandlerFunc
}

func startRouteV1(group *gin.RouterGroup) {
	tourRepo := tourGrpcClient()
	repo := repository.NewPostgresRepo(context.GetSQLClient())
	biz := business.NewBusiness(repo, tourRepo, context.GetContextPubSubClient())
	bookingService := rest.NewAPI(biz)

	booking := group.Group("/booking")
	{
		// Unauthenticated route
		// For development testing
		booking.GET("/ping-notification", bookingService.PingNotificationServiceHdl()) // /api/v1/booking/ping-notification

		// Authenticated routes
		authBooking := booking.Group("")
		authBooking.Use(middleware.RequireAuth(authGrpcClient())) // comment for developing
		{
			authBooking.POST("/create", bookingService.CreateBookingHdl())     // /api/v1/booking/create
			authBooking.GET("/:id", bookingService.GetBookingByIdHdl())        // /api/v1/booking/:id
			authBooking.POST("/:id/cancel", bookingService.CancelBookingHdl()) // /api/v1/booking/:id
		}
	}
}
