package rest

import (
	"github.com/gin-gonic/gin"
	"github.com/trekking-mobile-app/internal/module/tour"
	"github.com/trekking-mobile-app/internal/module/tour/entity"
	"net/http"
)

type api struct {
	biz tour.Business
}

func NewAPI(biz tour.Business) tour.API {
	return &api{
		biz: biz,
	}
}

func (a *api) CreateTourHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
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

func (a *api) ListTourHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "ListTourHdl called"})
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

		responseSuccessWithMessage(c, "delete tour successful")
		return
	}
}
