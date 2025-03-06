package main

import (
	"fmt"
	"github.com/trekking-mobile-app/cmd/api"
	"github.com/trekking-mobile-app/cmd/migrate"
	"github.com/trekking-mobile-app/internal/util/env"
	"github.com/urfave/cli/v2"
	"os"
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
			migrate.NewCommand(),
		},
		Metadata: map[string]interface{}{
			"version": "1.0.0",
		},
	}

	if err := app.Run(os.Args); err != nil {
		fmt.Println("[Main] Run CLI error:", err.Error())
		return
	}
}
