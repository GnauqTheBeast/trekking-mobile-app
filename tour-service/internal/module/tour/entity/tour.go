package entity

import (
	"github.com/google/uuid"
	"time"
)

type TourStatus string

const (
	TourStatusDraft     TourStatus = "DRAFT"
	TourStatusPublished TourStatus = "PUBLISHED"
	TourStatusArchived  TourStatus = "ARCHIVED"
)

type Tour struct {
	ID          uuid.UUID  `json:"id" binding:"required"`
	Name        string     `json:"name" binding:"required,min=3,max=255"`
	Description string     `json:"description" binding:"required,min=10"`
	HostID      uuid.UUID  `json:"host_id" binding:"required"`
	Slot        int32      `json:"slot" binding:"required"`
	Status      TourStatus `json:"status" binding:"required,oneof=DRAFT PUBLISHED ARCHIVED"`
	TimeStart   time.Time  `json:"start" binding:"required"`
	TimeEnd     time.Time  `json:"end" binding:"required"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

type TourCreateData struct {
	Name        string     `json:"name" binding:"required,min=3,max=255"`
	Description string     `json:"description" binding:"required,min=10"`
	HostID      uuid.UUID  `json:"host_id" binding:"required"`
	Slot        int32      `json:"slot" binding:"required"`
	Status      TourStatus `json:"status" binding:"required,oneof=DRAFT PUBLISHED ARCHIVED"`
	TimeStart   time.Time  `json:"start" binding:"required"`
	TimeEnd     time.Time  `json:"end" binding:"required"`
	CreatedAt   time.Time  `json:"created_at"`
}

func (*Tour) TableName() string {
	return "booking"
}

type TourPatchData struct {
	Name        string     `json:"title,omitempty" binding:"omitempty,min=3,max=255"`
	Description string     `json:"description,omitempty" binding:"omitempty,min=10"`
	Status      TourStatus `json:"status,omitempty" binding:"omitempty,oneof=draft published archived"`
	Slot        int32      `json:"slot" binding:"required"`
	TimeStart   time.Time  `json:"start" binding:"required"`
	TimeEnd     time.Time  `json:"end" binding:"required"`
}
