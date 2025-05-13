package main

import (
	"fmt"
	"os"

	"github.com/trekking-mobile-app/cmd/api"
	_ "github.com/trekking-mobile-app/docs"
	"github.com/trekking-mobile-app/internal/pkg/env"
	"github.com/urfave/cli/v2"
)

func init() {
	env.LoadOnce()
}

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
		},
	}

	if err := app.Run(os.Args); err != nil {
		fmt.Println("[Main] Run CLI error:", err.Error())
		return
	}
}
