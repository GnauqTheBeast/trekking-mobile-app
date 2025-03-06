package migrate

import (
	"database/sql"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
	"github.com/urfave/cli/v2"
)

const (
	argsMigrateUp   = "migrate-up"
	argsMigrateDown = "migrate-down"
	migrationsDir   = "file://migrate/migrations"
)

func NewCommand() *cli.Command {
	return &cli.Command{
		Name:    "migrate",
		Usage:   "Run migration",
		Aliases: []string{"m"},
		Flags: []cli.Flag{
			&cli.BoolFlag{
				Name:    argsMigrateUp,
				Aliases: []string{"u"},
				Usage:   "migrate up",
				Value:   false,
			},
			&cli.BoolFlag{
				Name:    argsMigrateDown,
				Aliases: []string{"d"},
				Usage:   "migrate down",
				Value:   false,
			},
		},
		Before: func(c *cli.Context) error {
			return beforeCommand(c)
		},
		Action: func(c *cli.Context) error {
			return start(c)
		},
	}
}

func start(c *cli.Context) error {
	db, err := sql.Open("postgres", "postgres://postgres:postgres@localhost:5432/trekking_app?sslmode=disable")
	if err != nil {
		return err
	}

	driver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		return err
	}

	m, err := migrate.NewWithDatabaseInstance(migrationsDir, "trekking_app", driver)

	if c.Bool(argsMigrateUp) {
		if err := m.Up(); err != nil {
			return err
		}
	}

	if c.Bool(argsMigrateDown) {
		if err := m.Down(); err != nil {
			return err
		}
	}

	m.Run()

	return nil
}

func beforeCommand(c *cli.Context) error {
	return nil
}
