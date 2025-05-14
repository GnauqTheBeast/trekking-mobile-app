package redis

import (
	"context"
	"fmt"

	"github.com/trekking-mobile-app/internal/pkg/pubsub"

	"github.com/redis/go-redis/v9"
)

type RedisSubscriber struct {
	pubsub        *redis.PubSub
	unmarshalFunc func([]byte) (interface{}, error)
}

func (r *RedisSubscriber) MessageChannel() <-chan *pubsub.Message {
	ch := make(chan *pubsub.Message)
	redisCh := r.pubsub.Channel()
	go func() {
		for msg := range redisCh {
			payload, err := r.unmarshalFunc([]byte(msg.Payload))
			if err != nil {
				fmt.Println("Error unmarshalling message:", err)
				continue
			}
			message := &pubsub.Message{
				Topic:   msg.Channel,
				Message: payload,
			}
			ch <- message
		}
		fmt.Println("Channel closed")
		close(ch)
	}()
	return ch
}

func (r *RedisSubscriber) Unsubscribe(context context.Context) error {
	return r.pubsub.Unsubscribe(context)
}
