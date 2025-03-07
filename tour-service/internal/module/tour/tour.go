package tour

import (
	"context"
	"github.com/gin-gonic/gin"
	"github.com/trekking-mobile-app/app/model"
	"github.com/trekking-mobile-app/internal/module/tour/entity"
)

type Repository interface {
	InsertNewTask(ctx context.Context, data *entity.TourCreationData) error
	GetTourByID(ctx context.Context, tourID int64) (*entity.Tour, error)
	FindTour(ctx context.Context, paging *model.Paging) ([]*entity.Tour, error)
	UpdateTour(ctx context.Context, tourID int64, data *entity.TourPatchData) error
	DeleteTour(ctx context.Context, tourID int64) error
}

type Business interface {
	CreateNewTour(ctx context.Context, data *entity.TourCreationData) error
	ListTasks(ctx context.Context, paging *model.Paging) ([]*entity.Tour, error)
	GetTourDetails(ctx context.Context, tourID string) (*entity.Tour, error)
	UpdateTour(ctx context.Context, tourID string, data *entity.TourPatchData) error
	DeleteTour(ctx context.Context, tourID string) error
}

type API interface {
	GetTourNameHdl() gin.HandlerFunc
	ListTourHdl() gin.HandlerFunc
	GetTourHdl() gin.HandlerFunc
	UpdateTourHdl() gin.HandlerFunc
	DeleteTourHdl() gin.HandlerFunc
}
