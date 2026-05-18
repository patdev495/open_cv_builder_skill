# 0001-sqlite-backend-with-password-protected-slugs

## Status
Accepted

## Context
Chúng tôi cần xây dựng một ứng dụng CV Builder cho phép người dùng chia sẻ CV qua một URL tùy chỉnh (Slug) và bảo mật quyền chỉnh sửa bằng một mật mã (Passcode). Hệ thống cần lưu trữ dữ liệu bền vững nhưng gọn nhẹ, dễ triển khai và không yêu cầu đăng ký tài khoản (User Auth) phức tạp.

## Decision
Chúng tôi quyết định xây dựng một kiến trúc Full-stack đơn giản:
1. **Backend**: FastAPI (Python) cung cấp API RESTful để lưu và tải CV.
2. **Database**: SQLite lưu trữ dữ liệu trực tiếp trong một file local (`cv_builder.db`), giúp triển khai cực kỳ gọn nhẹ và không cần cấu hình server DB phức tạp.
3. **Authentication**: Không sử dụng hệ thống tài khoản người dùng (User Accounts). Mỗi CV được xác thực trực tiếp bằng cặp `Slug` (duy nhất) và `Passcode` (hash lưu trong DB). Người dùng bắt buộc phải cung cấp `Passcode` chính xác để chuyển sang chế độ chỉnh sửa.
4. **Frontend**: React + Vite hiển thị giao diện động và thực hiện chỉnh sửa, giao tiếp với backend qua các API endpoints.

## Consequences
- **Ưu điểm**: Phát triển cực nhanh, không tốn chi phí vận hành DB lớn, trải nghiệm người dùng tối giản (không cần đăng ký/đăng nhập).
- **Nhược điểm**: Nếu người dùng quên `Passcode` hoặc nhập trùng `Slug` đã có (và không có passcode cũ), họ sẽ không thể ghi đè lên slug đó. Hệ thống cần có cơ chế cảnh báo trùng lặp slug rõ ràng.
