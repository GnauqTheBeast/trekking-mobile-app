package context

import (
	"context"

	"github.com/trekking-mobile-app/app/kafka"

	"github.com/trekking-mobile-app/app/database/sqlc"
)

const (
	contextSQLClient     = "CONTEXT_SQL_CLIENT"
	contextKafkaConsumer = "CONTEXT_KAFKA_CONSUMER"
)

var background = context.Background()

func SetContextSQL() error {
	client, err := sqlc.NewSQLRepository()
	if err != nil {
		return err
	}

	background = context.WithValue(background, contextSQLClient, client)
	return nil
}

func GetSQLClient() *sqlc.SQLRepository {
	client, ok := background.Value(contextSQLClient).(*sqlc.SQLRepository)
	if !ok {
		return nil
	}

	return client
}

func SetContextKafkaConsumer() error {
	client, err := kafka.NewKafkaConsumer()
	if err != nil {
		return err
	}

	background = context.WithValue(background, contextKafkaConsumer, client)
	return nil
}

func GetKafkaConsumer() kafka.KafkaConsumer {
	client, ok := background.Value(contextKafkaConsumer).(kafka.KafkaConsumer)
	if !ok {
		return nil
	}

	return client
}
