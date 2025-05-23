package business

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/trekking-mobile-app/app/database/redis"
	"github.com/trekking-mobile-app/internal/pkg/caching"
	"github.com/trekking-mobile-app/internal/pkg/paging"

	"github.com/trekking-mobile-app/internal/module/tour/entity"
)

var (
	ErrInvalidTourData         = fmt.Errorf("invalid tour data")
	ErrInvalidStatusTransition = fmt.Errorf("invalid status transition")
)

type Repository interface {
	InsertNewTour(ctx context.Context, data *entity.Tour) (*entity.Tour, error)
	GetTourById(ctx context.Context, tourId string) (*entity.Tour, error)
	ListTours(ctx context.Context, paging *paging.Paging) (*entity.TourListResponse, error)
	UpdateTour(ctx context.Context, tourId string, data *entity.TourPatchData) error
	DeleteTour(ctx context.Context, tourId string) error
	UpdateTourAvailableSlot(ctx context.Context, tourId string, availableSlot int) (*entity.Tour, error)
	ListToursByHostId(ctx context.Context, hostId string) ([]*entity.Tour, error)
}

type business struct {
	repository Repository
	cache      *redis.CacheRedis
}

func NewBusiness(repository Repository, cache *redis.CacheRedis) *business {
	return &business{
		repository: repository,
		cache:      cache,
	}
}

func (b *business) CreateNewTour(ctx context.Context, data *entity.Tour) (*entity.Tour, error) {
	if data == nil {
		return nil, ErrInvalidTourData
	}

	if data.Name == "" || len(data.Name) < 3 {
		return nil, fmt.Errorf("%w: title must be at least 3 characters", ErrInvalidTourData)
	}

	if data.Description == "" || len(data.Description) < 10 {
		return nil, fmt.Errorf("%w: description must be at least 10 characters", ErrInvalidTourData)
	}

	now := time.Now()
	data.CreatedAt = now

	err := b.DeleteAllTourListCache(ctx)
	if err != nil {
		return nil, err
	}

	return b.repository.InsertNewTour(ctx, data)
}

func (b *business) ListTours(ctx context.Context, paging *paging.Paging) (*entity.TourListResponse, error) {
	tours, err := caching.FetchFromCallback(b.cache, redisPagingListTour(paging), pagingListTourTTL, func() (*entity.TourListResponse, error) {
		return b.repository.ListTours(ctx, paging)
	})
	if err != nil {
		return nil, err
	}

	return tours, nil
}

func (b *business) ListToursByHostId(ctx context.Context, hostId string) ([]*entity.Tour, error) {
	tours, err := b.repository.ListToursByHostId(ctx, hostId)
	if err != nil {
		return nil, err
	}

	return tours, nil
}

func (b *business) GetTourDetails(ctx context.Context, tourId string) (*entity.Tour, error) {
	if tourId == "" {
		return nil, fmt.Errorf("%w: tour ID is required", ErrInvalidTourData)
	}

	tour, err := caching.FetchFromCallback(b.cache, redisTourDetail(tourId), pagingTourDetailTTL, func() (*entity.Tour, error) {
		return b.repository.GetTourById(ctx, tourId)
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get tour: %w", err)
	}

	return tour, nil
}

func (b *business) UpdateTour(ctx context.Context, tourId string, data *entity.TourPatchData) error {
	if tourId == "" {
		return fmt.Errorf("%w: tour ID is required", ErrInvalidTourData)
	}
	if data == nil {
		return ErrInvalidTourData
	}

	if data.Name != "" && len(data.Name) < 3 {
		return fmt.Errorf("%w: title must be at least 3 characters", ErrInvalidTourData)
	}

	if data.Description != "" && len(data.Description) < 10 {
		return fmt.Errorf("%w: description must be at least 10 characters", ErrInvalidTourData)
	}

	err := b.cache.Delete(ctx, redisTourDetail(tourId))
	if err != nil {
		return err
	}

	return b.repository.UpdateTour(ctx, tourId, data)
}

func (b *business) DeleteTour(ctx context.Context, tourId string) error {
	if tourId == "" {
		return fmt.Errorf("%w: tourById ID is required", ErrInvalidTourData)
	}

	_, err := b.repository.GetTourById(ctx, tourId)
	if err != nil {
		return fmt.Errorf("failed to get tourById: %w", err)
	}

	b.cache.Delete(ctx, redisTourDetail(tourId))

	err = b.DeleteAllTourListCache(ctx)
	if err != nil {
		return err
	}

	return b.repository.DeleteTour(ctx, tourId)
}

func validateStatusTransition(current, new entity.TourStatus) error {
	switch current {
	case entity.TourStatusDraft:
		if new != entity.TourStatusPublished {
			return fmt.Errorf("%w: draft can only transition to published", ErrInvalidStatusTransition)
		}
	case entity.TourStatusPublished:
		if new != entity.TourStatusArchived {
			return fmt.Errorf("%w: published can only transition to archived", ErrInvalidStatusTransition)
		}
	case entity.TourStatusArchived:
		return fmt.Errorf("%w: archived tours cannot transition to other states", ErrInvalidStatusTransition)
	}
	return nil
}

func (b *business) CheckTourExist(ctx context.Context, tourId string) (*entity.Tour, error) {
	_, err := uuid.Parse(tourId)
	if err != nil {
		return nil, errors.New("invalid tourById ID")
	}

	tourById, err := caching.FetchFromCallback(b.cache, redisTourDetail(tourId), pagingTourDetailTTL, func() (*entity.Tour, error) {
		return b.repository.GetTourById(ctx, tourId)
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get booking: %w", err)
	}

	return tourById, nil
}

func (b *business) UpdateTourAvailableSlot(ctx context.Context, tourId string, lockedSlot int) (*entity.Tour, error) {
	_, err := uuid.Parse(tourId)
	if err != nil {
		return nil, errors.New("invalid tourById Id")
	}

	tourById, err := b.repository.GetTourById(ctx, tourId)
	if err != nil {
		return nil, fmt.Errorf("failed to get tourById: %w", err)
	}

	//if tourById.AvailableSlot > tourById.Slot {
	//	return nil, fmt.Errorf("tour data is not correct")
	//}

	if lockedSlot > int(tourById.AvailableSlot) {
		return nil, fmt.Errorf("out of available slot")
	}

	err = b.cache.Delete(ctx, redisTourDetail(tourId))
	if err != nil {
		return nil, fmt.Errorf("failed to delete tour: %w", err)
	}

	return b.repository.UpdateTourAvailableSlot(ctx, tourId, int(tourById.AvailableSlot)-lockedSlot)
}

func (b *business) DeleteAllTourListCache(ctx context.Context) error {
	keys, err := b.cache.Keys(redisKeyPagingListTourPattern)
	if err != nil {
		return err
	}
	for _, key := range keys {
		b.cache.Delete(ctx, key)
	}
	return nil
}
