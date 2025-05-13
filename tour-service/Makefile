postgres:
	docker run --name postgres_trekking_app -e POSTGRES_USER=root -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
createdb:
	docker exec -it app_postgres createdb --username=postgres --owner=postgres trekking_app
dropdb:
	docker exec -it app_postgres dropdb trekking_app
create-migration:
	migrate create -ext sql -dir ./cmd/migrate/migrations -seq init_table
migrateup:
	migrate -path core/app/database/migration -database "postgres://postgres:postgres@localhost:5432/trekking_app?sslmode=disable" -verbose up
migratedown:
	migrate -path core/app/database/migration -database "postgres://postgres:postgres@localhost:5432/trekking_app?sslmode=disable" -verbose down
sqlc:
	sqlc generate
test:
	go test -v -cover ./...
protoc:
	protoc --proto_path=proto --go_out=proto/pb --go_opt=paths=source_relative \
               --go-grpc_out=proto/pb --go-grpc_opt=paths=source_relative \
               proto/*.proto
.PHONY: postgres createdb dropdb migratedown migrateup sqlc test create-migration protoc

