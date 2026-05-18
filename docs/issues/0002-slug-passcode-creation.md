# Issue #0002: Unique Slug Registration & Secure Passcode Creation

**Status:** `ready-for-agent`
**Type:** AFK
**Blocked by:** Issue #0001

---

## Parent
- Ref: PRD-0001 (CV Builder Pro Product Requirement Document)

## What to build
Thiết lập cơ chế lưu trữ CV động vào SQLite và bảo vệ quyền chỉnh sửa bằng mật mã:
- Frontend cung cấp thanh nhập liệu ở trên cùng để người dùng điền `Slug` mong muốn và `Passcode` bảo vệ.
- Khi bấm "Lưu & Xuất bản", gửi payload chứa `slug`, `passcode`, `template`, và `cv_data` lên API `POST /api/cvs`.
- Backend kiểm tra trùng lặp (collision detection): nếu slug đã tồn tại trong database, trả về lỗi `400 Bad Request`.
- Nếu slug chưa tồn tại, Backend tiến hành băm `passcode` bằng bcrypt và lưu thông tin CV cùng passcode đã băm vào bảng SQLite.
- Sau khi lưu thành công, Frontend tự động cập nhật URL trình duyệt thành `/{slug}` mà không cần reload trang.

## Acceptance criteria
- [ ] Giao diện cho phép nhập Slug và Passcode rõ ràng, có hiển thị cảnh báo nếu để trống.
- [ ] Bấm nút "Lưu" gửi chính xác payload lên backend API.
- [ ] Backend chặn lưu đè nếu slug đã được người khác sử dụng và trả về mã lỗi thích hợp kèm thông báo rõ ràng cho client.
- [ ] Backend lưu trữ mật mã đã băm bằng bcrypt, tuyệt đối không lưu passcode dạng text thuần túy vào database.
- [ ] Sau khi lưu thành công lần đầu, URL thanh địa chỉ trình duyệt tự động cập nhật sang URL mới (ví dụ `/pat`).
