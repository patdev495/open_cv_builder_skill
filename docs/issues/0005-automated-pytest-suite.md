# Issue #0005: Automated Integration Test Suite

**Status:** `ready-for-agent`
**Type:** AFK
**Blocked by:** Issue #0002

---

## Parent
- Ref: PRD-0001 (CV Builder Pro Product Requirement Document)

## What to build
Xây dựng và duy trì bộ kiểm thử tích hợp (integration tests) cho backend API để đảm bảo chất lượng phần mềm lâu dài:
- Thiết lập môi trường test sử dụng `pytest` chạy độc lập với cơ sở dữ liệu thực tế bằng cách dùng SQLite in-memory (`sqlite://`).
- Viết các test cases bao phủ các nghiệp vụ cốt lõi:
  - Tạo mới thành công CV và mã hóa mật khẩu.
  - Chặn tạo CV nếu trùng lặp slug.
  - Đọc thành công dữ liệu CV công khai.
  - Cập nhật CV thành công khi cung cấp đúng passcode.
  - Từ chối cập nhật CV (trả về lỗi 401) khi truyền sai passcode.
  - Xác thực đúng/sai passcode thông qua endpoint `/verify`.
- Bộ test phải được cấu hình đường dẫn tiện lợi và có thể kích hoạt nhanh chóng bằng một dòng lệnh đơn giản.

## Acceptance criteria
- [ ] Chạy kiểm thử thành công bằng lệnh `uv run pytest -o pythonpath=.` trong thư mục backend.
- [ ] Bộ test không tạo ra hoặc ghi đè lên file cơ sở dữ liệu phát triển thực tế (`cv_builder.db`).
- [ ] 100% các test cases vượt qua (Passed) mà không gặp bất kỳ lỗi hay cảnh báo nghiêm trọng nào.
- [ ] Dữ liệu test tự động bị hủy sạch (Drop tables / Close session) sau khi kết thúc toàn bộ phiên kiểm thử.
