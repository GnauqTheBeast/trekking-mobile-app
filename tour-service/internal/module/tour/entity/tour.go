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
	ID            uuid.UUID  `json:"id"`
	Name          string     `json:"name" binding:"required,max=255"`
	Description   string     `json:"description" binding:"required"`
	HostID        uuid.UUID  `json:"host_id" binding:"required"`
	Price         int        `json:"price" binding:"required,gt=0"`
	Level         string     `json:"level" binding:"required"`
	Distance      int        `json:"distance" binding:"required"`
	Elevation     int        `json:"elevation" binding:"required"`
	Duration      string     `json:"duration" binding:"required"`
	Location      string     `json:"location" binding:"required"`
	Images        string     `json:"images" binding:"required"`
	Rate          string     `json:"rate" binding:"required"`
	Slot          int        `json:"slot" binding:"required"`
	AvailableSlot int        `json:"available_slot" binding:"required"`
	Status        TourStatus `json:"status" binding:"required,oneof=DRAFT PUBLISHED ARCHIVED"`
	TimeStart     time.Time  `json:"start_at" binding:"required"`
	TimeEnd       time.Time  `json:"end_at" binding:"required"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}
type TourPatchData struct {
	Name        string     `json:"title,omitempty" binding:"omitempty,max=255"`
	Description string     `json:"description,omitempty" binding:"omitempty"`
	Status      TourStatus `json:"status,omitempty" binding:"omitempty,oneof=draft published archived"`
	Price       int        `json:"price" binding:"required,gt=0"`
	Slot        int        `json:"slot" binding:"required"`
	Level       string     `json:"level" binding:"required"`
	Distance    int        `json:"distance" binding:"required"`
	Elevation   int        `json:"elevation" binding:"required"`
	Duration    string     `json:"duration" binding:"required"`
	Location    string     `json:"location" binding:"required"`
	Images      string     `json:"images" binding:"required"`
	Rate        string     `json:"rate" binding:"required"`
	TimeStart   time.Time  `json:"start" binding:"required"`
	TimeEnd     time.Time  `json:"end" binding:"required"`
}
