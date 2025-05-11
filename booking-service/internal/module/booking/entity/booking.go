package entity

import (
	"time"

	"github.com/google/uuid"
)

// Enum: [PENDING CONFIRMED CANCELED]
type BookingStatus string

const (
	BookingStatusExpired BookingStatus = "EXPIRED"
	BookingStatusPending BookingStatus = "PENDING"
	BookingStatusCancel  BookingStatus = "CANCEL"
	BookingStatusSuccess BookingStatus = "SUCCESS"
)

type Booking struct {
	Id         uuid.UUID     `json:"id" example:"123e4567-e89b-12d3-a456-426614174000"`
	UserId     uuid.UUID     `json:"user_id" example:"123e4567-e89b-12d3-a456-426614174001"`
	TourId     uuid.UUID     `json:"tour_id" example:"123e4567-e89b-12d3-a456-426614174002"`
	PorterId   uuid.NullUUID `json:"porter_id,omitempty" example:"123e4567-e89b-12d3-a456-426614174003"`
	Quantity   int           `json:"quantity" example:"3"`
	Status     BookingStatus `json:"status" example:"PENDING"`
	TotalPrice int64         `json:"total_price,omitempty" example:"1500000"`
	ExpiredAt  time.Time     `json:"expired_at,omitempty" example:"2025-06-30T15:04:05Z"`
	CreatedAt  time.Time     `json:"created_at" example:"2025-05-11T15:04:05Z"`
	UpdatedAt  time.Time     `json:"updated_at,omitempty" example:"2025-05-12T10:00:00Z"`
}

func (*Booking) TableName() string {
	return "booking"
}

type BookingPatchData struct {
	UserId     uuid.UUID  `json:"user_id,omitempty" example:"123e4567-e89b-12d3-a456-426614174001"`
	TourId     uuid.UUID  `json:"tour_id,omitempty" example:"123e4567-e89b-12d3-a456-426614174002"`
	HostId     uuid.UUID  `json:"host_id,omitempty" example:"123e4567-e89b-12d3-a456-426614174005"`
	PorterId   *uuid.UUID `json:"porter_id,omitempty" example:"123e4567-e89b-12d3-a456-426614174003"`
	Quantity   int        `json:"quantity,omitempty" example:"2"`
	TotalPrice int64      `json:"total_price,omitempty" example:"1000000"`
	UpdatedAt  time.Time  `json:"updated_at,omitempty" example:"2025-05-12T12:00:00Z"`
}
