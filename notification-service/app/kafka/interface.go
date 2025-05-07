package kafka

type KafkaConsumer interface {
	ConsumePartition(topic string, partition int32, done <-chan struct{})
}

type KafkaProducer interface {
	Publish(topic string, key, value []byte)
}
