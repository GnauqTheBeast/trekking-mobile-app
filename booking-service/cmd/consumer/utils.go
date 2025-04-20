package consumer

import (
	"github.com/trekking-mobile-app/app/kafka"
	"github.com/trekking-mobile-app/internal/context"
)

func Consumer() kafka.KafkaConsumer {
	return context.GetKafkaConsumer()
}
