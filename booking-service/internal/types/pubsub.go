package types

import "github.com/vmihailenco/msgpack/v5"

type PaymentBookingResult struct {
	UserId  string `json:"userId"`
	Result  string `json:"result"`
	Message string `json:"message"`
}

type Ping struct {
	Message string `json:"message"`
}

func UnmarshalPaymentBookingResult(msg []byte) (interface{}, error) {
	paymentBookingResult := new(PaymentBookingResult)
	err := msgpack.Unmarshal(msg, paymentBookingResult)
	return paymentBookingResult, err
}

func UnmarshalPing(msg []byte) (interface{}, error) {
	pong := new(Ping)
	err := msgpack.Unmarshal(msg, pong)
	return pong, err
}
