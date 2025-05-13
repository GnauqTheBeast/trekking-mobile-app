package pubsub

import "context"

type PubSub interface {
	Publish(context.Context, *Message) error
	Subscribe(context.Context, string, func([]byte) (interface{}, error)) (Subscriber, error)
}

type Subscriber interface {
	MessageChannel() <-chan *Message
	Unsubscribe(context.Context) error
}

type Message struct {
	Topic   string
	Message interface{}
}
