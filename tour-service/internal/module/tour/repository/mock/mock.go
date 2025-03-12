package mock

import (
	"context"
	"sync"

	"github.com/trekking-mobile-app/app/model"
	"github.com/trekking-mobile-app/internal/module/tour"
	"github.com/trekking-mobile-app/internal/module/tour/entity"
)

type Repository struct {
	mu    sync.RWMutex
	tours map[string]*entity.Tour
}

func New() tour.Repository {
	return &Repository{
		tours: make(map[string]*entity.Tour),
	}
}

func (r *Repository) InsertNewTour(ctx context.Context, data *entity.Tour) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, exists := r.tours[data.Id]; exists {
		return tour.ErrTourAlreadyExists
	}

	r.tours[data.Id] = data
	return nil
}

func (r *Repository) GetTourByID(ctx context.Context, tourID string) (*entity.Tour, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	t, exists := r.tours[tourID]
	if !exists {
		return nil, tour.ErrTourNotFound
	}

	return t, nil
}

func (r *Repository) FindTour(ctx context.Context, paging *model.Paging) ([]*entity.Tour, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if paging == nil {
		return nil, tour.ErrInvalidPagination
	}

	var result []*entity.Tour
	for _, t := range r.tours {
		result = append(result, t)
	}

	start := (paging.Page - 1) * paging.Limit
	end := start + paging.Limit
	if start >= len(result) {
		return []*entity.Tour{}, nil
	}
	if end > len(result) {
		end = len(result)
	}

	return result[start:end], nil
}

func (r *Repository) UpdateTour(ctx context.Context, tourID string, data *entity.TourPatchData) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	t, exists := r.tours[tourID]
	if !exists {
		return tour.ErrTourNotFound
	}

	if data != nil {
		t.Title = *data.Title
		t.Description = *data.Description
		t.Status = *data.Status
	}

	return nil
}

func (r *Repository) DeleteTour(ctx context.Context, tourID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, exists := r.tours[tourID]; !exists {
		return tour.ErrTourNotFound
	}

	delete(r.tours, tourID)
	return nil
}
