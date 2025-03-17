package business

import (
	"context"
	"fmt"
	"github.com/google/uuid"
	"time"

	"github.com/trekking-mobile-app/app/model"
	"github.com/trekking-mobile-app/internal/module/tour"
	"github.com/trekking-mobile-app/internal/module/tour/entity"
)

var (
	ErrInvalidTourData         = fmt.Errorf("invalid tour data")
	ErrTourNotFound            = fmt.Errorf("tour not found")
	ErrInvalidStatusTransition = fmt.Errorf("invalid status transition")
)

type business struct {
	repository tour.Repository
}

func NewBusiness(repository tour.Repository) tour.Business {
	if repository == nil {
		panic("repository is required")
	}
	return &business{
		repository: repository,
	}
}

func (b *business) CreateNewTour(ctx context.Context, data *entity.Tour) error {
	if data == nil {
		return ErrInvalidTourData
	}

	if data.Name == "" || len(data.Name) < 3 {
		return fmt.Errorf("%w: title must be at least 3 characters", ErrInvalidTourData)
	}
	if data.Description == "" || len(data.Description) < 10 {
		return fmt.Errorf("%w: description must be at least 10 characters", ErrInvalidTourData)
	}
	if data.Status == "" {
		data.Status = entity.TourStatusDraft
	}

	now := time.Now()
	data.CreatedAt = now
	data.UpdatedAt = now

	data.ID = uuid.New()

	return b.repository.InsertNewTour(ctx, data)
}

func (b *business) ListTours(ctx context.Context, paging *model.Paging) ([]*entity.Tour, error) {
	if paging == nil {
		paging = &model.Paging{
			Limit:  10,
			Offset: 0,
		}
	}

	if paging.Limit <= 0 || paging.Limit > 100 {
		paging.Limit = 10
	}
	if paging.Offset < 0 {
		paging.Offset = 0
	}

	return b.repository.ListTours(ctx, paging)
}

func (b *business) GetTourDetails(ctx context.Context, tourID string) (*entity.Tour, error) {
	if tourID == "" {
		return nil, fmt.Errorf("%w: tour ID is required", ErrInvalidTourData)
	}

	tour, err := b.repository.GetTourByID(ctx, tourID)
	if err != nil {
		return nil, fmt.Errorf("failed to get tour: %w", err)
	}
	return tour, nil
}

func (b *business) UpdateTour(ctx context.Context, tourID string, data *entity.TourPatchData) error {
	if tourID == "" {
		return fmt.Errorf("%w: tour ID is required", ErrInvalidTourData)
	}
	if data == nil {
		return ErrInvalidTourData
	}

	existingTour, err := b.repository.GetTourByID(ctx, tourID)
	if err != nil {
		return fmt.Errorf("failed to get existing tour: %w", err)
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

	return b.repository.UpdateTour(ctx, tourID, data)
}

func (b *business) DeleteTour(ctx context.Context, tourID string) error {
	if tourID == "" {
		return fmt.Errorf("%w: tourByID ID is required", ErrInvalidTourData)
	}

	tourByID, err := b.repository.GetTourByID(ctx, tourID)
	if err != nil {
		return fmt.Errorf("failed to get tourByID: %w", err)
	}

	if tourByID.Status == entity.TourStatusPublished {
		return fmt.Errorf("%w: cannot delete published tourByID", ErrInvalidStatusTransition)
	}

	return b.repository.DeleteTour(ctx, tourID)
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
