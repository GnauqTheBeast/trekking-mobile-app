package main

import (
	"fmt"
	"github.com/trekking-mobile-app/migration/cmd/migrate"
	"github.com/urfave/cli/v2"
	"os"
)

func main() {
	app := &cli.App{
		Name:  "Trekking App",
		Usage: "App tool",
		Action: func(*cli.Context) error {
			fmt.Println("use --help")
			return nil
		},
		Commands: []*cli.Command{
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
