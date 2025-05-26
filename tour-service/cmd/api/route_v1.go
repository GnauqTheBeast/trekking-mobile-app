package api

import (
	"github.com/gin-gonic/gin"
	"github.com/trekking-mobile-app/internal/context"
	"github.com/trekking-mobile-app/internal/module/tour/business"
	"github.com/trekking-mobile-app/internal/module/tour/repository/postgres"
	"github.com/trekking-mobile-app/internal/module/tour/transport/rest"
	"github.com/trekking-mobile-app/middleware"
)

type API interface {
	CreateTourHdl() gin.HandlerFunc
	ListTourHdl() gin.HandlerFunc
	GetTourHdl() gin.HandlerFunc
	UpdateTourHdl() gin.HandlerFunc
	DeleteTourHdl() gin.HandlerFunc
	ListTourByHostIdHdl() gin.HandlerFunc
}

func startRouteV1(group *gin.RouterGroup) {
	repo := postgres.NewPostgresRepo(context.GetSQLClient())
	biz := business.NewBusiness(repo, context.GetRedisClient())
	tourService := rest.NewAPI(biz)

	tours := group.Group("/tours")
	{
		// Unauthenticated routes
		tours.GET("", tourService.ListTourHdl())    // /api/v1/tours
		tours.GET("/:id", tourService.GetTourHdl()) // /api/v1/tours/:id

		// Authenticated routes
		authTours := tours.Group("")
		authTours.PATCH("/:tourId", tourService.UpdateTourHdl()) // /api/v1/tours/:tourId
		authTours.DELETE("/:id", tourService.DeleteTourHdl())    // /api/v1/tours/:id
		authTours.Use(middleware.RequireAuth(authGrpcClient()))
		{
			authTours.POST("", tourService.CreateTourHdl()) // /api/v1/tours
		}
	}

	host := group.Group("/:hostId")
	// host.Use(middleware.RequireAuth(authGrpcClient()))
	{
		host.GET("/tours", tourService.ListTourByHostIdHdl())
	}
}
