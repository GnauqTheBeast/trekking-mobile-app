package business

import (
	"context"
	"fmt"
	"github.com/trekking-mobile-app/internal/module/booking/entity"
	"github.com/trekking-mobile-app/proto/pb"
)

type Repository interface {
	InsertNewBooking(ctx context.Context, booking *entity.Booking) (*entity.Booking, error)
	GetBookingByID(ctx context.Context, bookingID string) (*entity.Booking, error)
}

type TourRepository interface {
	CheckTourExist(ctx context.Context, tourId string) (*pb.TourResp, error)
}

type business struct {
	repository Repository
	tourRepo   TourRepository
}

func NewBusiness(repository Repository, tourRepo TourRepository) *business {
	return &business{
		repository: repository,
		tourRepo:   tourRepo,
	}
}

func (b *business) GetBookingByID(ctx context.Context, bookingID string) (*entity.Booking, error) {
	return b.repository.GetBookingByID(ctx, bookingID)
}

func (b *business) RequestBooking(ctx context.Context, booking *entity.Booking) error {
	tour, err := b.tourRepo.CheckTourExist(ctx, "e5bdd4b2-d455-4922-b6b1-5f0e4be6fbe7")
	if err != nil {
		return err
	}
	fmt.Println(tour)
	// Check tour exist

	// Check slot of tour

	return nil
}
