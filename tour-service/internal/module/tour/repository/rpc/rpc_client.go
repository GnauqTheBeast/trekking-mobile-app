package rpc

import (
	"context"

	"github.com/trekking-mobile-app/proto/pb"
)

type RpcClient struct {
	client pb.AuthServiceClient
}

func NewClient(client pb.AuthServiceClient) *RpcClient {
	return &RpcClient{client: client}
}

func (c *RpcClient) Validate(ctx context.Context, jwtToken string) (int, string, []string, error) {
	validated, err := c.client.Validate(ctx, &pb.ValidateRequest{
		Token: jwtToken,
	})
	if err != nil {
		return 0, "", nil, err
	}

	return int(validated.Status), validated.Role, validated.Permissions, nil
}
