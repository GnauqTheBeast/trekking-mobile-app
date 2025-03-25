package api

import (
	"context"
	"fmt"
	"github.com/trekking-mobile-app/proto/pb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

const (
	bookingAddr = "localhost:50051"
)

func startGrpcServer() {
	conn, err := grpc.NewClient(bookingAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		fmt.Println(err)
		return
	}
	defer conn.Close()

	tourClient := pb.NewTourServiceClient(conn)

	tour, err := tourClient.CheckTourExist(context.Background(), &pb.TourReq{
		TourId: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
	})

	if err != nil {
		fmt.Println(err)
	}

	fmt.Println("nhu cc", tour)
}
