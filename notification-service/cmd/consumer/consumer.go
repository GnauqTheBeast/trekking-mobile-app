package consumer

import (
	"fmt"
	"github.com/IBM/sarama"
	"github.com/trekking-mobile-app/internal/context"
	"github.com/trekking-mobile-app/internal/dependencies"
	"github.com/urfave/cli/v2"
	"os"
	"os/signal"
	"syscall"
)

func NewCommand() *cli.Command {
	return &cli.Command{
		Name:  "consumer",
		Usage: "start the booking-service",
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
	return dependencies.Init()
}

func start(c *cli.Context) error {
	topics := []string{"email_register", "booking_request", "payment_success"}
	brokers := []string{"localhost:9092"}

	consumer, err := connectConsumer(brokers)
	if err != nil {
		panic(err)
	}

	defer consumer.Close()

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	done := make(chan struct{})

	for _, topic := range topics {
		go consumeTopic(consumer, topic, 0, done)
	}

	<-sigChan
	fmt.Println("Shutdown signal received. Exiting...")

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
		fmt.Printf("Error starting partition consumer for topic %s: %v\n", topic, err)
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
			} else {
				fmt.Printf("No handler for topic %s\n", topic)
			}

		case err := <-partitionConsumer.Errors():
			fmt.Printf("Error on topic %s: %v\n", topic, err)
		case <-done:
			fmt.Printf("Stopping consumer for topic %s after %d messages\n", topic, msgCount)
			return
		}
	}
}

var topicHandlers = map[string]func(*sarama.ConsumerMessage){
	"email_register":  handleEmailRegister,
	"booking_request": handleOrderCreated,
	"payment_success": handlePaymentSuccess,
}

func handleEmailRegister(msg *sarama.ConsumerMessage) {
	fmt.Printf("Handling Email Register: %s\n", string(msg.Value))
}

func handleOrderCreated(msg *sarama.ConsumerMessage) {
	fmt.Printf("Handling Order Created: %s\n", string(msg.Value))
}

func handlePaymentSuccess(msg *sarama.ConsumerMessage) {
	fmt.Printf("Handling Payment Success: %s\n", string(msg.Value))
}
