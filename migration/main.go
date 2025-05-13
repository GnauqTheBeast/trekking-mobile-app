package main

import (
	"fmt"
	"os"

	"github.com/trekking-mobile-app/migration/cmd/migrate"
	"github.com/urfave/cli/v2"
)

func main() {
	app := &cli.App{
		Name:  "Trekking App",
		Usage: "Migration tool",
		Action: func(*cli.Context) error {
			fmt.Println("use --help")
			return nil
		},
		Commands: []*cli.Command{
			migrate.NewCommand(),
		},
	}

	if err := app.Run(os.Args); err != nil {
		fmt.Println("[Main] Run CLI error:", err.Error())
		return
	}
}
