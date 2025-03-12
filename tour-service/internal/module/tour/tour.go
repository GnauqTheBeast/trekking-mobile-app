// Package tour provides functionality for managing tour-related operations
package tour

import (
	"context"

	"github.com/gin-gonic/gin"
	"github.com/trekking-mobile-app/app/model"
	"github.com/trekking-mobile-app/internal/module/tour/entity"
)

type Repository interface {
	InsertNewTour(ctx context.Context, data *entity.Tour) error
	GetTourByID(ctx context.Context, tourID string) (*entity.Tour, error)
	FindTour(ctx context.Context, paging *model.Paging) ([]*entity.Tour, error)
	UpdateTour(ctx context.Context, tourID string, data *entity.TourPatchData) error
	DeleteTour(ctx context.Context, tourID string) error
}

type Business interface {
	CreateNewTour(ctx context.Context, data *entity.Tour) error
	ListTours(ctx context.Context, paging *model.Paging) ([]*entity.Tour, error)
	GetTourDetails(ctx context.Context, tourID string) (*entity.Tour, error)
	UpdateTour(ctx context.Context, tourID string, data *entity.TourPatchData) error
	DeleteTour(ctx context.Context, tourID string) error
}

type API interface {
	Ping() gin.HandlerFunc
	CreateTourHdl() gin.HandlerFunc
	GetTourNameHdl() gin.HandlerFunc
	ListTourHdl() gin.HandlerFunc
	GetTourHdl() gin.HandlerFunc
	UpdateTourHdl() gin.HandlerFunc
	DeleteTourHdl() gin.HandlerFunc
}
