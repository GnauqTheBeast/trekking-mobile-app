package rpc

import (
	"context"

	"github.com/trekking-mobile-app/proto/pb"
)

type rpcClient struct {
	client pb.TourServiceClient
}

func NewClient(client pb.TourServiceClient) *rpcClient {
	return &rpcClient{client: client}
}

func (c *rpcClient) CheckTourExist(ctx context.Context, tourId string) (*pb.TourResp, error) {
	exist, err := c.client.CheckTourExist(ctx, &pb.TourReq{TourId: tourId})
	if err != nil {
		return nil, err
	}

	return exist, nil
}

func (c *rpcClient) UpdateTourAvailableSlot(ctx context.Context, tourId string, lockedSlot int) (*pb.AvailableSlotResp, error) {
	slotTourUpdated, err := c.client.UpdateTourAvailableSlot(ctx, &pb.AvailableSlotReq{
		TourId:     tourId,
		LockedSlot: int32(lockedSlot),
	})
	if err != nil {
		return nil, err
	}

	return slotTourUpdated, nil
}
