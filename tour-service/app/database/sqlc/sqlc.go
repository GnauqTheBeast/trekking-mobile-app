package sqlc

import (
	"database/sql"
	_ "github.com/lib/pq"
	"os"
	"strconv"
	"strings"
	"time"
)

const (
	envDBConnection           = "DB_CONNECTION"
	envDBDataSourceName       = "DB_DSN"
	envDBMaxOpenConnections   = "DB_MAX_OPEN_CONNECTIONS"
	defaultMaxOpenConnections = 100
)

type SQLRepository struct {
	Client *sql.DB
}

type SQLConfig struct {
	Driver             string
	DSN                string
	MaxOpenConnections int
}

func (r *SQLRepository) init() error {
	config := &SQLConfig{
		Driver:             strings.ToLower(strings.TrimSpace(os.Getenv(envDBConnection))),
		DSN:                strings.TrimSpace(os.Getenv(envDBDataSourceName)),
		MaxOpenConnections: parseInt(strings.TrimSpace(os.Getenv(envDBMaxOpenConnections))),
	}
	return r.initFromConfig(config)
}

func (r *SQLRepository) initFromConfig(config *SQLConfig) error {
	maxOpenConnections := config.MaxOpenConnections
	if maxOpenConnections < 1 {
		maxOpenConnections = defaultMaxOpenConnections
	}

	var err error
	r.Client, err = sql.Open(config.Driver, config.DSN)
	if err != nil {
		return err
	}

	r.Client.SetConnMaxLifetime(time.Hour * 3)
	r.Client.SetMaxOpenConns(maxOpenConnections)
	r.Client.SetMaxIdleConns(maxOpenConnections)

	return nil
}

func NewSQLRepository() (*SQLRepository, error) {
	r := new(SQLRepository)
	if err := r.init(); err != nil {
		return nil, err
	}
	return r, nil
}

func parseInt(value string) int {
	result, _ := strconv.Atoi(value)
	return result
}
