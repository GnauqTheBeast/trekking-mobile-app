package tour

import (
	"context"
	"github.com/trekking-mobile-app/internal/pkg/paging"

	"github.com/gin-gonic/gin"
	"github.com/trekking-mobile-app/internal/module/tour/entity"
)

type Repository interface {
	InsertNewTour(ctx context.Context, data *entity.TourCreateData) (*entity.Tour, error)
	GetTourByID(ctx context.Context, tourID string) (*entity.Tour, error)
	ListTours(ctx context.Context, paging *paging.Paging) ([]*entity.Tour, error)
	UpdateTour(ctx context.Context, tourID string, data *entity.TourPatchData) error
	DeleteTour(ctx context.Context, tourID string) error
}

type Business interface {
	CreateNewTour(ctx context.Context, data *entity.TourCreateData) (*entity.Tour, error)
	ListTours(ctx context.Context, paging *paging.Paging) ([]*entity.Tour, error)
	GetTourDetails(ctx context.Context, tourID string) (*entity.Tour, error)
	UpdateTour(ctx context.Context, tourID string, data *entity.TourPatchData) error
	DeleteTour(ctx context.Context, tourID string) error
}

type API interface {
	CreateTourHdl() gin.HandlerFunc
	ListTourHdl() gin.HandlerFunc
	GetTourHdl() gin.HandlerFunc
	UpdateTourHdl() gin.HandlerFunc
	DeleteTourHdl() gin.HandlerFunc
}
