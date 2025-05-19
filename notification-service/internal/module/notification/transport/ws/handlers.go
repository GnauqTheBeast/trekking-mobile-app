package ws

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/google/uuid"
	"github.com/trekking-mobile-app/internal/types"

	"github.com/trekking-mobile-app/internal/module/notification/entity"
	"github.com/trekking-mobile-app/internal/pkg/pubsub"
	"github.com/trekking-mobile-app/internal/utils"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type Business interface {
	CreateNotification(ctx context.Context, notification *entity.Notification) (*entity.Notification, error)
}

type WS struct {
	clients  map[string]*websocket.Conn
	mu       *sync.RWMutex
	upgrader *websocket.Upgrader
	biz      Business
}

func NewWSHandler(biz Business) *WS {
	return &WS{
		clients: make(map[string]*websocket.Conn),
		mu:      new(sync.RWMutex),
		upgrader: &websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true // Allow all origins
			},
		},
		biz: biz,
	}
}

func (w *WS) WsHandler(c *gin.Context) {
	token := c.Query("token")
	if token == "" {
		fmt.Println("token is empty")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "no token provided"})
		return
	}

	userId, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	conn, err := w.upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	fmt.Println("UserId connect successfully", userId)

	w.mu.Lock()
	w.clients[userId] = conn
	w.mu.Unlock()

	for {
		if _, _, err := conn.ReadMessage(); err != nil {
			break
		}
	}

	w.mu.Lock()
	delete(w.clients, userId)
	w.mu.Unlock()
}

func (w *WS) sendToUser(userId string, data interface{}) {
	w.mu.RLock()
	conn, ok := w.clients[userId]
	w.mu.RUnlock()

	if !ok {
		fmt.Printf("No WebSocket connection for user %s\n", userId)
		return
	}
	fmt.Println("Sending data to userId", data, userId)

	if err := conn.WriteJSON(data); err != nil {
		fmt.Printf("WebSocket write error to user %s: %v\n", userId, err)
	}
}

func (ws *WS) ConsumeTopic(ctx context.Context, pubsub pubsub.PubSub, topics map[string]func([]byte) (interface{}, error)) {
	wg := new(sync.WaitGroup)
	for topic := range topics {
		wg.Add(1)
		go ws.consumeMessage(ctx, pubsub, wg, topic, topics[topic])
	}
	wg.Wait()
}

func (ws *WS) consumeMessage(ctx context.Context, pubsub pubsub.PubSub, wg *sync.WaitGroup, topic string, unmarshallFunc func([]byte) (interface{}, error)) {
	defer wg.Done()

	subscriber, err := pubsub.Subscribe(ctx, topic, unmarshallFunc)
	if err != nil {
		fmt.Printf("Failed to subscribe to topic %s: %v\n", topic, err)
		return
	}

	defer func() {
		if err := subscriber.Unsubscribe(ctx); err != nil {
			log.Printf("failed to unsubscribe from topic %s: %v", topic, err)
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

			received := msg.Message.(*types.PaymentBookingResult)
			userId, _ := uuid.Parse(received.UserID)
			noti := &entity.Notification{
				ID:          uuid.New(),
				UserID:      userId,
				Name:        "Payment Booking Successfully",
				Description: received.BookingID,
			}

			go func() {
				_, err := ws.biz.CreateNotification(ctx, noti)
				if err != nil {
					log.Printf("Failed to create notification: %v\n", err)
					return
				}
			}()
			go ws.sendToUser(received.UserID, noti)
		}
	}
}
