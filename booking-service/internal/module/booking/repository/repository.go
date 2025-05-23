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

var ErrBookingNotFound = errors.New("booking not found")

type repository struct {
	queries *sqlc.Queries
}

func NewPostgresRepo(db *sqlc.SQLRepository) *repository {
	return &repository{
		queries: sqlc.New(db.Client),
	}
}

func (repo *repository) GetBookingById(ctx context.Context, bookingID string) (*entity.Booking, error) {
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

	return toEntityBooking(result), nil
}

func (repo *repository) InsertNewBooking(ctx context.Context, booking *entity.Booking) (*entity.Booking, error) {
	porterID := uuid.NullUUID{}
	if booking.PorterId != nil {
		porterID = uuid.NullUUID{UUID: *booking.PorterId, Valid: true}
	}

	newBooking, err := repo.queries.CreateBooking(ctx, &sqlc.CreateBookingParams{
		ID:         booking.Id,
		UserID:     booking.UserId,
		TourID:     booking.TourId,
		PorterID:   porterID,
		Quantity:   int32(booking.Quantity),
		TotalPrice: booking.TotalPrice,
	})
	if err != nil {
		return nil, err
	}

	return toEntityBooking(newBooking), nil
}

func (repo *repository) UpdateBookingStatus(ctx context.Context, bookingId uuid.UUID, status entity.BookingStatus) (*entity.Booking, error) {
	updateBookingStatus := &sqlc.UpdateBookingStatusParams{
		ID:     bookingId,
		Status: string(status),
	}
	booking, err := repo.queries.UpdateBookingStatus(ctx, updateBookingStatus)
	if err != nil {
		return nil, err
	}

	return toEntityBooking(booking), nil
}

func (repo *repository) GetBookingByUserId(ctx context.Context, userId uuid.UUID) ([]*entity.Booking, error) {
	bookings, err := repo.queries.GetBookingByUserId(ctx, userId)
	if err != nil {
		return nil, err
	}
	bookingsEntity := make([]*entity.Booking, 0)
	for _, booking := range bookings {
		bookingsEntity = append(bookingsEntity, toEntityBooking(booking))
	}
	return bookingsEntity, nil
}

func toEntityBooking(booking *sqlc.Booking) *entity.Booking {
	var porterIdPtr *uuid.UUID
	if booking.PorterID.Valid {
		porterIdPtr = &booking.PorterID.UUID
	}
	return &entity.Booking{
		Id:         booking.ID,
		UserId:     booking.UserID,
		TourId:     booking.TourID,
		PorterId:   porterIdPtr,
		Quantity:   int(booking.Quantity),
		TotalPrice: booking.TotalPrice,
		CreatedAt:  booking.CreatedAt,
		UpdatedAt:  booking.UpdatedAt,
		Status:     entity.BookingStatus(booking.Status),
	}
}
