package entity

import (
	"time"

	"github.com/google/uuid"
)

type TourStatus string

const (
	TourStatusDraft     TourStatus = "DRAFT"
	TourStatusPublished TourStatus = "PUBLISHED"
	TourStatusArchived  TourStatus = "ARCHIVED"
)

type Tour struct {
	ID            uuid.UUID  `json:"id" binding:"required"`
	Name          string     `json:"name" binding:"required,min=3,max=255"`
	Description   string     `json:"description" binding:"required,min=10"`
	HostID        uuid.UUID  `json:"host_id" binding:"required"`
	Slot          int32      `json:"slot" binding:"required"`
	AvailableSlot int32      `json:"available_slot" binding:"required"`
	Price         int32      `json:"price" binding:"required,gt=0"`
	Status        TourStatus `json:"status" binding:"required,oneof=DRAFT PUBLISHED ARCHIVED"`
	TimeStart     time.Time  `json:"start" binding:"required"`
	TimeEnd       time.Time  `json:"end" binding:"required"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}

func (*Tour) TableName() string {
	return "booking"
}

type TourPatchData struct {
	Name        string     `json:"title,omitempty" binding:"omitempty,min=3,max=255"`
	Description string     `json:"description,omitempty" binding:"omitempty,min=10"`
	Status      TourStatus `json:"status,omitempty" binding:"omitempty,oneof=draft published archived"`
	Price       int32      `json:"price" binding:"required,gt=0"`
	Slot        int32      `json:"slot" binding:"required"`
	TimeStart   time.Time  `json:"start" binding:"required"`
	TimeEnd     time.Time  `json:"end" binding:"required"`
}
