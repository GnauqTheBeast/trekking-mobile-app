package repository

import (
	"context"
	"errors"
	"github.com/google/uuid"
	"github.com/trekking-mobile-app/internal/pkg/paging"

	"github.com/trekking-mobile-app/app/database/sqlc"
	"github.com/trekking-mobile-app/internal/module/booking"
	"github.com/trekking-mobile-app/internal/module/booking/entity"
)

var (
	ErrBookingNotFound    = errors.New("booking not found")
	ErrInvalidBookingData = errors.New("invalid booking data")
)

type postgresRepo struct {
	queries *sqlc.Queries
}

func NewPostgresRepo(db *sqlc.SQLRepository) booking.Repository {
	if db == nil {
		panic("db connection is required")
	}
	return &postgresRepo{
		queries: sqlc.New(db.Client),
	}
}

func (repo *postgresRepo) ListBookings(ctx context.Context, paging *paging.Paging) ([]*entity.Booking, error) {
	bookingList, err := repo.queries.ListHostBookings(ctx, &sqlc.ListHostBookingsParams{
		Limit:  int32(paging.Limit),
		Offset: int32(paging.Offset),
	})
	if err != nil {
		return nil, err
	}

	result := make([]*entity.Booking, 0)
	for _, t := range bookingList {
		result = append(result, &entity.Booking{
			ID: t.ID,
		})
	}

	return result, nil
}

func (repo *postgresRepo) InsertNewBooking(ctx context.Context, booking *entity.Booking) (*entity.Booking, error) {
	// Todo: handle case if customer doesn't need porter
	if booking.PorterID != nil {
	}

	newBooking, err := repo.queries.CreateBooking(ctx, &sqlc.CreateBookingParams{
		ID:     booking.ID,
		UserID: booking.UserID,
		HostID: booking.HostID,
		TourID: booking.TourID,
		PorterID: uuid.NullUUID{
			Valid: true,
			UUID: *booking.PorterID,
		},

	})
	if err != nil {
		return nil, err
	}

	return &entity.Booking{
		ID:     newBooking.ID,
		UserID: newBooking.UserID,
		HostID: newBooking.HostID,
		TourID: newBooking.TourID,
	}, nil
}
