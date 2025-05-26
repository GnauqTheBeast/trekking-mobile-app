# System Architecture

## Overview
### The purpose of the microservices system
Hệ thống đặt tour trekking được thiết kế dựa trên kiến trúc microservices để đảm bảo khả năng mở rộng, linh hoạt và dễ bảo trì. Mỗi service xử lý một chức năng riêng biệt như người dùng, tour, đặt tour, thanh toán, thông báo...
### Outline the main components and their responsibilities
- ***user-service***: Quản lý thông tin người dùng như host, khách, porter.
- ***auth-service***: Xác thực đăng nhập, đăng ký và quản lý token đăng nhập.
- ***tour-service***: Tạo và quản lý thông tin các tour trekking (địa điểm, thời gian, độ khó...).
- ***booking-service***: Xử lý đặt tour, cập nhật số chỗ còn lại theo thời gian thực.
- ***payment-service***: Tích hợp với cổng thanh toán để xử lý giao dịch một cách an toàn.
- ***notification-service***: Gửi thông báo xác nhận, nhắc nhở, và cảnh báo qua email hoặc tin nhắn.
- ***api-gateway***: Cổng vào duy nhất của hệ thống, chịu trách nhiệm điều phối, bảo mật, kiểm soát lưu lượng truy cập.

## System Components

### 1. api-gateway

- **Trách nhiệm**: Cung cấp điểm truy cập thống nhất cho hệ thống microservices, xử lý định tuyến và tích hợp các dịch vụ.

- **Logic chính**:

    - **Định tuyến API**:
        - Sử dụng Ocelot để định tuyến các request đến các microservice tương ứng
        - Hỗ trợ các route cho auth, user, tour, booking, notification và payment service
        - Tích hợp Swagger UI cho tài liệu API

    - **Tích hợp gRPC**:
        - Sử dụng gRPC để giao tiếp với payment-service
        - Định nghĩa các service và message trong file proto
        - Xử lý các request/response thông qua gRPC client

    - **Xử lý lỗi và logging**:
        - Ghi log chi tiết cho mỗi request
        - Xử lý lỗi toàn cục và trả về response phù hợp
        - Theo dõi hiệu suất và trạng thái của các service

    - **Bảo mật**:
        - Hỗ trợ CORS
        - Tích hợp JWT authentication
        - Bảo vệ các endpoint nhạy cảm

    - **Cấu hình**:
        - Quản lý cấu hình thông qua ocelot.json
        - Định nghĩa các route và upstream/downstream path
        - Cấu hình port và host cho từng service

    - **Tích hợp Swagger**:
        - Tổng hợp tài liệu API từ tất cả các service
        - Cung cấp giao diện tương tác để test API
        - Hỗ trợ xác thực qua Swagger UI

### 2. user-service

- **Trách nhiệm**: Quản lý thông tin người dùng, vai trò và quyền hạn trong hệ thống.

- **Logic chính**:

    - **Quản lý người dùng**:
        - Tạo người dùng mới với mã hóa mật khẩu bằng bcrypt
        - Lấy thông tin người dùng theo ID
        - Cập nhật thông tin người dùng
        - Xóa người dùng
        - Kiểm tra sự tồn tại của email
        - Xác thực đăng nhập và trả về thông tin người dùng kèm quyền hạn

    - **Quản lý vai trò (Role)**:
        - Tạo vai trò mới
        - Lấy danh sách tất cả vai trò
        - Cập nhật thông tin vai trò
        - Xóa vai trò
        - Lấy vai trò theo tên

    - **Quản lý quyền hạn (Permission)**:
        - Lấy danh sách quyền hạn theo ID vai trò
        - Cache quyền hạn trong Redis để tăng hiệu suất

    - **Tích hợp gRPC**:
        - Cung cấp các service gRPC cho các microservice khác:
            - `Create`: Tạo người dùng mới
            - `GetById`: Lấy thông tin người dùng
            - `CheckExistByEmail`: Kiểm tra email tồn tại
            - `CheckLogin`: Xác thực đăng nhập

    - **Bảo mật**:
        - Mã hóa mật khẩu với bcrypt
        - Xác thực thông tin người dùng
        - Kiểm soát quyền truy cập dựa trên vai trò

    - **Cấu trúc dữ liệu**:
        - User: id, name, email, password, phone_number, address, dob, role
        - Role: id, name, description
        - Permission: id, name, code, description
        - RolePermission: role_id, permission_id (quan hệ nhiều-nhiều)

### 3. auth-service

- **Trách nhiệm**: Quản lý xác thực người dùng, xử lý đăng ký với OTP, đăng nhập và xác thực token JWT.

- **Logic chính**:

    - **Đăng ký người dùng**:
        - Nhận request `register` với thông tin email, fullname, password, roleName
        - Kiểm tra email đã tồn tại chưa thông qua user-service
        - Tạo OTP ngẫu nhiên 6 số và lưu vào Redis với thời hạn 5 phút
        - Gửi OTP qua email cho người dùng
        - Lưu thông tin đăng ký tạm thời vào Redis
        - Yêu cầu người dùng xác nhận OTP để hoàn tất đăng ký

    - **Xác thực OTP**:
        - Nhận OTP từ người dùng
        - Kiểm tra OTP có hợp lệ và chưa hết hạn
        - Giới hạn 5 lần nhập sai OTP
        - Sau khi xác thực thành công, tạo người dùng mới qua user-service
        - Xóa thông tin tạm thời trong Redis

    - **Đăng nhập**:
        - Nhận request `login` với email và password
        - Kiểm tra email tồn tại qua user-service
        - Xác thực thông tin đăng nhập qua user-service
        - Tạo JWT token chứa thông tin user ID, role và permissions
        - Trả về token và thông tin người dùng

    - **Xác thực token**:
        - Cung cấp gRPC service `validate` cho các service khác
        - Kiểm tra tính hợp lệ của JWT token
        - Trả về thông tin user ID, role và permissions nếu token hợp lệ

    - **Tích hợp**:
        - Sử dụng gRPC để giao tiếp với user-service
        - Sử dụng Redis để lưu trữ OTP và thông tin tạm thời
        - Tích hợp với nodemailer để gửi email OTP

    - **Bảo mật**:
        - Mã hóa mật khẩu với bcrypt
        - JWT token có thời hạn 1 giờ
        - Giới hạn số lần nhập sai OTP
        - Lưu trữ thông tin nhạy cảm trong Redis với TTL

### 4. tour-service

- **Trách nhiệm**: Quản lý thông tin tour du lịch, lịch trình và số lượng chỗ còn trống.

- **Logic chính**:

    - **Quản lý tour**:
        - Tạo tour mới với thông tin: tên, mô tả, host, số lượng chỗ, giá, thời gian bắt đầu/kết thúc
        - Lấy danh sách tour theo phân trang
        - Lấy chi tiết tour theo ID
        - Cập nhật thông tin tour
        - Xóa tour (chỉ cho phép xóa tour ở trạng thái DRAFT)

    - **Quản lý trạng thái tour**:
        - DRAFT: Tour mới tạo, chưa công khai
        - PUBLISHED: Tour đã được công khai, có thể đặt chỗ
        - ARCHIVED: Tour đã kết thúc hoặc bị hủy
        - Chỉ cho phép chuyển trạng thái: DRAFT -> PUBLISHED -> ARCHIVED

    - **Quản lý số lượng chỗ**:
        - Theo dõi tổng số chỗ và số chỗ còn trống
        - Cập nhật số chỗ còn trống khi có đặt chỗ
        - Kiểm tra số chỗ còn trống trước khi cho phép đặt

    - **Tích hợp**:
        - Cung cấp REST API cho client
        - Cung cấp gRPC service cho các microservice khác
        - Sử dụng Redis để cache thông tin tour
        - Tích hợp với auth-service để xác thực người dùng

    - **Bảo mật**:
        - Xác thực người dùng qua JWT token
        - Phân quyền truy cập API theo vai trò
        - Validate dữ liệu đầu vào
        - Kiểm tra quyền sở hữu tour

    - **Cấu trúc dữ liệu**:
        - Tour: id, name, description, host_id, slot, available_slot, price, status, start_at, end_at, created_at, updated_at

### 5. booking-service

- **Trách nhiệm**: Quản lý việc đặt tour và xử lý các yêu cầu đặt chỗ, tích hợp với các dịch vụ khác thông qua gRPC và Redis pub/sub.

- **Logic chính**:

    - **Quản lý đặt chỗ**:
        - Tạo đơn đặt chỗ mới với thông tin: user_id, tour_id, porter_id, quantity, total_price
        - Kiểm tra tour tồn tại và số lượng chỗ trống qua tour-service
        - Cập nhật số lượng chỗ trống của tour
        - Gửi yêu cầu thanh toán qua Redis topic `booking_request`
        - Quản lý trạng thái đặt chỗ (PENDING, SUCCESS, CANCEL, EXPIRED)

    - **Tích hợp với các service**:
        - Giao tiếp với tour-service qua gRPC để kiểm tra và cập nhật tour
        - Giao tiếp với auth-service để xác thực người dùng
        - Gửi thông báo qua notification-service khi có thay đổi trạng thái

    - **Xử lý hủy đặt chỗ**:
        - Cập nhật trạng thái đặt chỗ thành CANCEL
        - Cập nhật lại số lượng chỗ trống của tour
        - Gửi thông báo hủy qua Redis topic `booking_cancel`

### 6. payment-service

- **Trách nhiệm**: Xử lý và quản lý các giao dịch thanh toán, tích hợp với các dịch vụ khác thông qua Redis pub/sub.

- **Logic chính**:

    - **Xử lý thanh toán**:
        - Nhận yêu cầu thanh toán từ booking-service qua Redis topic `booking_request`
        - Tạo payment record với trạng thái "processing"
        - Kiểm tra số dư tài khoản người dùng
        - Thực hiện thanh toán và cập nhật số dư
        - Gửi kết quả thanh toán qua Redis topic `payment_result`

    - **Quản lý tài khoản**:
        - Quản lý số dư người dùng
        - Xử lý nạp/rút tiền
        - Theo dõi lịch sử giao dịch

    - **Xử lý hoàn tiền**:
        - Khi thanh toán thất bại hoặc đơn hàng bị hủy
        - Hoàn trả số tiền về tài khoản người dùng
        - Cập nhật trạng thái giao dịch

### 7. notification-service

- **Trách nhiệm**: Gửi thông báo thời gian thực qua WebSocket cho khách hàng về trạng thái đặt tour và thanh toán.

- **Logic chính**:

    - **Xử lý thông báo**:
        - Nhận message từ các service khác qua Redis pub/sub
        - Lưu thông báo vào database
        - Gửi thông báo real-time qua WebSocket cho người dùng

    - **Quản lý kết nối WebSocket**:
        - Duy trì kết nối WebSocket với client
        - Gửi thông báo đến đúng người dùng
        - Xử lý đóng/mở kết nối

    - **Tích hợp với các service**:
        - Nhận thông báo từ booking-service về trạng thái đặt tour
        - Nhận thông báo từ payment-service về kết quả thanh toán
        - Gửi thông báo ping/pong để kiểm tra kết nối

### 8. RedisQueue

- **Trách nhiệm**: Message Broker, đóng vai trò trung tâm trong việc giao tiếp bất đồng bộ giữa các microservices. Lưu trữ các sự kiện (yêu cầu và phản hồi) trong các hàng đợi. Đảm bảo sự kiện được gửi đi ngay cả khi dịch vụ nhận tạm thời không hoạt động.

- **Các Topic chính**:
    - `booking_request`: Yêu cầu thanh toán từ booking-service
    - `payment_result`: Kết quả thanh toán từ payment-service
    - `booking_cancel`: Thông báo hủy đặt tour
    - `notification`: Thông báo hệ thống cho notification-service

- **Cấu hình**:
    - Sử dụng Redis pub/sub cho real-time messaging
    - Message persistence để đảm bảo không mất dữ liệu

## Communication

### 1. Giao tiếp Đồng bộ (Synchronous)

- **REST APIs**:
    - API Gateway cung cấp REST endpoints cho client
    - Sử dụng HTTP/2 để tối ưu performance

- **gRPC**:
    - Sử dụng cho giao tiếp giữa các service với yêu cầu hiệu suất cao
    - Định nghĩa các service và message trong file proto
    - Hỗ trợ streaming cho real-time data
    - Các service chính sử dụng gRPC:
        - Auth Service: validate token
        - User Service: get user info
        - Tour Service: check tour availability
        - Payment Service: process payment

### 2. Giao tiếp Bất đồng bộ (Asynchronous)

- **Redis Pub/Sub**:
    - Sử dụng cho các event-driven communication
    - Các service publish/subscribe các event
    - Topics chính:
        - `booking_request`: Yêu cầu thanh toán
        - `payment_result`: Kết quả thanh toán
        - `booking_cancel`: Hủy đặt tour
        - `notification`: Thông báo hệ thống

- **WebSocket**:
    - Notification Service sử dụng WebSocket để gửi real-time notifications
    - Duy trì persistent connection với client

### 3. Internal Networking

- **Docker Compose Services**:
    - `api-gateway`: Cổng vào duy nhất của hệ thống
    - `auth-service`: Xử lý authentication
    - `user-service`: Quản lý thông tin người dùng
    - `tour-service`: Quản lý tour
    - `booking-service`: Xử lý đặt tour
    - `payment-service`: Xử lý thanh toán
    - `notification-service`: Gửi thông báo
    - `redis`: Message broker và cache
    - `postgres`: Database chính

- **Network Configuration**:
    - Mỗi service chạy trong container riêng biệt
    - Sử dụng Docker network để isolate các service
    - Các service có thể giao tiếp thông qua service name
    - Port mapping cho external access
    - Health check endpoints cho service discovery

## Data Flow

1. **Tìm Kiếm và Chọn Tour**:
    - Người dùng truy cập hệ thống thông qua API Gateway
    - API Gateway định tuyến yêu cầu đến Tour Service
    - Tour Service kiểm tra và trả về thông tin tour (số lượng chỗ, giá, thời gian...)
    - Redis cache được sử dụng để tối ưu performance

2. **Đặt Tour và Thanh Toán**:
    - Người dùng gửi yêu cầu đặt tour qua Booking Service
    - Booking Service kiểm tra:
        - Xác thực người dùng qua Auth Service
        - Kiểm tra tour tồn tại và số lượng chỗ trống qua Tour Service
        - Tính toán tổng giá tiền
    - Booking Service tạo đơn đặt chỗ với trạng thái PENDING
    - Booking Service gửi yêu cầu thanh toán qua Redis topic `booking_request`
    - Payment Service xử lý thanh toán:
        - Kiểm tra số dư tài khoản
        - Thực hiện thanh toán
        - Cập nhật trạng thái giao dịch
    - Payment Service gửi kết quả thanh toán qua Redis topic `payment_result`
    - Notification Service nhận kết quả và gửi thông báo real-time qua WebSocket

3. **Xử Lý Đơn Đặt Tour Hết Hạn**:
    - Booking Service kiểm tra các đơn đặt tour có trạng thái PENDING
    - Nếu quá thời gian quy định (15 phút), hệ thống tự động:
        - Cập nhật trạng thái đơn thành EXPIRED
        - Cập nhật lại số lượng chỗ trống của tour
        - Gửi thông báo hủy qua Redis topic `booking_cancel`
        - Notification Service gửi thông báo qua WebSocket

4. **Hủy Đặt Tour**:
    - Người dùng gửi yêu cầu hủy đặt tour
    - Booking Service kiểm tra điều kiện hủy
    - Nếu hợp lệ:
        - Cập nhật trạng thái đơn thành CANCEL
        - Cập nhật lại số lượng chỗ trống của tour
        - Gửi thông báo hủy qua Redis topic `booking_cancel`
        - Payment Service xử lý hoàn tiền nếu cần
        - Notification Service gửi thông báo qua WebSocket

## Diagram
- Reference a high-level architecture diagram (place in `docs/asset/`).

## Scalability & Fault Tolerance

### Scalability

1. **Horizontal Scaling**:
    - Các service được containerized bằng Docker, cho phép dễ dàng scale theo chiều ngang
    - Redis được sử dụng làm message broker và cache layer, hỗ trợ phân tán tải
    - PostgreSQL cho phép read replicas để tăng khả năng đọc

2. **Load Balancing & Rate Limiting**:
    - Nginx làm reverse proxy và load balancer cho các service
    - Rate limiting được cấu hình ở Nginx level để bảo vệ các service
    - API Gateway (Ocelot) phân phối request đến các service instance
    - Redis pub/sub giúp phân tán message giữa các consumer
    - WebSocket connections được quản lý độc lập cho mỗi user

3. **Caching Strategy**:
    - Redis cache cho tour information và booking status
    - Local cache trong payment-service để tối ưu performance
    - Cache invalidation được xử lý qua Redis pub/sub
    - Nginx caching cho static content và API responses

### Fault Tolerance

1. **Service Resilience**:
    - Circuit breaker pattern trong gRPC communication
    - Retry mechanism cho các database operations
    - Graceful shutdown handling trong các service
    - Nginx health checks để phát hiện và loại bỏ unhealthy instances

2. **Data Consistency**:
    - Transaction management trong booking và payment service
    - Eventual consistency được đảm bảo qua Redis pub/sub
    - Database transactions với rollback capability

3. **Error Handling**:
    - Centralized error handling trong mỗi service
    - Detailed logging cho debugging và monitoring
    - Fallback mechanisms cho critical operations
    - Nginx error pages và custom error handling

4. **High Availability**:
    - Stateless services cho phép zero-downtime deployment
    - Redis cluster cho message broker reliability
    - Database connection pooling và retry logic
    - Nginx load balancing với multiple upstream servers
    - Automatic failover khi service instance fails