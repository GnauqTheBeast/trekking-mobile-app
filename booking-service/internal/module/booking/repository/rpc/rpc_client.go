package rpc

import (
	"context"
	"fmt"
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

	fmt.Println(exist)
	return exist, nil
}
