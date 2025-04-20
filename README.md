# Trekking Mobile App - Tour Service

A microservice for managing tour operations in the Trekking Mobile App platform. Built using Clean Architecture principles in Go.

## Architecture

The service follows Clean Architecture with the following layers:

### 1. Entity Layer (`entity/`)
- Contains domain models and business rules
- Independent of other layers
- Core business objects

### 2. Business Layer (`business/`)
- Implements core business logic
- Uses repository interfaces
- Handles validation and business rules

### 3. Repository Layer (`repository/`)
- Handles data persistence
- Implements database operations
- Includes mock implementations for testing

### 4. Transport Layer (`transport/`)
- REST API endpoints
- RPC services
- Request/response handling

## Getting Started

### Prerequisites
- Go 1.19 or later
- PostgreSQL

### Installation
```bash
# Clone the repository
git clone https://github.com/GnauqTheBeast/trekking-mobile-app.git

# Navigate to the service directory
cd booking-service

# Install dependencies
go mod download

# Run the service
go run cmd/api/main.go
```

### Configuration
Environment variables:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trekking
DB_USER=postgres
DB_PASSWORD=secret

## Testing

```bash
# Run unit tests
go test ./...

# Run with coverage
go test -cover ./...
```

## Project Structure

tour-service/
├── cmd/
│ └── api/ # Application entry points
├── internal/
│ └── module/
│   └── tour/ 
│ ├── entity/
│ ├── business/
│ ├── repository/
│ └── transport/
|   └── rest/
|   └── grpc/   
└── pkg/

```

## Error Handling
The service uses domain-specific error types defined in `errors.go` for consistent error handling across layers.

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details