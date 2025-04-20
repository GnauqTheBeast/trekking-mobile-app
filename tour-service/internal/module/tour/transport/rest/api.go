package rest

import (
	"github.com/gin-gonic/gin"
	"github.com/trekking-mobile-app/internal/module/tour/business"
	"github.com/trekking-mobile-app/internal/module/tour/entity"
	"github.com/trekking-mobile-app/internal/pkg/paging"
	"net/http"
)

type API interface {
	CreateTourHdl() gin.HandlerFunc
	ListTourHdl() gin.HandlerFunc
	GetTourHdl() gin.HandlerFunc
	UpdateTourHdl() gin.HandlerFunc
	DeleteTourHdl() gin.HandlerFunc
}

type api struct {
	biz business.Business
}

func NewAPI(biz business.Business) *api {
	return &api{
		biz: biz,
	}
}

func (a *api) CreateTourHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		data := new(entity.TourCreateData)
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

func (a *api) ListTourHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		listTours, err := a.biz.ListTours(c, paging.GetQueryPaging(c))
		if err != nil {
			responseError(c, err)
		}

		responseSuccess(c, listTours)
		return
	}
}

func (a *api) GetTourHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		tourID := c.Param("id")
		if tourID == "" {
			responseErrorWithMessage(c, "tourID is required")
			return
		}

		tourDetails, err := a.biz.GetTourDetails(c, tourID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": tourDetails.ID})
		return
	}
}

func (a *api) UpdateTourHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "UpdateTourHdl called"})
	}
}

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
