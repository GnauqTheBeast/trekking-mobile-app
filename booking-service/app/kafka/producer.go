package kafka

import (
	"log"
	"os"
	"strings"

	"github.com/IBM/sarama"
)

type Producer struct {
	AsyncProducer sarama.AsyncProducer
}

// NewKafkaProducer initializes a new Kafka async producer
func NewKafkaProducer() (*Producer, error) {
	brokers := strings.Split(os.Getenv(kafkaConnection), ",")

	config := sarama.NewConfig()
	config.Producer.Return.Successes = true
	config.Producer.Return.Errors = true
	config.Producer.RequiredAcks = sarama.WaitForAll
	config.Producer.Retry.Max = 5

	producer, err := sarama.NewAsyncProducer(brokers, config)
	if err != nil {
		return nil, err
	}

	// Optionally log producer errors and successes
	go func() {
		for {
			select {
			case success := <-producer.Successes():
				log.Printf("Message published to topic %s partition %d offset %d\n", success.Topic, success.Partition, success.Offset)
			case err := <-producer.Errors():
				log.Printf("Failed to publish message: %v\n", err.Err)
			}
		}
	}()

	return &Producer{
		AsyncProducer: producer,
	}, nil
}

// Publish sends a message to the specified Kafka topic
func (p *Producer) Publish(topic string, key, value []byte) {
	message := &sarama.ProducerMessage{
		Topic: topic,
		Key:   sarama.ByteEncoder(key),
		Value: sarama.ByteEncoder(value),
	}

	p.AsyncProducer.Input() <- message
}

// Close gracefully shuts down the producer
func (p *Producer) Close() error {
	return p.AsyncProducer.Close()
}
