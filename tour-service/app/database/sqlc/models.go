package sqlc

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
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
