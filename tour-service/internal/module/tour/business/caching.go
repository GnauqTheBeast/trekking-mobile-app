package business

import (
	"fmt"
	"github.com/trekking-mobile-app/internal/pkg/paging"
	"time"
)

const (
	redisKeyPagingListTour        = "v1_paging_tour_%d_%d_%s_%s" // v1_paging_tour_<limit>_<offset>_<sort_order>_<filter>
	redisKeyPagingListTourPattern = "v1_paging_tour_*"

	redisKeyTourDetail        = "v1_tour_detail_%s" // v1_tour_<tour_id>
	redisKeyTourDetailPattern = "v1_tour_detail_*"

	pagingListTourTTL   = 1 * time.Hour
	pagingTourDetailTTL = 1 * time.Hour
)

func redisPagingListTour(paging *paging.Paging) string {
	return fmt.Sprintf(redisKeyPagingListTour, paging.Limit, paging.Offset, paging.SortOrder, paging.Filter)
}

func redisTourDetail(tourId string) string {
	return fmt.Sprintf(redisKeyTourDetail, tourId)
}
