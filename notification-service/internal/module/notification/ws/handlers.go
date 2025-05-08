package ws

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	"github.com/IBM/sarama"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins
	},
}

type WS struct {
	clients map[string]*websocket.Conn
	mu      *sync.RWMutex
}

func NewWS() *WS {
	return &WS{
		clients: make(map[string]*websocket.Conn),
		mu:      new(sync.RWMutex),
	}
}

func (w *WS) wsHandler(c *gin.Context) {
	// Lấy token từ header hoặc query
	token := c.GetHeader("Authorization")
	if token == "" {
		token = c.Query("token")
	}

	// Xác thực token
	userId, err := validateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
		return
	}

	// Sử dụng userId từ token thay vì query
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	defer conn.Close()

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

func validateToken(token string) (string, error) {
	// Implement token validation logic here (rpc to auth service)
	// Return userId and error
	return "", nil
}

func (w *WS) HandlePaymentResult(msg *sarama.ConsumerMessage) {
	var data struct {
		UserId    string `json:"user_id"`
		BookingId string `json:"booking_id"`
	}

	if err := json.Unmarshal(msg.Value, &data); err != nil {
		fmt.Println("Error parsing message:", err)
		return
	}

	w.sendToUser(data.UserId, map[string]interface{}{
		"type":       "payment_result",
		"booking_id": data.BookingId,
		"message":    "Thanh toán thành công!",
	})
}

func (w *WS) sendToUser(userID string, data interface{}) {
	w.mu.RLock()
	conn, ok := w.clients[userID]
	w.mu.RUnlock()

	if !ok {
		fmt.Printf("No WebSocket connection for user %s\n", userID)
		return
	}

	if err := conn.WriteJSON(data); err != nil {
		fmt.Printf("WebSocket write error to user %s: %v\n", userID, err)
	}
}
