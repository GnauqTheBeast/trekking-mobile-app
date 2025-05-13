package api

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strings"
	"sync"
	"syscall"

	"github.com/trekking-mobile-app/internal/pkg/pubsub"
	"github.com/trekking-mobile-app/internal/types"

	ctx "github.com/trekking-mobile-app/internal/context"
	"github.com/trekking-mobile-app/internal/module/notification/transport/ws"

	"github.com/gin-gonic/gin"
	"github.com/trekking-mobile-app/internal/dependencies"
	"github.com/urfave/cli/v2"
)

func NewCommand() *cli.Command {
	return &cli.Command{
		Name:  "api",
		Usage: "start the notification-service",
		Action: func(c *cli.Context) error {
			return start(c)
		},
		Before: func(c *cli.Context) error {
			return beforeCommand()
		},
	}
}

func beforeCommand() error {
	dependencies.Register(ctx.SetContextSQL)
	dependencies.Register(ctx.SetContextPubsubClient)
	// dependencies.Register(ctx.SetContextKafkaConsumer)
	return dependencies.Init()
}

func start(c *cli.Context) error {
	wsHandler := ws.NewWS()

	go func() {
		r := gin.Default()
		RegisterRoutes(r, wsHandler)
		if err := r.Run(":8082"); err != nil {
			fmt.Printf("WebSocket server failed: %v\n", err)
		}
	}()

	pubsub := ctx.GetContextPubSubClient()
	topicHandlers, err := topicHandler()
	if err != nil {
		return err
	}
	consumeTopic(c.Context, pubsub, topicHandlers)

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	return nil
}

func consumeTopic(ctx context.Context, pubsub pubsub.PubSub, topics map[string]func([]byte) (interface{}, error)) {
	wg := new(sync.WaitGroup)
	for topic := range topics {
		wg.Add(1)
		go consumeMessage(ctx, pubsub, wg, topic, topics[topic])
	}
	wg.Wait()
}

func consumeMessage(ctx context.Context, pubsub pubsub.PubSub, wg *sync.WaitGroup, topic string, unmarshallFunc func([]byte) (interface{}, error)) {
	defer wg.Done()

	subscriber, err := pubsub.Subscribe(ctx, topic, unmarshallFunc)
	if err != nil {
		fmt.Printf("Failed to subscribe to topic %s: %v\n", topic, err)
		return
	}

	defer func() {
		err = subscriber.Unsubscribe(ctx)
		if err != nil {
			return
		}
	}()

	for {
		select {
		case <-ctx.Done():
			log.Printf("topic %s done", topic)
			return
		case msg, ok := <-subscriber.MessageChannel():
			if !ok {
				log.Printf("message channel closed on topic %s", topic)
				return
			}
			fmt.Println(msg)
		}
	}
}

func topicHandler() (map[string]func([]byte) (interface{}, error), error) {
	topics := strings.Split(os.Getenv("NOTIFICATION_TOPIC_CONSUME"), ",")
	if len(topics) == 0 {
		fmt.Printf("No topics found\n")
		return nil, nil
	}

	topicUnmarshallHandlers := make(map[string]func([]byte) (interface{}, error))
	for _, topic := range topics {
		switch topic {
		case "ping":
			topicUnmarshallHandlers["ping"] = types.UnmarshalPing
		case "payment_result":
			topicUnmarshallHandlers["payment_result"] = types.UnmarshalPaymentBookingResult
		}
	}

	return topicUnmarshallHandlers, nil
}
