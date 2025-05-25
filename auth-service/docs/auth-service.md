# Auth Service

## Tổng Quan
Auth Service là một microservice chuyên xử lý các vấn đề liên quan đến xác thực và phân quyền trong hệ thống. Service này đảm nhiệm việc quản lý phiên đăng nhập, tạo và xác thực token, cũng như xác thực hai lớp qua OTP.

## Chức Năng Chính

### 1. Đăng Ký Tài Khoản
**Mục đích**: Xử lý quá trình đăng ký tài khoản mới với xác thực email.

**Quy trình xử lý**:
1. Nhận thông tin đăng ký (email, mật khẩu, họ tên)
2. Kiểm tra email đã tồn tại
3. Gửi mã OTP qua email
4. Xác thực OTP
5. Tạo tài khoản mới thông qua User Service

**API Endpoint**:
- POST /api/auth/register
- POST /api/auth/verify-otp

### 2. Đăng Nhập
**Mục đích**: Xác thực người dùng và tạo phiên đăng nhập.

**Quy trình xử lý**:
1. Nhận thông tin đăng nhập (email, mật khẩu)
2. Kiểm tra thông tin với User Service
3. Tạo JWT token chứa thông tin người dùng
4. Trả về token và thông tin người dùng

**API Endpoint**:
- POST /api/auth/login

### 3. Xác Thực Token
**Mục đích**: Kiểm tra tính hợp lệ của token và quyền truy cập.

**Quy trình xử lý**:
1. Nhận JWT token
2. Giải mã và xác thực token
3. Kiểm tra quyền hạn
4. Trả về thông tin xác thực

**API Endpoint**:
- POST /api/auth/validate

## Tích Hợp

### Với User Service
- Gọi API tạo người dùng mới
- Kiểm tra thông tin đăng nhập
- Lấy thông tin người dùng

### Với Các Service Khác
- Cung cấp middleware xác thực
- Kiểm tra quyền truy cập
- Xác thực token

## Bảo Mật

### Mã Hóa
- Mật khẩu được mã hóa bằng bcrypt
- JWT token được ký bằng secret key
- OTP được mã hóa

### Xác Thực
- Xác thực 2 lớp qua email
- Kiểm tra token hết hạn
- Validate input data

## Yêu Cầu Phi Chức Năng

### Hiệu Suất
- Thời gian phản hồi < 200ms
- Xử lý đồng thời nhiều request
- Cache token và thông tin xác thực

### Độ Tin Cậy
- Xử lý lỗi và ghi log
- Khôi phục sau sự cố
- Kiểm tra tính nhất quán

### Giám Sát
- Theo dõi hoạt động đăng nhập
- Giám sát lỗi xác thực
- Báo cáo bảo mật 