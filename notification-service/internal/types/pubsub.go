package types

import "github.com/vmihailenco/msgpack/v5"

type PaymentBookingResult struct {
	UserId  string
	Result  string
	Message string
}

type Ping struct {
	Message string
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
