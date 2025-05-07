package kafka

import (
	"fmt"
	"os"
	"strings"

	"github.com/IBM/sarama"
)

const (
	kafkaConnection = "KAFKA_CONNECTION"
)

var topicHandlers = map[string]func(*sarama.ConsumerMessage){
	"booking_request": handleCreateBooking,
}

type Consumer struct {
	Consumer sarama.Consumer
}

func NewKafkaConsumer() (*Consumer, error) {
	producer, err := connectConsumer(strings.Split(os.Getenv(kafkaConnection), ","))
	if err != nil {
		return nil, err
	}

	return &Consumer{
		Consumer: producer,
	}, nil
}

func connectConsumer(brokers []string) (sarama.Consumer, error) {
	config := sarama.NewConfig()
	config.Consumer.Return.Errors = true
	return sarama.NewConsumer(brokers, config)
}

func (k *Consumer) ConsumePartition(topic string, partition int32, done <-chan struct{}) {
	consumePartition, err := k.Consumer.ConsumePartition(topic, partition, sarama.OffsetNewest)
	if err != nil {
		return
	}

	for {
		select {
		case msg := <-consumePartition.Messages():
			if handler, ok := topicHandlers[topic]; ok {
				handler(msg)
			}

		case err := <-consumePartition.Errors():
			fmt.Printf("Error on topic %s: %v\n", topic, err)
		case <-done:
			fmt.Printf("Stopping consumer for topic %s\n", topic)
			return
		}
	}
}

func handleCreateBooking(msg *sarama.ConsumerMessage) {
	// Insert Booking to db
}
