package business

import (
	"context"
	"errors"
	"fmt"
	"github.com/google/uuid"
	"github.com/trekking-mobile-app/internal/pkg/paging"
	"time"

	"github.com/trekking-mobile-app/internal/module/tour/entity"
)

var (
	ErrInvalidTourData         = fmt.Errorf("invalid tour data")
	ErrInvalidStatusTransition = fmt.Errorf("invalid status transition")
)

type Repository interface {
	InsertNewTour(ctx context.Context, data *entity.TourCreateData) (*entity.Tour, error)
	GetTourById(ctx context.Context, tourId string) (*entity.Tour, error)
	ListTours(ctx context.Context, paging *paging.Paging) ([]*entity.Tour, error)
	UpdateTour(ctx context.Context, tourId string, data *entity.TourPatchData) error
	DeleteTour(ctx context.Context, tourId string) error
	UpdateTourAvailableSlot(ctx context.Context, tourId string, availableSlot int) (*entity.Tour, error)
}

type business struct {
	repository Repository
}

func NewBusiness(repository Repository) *business {
	if repository == nil {
		panic("repository is required")
	}
	return &business{
		repository: repository,
	}
}

func (b *business) CreateNewTour(ctx context.Context, data *entity.TourCreateData) (*entity.Tour, error) {
	if data == nil {
		return nil, ErrInvalidTourData
	}

	if data.Name == "" || len(data.Name) < 3 {
		return nil, fmt.Errorf("%w: title must be at least 3 characters", ErrInvalidTourData)
	}
	if data.Description == "" || len(data.Description) < 10 {
		return nil, fmt.Errorf("%w: description must be at least 10 characters", ErrInvalidTourData)
	}
	if data.Status == "" {
		data.Status = entity.TourStatusDraft
	}

	now := time.Now()
	data.CreatedAt = now

	return b.repository.InsertNewTour(ctx, data)
}

func (b *business) ListTours(ctx context.Context, paging *paging.Paging) ([]*entity.Tour, error) {
	return b.repository.ListTours(ctx, paging)
}

func (b *business) GetTourDetails(ctx context.Context, tourId string) (*entity.Tour, error) {
	if tourId == "" {
		return nil, fmt.Errorf("%w: booking ID is required", ErrInvalidTourData)
	}

	tour, err := b.repository.GetTourById(ctx, tourId)
	if err != nil {
		return nil, fmt.Errorf("failed to get booking: %w", err)
	}
	return tour, nil
}

func (b *business) UpdateTour(ctx context.Context, tourId string, data *entity.TourPatchData) error {
	if tourId == "" {
		return fmt.Errorf("%w: booking ID is required", ErrInvalidTourData)
	}
	if data == nil {
		return ErrInvalidTourData
	}

	existingTour, err := b.repository.GetTourById(ctx, tourId)
	if err != nil {
		return fmt.Errorf("failed to get existing booking: %w", err)
	}

	if data.Status != "" {
		if err := validateStatusTransition(existingTour.Status, data.Status); err != nil {
			return err
		}
	}

	if data.Name != "" && len(data.Name) < 3 {
		return fmt.Errorf("%w: title must be at least 3 characters", ErrInvalidTourData)
	}
	if data.Description != "" && len(data.Description) < 10 {
		return fmt.Errorf("%w: description must be at least 10 characters", ErrInvalidTourData)
	}

	return b.repository.UpdateTour(ctx, tourId, data)
}

func (b *business) DeleteTour(ctx context.Context, tourId string) error {
	if tourId == "" {
		return fmt.Errorf("%w: tourById ID is required", ErrInvalidTourData)
	}

	tourById, err := b.repository.GetTourById(ctx, tourId)
	if err != nil {
		return fmt.Errorf("failed to get tourById: %w", err)
	}

	if tourById.Status == entity.TourStatusPublished {
		return fmt.Errorf("%w: cannot delete published tourById", ErrInvalidStatusTransition)
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

	tourById, err := b.repository.GetTourById(ctx, tourId)
	if err != nil {
		return nil, fmt.Errorf("failed to get tourById: %w", err)
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

	if tourById.AvailableSlot > tourById.Slot {
		return nil, fmt.Errorf("out of available slot")
	}

	if lockedSlot > int(tourById.AvailableSlot) {
		return nil, fmt.Errorf("out of available slot")
	}

	return b.repository.UpdateTourAvailableSlot(ctx, tourId, int(tourById.AvailableSlot)-lockedSlot)
}
