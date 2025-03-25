package rpc

import "github.com/trekking-mobile-app/internal/module/booking"

type grpcService struct {
	bussiness booking.RPCBusiness
}
