# Hệ Thống Xác Thực và Quản Lý Người Dùng

## Tổng Quan
Hệ thống xác thực và quản lý người dùng bao gồm hai microservice chính:
1. **Auth Service**: Xử lý xác thực, đăng nhập, đăng ký và quản lý token
2. **User Service**: Quản lý thông tin người dùng, vai trò và quyền hạn

## Chức Năng Chính

### 1. Đăng Ký Người Dùng
**Mục đích**: Cho phép người dùng mới đăng ký tài khoản.

**Dữ liệu đầu vào**:
- Email
- Họ tên
- Mật khẩu
- Vai trò (role)

**Yêu cầu xử lý**:
- Kiểm tra email đã tồn tại
- Mã hóa mật khẩu
- Tạo tài khoản mới
- Gán vai trò và quyền hạn

**Yêu cầu đặc biệt**:
- Xác thực email qua OTP
- Mật khẩu phải được mã hóa
- Kiểm tra tính hợp lệ của dữ liệu

### 2. Đăng Nhập
**Mục đích**: Xác thực người dùng và cấp token truy cập.

**Dữ liệu đầu vào**:
- Email
- Mật khẩu

**Yêu cầu xử lý**:
- Kiểm tra thông tin đăng nhập
- Tạo JWT token
- Trả về thông tin người dùng

**Yêu cầu đặc biệt**:
- Bảo mật thông tin đăng nhập
- Token có thời hạn
- Lưu trữ phiên đăng nhập

### 3. Xác Thực Token
**Mục đích**: Kiểm tra tính hợp lệ của token và quyền truy cập.

**Dữ liệu đầu vào**:
- JWT token

**Yêu cầu xử lý**:
- Giải mã và xác thực token
- Kiểm tra quyền hạn
- Trả về thông tin người dùng

**Yêu cầu đặc biệt**:
- Xử lý token hết hạn
- Kiểm tra quyền truy cập
- Bảo mật thông tin

### 4. Quản Lý Người Dùng
**Mục đích**: Quản lý thông tin và trạng thái người dùng.

**Dữ liệu đầu vào**:
- ID người dùng
- Thông tin cập nhật

**Yêu cầu xử lý**:
- Cập nhật thông tin
- Quản lý trạng thái
- Phân quyền

**Yêu cầu đặc biệt**:
- Kiểm tra quyền thực hiện
- Lưu lịch sử thay đổi
- Đồng bộ dữ liệu

## API Endpoints

### Auth Service
- POST /api/auth/register - Đăng ký tài khoản
- POST /api/auth/login - Đăng nhập
- POST /api/auth/verify-otp - Xác thực OTP
- POST /api/auth/validate - Xác thực token

### User Service
- GET /api/users/{id} - Lấy thông tin người dùng
- POST /api/users - Tạo người dùng mới
- PUT /api/users/{id} - Cập nhật thông tin
- DELETE /api/users/{id} - Xóa người dùng

## Mô Hình Dữ Liệu

### User
```typescript
interface User {
  id: string;
  email: string;
  fullname: string;
  dob: string | null;
  address: string | null;
  phoneNumber: string | null;
  role: Role;
  permissions: string[];
}
```

### Role
```typescript
interface Role {
  id: string;
  name: string;
}
```

## Yêu Cầu Phi Chức Năng

### Hiệu Suất
- Thời gian phản hồi < 200ms
- Xử lý đồng thời nhiều request
- Cache thông tin người dùng

### Bảo Mật
- Mã hóa mật khẩu với bcrypt
- JWT token bảo mật
- Xác thực 2 lớp qua OTP
- Bảo vệ chống tấn công

### Độ Tin Cậy
- Xử lý lỗi và ghi log
- Sao lưu dữ liệu
- Khôi phục sau sự cố
- Kiểm tra tính nhất quán

### Khả Năng Mở Rộng
- Kiến trúc microservice
- Dễ dàng thêm vai trò mới
- Tích hợp với các dịch vụ khác

### Giám Sát
- Theo dõi hoạt động đăng nhập
- Giám sát lỗi xác thực
- Báo cáo bảo mật
- Thống kê người dùng 