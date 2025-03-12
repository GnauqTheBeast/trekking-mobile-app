package entity

import (
	"time"
)

type TourStatus string

const (
	TourStatusDraft     TourStatus = "draft"
	TourStatusPublished TourStatus = "published"
	TourStatusArchived  TourStatus = "archived"
)

type Tour struct {
	Id          string     `json:"id" binding:"required"`
	Title       string     `json:"title" binding:"required,min=3,max=255"`
	Description string     `json:"description" binding:"required,min=10"`
	Status      TourStatus `json:"status" binding:"required,oneof=draft published archived"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

func (*Tour) TableName() string {
	return "tour"
}

type TourPatchData struct {
	Title       *string     `json:"title,omitempty" binding:"omitempty,min=3,max=255"`
	Description *string     `json:"description,omitempty" binding:"omitempty,min=10"`
	Status      *TourStatus `json:"status,omitempty" binding:"omitempty,oneof=draft published archived"`
}
