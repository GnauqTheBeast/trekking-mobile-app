# 📊 Hệ Thống Đặt Tour Trekking - Analysis and Design

---

## 1. 🎯 Problem Statement

Hệ thống đặt tour trekking trực tuyến giải quyết nhu cầu đặt tour nhanh chóng, thuận tiện và tránh các vấn đề thường gặp như hết chỗ, thông tin không rõ ràng hoặc khó liên hệ với đơn vị tổ chức.

**User**
- Host thêm các tour của công ty mình lên hệ thống
- Các porter đăng ký hướng dẫn các tour
- Khách hàng tìm kiếm và đặt tour trekking, lựa chọn porter

**Main goal**
- Cung cấp trải nghiệm đặt tour đơn giản, trực quan
- Cập nhật chính xác số lượng chỗ còn lại theo thời gian thực
- Quản lý thông tin tour, lịch trình và người tham gia
- Hỗ trợ thanh toán và gửi xác nhận nhanh chóng

**Processed data**
- Thông tin tour (tên, địa điểm, thời gian, giá,..)
- Thông tin porter (họ tên, liên hệ, giá,...)
- Lịch trình tour và số lượng người tham gia
- Thông tin người dùng (họ tên, liên hệ, yêu cầu đặc biệt)
- Dữ liệu thanh toán và xác nhận đặt tour
- Gửi thông báo

---

## 2. 🧩 Identified Microservices

List the microservices in your system and their responsibilities.

| Service Name  | Responsibility                                | Tech Stack   |
|---------------|------------------------------------------------|--------------|
| api-gate-way           | Điều hướng yêu cầu                                   | C#, Ocelot |
| user-service           | Quản lý thông tin cá nhân người dùng                 | NestJS, Postgres, Typescript  |
| auth-service           | Xử lý đăng nhập, đăng ký, quản lý token              | NestJS, Postgres, Typescript, Redis |
| tour-service           | Quản lý thông tin các tour trekking                  | Go, Postgres, Redis Cache, Redis Queue |
| booking-service        | Xử lý người dùng booking tour                        | Go, Postgres, Redis Cache, Redis Queue |
| payment-service        | Xử lý thanh toán khi đặt tour                        | C#, Postgres, Redis Queue |
| notification-service   | Xử lý thông báo tin nhắn hệ thống cho người dùng cuối     | Go, Postgres, Redis Cache, Redis Queue |

---

## 3. 🔄 Service Communication

- Gateway ⟷ Tất cả các service: REST
- Giữa các service với nhau: gRPC
- Giữa client với server: REST, Websocket

---

## 4. 🗂️ Data Design

Tất cả các service đều dùng **PostgresSQL** để lưu trữ dữ liệu

**user-service**
- *user*: id, name, email, password, phone_number, role_id, address, dob, provider_id, created_at, updated_at
- *role*: id, name, description
- *permission*: id, name, code, description, create_at, updated_at
- *role_permission*: role_id, permission_id

**tour-service**
- *tour*: id, name, description, host_id, slot, available_slot, price, status, start_at, end_at, created_at, updated_at

**booking-service**
- *booking*: id, user_id, tour_id, porter_id, quantity, status, total_price, expired_at, created_at, updated_at

**payment-service**
- *payment*: id, user_id, tour_id, porter_id, quantity, status, total_price, expired_at, created_at, updated_at
- *transaction*: id, account_id, amount, type, status, description, reference_id, reference_type, created_at, updated_at

**notification-service**
- *notification*: id, user_id, name, description, created_at, updated_at

![image](https://github.com/jnp2018/mid-project-630245654/blob/main/docs/assets/schema.png)

---

## 5. 🔐 Security Considerations

- Sử dụng JWT cho xác thực và phân quyền tại API Gateway
- Mã hóa thông tin thanh toán trong quá trình truyền và lưu trữ
- Bảo vệ API với Rate Limiting để ngăn chặn tấn công DDoS
- Sử dụng HTTPS cho tất cả các kết nối
- Áp dụng Principle of Least Privilege cho mỗi service

---

## 6. 📦 Deployment Plan

- Sử dụng `docker-compose` để quản lý môi trường cục bộ
- Mỗi service có một Dockerfile riêng
- Cấu hình môi trường được lưu trong tệp `.env`
- Dùng file `init.sh` để triển khai dự án trên `kubernetes`

---

## 7. 🎨 Architecture Diagram

![image](https://github.com/jnp2018/mid-project-630245654/blob/main/docs/assets/architecture.png)

---

## ✅ Summary

- **Khả năng mở rộng**: Các service độc lập, dễ mở rộng theo nhu cầu người dùng hoặc tour tăng nhanh.
- **Tính module**: Từng service đảm nhiệm một chức năng riêng (người dùng, tour, đặt tour, thanh toán...).
- **Khả năng chịu lỗi**: Dùng circuit breaker để tránh lỗi lan rộng nếu một service gặp sự cố.
- **Xử lý đồng thời**: Cập nhật chỗ còn lại theo thời gian thực, tránh đặt trùng khi nhiều người cùng đặt tour.
- **Xử lý bất đồng bộ**: Notification, gửi email xác nhận... được xử lý thông qua Message Broker (Redis Queue).
- **API Gateway tập trung**: Quản lý bảo mật, định tuyến và giám sát hiệu quả toàn hệ thống.

> Kiến trúc này phù hợp với đặc thù đặt tour trekking: nhiều người truy cập cùng lúc, dữ liệu thay đổi liên tục, yêu cầu xử lý nhanh, rõ ràng và tin cậy.
