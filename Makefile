postgres:
	docker run --name postgres_trekking-app -e POSTGRES_USER=root -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
createdb:
	docker exec -it app_postgres createdb --username=postgres --owner=postgres trekking-app
dropdb:
	docker exec -it app_postgres dropdb trekking-app
create-migration:
	migrate create -ext sql -dir ./migration/cmd/migrate/migrations -seq schema_1
migrateup:
	migrate -path core/app/database/migration -database "postgres://postgres:postgres@localhost:5432/trekking-app?sslmode=disable" -verbose up
migratedown:
	migrate -path core/app/database/migration -database "postgres://postgres:postgres@localhost:5432/trekking-app?sslmode=disable" -verbose down
sqlc:
	sqlc generate
test:
	go test -v -cover ./...
docker-compose:
	docker compose up -d
.PHONY: postgres createdb dropdb migratedown migrateup sqlc test docker-compose create-migration

