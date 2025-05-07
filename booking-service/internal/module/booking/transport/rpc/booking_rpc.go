package rpc

import (
	"context"

	"github.com/google/uuid"
	"github.com/trekking-mobile-app/internal/module/booking/entity"
	"github.com/trekking-mobile-app/proto/pb"
)

type Business interface {
	UpdateBookingStatus(ctx context.Context, bookingId uuid.UUID, status entity.BookingStatus) (*entity.Booking, error)
}

type BookingServiceServer struct {
	pb.UnimplementedBookingServiceServer
	business Business
}

func NewBookingServiceServer(business Business) *BookingServiceServer {
	return &BookingServiceServer{
		business: business,
	}
}

func (s *BookingServiceServer) UpdateBookingStatus(ctx context.Context, req *pb.BookingReq) (*entity.Booking, error) {
	bookingId, err := uuid.Parse(req.BookingId)
	if err != nil {
		return nil, err
	}

	return s.business.UpdateBookingStatus(ctx, bookingId, entity.BookingStatus(req.Status))
}
