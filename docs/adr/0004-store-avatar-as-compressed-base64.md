# 0004-store-avatar-as-compressed-base64

## Status
Accepted

## Context
Người dùng yêu cầu khả năng tải ảnh đại diện (Avatar) lên CV. Vì hệ thống là một ứng dụng không cần tài khoản, được đóng gói siêu nhẹ và có thể chạy được trên mọi nền tảng serverless stateless (nơi các file tĩnh lưu cục bộ sẽ bị xóa sạch khi máy chủ khởi động lại), chúng tôi cần tìm giải pháp lưu trữ ảnh đại diện bền vững và an toàn nhất.

Các phương án được cân nhắc:
1. **Lưu file ảnh tĩnh trên ổ đĩa máy chủ (Disk storage)**: Dễ mất dữ liệu ảnh khi container serverless khởi động lại hoặc scale-out.
2. **Lưu ảnh trong một bảng nhị phân BLOB riêng biệt trong SQLite**: Phức tạp hóa schema cơ sở dữ liệu SQLite, yêu cầu thay đổi migrations và logic stream nhị phân.
3. **Mã hóa ảnh thành chuỗi Base64 và lưu trực tiếp bên trong đối tượng JSON `cv_data` ở trường `personalInfo.avatar`**: Rất đơn giản, stateless-friendly, nhưng có nhược điểm phình to payload.

## Decision
Chúng tôi quyết định chọn **Phương án 3**: Lưu ảnh đại diện dưới dạng **chuỗi Base64 nén trực tiếp trong trường `personalInfo.avatar`**.

Để khắc phục triệt để nhược điểm phình to dung lượng:
1. **Nén tại Frontend (Canvas HTML5)**: Frontend sử dụng API Canvas HTML5 thuần để tự động crop tâm hình vuông (tỷ lệ 1:1), thu nhỏ kích thước về **300x300 pixels**, và xuất ra Base64 định dạng JPEG chất lượng **70%** (`canvas.toDataURL("image/jpeg", 0.7)`).
2. **Giới hạn kích thước**: Đảm bảo dung lượng ảnh sau nén tối đa là **150KB** (trên thực tế chỉ dao động từ 15KB - 30KB).
3. **Không dùng thư viện ngoài**: Toàn bộ quá trình nén và định cỡ được viết bằng vanilla JavaScript trên Canvas để giữ kích thước bundle tối giản.

## Consequences
- **Ưu điểm**:
  * Giữ nguyên sự đơn giản của Database đơn file (SQLite). Không cần viết migrations hay thay đổi schema bảng `CV`.
  * Tương thích tuyệt đối với các môi trường Serverless (stateless), dữ liệu ảnh luôn đi kèm trọn vẹn với file database `cv_builder.db` khi sao lưu.
  * Tự động thừa hưởng cơ chế phân quyền bảo mật bằng passcode của CV mà không cần phát sinh Endpoint xác thực upload riêng biệt.
- **Nhược điểm**: Dung lượng lưu trữ của một số bản ghi CV tăng thêm trung bình ~25KB. Đây là mức tăng hoàn toàn chấp nhận được và không ảnh hưởng đến hiệu năng truy vấn của SQLite.
