package paging

import (
	"github.com/gin-gonic/gin"
	"strconv"
)

const (
	defaultQueryPage     = "1"
	defaultQueryPageSize = "8"
)

type Paging struct {
	Limit     int
	Offset    int
	SortOrder string
	Filter    string
}

func GetQueryPaging(c *gin.Context) *Paging {
	page := stringToInt(c.DefaultQuery("page", defaultQueryPage))
	size := stringToInt(c.DefaultQuery("size", defaultQueryPageSize))
	sortOrder := c.DefaultQuery("sort_order", "desc")
	filter := c.DefaultQuery("filter", "")
	return &Paging{
		Limit:     size,
		Offset:    (page - 1) * size,
		SortOrder: sortOrder,
		Filter:    filter,
	}
}

func stringToInt(s string) int {
	i, err := strconv.Atoi(s)
	if err != nil {
		return 0
	}
	return i
}
