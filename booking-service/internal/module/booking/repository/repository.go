package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"github.com/google/uuid"
	"github.com/trekking-mobile-app/app/database/sqlc"
	"github.com/trekking-mobile-app/internal/module/booking/entity"
)

var (
	ErrBookingNotFound = errors.New("booking not found")
)

type repository struct {
	queries *sqlc.Queries
}

func NewPostgresRepo(db *sqlc.SQLRepository) *repository {
	return &repository{
		queries: sqlc.New(db.Client),
	}
}

func (repo *repository) GetBookingByID(ctx context.Context, bookingID string) (*entity.Booking, error) {
	bookingUUID, err := uuid.Parse(bookingID)
	if err != nil {
		return nil, ErrBookingNotFound
	}

	result, err := repo.queries.GetBookingByID(ctx, bookingUUID)
	if err != nil {
		fmt.Println("err", err)
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrBookingNotFound
		}
		return nil, err
	}

	return &entity.Booking{
		ID:         result.ID,
		UserID:     result.UserID,
		TourID:     result.TourID,
		PorterID:   result.PorterID,
		Quantity:   int(result.Quantity),
		TotalPrice: result.TotalPrice,
		CreatedAt:  result.CreatedAt,
		UpdatedAt:  result.UpdatedAt,
	}, nil
}

func (repo *repository) InsertNewBooking(ctx context.Context, booking *entity.Booking) (*entity.Booking, error) {
	newBooking, err := repo.queries.CreateBooking(ctx, &sqlc.CreateBookingParams{
		ID:       booking.ID,
		UserID:   booking.UserID,
		TourID:   booking.TourID,
		PorterID: booking.PorterID,
	})
	if err != nil {
		return nil, err
	}

	return &entity.Booking{
		ID:     newBooking.ID,
		UserID: newBooking.UserID,
		TourID: newBooking.TourID,
	}, nil
}
