package rpc

import (
	"fmt"
	"net"

	"github.com/trekking-mobile-app/internal/context"
	"github.com/trekking-mobile-app/internal/dependencies"
	"github.com/trekking-mobile-app/internal/module/tour/business"
	"github.com/trekking-mobile-app/internal/module/tour/repository/postgres"
	"github.com/trekking-mobile-app/internal/module/tour/transport/rpc"
	"github.com/trekking-mobile-app/proto/pb"
	"github.com/urfave/cli/v2"
	"google.golang.org/grpc"
)

func NewCommand() *cli.Command {
	return &cli.Command{
		Name:  "rpc",
		Usage: "start the RPC server",
		Action: func(c *cli.Context) error {
			return start(c)
		},
		Before: func(c *cli.Context) error {
			return beforeCommand()
		},
	}
}

func beforeCommand() error {
	dependencies.Register(context.SetContextSQL)
	dependencies.Register(context.SetContextRedisClient)
	return dependencies.Init()
}

func start(c *cli.Context) error {
	return startGrpcServer()
}

func startGrpcServer() error {
	s := grpc.NewServer()

	repo := postgres.NewPostgresRepo(context.GetSQLClient())
	biz := business.NewBusiness(repo, context.GetRedisClient())
	tourRpcService := rpc.NewTourServiceServer(biz)

	pb.RegisterTourServiceServer(s, tourRpcService)

	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		return err
	}

	fmt.Println("tour service listening on port 50051")
	if err := s.Serve(lis); err != nil {
		return err
	}

	return nil
}
