package api

import (
	"log"
	"os"

	"github.com/trekking-mobile-app/internal/module/booking/business"
	"github.com/trekking-mobile-app/internal/module/booking/repository/rpc"
	"github.com/trekking-mobile-app/proto/pb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func tourGrpcClient() business.TourRepository {
	conn, err := grpc.NewClient(os.Getenv("TOUR_RPC"), grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Println(err)
		return nil
	}
	return rpc.NewClient(pb.NewTourServiceClient(conn))
}

func authGrpcClient() *rpc.AuthRpcClient {
	conn, err := grpc.NewClient(os.Getenv("AUTH_RPC"), grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Println(err)
		return nil
	}
	return rpc.NewAuthClient(pb.NewAuthServiceClient(conn))
}
