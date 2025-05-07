package rpc

import (
	"context"
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
		Slot:          tour.Slot,
		AvailableSlot: tour.AvailableSlot,
		HostId:        tour.HostID.String(),
		Status:        string(tour.Status),
		Price:         tour.Price,
		StartAt:       tour.TimeStart.String(),
		EndAt:         tour.TimeEnd.String(),
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
		Slot:          tour.Slot,
		AvailableSlot: tour.AvailableSlot,
		HostId:        tour.HostID.String(),
		Status:        string(tour.Status),
		Price:         tour.Price,
		StartAt:       tour.TimeStart.String(),
		EndAt:         tour.TimeEnd.String(),
	}, nil
}
