# Hệ Thống Quản Lý Thanh Toán

## Tổng Quan
Hệ thống Quản lý Thanh toán là một microservice xử lý tất cả các hoạt động liên quan đến thanh toán trong ứng dụng di động trekking. Nó cung cấp chức năng quản lý tài khoản, giao dịch và xử lý thanh toán cho các đặt tour.

## Chức Năng Chính

### 1. Quản Lý Tài Khoản
**Mục đích**: Quản lý thông tin và số dư tài khoản của người dùng.

**Dữ liệu đầu vào**:
- ID người dùng
- Số dư
- Loại tiền tệ
- Trạng thái tài khoản

**Yêu cầu xử lý**:
- Tạo tài khoản mới cho người dùng
- Cập nhật số dư tài khoản
- Kiểm tra số dư khả dụng
- Theo dõi trạng thái tài khoản

### 2. Nạp Tiền
**Mục đích**: Cho phép người dùng nạp tiền vào tài khoản.

**Dữ liệu đầu vào**:
- ID người dùng
- Số tiền (phải lớn hơn 0)
- Mô tả giao dịch

**Yêu cầu xử lý**:
- Kiểm tra tính hợp lệ của số tiền
- Tạo giao dịch nạp tiền
- Cập nhật số dư tài khoản
- Ghi log giao dịch

**Yêu cầu đặc biệt**:
- Xác thực người dùng
- Xử lý đồng thời các giao dịch
- Đảm bảo tính nhất quán dữ liệu

### 3. Rút Tiền
**Mục đích**: Cho phép người dùng rút tiền từ tài khoản.

**Dữ liệu đầu vào**:
- ID người dùng
- Số tiền (phải lớn hơn 0)
- Mô tả giao dịch

**Yêu cầu xử lý**:
- Kiểm tra số dư khả dụng
- Tạo giao dịch rút tiền
- Cập nhật số dư tài khoản
- Ghi log giao dịch

**Yêu cầu đặc biệt**:
- Kiểm tra số dư đủ
- Xác thực người dùng
- Xử lý đồng thời các giao dịch

### 4. Thanh Toán Tour
**Mục đích**: Xử lý thanh toán cho các tour đã đặt.

**Dữ liệu đầu vào**:
- ID đặt tour
- ID người dùng
- Số tiền
- Phương thức thanh toán

**Yêu cầu xử lý**:
- Tạo giao dịch thanh toán
- Kiểm tra số dư người dùng
- Chuyển tiền cho chủ tour (80%)
- Chuyển tiền cho porter (20%)
- Cập nhật trạng thái đặt tour

**Yêu cầu đặc biệt**:
- Xử lý giao dịch nguyên tử
- Thông báo kết quả thanh toán
- Cập nhật trạng thái tour

### 5. Lịch Sử Giao Dịch
**Mục đích**: Theo dõi và truy xuất lịch sử giao dịch của người dùng.

**Dữ liệu đầu vào**:
- ID người dùng

**Yêu cầu xử lý**:
- Lấy danh sách giao dịch
- Phân loại giao dịch
- Hiển thị chi tiết giao dịch

## API Endpoints

### REST API
- POST /api/payment/deposit - Nạp tiền
- POST /api/payment/withdraw - Rút tiền
- POST /api/payment/booking/{bookingId} - Tạo thanh toán từ đặt tour
- POST /api/payment/process/{paymentId} - Xử lý thanh toán
- GET /api/payment/account/{userId} - Lấy thông tin tài khoản
- GET /api/payment/transactions/{userId} - Lấy lịch sử giao dịch

## Mô Hình Dữ Liệu

### Account
```csharp
public class Account
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public long Balance { get; set; }
    public string Currency { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

### Transaction
```csharp
public class Transaction
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public long Amount { get; set; }
    public string Type { get; set; }
    public string Status { get; set; }
    public string Description { get; set; }
    public Guid? ReferenceId { get; set; }
    public string ReferenceType { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

### Payment
```csharp
public class Payment
{
    public Guid Id { get; set; }
    public Guid BookingId { get; set; }
    public long Total { get; set; }
    public string Method { get; set; }
    public string Type { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

## Yêu Cầu Phi Chức Năng

### Hiệu Suất
- Thời gian phản hồi < 200ms cho các giao dịch
- Xử lý đồng thời nhiều giao dịch
- Cache thông tin tài khoản

### Bảo Mật
- Mã hóa dữ liệu nhạy cảm
- Xác thực và phân quyền
- Kiểm tra đầu vào
- Bảo vệ chống SQL injection

### Độ Tin Cậy
- Xử lý giao dịch nguyên tử
- Sao lưu dữ liệu
- Xử lý lỗi và ghi log
- Khôi phục sau sự cố

### Khả Năng Mở Rộng
- Kiến trúc microservice
- Hỗ trợ nhiều phương thức thanh toán
- Dễ dàng tích hợp với các dịch vụ bên thứ ba

### Giám Sát
- Theo dõi số lượng giao dịch
- Giám sát số dư tài khoản
- Theo dõi lỗi giao dịch
- Báo cáo doanh thu 