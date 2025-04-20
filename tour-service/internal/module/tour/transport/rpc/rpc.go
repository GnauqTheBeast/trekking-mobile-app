package rpc

import (
	"context"
	"github.com/trekking-mobile-app/internal/module/tour/entity"
	"github.com/trekking-mobile-app/proto/pb"
)

type Business interface {
	CheckTourExist(ctx context.Context, tourID string) (*entity.Tour, error)
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
	exist, err := t.business.CheckTourExist(ctx, req.TourId)
	if err != nil {
		return nil, err
	}

	return &pb.TourResp{
		TourId:      req.TourId,
		Name:        exist.Name,
		Description: exist.Description,
		Slot:        exist.Slot,
	}, nil
}
