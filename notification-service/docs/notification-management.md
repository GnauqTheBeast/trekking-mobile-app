# Hệ Thống Thông Báo

## Tổng Quan
Hệ thống thông báo là một microservice chuyên xử lý và quản lý các thông báo trong ứng dụng trekking. Service này đảm nhiệm việc gửi, lưu trữ và quản lý các thông báo cho người dùng thông qua nhiều kênh khác nhau như push notification, in-app notification và email.

## Chức Năng Chính

### 1. Quản Lý Thông Báo
**Mục đích**: Lưu trữ và quản lý thông báo cho người dùng.

**Dữ liệu quản lý**:
- ID thông báo
- ID người dùng
- Tiêu đề
- Nội dung
- Loại thông báo
- Trạng thái đọc
- Thời gian tạo/cập nhật

**API Endpoints**:
- GET /api/v1/notifications/{userId} - Lấy danh sách thông báo
- POST /api/v1/notifications - Tạo thông báo mới
- PUT /api/v1/notifications/{id} - Cập nhật thông báo
- DELETE /api/v1/notifications/{id} - Xóa thông báo

### 2. Gửi Thông Báo
**Mục đích**: Gửi thông báo đến người dùng qua nhiều kênh.

**Loại thông báo**:
- Thông báo đặt tour
- Thông báo thanh toán
- Thông báo khuyến mãi
- Thông báo hệ thống

**Kênh gửi**:
- Push notification
- In-app notification
- Email (tùy chọn)

### 3. WebSocket
**Mục đích**: Cung cấp thông báo realtime cho người dùng.

**Tính năng**:
- Kết nối WebSocket
- Gửi thông báo realtime
- Xử lý sự kiện người dùng

## Tích Hợp

### Với Các Service Khác
- Booking Service: Thông báo đặt tour
- Payment Service: Thông báo thanh toán
- Tour Service: Thông báo tour mới
- User Service: Thông tin người dùng

### Với Frontend
- Push notification (React Native)
- In-app notification
- WebSocket client

## Mô Hình Dữ Liệu

### Notification
```typescript
interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'promotion' | 'trip' | 'booking' | 'payment';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### NotificationData
```typescript
interface NotificationData {
  id?: string;
  title: string;
  message?: string;
  body?: string;
  type?: string;
  isRead?: boolean;
  createdAt?: string;
  expiresAt?: string;
  actionData?: {
    bookingId: string;
    screen?: string;
    params?: Record<string, any>;
  };
  userId?: string;
  scheduled?: boolean;
}
```

## Yêu Cầu Phi Chức Năng

### Hiệu Suất
- Thời gian phản hồi < 200ms
- Xử lý đồng thời nhiều thông báo
- Tối ưu hóa WebSocket

### Độ Tin Cậy
- Đảm bảo thông báo được gửi
- Xử lý lỗi và ghi log
- Khôi phục sau sự cố

### Khả Năng Mở Rộng
- Hỗ trợ nhiều loại thông báo
- Dễ dàng thêm kênh gửi mới
- Tích hợp với các service khác

### Giám Sát
- Theo dõi số lượng thông báo
- Giám sát trạng thái gửi
- Báo cáo thống kê 