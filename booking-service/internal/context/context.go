package context

import (
	"context"

	"github.com/trekking-mobile-app/app/database/redis"
	"github.com/trekking-mobile-app/app/database/sqlc"
	"github.com/trekking-mobile-app/app/kafka"
)

const (
	contextSQLClient     = "CONTEXT_SQL_CLIENT"
	contextRedisClient   = "CONTEXT_REDIS_CLIENT"
	contextKafkaProducer = "CONTEXT_KAFKA_PRODUCER"
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

func SetContextRedisClient() error {
	redisClient, err := redis.NewCacheRedis(false)
	if err != nil {
		return err
	}

	background = context.WithValue(background, contextRedisClient, redisClient)
	return nil
}

func GetRedisClient() *redis.CacheRedis {
	client, ok := background.Value(contextRedisClient).(*redis.CacheRedis)
	if !ok {
		return nil
	}

	return client
}

func SetContextKafkaProducer() error {
	client, err := kafka.NewKafkaProducer()
	if err != nil {
		return err
	}
	background = context.WithValue(background, contextKafkaProducer, client)
	return nil
}

func GetContextKafkaProducer() kafka.KafkaProducer {
	client, ok := background.Value(contextKafkaProducer).(kafka.KafkaProducer)
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

	background = context.WithValue(background, contextKafkaProducer, client)
	return nil
}

func GetKafkaConsumer() kafka.KafkaConsumer {
	client, ok := background.Value(contextKafkaProducer).(kafka.KafkaConsumer)
	if !ok {
		return nil
	}

	return client
}
