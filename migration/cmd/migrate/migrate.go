package migrate

import (
	"database/sql"
	"fmt"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
	"github.com/trekking-mobile-app/migration/internal/util/env"
	"github.com/urfave/cli/v2"
	"os"
)

const (
	envDBConnection     = "DB_CONNECTION"
	envDBDataSourceName = "DB_DSN"
	dbName              = "trekking_app"
	argsMigrateUp       = "migrate-up"
	argsMigrateDown     = "migrate-down"
	migrationsDir       = "file://cmd/migrate/migrations"
)

func init() {
	env.LoadOnce()
}

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
	db, err := sql.Open(os.Getenv(envDBConnection), os.Getenv(envDBDataSourceName))
	if err != nil {
		return err
	}

	driver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		return err
	}

	m, err := migrate.NewWithDatabaseInstance(migrationsDir, dbName, driver)
	if err != nil {
		return err
	}

	version, dirty, _ := m.Version()
	if dirty {
		fmt.Println("dirty version", version)
		if err := m.Force(int(version)); err != nil {
			return fmt.Errorf("failed to force migration version %d: %w", version, err)
		}
	}

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

	return nil
}

func beforeCommand(c *cli.Context) error {
	return nil
}
