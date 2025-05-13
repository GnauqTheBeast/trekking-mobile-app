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
			fmt.Println("Received message:", msg.Payload)
			// Unmarshal the message payload
			// Assuming the payload is a byte array, you may need to adjust this based on your actual message structure
			// var payload interface{}
			// Unmarshal the payload into the desired structure
			// err := msgpack.Unmarshal([]byte(msg.Payload), &payload)
			payload, err := r.unmarshalFunc([]byte(msg.Payload))
			if err != nil {
				fmt.Println("Error unmarshalling message:", err)
				continue
			}
			fmt.Printf("Unmarshalled message:%+v\n", payload)
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
