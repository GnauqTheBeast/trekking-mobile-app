package redis

import (
	"context"

	"github.com/trekking-mobile-app/internal/pkg/pubsub"

	"github.com/redis/go-redis/v9"
	"github.com/vmihailenco/msgpack/v5"
)

type RedisPubSub struct {
	writeClient redis.UniversalClient
	readClient  redis.UniversalClient
}

func New(writeClient redis.UniversalClient, readClient redis.UniversalClient) *RedisPubSub {
	return &RedisPubSub{
		writeClient: writeClient,
		readClient:  readClient,
	}
}

func (r *RedisPubSub) Publish(context context.Context, message *pubsub.Message) error {
	if message == nil {
		return nil
	}
	b, err := msgpack.Marshal(message.Message)
	if err != nil {
		return err
	}
	return r.writeClient.Publish(context, message.Topic, b).Err()
}

func (r *RedisPubSub) Subscribe(context context.Context, topic string, unmarshalFunc func([]byte) (interface{}, error)) (pubsub.Subscriber, error) {
	pubsub := r.readClient.Subscribe(context, topic)

	subscriber := &RedisSubscriber{
		pubsub:        pubsub,
		unmarshalFunc: unmarshalFunc,
	}

	return subscriber, nil
}
