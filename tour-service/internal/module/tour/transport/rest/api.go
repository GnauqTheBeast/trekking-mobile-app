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

func (a *api) Ping() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
			"ping":    "plunk",
		})
	}
}

func (a *api) CreateTourHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		data := new(entity.Tour)
		if err := c.ShouldBindJSON(&data); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		err := a.biz.CreateNewTour(c, data)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		return
	}
}

func (a *api) GetTourNameHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "GetTourNameHdl called"})
	}
}

func (a *api) ListTourHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "ListTourHdl called"})
	}
}

func (a *api) GetTourHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "GetTourHdl called"})
	}
}

func (a *api) UpdateTourHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "UpdateTourHdl called"})
	}
}

func (a *api) DeleteTourHdl() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "DeleteTourHdl called"})
	}
}
