package entity

import (
	"github.com/google/uuid"
	"time"
)

type BookingStatus string

const (
	BookingStatusExpired BookingStatus = "EXPIRED"
	BookingStatusPending BookingStatus = "PENDING"
	BookingStatusCancel  BookingStatus = "CANCEL"
	BookingStatusSuccess BookingStatus = "SUCCESS"
)

type Booking struct {
	Id         uuid.UUID     `json:"id" binding:"required"`
	UserId     uuid.UUID     `json:"user_id" binding:"required"`
	TourId     uuid.UUID     `json:"tour_id" binding:"required"`
	PorterId   uuid.NullUUID `json:"porter_id,omitempty"`
	Quantity   int           `json:"quantity" binding:"required,min=1"`
	Status     BookingStatus `json:"status" binding:"required"`
	TotalPrice int64         `json:"total_price,omitempty"`
	ExpiredAt  time.Time     `json:"expired_at,omitempty"`
	CreatedAt  time.Time     `json:"created_at"`
	UpdatedAt  time.Time     `json:"updated_at,omitempty"`
}

func (*Booking) TableName() string {
	return "booking"
}

type BookingPatchData struct {
	UserId     uuid.UUID  `json:"user_id,omitempty" binding:"omitempty"`
	TourId     uuid.UUID  `json:"tour_id,omitempty" binding:"omitempty"`
	HostId     uuid.UUID  `json:"host_id,omitempty" binding:"omitempty"`
	PorterId   *uuid.UUID `json:"porter_id,omitempty" binding:"omitempty"`
	Quantity   int        `json:"quantity,omitempty" binding:"omitempty,min=1"`
	TotalPrice int64      `json:"total_price,omitempty" binding:"omitempty"`
	UpdatedAt  time.Time  `json:"updated_at,omitempty"`
}
