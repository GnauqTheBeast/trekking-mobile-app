package types

import (
	"encoding/json"
	"github.com/vmihailenco/msgpack/v5"
	"time"
)

type PaymentBookingResult struct {
	ID        string    `json:"Id"`
	BookingID string    `json:"BookingId"`
	Total     int64     `json:"Total"`
	Method    string    `json:"Method"`
	Type      string    `json:"Type"`
	Status    string    `json:"Status"`
	CreatedAt time.Time `json:"CreatedAt"`
	UpdatedAt time.Time `json:"UpdatedAt"`
}

type Ping struct {
	Message string `json:"message"`
}

func UnmarshalPaymentBookingResult(msg []byte) (interface{}, error) {
	paymentBookingResult := new(PaymentBookingResult)
	err := json.Unmarshal(msg, paymentBookingResult)
	return paymentBookingResult, err
}

func UnmarshalPing(msg []byte) (interface{}, error) {
	pong := new(Ping)
	err := msgpack.Unmarshal(msg, pong)
	return pong, err
}
