package rpc

import (
	"context"
	"time"

	"github.com/trekking-mobile-app/internal/module/tour/entity"
	"github.com/trekking-mobile-app/proto/pb"
)

type Business interface {
	CheckTourExist(ctx context.Context, tourId string) (*entity.Tour, error)
	UpdateTourAvailableSlot(ctx context.Context, tourId string, lockSlot int) (*entity.Tour, error)
}

type TourServiceServer struct {
	pb.UnimplementedTourServiceServer
	business Business
}

func NewTourServiceServer(business Business) *TourServiceServer {
	return &TourServiceServer{
		business: business,
	}
}

func (t *TourServiceServer) CheckTourExist(ctx context.Context, req *pb.TourReq) (*pb.TourResp, error) {
	tour, err := t.business.CheckTourExist(ctx, req.TourId)
	if err != nil {
		return nil, err
	}

	return &pb.TourResp{
		TourId:        tour.ID.String(),
		Name:          tour.Name,
		Description:   tour.Description,
		HostId:        tour.HostID.String(),
		Slot:          int32(tour.Slot),
		AvailableSlot: int32(tour.AvailableSlot),
		Status:        string(tour.Status),
		StartAt:       tour.TimeStart.Format(time.RFC3339),
		EndAt:         tour.TimeEnd.Format(time.RFC3339),
		Price:         int32(tour.Price),
		Duration:      tour.Duration,
		Distance:      int32(tour.Distance),
		Elevation:     int32(tour.Elevation),
		Location:      tour.Location,
		Level:         tour.Level,
		Images:        tour.Images,
		Rate:          tour.Rate,
		CreatedAt:     tour.CreatedAt.Format(time.RFC3339),
		UpdatedAt:     tour.UpdatedAt.Format(time.RFC3339),
	}, nil
}

func (t *TourServiceServer) UpdateTourAvailableSlot(ctx context.Context, req *pb.AvailableSlotReq) (*pb.AvailableSlotResp, error) {
	tour, err := t.business.UpdateTourAvailableSlot(ctx, req.TourId, int(req.LockedSlot))
	if err != nil {
		return nil, err
	}

	return &pb.AvailableSlotResp{
		TourId:        tour.ID.String(),
		Name:          tour.Name,
		Description:   tour.Description,
		HostId:        tour.HostID.String(),
		Slot:          int32(tour.Slot),
		AvailableSlot: int32(tour.AvailableSlot),
		Status:        string(tour.Status),
		StartAt:       tour.TimeStart.Format(time.RFC3339),
		EndAt:         tour.TimeEnd.Format(time.RFC3339),
		Price:         int32(tour.Price),
		Duration:      tour.Duration,
		Distance:      int32(tour.Distance),
		Elevation:     int32(tour.Elevation),
		Level:         tour.Level,
		Location:      tour.Location,
		Images:        tour.Images,
		Rate:          tour.Rate,
		CreatedAt:     tour.CreatedAt.Format(time.RFC3339),
		UpdatedAt:     tour.UpdatedAt.Format(time.RFC3339),
	}, nil
}
