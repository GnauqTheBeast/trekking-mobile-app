package context

import (
	"context"

	"github.com/trekking-mobile-app/internal/pkg/pubsub"

	"github.com/trekking-mobile-app/app/database/redis"
	"github.com/trekking-mobile-app/app/database/sqlc"
)

const (
	contextSQLClient         = "CONTEXT_SQL_CLIENT"
	contextRedisClient       = "CONTEXT_REDIS_CLIENT"
	contextRedisPubsubClient = "CONTEXT_PUBSUB_CLIENT"
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

func SetContextPubsubClient() error {
	client, err := redis.GetPubsubRedisClient()
	if err != nil {
		return err
	}
	background = context.WithValue(background, contextRedisPubsubClient, client)
	return nil
}

func GetContextPubSubClient() pubsub.PubSub {
	client, ok := background.Value(contextRedisPubsubClient).(pubsub.PubSub)
	if !ok {
		return nil
	}
	return client
}
