package postgres

import (
	"context"
	"github.com/trekking-mobile-app/internal/pkg/paging"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"

	"github.com/trekking-mobile-app/internal/module/tour/entity"
)

type MockQueries struct {
	mock.Mock
}

func (m *MockQueries) InsertNewTour(ctx context.Context, data *entity.Tour) (*entity.Tour, error) {
	args := m.Called(ctx, data)
	return args.Get(0).(*entity.Tour), args.Error(1)
}

func (m *MockQueries) ListTours(ctx context.Context, paging *paging.Paging) ([]*entity.Tour, error) {
	args := m.Called(ctx, paging)
	return args.Get(0).([]*entity.Tour), args.Error(1)
}

func (m *MockQueries) GetTourByID(ctx context.Context, tourID string) (*entity.Tour, error) {
	args := m.Called(ctx, tourID)
	return args.Get(0).(*entity.Tour), args.Error(1)
}

func (m *MockQueries) UpdateTour(ctx context.Context, tourID string, data *entity.TourPatchData) error {
	args := m.Called(ctx, data)
	return args.Error(0)
}

func (m *MockQueries) DeleteTour(ctx context.Context, id string) error {
	args := m.Called(ctx, id)
	return args.Error(0)
}

func TestListTours(t *testing.T) {
	mockQueries := new(MockQueries)
	ctx := context.Background()

	t.Run("list tours", func(t *testing.T) {
		now := time.Now()
		mockTours := []*entity.Tour{{
			ID:          uuid.New(),
			Name:        "Test Tour",
			Description: "Test Description",
			Status:      "active",
			CreatedAt:   now,
		}}

		mockQueries.On("ListTours", ctx, mock.Anything).Return(mockTours, nil)

		result, err := mockQueries.ListTours(ctx, &paging.Paging{Limit: 8, Offset: 0})
		assert.NoError(t, err)
		assert.Len(t, result, 1)
		assert.Equal(t, mockTours[0].ID, result[0].ID)
	})
}

func TestGetTourByID(t *testing.T) {
	mockQueries := new(MockQueries)
	ctx := context.Background()

	t.Run("get booking by id", func(t *testing.T) {
		tourID := uuid.New()
		mockTour := &entity.Tour{
			ID:          tourID,
			Name:        "Test Tour",
			Description: "Test Description",
			Status:      "active",
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		}

		mockQueries.On("GetTourById", ctx, tourID.String()).Return(mockTour, nil)

		result, err := mockQueries.GetTourByID(ctx, tourID.String())

		assert.NoError(t, err)
		assert.Equal(t, mockTour.ID, result.ID)
	})
}

func TestInsertNewTour(t *testing.T) {
	mockQueries := new(MockQueries)
	ctx := context.Background()

	t.Run("insert new booking", func(t *testing.T) {
		mockTour := &entity.Tour{
			ID:   uuid.New(),
			Name: "New Tour",
		}

		mockQueries.On("InsertNewTour", ctx, mock.Anything).Return(mockTour, nil)

		createdTour, err := mockQueries.InsertNewTour(ctx, mockTour)
		assert.NoError(t, err)
		assert.Equal(t, mockTour.ID, createdTour.ID)
	})
}

func TestDeleteTour(t *testing.T) {
	mockQueries := new(MockQueries)
	ctx := context.Background()

	t.Run("delete booking", func(t *testing.T) {
		tourID := uuid.New()
		mockQueries.On("DeleteTour", ctx, tourID.String()).Return(nil)

		err := mockQueries.DeleteTour(ctx, tourID.String())
		assert.NoError(t, err)
	})
}
