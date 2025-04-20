package consumer

import (
	"fmt"
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
	dependencies.Register(context.SetContextKafkaConsumer)
	return dependencies.Init()
}

func start(c *cli.Context) error {
	topic := "booking_request"

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	done := make(chan struct{})
	Consumer().ConsumePartition(topic, 0, done)

	sigChan <- syscall.SIGINT
	fmt.Println("Shutdown signal received. Exiting...")

	close(done)
	return nil
}
