# Use Case: Đặt tour leo núi

### Thành viên: 
- Vũ Ngọc Sơn - B21DCCN654
- Nguyễn Ngọc Quang - B21DCCN630 
- Nguyễn Anh Đức - B21DCCN245


---

## 📁 Cấu trúc thư mục 

```
mid-project-630245654/
├── docs/
│   ├── api-specs/
│   │   ├── auth-service.yaml
│   │   ├── booking-service.yaml
│   │   ├── notification-service.yaml
│   │   ├── payment-service.yaml
│   │   ├── tour-service.yaml
│   │   └── user-service.yaml
│   ├── architecture.md
│   ├── analysis-and-design.md
│   └── assets/
│       ├── architecture.png
│       └── schema.png
│
├── services/
│   ├── auth-service/
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   │   ├── controller/
│   │   │   │   │   └── auth.controller.ts
│   │   │   │   ├── dto/
│   │   │   │   │   └── auth.dto.ts
│   │   │   │   ├── interface/
│   │   │   │   │   ├── auth.interface.ts
│   │   │   │   │   └── user.interface.ts
│   │   │   │   └── service/
│   │   │   │       ├── auth.service.ts
│   │   │   │       └── jwt.service.ts
│   │   │   ├── client-grpc/
│   │   │   │   └── client.grpc.ts
│   │   │   ├── otp/
│   │   │   │   └── otp.service.ts
│   │   │   ├── proto/
│   │   │   │   ├── auth.proto
│   │   │   │   └── user.proto
│   │   │   ├── redis/
│   │   │   │   ├── redis.config.ts
│   │   │   │   ├── redis.module.ts
│   │   │   │   └── redis.service.ts
│   │   │   ├── util/
│   │   │   │   └── mail.util.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── Dockerfile
│   │   └── README.md
│   │
│   ├── booking-service/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── database/
│   │   │   │   │   ├── migrations/
│   │   │   │   │   │   └── 000001_init_schema.sql
│   │   │   │   │   ├── queries/
│   │   │   │   │   │   └── booking.sql
│   │   │   │   │   ├── redis/
│   │   │   │   │   │   └── redis.go
│   │   │   │   │   └── sqlc/
│   │   │   │   │       ├── booking.sql.go
│   │   │   │   │       ├── db.go
│   │   │   │   │       ├── models.go
│   │   │   │   │       └── querier.go
│   │   │   ├── cmd/
│   │   │   │   ├── api/
│   │   │   │   │   ├── api.go
│   │   │   │   │   ├── grpc_client.go
│   │   │   │   │   └── route_v1.go
│   │   │   │   └── main.go
│   │   │   ├── internal/
│   │   │   │   ├── context/
│   │   │   │   │   └── context.go
│   │   │   │   ├── dependencies/
│   │   │   │   │   └── dependencies.go
│   │   │   │   ├── module/
│   │   │   │   │   └── booking/
│   │   │   │   │       ├── business/
│   │   │   │   │       │   └── business.go
│   │   │   │   │       ├── entity/
│   │   │   │   │       │   └── booking.go
│   │   │   │   │       ├── repository/
│   │   │   │   │       │   ├── repository.go
│   │   │   │   │       │   └── rpc/
│   │   │   │   │       │       ├── auth_repository.go
│   │   │   │   │       │       └── tour_repository.go
│   │   │   │   │       └── transport/
│   │   │   │   │           └── rest/
│   │   │   │   │               ├── api.go
│   │   │   │   │               └── response_message.go
│   │   │   │   ├── pkg/
│   │   │   │   │   ├── env/
│   │   │   │   │   │   └── env.go
│   │   │   │   │   ├── jwt/
│   │   │   │   │   │   └── jwt.go
│   │   │   │   │   ├── paging/
│   │   │   │   │   │   └── paging.go
│   │   │   │   │   └── pubsub/
│   │   │   │   │       ├── interfaces.go
│   │   │   │   │       └── redis/
│   │   │   │   │           ├── main.go
│   │   │   │   │           └── subscriber.go
│   │   │   │   ├── types/
│   │   │   │   │   └── pubsub.go
│   │   │   │   └── utils/
│   │   │   │       └── utils.go
│   │   │   ├── middleware/
│   │   │   ├── proto/
│   │   │   └── docs/
│   │   │       ├── docs.go
│   │   │       ├── swagger.json
│   │   │       └── swagger.yaml
│   │   ├── Dockerfile
│   │   └── README.md
│   │
│   ├── tour-service/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── database/
│   │   │   │   ├── repository/
│   │   │   │   └── service/
│   │   │   ├── cmd/
│   │   │   ├── internal/
│   │   │   ├── middleware/
│   │   │   └── proto/
│   │   ├── Dockerfile
│   │   └── README.md
│   │
│   ├── payment-service/
│   │   ├── src/
│   │   │   ├── PaymentService.Api/
│   │   │   │   ├── Controllers/
│   │   │   │   ├── Models/
│   │   │   │   ├── Services/
│   │   │   │   └── Program.cs
│   │   │   ├── PaymentService.Core/
│   │   │   └── PaymentService.Infrastructure/
│   │   ├── Dockerfile
│   │   └── README.md
│   │
│   ├── notification-service/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── database/
│   │   │   │   ├── repository/
│   │   │   │   └── service/
│   │   │   ├── cmd/
│   │   │   ├── internal/
│   │   │   ├── middleware/
│   │   │   └── proto/
│   │   ├── Dockerfile
│   │   └── README.md
│   │
│   └── user-service/
│       ├── src/
│       │   ├── user/
│       │   │   ├── controller/
│       │   │   ├── dto/
│       │   │   ├── entity/
│       │   │   ├── interface/
│       │   │   └── service/
│       │   ├── proto/
│       │   ├── app.module.ts
│       │   └── main.ts
│       ├── Dockerfile
│       └── README.md
│
├── gateway/
│   ├── src/
│   │   ├── ApiGateWay/
│   │   │   ├── Controllers/
│   │   │   │   └── PaymentController.cs
│   │   │   ├── Protos/
│   │   │   │   └── payment.proto
│   │   │   ├── Services/
│   │   │   │   └── PaymentServiceClient.cs
│   │   │   ├── Program.cs
│   │   │   └── appsettings.json
│   │   └── OcelotGateway/
│   │       ├── ocelot.json
│   │       └── Program.cs
│   ├── Dockerfile
│   └── README.md
│
├── webserver/
│   ├── nginx.conf
│   └── Dockerfile
│
├── scripts/
│   └── init.sh
│
├── .env.example
├── docker-compose.yml
└── README.md


```

---

## Công nghệ sử dụng

### 1. Ngôn ngữ lập trình & Framework
- **Backend Services**:
  - **auth-service**: NestJS, TypeScript
  - **user-service**: NestJS, TypeScript
  - **booking-service**: Go (Golang)
  - **tour-service**: Go (Golang)
  - **payment-service**: .NET Core (C#)
  - **notification-service**: Go (Golang)
  - **api-gateway**: .NET Core (C#), Ocelot

### 2. Cơ sở dữ liệu & Cache
- **PostgreSQL**: Database chính cho tất cả các service
- **Redis**:
  - Cache layer
  - Message broker (pub/sub)
  - Lưu trữ OTP và session
  - Rate limiting

### 3. Giao tiếp & API
- **REST API**: Giao tiếp với client
- **gRPC**: Giao tiếp giữa các microservice
- **WebSocket**: Real-time notifications
- **Protocol Buffers**: Định nghĩa interface gRPC
- **Swagger/OpenAPI**: Tài liệu API

### 4. Bảo mật
- **JWT**: Xác thực và phân quyền
- **bcrypt**: Mã hóa mật khẩu
- **HTTPS**: Bảo mật kết nối
- **CORS**: Cross-Origin Resource Sharing

### 5. Container & Deployment
- **Docker**: Container hóa ứng dụng
- **Docker Compose**: Quản lý multi-container
- **Nginx**: 
  - Reverse proxy
  - Load balancing
  - Rate limiting
  - SSL/TLS termination

### 6. Monitoring & Logging
- **Redis Pub/Sub**: Theo dõi trạng thái cache
- **Health Checks**: Kiểm tra trạng thái service
- **Logging Middleware**: Ghi log request/response

### 7. Công cụ phát triển
- **SQLC**: Tạo code cho database operations (Go)
- **Nodemailer**: Gửi email OTP
- **Protocol Buffers Compiler**: Tạo code gRPC

### 8. Các thư viện chính
- **NestJS**:
  - @nestjs/common
  - @nestjs/microservices
  - @nestjs/jwt
- **Go**:
  - grpc
  - gin
  - gorm
  - sqlc
- **.NET**:
  - Ocelot
  - Grpc.AspNetCore
  - Swashbuckle.AspNetCore

---

## Mô tả dịch vụ

### 1. Auth Service
- **Chức năng chính**: Xác thực và phân quyền người dùng
- **API Endpoints**:
  - `POST /auth/register`: Đăng ký người dùng mới với xác minh OTP
  - `POST /auth/login`: Đăng nhập và nhận JWT token
  - `POST /auth/otp`: Xác minh OTP
  - `POST /auth/resend-otp`: Gửi lại OTP
  - `POST /auth/test`: Kiểm tra xác thực token
- **Tích hợp**: 
  - Giao tiếp với User Service qua gRPC
  - Lưu trữ OTP trong Redis
  - Gửi email OTP qua Nodemailer

### 2. User Service
- **Chức năng chính**: Quản lý thông tin người dùng
- **API Endpoints**:
  - `GET /user/getInfo/{id}`: Lấy thông tin người dùng
  - `GET /user/getAll`: Lấy danh sách người dùng
  - `PUT /user/update/{id}`: Cập nhật thông tin người dùng
  - `DELETE /user/delete/{id}`: Xóa người dùng
- **Tích hợp**:
  - Quản lý vai trò và quyền hạn
  - Cache thông tin người dùng trong Redis

### 3. Tour Service
- **Chức năng chính**: Quản lý thông tin tour trekking
- **API Endpoints**:
  - `GET /api/v1/tours`: Lấy danh sách tour
  - `POST /api/v1/tours`: Tạo tour mới
  - `GET /api/v1/tours/{id}`: Lấy chi tiết tour
  - `DELETE /api/v1/tours/{id}`: Xóa tour
  - `PATCH /api/v1/tours/{id}`: Cập nhật thông tin tour
- **Tích hợp**:
  - Quản lý số lượng chỗ trống
  - Cache thông tin tour trong Redis
  - Xác thực host thông qua Auth Service

### 4. Booking Service
- **Chức năng chính**: Xử lý đặt tour và quản lý đơn đặt chỗ
- **API Endpoints**:
  - `POST /api/v1/booking/create`: Tạo đơn đặt chỗ mới
  - `GET /api/v1/booking/{id}`: Lấy thông tin đặt chỗ
  - `POST /api/v1/booking/{id}/cancel`: Hủy đặt chỗ
- **Tích hợp**:
  - Kiểm tra số chỗ trống qua Tour Service
  - Xác thực người dùng qua Auth Service
  - Gửi thông báo qua Notification Service
  - Xử lý thanh toán qua Payment Service

### 5. Payment Service
- **Chức năng chính**: Xử lý thanh toán và quản lý giao dịch
- **API Endpoints**:
  - `POST /api/Payment/deposit`: Nạp tiền
  - `POST /api/Payment/withdraw`: Rút tiền
  - `POST /api/Payment/payment`: Thực hiện thanh toán
  - `GET /api/Payment/account/{userId}`: Xem số dư tài khoản
  - `GET /api/Payment/transactions/{userId}`: Xem lịch sử giao dịch
- **Tích hợp**:
  - Xử lý giao dịch an toàn
  - Quản lý số dư tài khoản
  - Gửi thông báo kết quả thanh toán

### 6. Notification Service
- **Chức năng chính**: Gửi thông báo real-time
- **Tích hợp**:
  - WebSocket cho real-time notifications
  - Redis pub/sub cho message handling
  - Gửi thông báo về:
    - Trạng thái đặt tour
    - Kết quả thanh toán
    - Xác nhận OTP
    - Các thông báo hệ thống khác

### 7. API Gateway
- **Chức năng chính**: Điểm vào duy nhất của hệ thống
- **Tính năng**:
  - Định tuyến request đến các service
  - Tích hợp Swagger UI
  - Xử lý CORS
  - Rate limiting
  - Load balancing
  - SSL/TLS termination

### 8. Webserver (Nginx)
- **Chức năng chính**: Reverse proxy và load balancer
- **Tính năng**:
  - Cân bằng tải
  - Rate limiting
  - Caching
  - SSL/TLS termination
  - Static file serving

---

### Hướng dẫn chạy ứng dụng

1. **Clone this repository**

   ```bash
   git clone https://github.com/jnp2018/mid-project-630245654.git
   cd mid-project-630245654
   ```
2. **Run with Docker Compose**

   ```bash
   docker-compose up --build
   ```
3. **Run with Kubernetes**

   Sử dụng Minikube để triển khai:
   Đầu tiên hãy tải minikube và ubuntu về máy, sau khi tải và cài đặt thì mở ubuntu chạy lần lượt các lệnh:
   ```bash
   minikube start --driver=docker
   ```
   ```bash
   minikube status
   ```
   ```bash
   minikube dashboard
   ```
   Mở 1 tab ubuntu khác rồi chạy:
   ```bash
   eval $(minikube docker-env)
   ```
   Trỏ vào thư mục chứa dự án ở đây đang để ví dụ là demo777:
   ```bash
   cd /mnt/d/demo777
   ```
   ```bash
   docker-compose build
   ```
   Triển khai với file init.sh
   ```bash
   bash /mnt/d/demo777/scripts/init.sh
   ``` 
---


## Hướng dẫn sử dụng API đặt tour leo núi

### Chuẩn bị
1. **Cài đặt môi trường**:
   ```bash
   # Clone repository
   git clone [repository-url]
   
   # Cài đặt dependencies
   docker-compose up -d
   ```

2. **Kiểm tra services**:
   - API Gateway: http://localhost:8084
   - Auth Service: http://localhost:3001
   - Tour Service: http://localhost:8083
   - Booking Service: http://localhost:8081
   - Payment Service: http://localhost:5000

### Xác thực

#### 1. Đăng ký tài khoản
```http
POST /api/auth/register
Content-Type: application/json

{
    "email": "user@example.com",
    "fullname": "John Doe",
    "password": "password123",
    "roleName": "USER"
}
```
**Response**:
```json
{
    "status": 200,
    "message": "OTP sent to your email"
}
```

#### 2. Xác thực OTP
```http
POST /api/auth/otp
Content-Type: application/json

{
    "email": "user@example.com",
    "otp": "123456"
}
```
**Response**:
```json
{
    "status": 200,
    "message": "Registration successful"
}
```

#### 3. Đăng nhập
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```
**Response**:
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Quy trình đặt tour

#### 1. Lấy danh sách tour
```http
GET /api/tours?page=1&size=10
Authorization: Bearer {accessToken}
```
**Response**:
```json
[
    {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "Trekking Fansipan",
        "description": "Tour leo núi Fansipan 3 ngày 2 đêm",
        "host_id": "123e4567-e89b-12d3-a456-426614174001",
        "slot": 20,
        "available_slot": 15,
        "price": 1500000,
        "status": "PUBLISHED",
        "start": "2024-05-01T00:00:00Z",
        "end": "2024-05-03T00:00:00Z"
    }
]
```

#### 2. Đặt tour
```http
POST /api/booking/create
Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "tour_id": "123e4567-e89b-12d3-a456-426614174000",
    "porter_id": "123e4567-e89b-12d3-a456-426614174003",
    "quantity": 2,
    "total_price": 3000000
}
```
**Response**:
```json
{
    "id": "123e4567-e89b-12d3-a456-426614174004",
    "user_id": "123e4567-e89b-12d3-a456-426614174001",
    "tour_id": "123e4567-e89b-12d3-a456-426614174000",
    "porter_id": "123e4567-e89b-12d3-a456-426614174003",
    "quantity": 2,
    "status": "PENDING",
    "total_price": 3000000,
    "expired_at": "2024-04-20T15:30:00Z",
    "created_at": "2024-04-20T15:15:00Z"
}
```

#### 3. Thanh toán
```http
POST /api/Payment/payment
Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "userId": "123e4567-e89b-12d3-a456-426614174001",
    "amount": 3000000,
    "referenceId": "123e4567-e89b-12d3-a456-426614174004",
    "referenceType": "BOOKING",
    "description": "Payment for Trekking Fansipan tour"
}
```
**Response**:
```json
{
    "id": "123e4567-e89b-12d3-a456-426614174005",
    "accountId": "123e4567-e89b-12d3-a456-426614174006",
    "amount": 3000000,
    "type": "PAYMENT",
    "status": "SUCCESS",
    "description": "Payment for Trekking Fansipan tour",
    "referenceId": "123e4567-e89b-12d3-a456-426614174004",
    "referenceType": "BOOKING",
    "createdAt": "2024-04-20T15:20:00Z"
}
```

#### 4. Xác nhận đặt tour
```http
GET /api/booking/{bookingId}
Authorization: Bearer {accessToken}
```
**Response**:
```json
{
    "id": "123e4567-e89b-12d3-a456-426614174004",
    "status": "SUCCESS",
    "total_price": 3000000,
    "created_at": "2024-04-20T15:15:00Z",
    "updated_at": "2024-04-20T15:20:00Z"
}
```

#### 5. Nhận thông báo (WebSocket)
```javascript
// Kết nối WebSocket
const ws = new WebSocket('ws://localhost:8082/ws');

// Lắng nghe thông báo
ws.onmessage = (event) => {
    const notification = JSON.parse(event.data);
    console.log('Notification:', notification);
};
```
**Notification Example**:
```json
{
    "type": "BOOKING_CONFIRMED",
    "message": "Your booking for Trekking Fansipan has been confirmed",
    "data": {
        "bookingId": "123e4567-e89b-12d3-a456-426614174004",
        "tourName": "Trekking Fansipan",
        "startDate": "2024-05-01T00:00:00Z"
    }
}
```

### Xử lý lỗi
Tất cả các API đều trả về lỗi theo format:
```json
{
   "status": 400,
   "message": "Error message",
   "details": {
      "field": "error description"
   }
}
```

### Lưu ý
1. Token JWT có thời hạn 1 giờ
2. Đơn đặt tour có thời hạn 15 phút
3. Cần xác thực qua OTP khi đăng ký
4. Thanh toán phải được hoàn tất trong thời hạn đặt tour
5. Thông báo real-time được gửi qua WebSocket
