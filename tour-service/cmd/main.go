package main

import (
	"fmt"
	"os"

	"github.com/trekking-mobile-app/cmd/api"
	"github.com/trekking-mobile-app/cmd/rpc"
	_ "github.com/trekking-mobile-app/docs"
	"github.com/trekking-mobile-app/internal/pkg/env"
	"github.com/urfave/cli/v2"
)

func init() {
	env.LoadOnce()
}

// @title Tour API
// @version 1.0
// @description API cho hệ thống booking tour
// @BasePath /api/v1

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main() {
	app := &cli.App{
		Name:  "Trekking App",
		Usage: "App tool",
		Action: func(*cli.Context) error {
			fmt.Println("use --help")
			return nil
		},
		Commands: []*cli.Command{
			api.NewCommand(),
			rpc.NewCommand(),
		},
	}

	if err := app.Run(os.Args); err != nil {
		fmt.Println("[Main] Run CLI error:", err.Error())
		return
	}
}
