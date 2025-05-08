package api

import (
	"fmt"

	"github.com/gin-gonic/gin"
	ws "github.com/trekking-mobile-app/internal/module/notification/ws"

	"github.com/IBM/sarama"
	"github.com/trekking-mobile-app/internal/context"
	"github.com/trekking-mobile-app/internal/dependencies"
	"github.com/urfave/cli/v2"
)

var topicHandlers = map[string]func(*sarama.ConsumerMessage){}

func NewCommand() *cli.Command {
	return &cli.Command{
		Name:  "websocket",
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
	dependencies.Register(context.SetContextSQL)
	dependencies.Register(context.SetContextKafkaConsumer)
	return dependencies.Init()
}

func start(c *cli.Context) error {
	brokers := []string{"localhost:9092"}

	consumer, err := connectConsumer(brokers)
	if err != nil {
		panic(err)
	}
	defer consumer.Close()

	wsHandler := ws.NewWS()
	topicHandlers["payment_result"] = wsHandler.HandlePaymentResult

	go func() {
		r := gin.Default()
		ws.RegisterRoutes(r, wsHandler)
		if err := r.Run(":8080"); err != nil {
			fmt.Printf("WebSocket server failed: %v\n", err)
		}
	}()

	done := make(chan struct{})
	for topic := range topicHandlers {
		go consumeTopic(consumer, topic, 0, done)
	}

	fmt.Println("Shutdown signal received.")
	close(done)
	return nil
}

func connectConsumer(brokers []string) (sarama.Consumer, error) {
	config := sarama.NewConfig()
	config.Consumer.Return.Errors = true
	return sarama.NewConsumer(brokers, config)
}

func consumeTopic(consumer sarama.Consumer, topic string, partition int32, done <-chan struct{}) {
	partitionConsumer, err := consumer.ConsumePartition(topic, partition, sarama.OffsetOldest)
	if err != nil {
		fmt.Printf("Error starting partition api for topic %s: %v\n", topic, err)
		return
	}
	defer partitionConsumer.Close()

	msgCount := 0
	fmt.Printf("Started consuming topic %s\n", topic)

	for {
		select {
		case msg := <-partitionConsumer.Messages():
			msgCount++
			fmt.Printf("Topic(%s) Count(%d): %s\n", msg.Topic, msgCount, string(msg.Value))

			if handler, ok := topicHandlers[topic]; ok {
				handler(msg)
			}

		case err := <-partitionConsumer.Errors():
			fmt.Printf("Error on topic %s: %v\n", topic, err)
		case <-done:
			fmt.Printf("Stopping api for topic %s after %d messages\n", topic, msgCount)
			return
		}
	}
}
