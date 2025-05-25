# User Service

## Tổng Quan
User Service là một microservice chuyên quản lý thông tin người dùng, vai trò và quyền hạn trong hệ thống. Service này đảm nhiệm việc lưu trữ và quản lý dữ liệu người dùng, cũng như cung cấp các API để các service khác có thể truy xuất thông tin người dùng.

## Chức Năng Chính

### 1. Quản Lý Thông Tin Người Dùng
**Mục đích**: Lưu trữ và quản lý thông tin chi tiết của người dùng.

**Dữ liệu quản lý**:
- Thông tin cơ bản (email, họ tên, ngày sinh)
- Thông tin liên hệ (địa chỉ, số điện thoại)
- Vai trò và quyền hạn
- Trạng thái tài khoản

**API Endpoints**:
- GET /api/users/{id} - Lấy thông tin người dùng
- PUT /api/users/{id} - Cập nhật thông tin
- DELETE /api/users/{id} - Xóa người dùng

### 2. Quản Lý Vai Trò và Quyền Hạn
**Mục đích**: Phân quyền và quản lý quyền truy cập của người dùng.

**Chức năng**:
- Gán vai trò cho người dùng
- Quản lý danh sách quyền hạn
- Kiểm tra quyền truy cập

**API Endpoints**:
- GET /api/roles - Lấy danh sách vai trò
- POST /api/roles - Tạo vai trò mới
- PUT /api/roles/{id} - Cập nhật vai trò
- GET /api/permissions - Lấy danh sách quyền hạn

### 3. Tìm Kiếm và Lọc
**Mục đích**: Cung cấp khả năng tìm kiếm và lọc thông tin người dùng.

**Tính năng**:
- Tìm kiếm theo nhiều tiêu chí
- Lọc theo vai trò
- Phân trang kết quả

**API Endpoint**:
- GET /api/users/search

## Tích Hợp

### Với Auth Service
- Cung cấp thông tin xác thực
- Kiểm tra thông tin đăng nhập
- Cập nhật trạng thái người dùng

### Với Các Service Khác
- Cung cấp thông tin người dùng
- Kiểm tra quyền truy cập
- Đồng bộ dữ liệu

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
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Role
```typescript
interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Yêu Cầu Phi Chức Năng

### Hiệu Suất
- Thời gian phản hồi < 200ms
- Xử lý đồng thời nhiều request
- Cache thông tin người dùng

### Bảo Mật
- Mã hóa dữ liệu nhạy cảm
- Kiểm tra quyền truy cập
- Validate input data

### Độ Tin Cậy
- Sao lưu dữ liệu
- Xử lý lỗi và ghi log
- Khôi phục sau sự cố

### Khả Năng Mở Rộng
- Dễ dàng thêm trường dữ liệu mới
- Hỗ trợ nhiều loại vai trò
- Tích hợp với các service khác

### Giám Sát
- Theo dõi hoạt động người dùng
- Thống kê người dùng
- Báo cáo hệ thống 