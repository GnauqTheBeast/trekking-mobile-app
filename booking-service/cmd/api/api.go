package api

import (
	"github.com/gin-gonic/gin"
	"github.com/trekking-mobile-app/internal/context"
	"github.com/trekking-mobile-app/internal/dependencies"
	"github.com/trekking-mobile-app/middleware"
	"github.com/urfave/cli/v2"
)

func NewCommand() *cli.Command {
	return &cli.Command{
		Name:  "api",
		Usage: "start the booking-service",
		Action: func(c *cli.Context) error {
			return start(c)
		},
		Before: func(c *cli.Context) error {
			return beforeCommand()
		},
	}
}

func beforeCommand() error {
	dependencies.Register(context.SetContextSQL)
	dependencies.Register(context.SetContextKafkaProducer)
	return dependencies.Init()
}

func start(c *cli.Context) error {
	router := gin.Default()
	router.RedirectTrailingSlash = true
	gin.SetMode(gin.DebugMode)
	router.Use(middleware.Cors())

	startRouteV1(router.Group("/api/v1"))

	return router.Run("localhost:8081")
}
