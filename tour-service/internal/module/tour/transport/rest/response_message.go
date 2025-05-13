package rest

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type responseMessage struct {
	Message    string      `json:"message"`
	StatusCode int         `json:"status_code"`
	Data       interface{} `json:"data"`
}

// 200 OK
func responseSuccess(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, responseMessage{
		Data:       data,
		StatusCode: http.StatusOK,
		Message:    http.StatusText(http.StatusOK),
	})
}

// 202 Accepted
func responseAccepted(c *gin.Context, data interface{}) {
	c.JSON(http.StatusAccepted, responseMessage{
		Data:       data,
		StatusCode: http.StatusAccepted,
		Message:    http.StatusText(http.StatusAccepted),
	})
}

// 200 OK with custom message only (no data)
func responseSuccessWithMessage(c *gin.Context, message string) {
	c.JSON(http.StatusOK, responseMessage{
		Data:       nil,
		StatusCode: http.StatusOK,
		Message:    message,
	})
}

// 500 Internal Server Error with error object
func responseError(c *gin.Context, err error) {
	c.JSON(http.StatusInternalServerError, responseMessage{
		Data:       nil,
		StatusCode: http.StatusInternalServerError,
		Message:    err.Error(),
	})
}

// 500 Internal Server Error with custom message
func responseErrorWithMessage(c *gin.Context, message string) {
	c.JSON(http.StatusInternalServerError, responseMessage{
		Data:       nil,
		StatusCode: http.StatusInternalServerError,
		Message:    message,
	})
}

// 404 Not Found
func responseNotFound(c *gin.Context, err error) {
	c.JSON(http.StatusNotFound, responseMessage{
		Data:       nil,
		StatusCode: http.StatusNotFound,
		Message:    err.Error(),
	})
}
