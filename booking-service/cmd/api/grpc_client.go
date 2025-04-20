package api

import (
	"github.com/trekking-mobile-app/internal/module/booking/business"
	"github.com/trekking-mobile-app/internal/module/booking/repository/rpc"
	"github.com/trekking-mobile-app/proto/pb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"log"
)

const (
	bookingAddr = "localhost:50051"
)

func tourGrpcClient() business.TourRepository {
	conn, err := grpc.NewClient(bookingAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Println(err)
		return nil
	}

	return rpc.NewClient(pb.NewTourServiceClient(conn))
}
