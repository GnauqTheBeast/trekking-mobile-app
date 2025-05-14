package api

import (
	"fmt"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"github.com/trekking-mobile-app/internal/module/notification/business"
	"github.com/trekking-mobile-app/internal/module/notification/repository"

	"github.com/trekking-mobile-app/middleware"

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
	repo := repository.NewPostgresRepo(ctx.GetSQLClient())
	biz := business.NewBusiness(repo)
	wsHandler := ws.NewWSHandler(biz)
	r := gin.Default()
	r.RedirectTrailingSlash = true
	r.Use(middleware.Cors())
	// r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	RegisterRoutes(r, wsHandler)
	go func() {
		fmt.Println("Starting server on :8082")
		if err := r.Run(":8082"); err != nil {
			fmt.Printf("Server failed to start: %v\n", err)
		}
	}()

	pubsub := ctx.GetContextPubSubClient()
	topicHandlers, err := topicHandler()
	if err != nil {
		return err
	}
	wsHandler.ConsumeTopic(c.Context, pubsub, topicHandlers)

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	return nil
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
