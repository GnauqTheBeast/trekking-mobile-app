package entity

import (
	"github.com/google/uuid"
	"time"
)

type TourStatus string

const (
	TourStatusDraft     TourStatus = "draft"
	TourStatusPublished TourStatus = "published"
	TourStatusArchived  TourStatus = "archived"
)

type Tour struct {
	ID          uuid.UUID  `json:"id" binding:"required"`
	Name        string     `json:"name" binding:"required,min=3,max=255"`
	Description string     `json:"description" binding:"required,min=10"`
	HostID      uuid.UUID  `json:"host_id" binding:"required"`
	Slot        int32      `json:"slot" binding:"required"`
	Status      TourStatus `json:"status" binding:"required,oneof=draft published archived"`
	TimeStart   time.Time  `json:"start" binding:"required"`
	TimeEnd     time.Time  `json:"end" binding:"required"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

func (*Tour) TableName() string {
	return "tour"
}

type TourPatchData struct {
	Name        string     `json:"title,omitempty" binding:"omitempty,min=3,max=255"`
	Description string     `json:"description,omitempty" binding:"omitempty,min=10"`
	Status      TourStatus `json:"status,omitempty" binding:"omitempty,oneof=draft published archived"`
	Slot        int32      `json:"slot" binding:"required"`
	TimeStart   time.Time  `json:"start" binding:"required"`
	TimeEnd     time.Time  `json:"end" binding:"required"`
}
