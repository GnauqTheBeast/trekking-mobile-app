# Hệ Thống Quản Lý Tour

## Tổng Quan
Hệ thống Quản lý Tour là một microservice xử lý tất cả các hoạt động liên quan đến tour trong ứng dụng di động trekking. Nó cung cấp chức năng tạo, quản lý và theo dõi các tour, bao gồm tính khả dụng và trạng thái của chúng.

## Chức Năng Chính

### 1. Tạo Tour
**Mục đích**: Cho phép chủ tour tạo tour mới trong hệ thống.

**Dữ liệu đầu vào**:
- Tên tour (bắt buộc, tối thiểu 3 ký tự)
- Mô tả (bắt buộc, tối thiểu 10 ký tự)
- ID chủ tour (bắt buộc)
- Số lượng chỗ (bắt buộc)
- Số chỗ còn trống (bắt buộc)
- Giá (bắt buộc, phải lớn hơn 0)
- Trạng thái (bắt buộc, một trong: DRAFT, PUBLISHED, ARCHIVED)
- Thời gian bắt đầu (bắt buộc)
- Thời gian kết thúc (bắt buộc)

**Yêu cầu xử lý**:
- Kiểm tra tất cả các trường bắt buộc
- Đặt trạng thái ban đầu là DRAFT
- Tạo ID tour duy nhất
- Ghi lại thời gian tạo
- Lưu thông tin tour vào cơ sở dữ liệu

**Yêu cầu đặc biệt**:
- Chỉ người dùng có vai trò HOST và quyền create_tour mới có thể tạo tour
- Tên tour phải là duy nhất
- Thời gian kết thúc phải sau thời gian bắt đầu

### 2. Danh Sách Tour
**Mục đích**: Lấy danh sách các tour có sẵn với hỗ trợ phân trang.

**Dữ liệu đầu vào**:
- Số trang (tùy chọn)
- Kích thước trang (tùy chọn)

**Yêu cầu xử lý**:
- Thực hiện phân trang
- Cache kết quả để tăng hiệu suất
- Trả về chi tiết tour bao gồm:
  - ID tour
  - Tên
  - Mô tả
  - ID chủ tour
  - Số chỗ còn trống
  - Giá
  - Trạng thái
  - Thời gian bắt đầu/kết thúc

### 3. Chi Tiết Tour
**Mục đích**: Lấy thông tin chi tiết về một tour cụ thể.

**Dữ liệu đầu vào**:
- ID tour

**Yêu cầu xử lý**:
- Kiểm tra định dạng ID tour
- Cache chi tiết tour
- Trả về thông tin tour đầy đủ
- Xử lý trường hợp tour không tồn tại

### 4. Cập Nhật Tour
**Mục đích**: Cho phép chỉnh sửa thông tin tour hiện có.

**Dữ liệu đầu vào**:
- ID tour
- Các trường có thể cập nhật:
  - Tên
  - Mô tả
  - Trạng thái
  - Giá
  - Số chỗ
  - Thời gian bắt đầu/kết thúc

**Yêu cầu xử lý**:
- Kiểm tra quá trình chuyển trạng thái
- Cập nhật thời gian
- Xóa cache của tour đã cập nhật
- Duy trì tính nhất quán dữ liệu

**Yêu cầu đặc biệt**:
- Quá trình chuyển trạng thái phải tuân theo: DRAFT → PUBLISHED → ARCHIVED
- Không thể sửa thông tin cốt lõi của tour đã xuất bản
- Chỉ chủ tour mới có thể cập nhật thông tin tour

### 5. Xóa Tour
**Mục đích**: Xóa tour khỏi hệ thống.

**Dữ liệu đầu vào**:
- ID tour

**Yêu cầu xử lý**:
- Kiểm tra sự tồn tại của tour
- Kiểm tra trạng thái tour
- Xóa tour khỏi cơ sở dữ liệu
- Xóa cache liên quan

**Yêu cầu đặc biệt**:
- Không thể xóa tour đã xuất bản
- Chỉ chủ tour mới có thể xóa tour

### 6. Quản Lý Chỗ
**Mục đích**: Quản lý tính khả dụng và đặt chỗ của tour.

**Dữ liệu đầu vào**:
- ID tour
- Số lượng chỗ cần khóa/mở khóa

**Yêu cầu xử lý**:
- Theo dõi số chỗ còn trống
- Kiểm tra tính khả dụng của chỗ
- Cập nhật số lượng chỗ một cách nguyên tử
- Duy trì tính nhất quán đặt chỗ

**Yêu cầu đặc biệt**:
- Ngăn chặn đặt chỗ quá số lượng
- Xử lý các yêu cầu đặt chỗ đồng thời
- Cập nhật cache sau khi thay đổi số chỗ

## Yêu Cầu Phi Chức Năng

### Hiệu Suất
- Thời gian phản hồi < 200ms cho tất cả các thao tác
- Hỗ trợ nhiều yêu cầu đặt chỗ đồng thời
- Chiến lược cache hiệu quả cho dữ liệu tour

### Bảo Mật
- Kiểm soát truy cập dựa trên vai trò
- Yêu cầu xác thực cho các thao tác nhạy cảm
- Kiểm tra đầu vào cho tất cả các trường
- Bảo vệ chống SQL injection

### Khả Năng Mở Rộng
- Khả năng mở rộng theo chiều ngang
- Hỗ trợ phân mảnh cơ sở dữ liệu
- Cơ chế cache hiệu quả

### Độ Tin Cậy
- Hỗ trợ giao dịch cho các thao tác quan trọng
- Xử lý lỗi và ghi log
- Kiểm tra tính nhất quán dữ liệu
- Quy trình sao lưu và khôi phục

### Giám Sát
- Theo dõi tỷ lệ tạo/cập nhật tour
- Giám sát tính khả dụng của chỗ
- Theo dõi mẫu đặt chỗ
- Chỉ số sức khỏe hệ thống

## API Endpoints

### Endpoints Công Khai
- GET /api/v1/tours - Danh sách tour
- GET /api/v1/tours/:id - Lấy chi tiết tour

### Endpoints Được Bảo Vệ
- POST /api/v1/tours - Tạo tour
- PATCH /api/v1/tours/:id - Cập nhật tour
- DELETE /api/v1/tours/:id - Xóa tour

## Mô Hình Dữ Liệu

### Entity Tour
```go
type Tour struct {
    ID            uuid.UUID
    Name          string
    Description   string
    HostID        uuid.UUID
    Slot          int32
    AvailableSlot int32
    Price         int32
    Status        TourStatus
    TimeStart     time.Time
    TimeEnd       time.Time
    CreatedAt     time.Time
    UpdatedAt     time.Time
}
```

### Trạng Thái Tour
- DRAFT: Trạng thái ban đầu cho tour mới
- PUBLISHED: Tour đang hoạt động và có thể đặt chỗ
- ARCHIVED: Tour đã hoàn thành hoặc đã hủy 