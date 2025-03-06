package api

import (
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/urfave/cli/v2"
	"strings"
	"time"
)

const (
	argsAddr = "addr"
)

func NewCommand() *cli.Command {
	return &cli.Command{
		Name:  "api",
		Usage: "start the API server",
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:  argsAddr,
				Value: "0.0.0.0:8080",
				Usage: "serve address",
			},
		},
		Action: func(c *cli.Context) error {
			return start(c)
		},
		Before: func(c *cli.Context) error {
			return beforeCommand()
		},
	}
}

func beforeCommand() error {
	return nil
}

func start(c *cli.Context) error {
	router := gin.Default()
	router.RedirectTrailingSlash = true
	gin.SetMode(gin.DebugMode)

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"*"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	addr := strings.ToLower(c.String(argsAddr))
	if addr == "" {
		return fmt.Errorf("[API Server] start error: addr is empty")
	}
	fmt.Printf("ListenAndServe: %s\n", addr)

	startRouteV1(router.Group("/api/v1"))

	return router.Run(addr)
}
