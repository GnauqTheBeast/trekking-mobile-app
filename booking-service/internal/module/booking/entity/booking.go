package entity

import (
	"github.com/google/uuid"
	"time"
)

type Booking struct {
	ID         uuid.UUID     `json:"id" binding:"required"`
	UserID     uuid.UUID     `json:"user_id" binding:"required"`
	TourID     uuid.UUID     `json:"tour_id" binding:"required"`
	PorterID   uuid.NullUUID `json:"porter_id,omitempty"`
	Quantity   int           `json:"quantity" binding:"required,min=1"`
	TotalPrice int64         `json:"total_price,omitempty"`
	CreatedAt  time.Time     `json:"created_at"`
	UpdatedAt  time.Time     `json:"updated_at,omitempty"`
}

func (*Booking) TableName() string {
	return "booking"
}

type BookingPatchData struct {
	UserID     uuid.UUID  `json:"user_id,omitempty" binding:"omitempty"`
	TourID     uuid.UUID  `json:"tour_id,omitempty" binding:"omitempty"`
	HostID     uuid.UUID  `json:"host_id,omitempty" binding:"omitempty"`
	PorterID   *uuid.UUID `json:"porter_id,omitempty" binding:"omitempty"`
	Quantity   int        `json:"quantity,omitempty" binding:"omitempty,min=1"`
	TotalPrice int64      `json:"total_price,omitempty" binding:"omitempty"`
	UpdatedAt  time.Time  `json:"updated_at,omitempty"`
}
