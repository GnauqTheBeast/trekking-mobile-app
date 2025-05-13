package business

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/trekking-mobile-app/internal/pkg/pubsub"
	"github.com/trekking-mobile-app/internal/types"

	"github.com/google/uuid"
	"github.com/trekking-mobile-app/internal/module/booking/entity"
	"github.com/trekking-mobile-app/proto/pb"
)

type Repository interface {
	InsertNewBooking(ctx context.Context, booking *entity.Booking) (*entity.Booking, error)
	GetBookingById(ctx context.Context, bookingID string) (*entity.Booking, error)
	UpdateBookingStatus(ctx context.Context, bookingId uuid.UUID, status entity.BookingStatus) (*entity.Booking, error)
}

type TourRepository interface {
	CheckTourExist(ctx context.Context, tourId string) (*pb.TourResp, error)
	UpdateTourAvailableSlot(ctx context.Context, tourId string, lockedSlot int) (*pb.AvailableSlotResp, error)
}

type business struct {
	repository Repository
	tourRepo   TourRepository
	pubsub     pubsub.PubSub
}

func NewBusiness(repository Repository, tourRepo TourRepository, pubsub pubsub.PubSub) *business {
	return &business{
		repository: repository,
		tourRepo:   tourRepo,
		pubsub:     pubsub,
	}
}

func (b *business) GetBookingByID(ctx context.Context, bookingID string) (*entity.Booking, error) {
	return b.repository.GetBookingById(ctx, bookingID)
}

func (b *business) RequestBooking(ctx context.Context, booking *entity.Booking) (*entity.Booking, error) {
	tour, err := b.tourRepo.CheckTourExist(ctx, booking.TourId.String())
	if err != nil {
		return nil, err
	}

	if tour == nil {
		return nil, fmt.Errorf("tour not found")
	}

	if tour.Status != "PUBLISHED" {
		return nil, fmt.Errorf("tour is not published")
	}

	if booking.Quantity > int(tour.AvailableSlot) {
		return nil, fmt.Errorf("tour quantity is greater than available slot limit")
	}

	if booking.TotalPrice != int64(int(tour.Price)*booking.Quantity) {
		return nil, fmt.Errorf("total price is wrong")
	}

	newBooking, err := b.repository.InsertNewBooking(ctx, booking)
	if err != nil {
		return nil, err
	}

	go func() {
		msgBytes, err := json.Marshal(newBooking)
		if err != nil {
			fmt.Printf("failed to marshal booking message: %v\n", err)
			return
		}

		err = b.pubsub.Publish(ctx, &pubsub.Message{
			Topic:   "booking_request",
			Message: msgBytes,
		})
		if err != nil {
			fmt.Printf("failed to publish booking request: %v\n", err)
		}
	}()

	_, err = b.tourRepo.UpdateTourAvailableSlot(ctx, tour.TourId, booking.Quantity)
	if err != nil {
		return nil, err
	}

	return &entity.Booking{
		Id:         newBooking.Id,
		UserId:     newBooking.UserId,
		TourId:     newBooking.TourId,
		Quantity:   newBooking.Quantity,
		TotalPrice: newBooking.TotalPrice,
		PorterId:   newBooking.PorterId,
		ExpiredAt:  newBooking.ExpiredAt,
		Status:     newBooking.Status,
		CreatedAt:  newBooking.CreatedAt,
		UpdatedAt:  newBooking.UpdatedAt,
	}, nil
}

func (b *business) CancelBooking(ctx context.Context, bookingId string) (*entity.Booking, error) {
	Id, err := uuid.Parse(bookingId)
	if err != nil {
		return nil, err
	}

	cancelBooking, err := b.UpdateBookingStatus(ctx, Id, entity.BookingStatusCancel)
	if err != nil {
		return nil, err
	}

	_, err = b.tourRepo.UpdateTourAvailableSlot(ctx, cancelBooking.TourId.String(), -cancelBooking.Quantity)
	if err != nil {
		return nil, err
	}

	go func() {
		msgBytes, err := json.Marshal(cancelBooking)
		if err != nil {
			fmt.Printf("failed to marshal cancelBooking message: %v\n", err)
			return
		}

		b.pubsub.Publish(ctx, &pubsub.Message{
			Topic:   "booking_cancel",
			Message: msgBytes,
		})
	}()

	return &entity.Booking{
		Id:         cancelBooking.Id,
		UserId:     cancelBooking.UserId,
		TourId:     cancelBooking.TourId,
		Quantity:   cancelBooking.Quantity,
		TotalPrice: cancelBooking.TotalPrice,
		PorterId:   cancelBooking.PorterId,
		ExpiredAt:  cancelBooking.ExpiredAt,
		Status:     cancelBooking.Status,
		CreatedAt:  cancelBooking.CreatedAt,
		UpdatedAt:  cancelBooking.UpdatedAt,
	}, nil
}

func (b *business) UpdateBookingStatus(ctx context.Context, bookingId uuid.UUID, status entity.BookingStatus) (*entity.Booking, error) {
	isValid := IsValidBookingStatus(status)
	if !isValid {
		return nil, fmt.Errorf("invalid booking status")
	}

	return b.repository.UpdateBookingStatus(ctx, bookingId, status)
}

func (b *business) PingNotificationService(ctx context.Context) error {
	return b.pubsub.Publish(ctx, &pubsub.Message{
		Topic: "ping",
		Message: types.Ping{
			Message: "pong",
		},
	})
}

func IsValidBookingStatus(s entity.BookingStatus) bool {
	switch s {
	case entity.BookingStatusCancel, entity.BookingStatusPending, entity.BookingStatusSuccess:
		return true
	default:
		return false
	}
}
