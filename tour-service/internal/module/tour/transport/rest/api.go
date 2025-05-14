package rest

import (
	"context"
	"fmt"
	"github.com/trekking-mobile-app/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/trekking-mobile-app/internal/module/tour/entity"
	"github.com/trekking-mobile-app/internal/pkg/paging"
)

const (
	createTourPermission = "create_tour"
)

type Business interface {
	CreateNewTour(ctx context.Context, data *entity.Tour) (*entity.Tour, error)
	ListTours(ctx context.Context, paging *paging.Paging) ([]*entity.Tour, error)
	GetTourDetails(ctx context.Context, tourId string) (*entity.Tour, error)
	UpdateTour(ctx context.Context, tourId string, data *entity.TourPatchData) error
	DeleteTour(ctx context.Context, tourId string) error
	UpdateTourAvailableSlot(ctx context.Context, tourId string, lockedSlot int) (*entity.Tour, error)
}

type api struct {
	biz Business
}

func NewAPI(biz Business) *api {
	return &api{
		biz: biz,
	}
}

// CreateTourHdl godoc
// @Summary Tạo tour mới
// @Description API tạo tour du lịch mới
// @Tags Tour
// @Accept json
// @Produce json
// @Param tour body entity.Tour true "Thông tin tour"
// @Success 200 {object} entity.Tour
// @Failure 400 {object} map[string]string
// @Router /api/v1/tours [post]
func (a *api) CreateTourHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exist := c.Get("userRole")
		if !exist {
			responseUnauthorized(c, fmt.Errorf("user role not found in context"))
			return
		}

		if userRole.(string) != "host" {
			responseUnauthorized(c, fmt.Errorf("user is not authorized to perform this action"))
			return
		}

		userPermissions, exist := c.Get("userPermissions")
		if !exist {
			responseUnauthorized(c, fmt.Errorf("user permissions not found in context"))
			return
		}

		if !utils.CheckUserPermission(createTourPermission, userPermissions.([]string)) {
			responseForbidden(c, fmt.Errorf("user does not have permission to create tour"))
			return
		}

		data := new(entity.Tour)
		if err := c.ShouldBindJSON(&data); err != nil {
			responseError(c, err)
			return
		}

		createdTour, err := a.biz.CreateNewTour(c, data)
		if err != nil {
			responseError(c, err)
			return
		}

		responseSuccess(c, createdTour)
		return
	}
}

// ListTourHdl godoc
// @Summary Danh sách tour
// @Description Lấy danh sách tour theo phân trang
// @Tags Tour
// @Accept json
// @Produce json
// @Param page query int false "Trang hiện tại"
// @Param size query int false "Số lượng mỗi trang"
// @Success 200 {array} entity.Tour
// @Failure 400 {object} map[string]string
// @Router /api/v1/tours [get]
func (a *api) ListTourHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		listTours, err := a.biz.ListTours(c, paging.GetQueryPaging(c))
		if err != nil {
			responseError(c, err)
			return
		}

		responseSuccess(c, listTours)
		return
	}
}

// GetTourHdl godoc
// @Summary Lấy thông tin chi tiết tour
// @Description Lấy chi tiết tour theo ID
// @Tags Tour
// @Accept json
// @Produce json
// @Param id path string true "Tour ID"
// @Success 200 {object} entity.Tour
// @Failure 400 {object} map[string]string
// @Router /api/v1/tours/{id} [get]
func (a *api) GetTourHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		tourId := c.Param("id")
		if tourId == "" {
			responseErrorWithMessage(c, "tourId is required")
			return
		}

		tourDetails, err := a.biz.GetTourDetails(c, tourId)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": tourDetails})
		return
	}
}

// UpdateTourHdl godoc
// @Summary Cập nhật thông tin tour
// @Description Cập nhật tour theo ID
// @Tags Tour
// @Accept json
// @Produce json
// @Param id path string true "Tour ID"
// @Param tour body entity.TourPatchData true "Dữ liệu cần cập nhật"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Router /api/v1/tours/{id} [patch]
func (a *api) UpdateTourHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		tourId := c.Param("id")
		if tourId == "" {
			responseErrorWithMessage(c, "tourId is required")
			return
		}

		data := new(entity.TourPatchData)
		if err := c.ShouldBindJSON(&data); err != nil {
			responseError(c, err)
			return
		}

		err := a.biz.UpdateTour(c, tourId, data)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		responseSuccess(c, nil)
		return
	}
}

// DeleteTourHdl godoc
// @Summary Xóa tour
// @Description Xóa tour theo ID
// @Tags Tour
// @Accept json
// @Produce json
// @Param id path string true "Tour ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Router /api/v1/tours/{id} [delete]
func (a *api) DeleteTourHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		tourID := c.Param("id")
		if tourID == "" {
			responseErrorWithMessage(c, "tourID is required")
			return
		}

		err := a.biz.DeleteTour(c, tourID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		responseSuccessWithMessage(c, "delete booking successful")
		return
	}
}
