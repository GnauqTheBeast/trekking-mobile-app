package api

import (
	"fmt"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/trekking-mobile-app/internal/context"
	"github.com/trekking-mobile-app/internal/dependencies"
	"github.com/trekking-mobile-app/middleware"
	"github.com/urfave/cli/v2"
)

func NewCommand() *cli.Command {
	return &cli.Command{
		Name:  "api",
		Usage: "start the API server",
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
	dependencies.Register(context.SetContextRedisClient)
	return dependencies.Init()
}

func start(c *cli.Context) error {
	router := gin.Default()
	router.RedirectTrailingSlash = true
	gin.SetMode(gin.DebugMode)
	router.Use(middleware.Cors())

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	fmt.Printf("ListenAndServe: %s\n", "8080")
	startRouteV1(router.Group("/api/v1"))

	return router.Run(":8080")
}
