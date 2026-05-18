# Issue #0001: Default CV Display & Live Preview (A4 Template Rendering)

**Status:** `ready-for-agent`
**Type:** AFK
**Blocked by:** None - can start immediately

---

## Parent
- Ref: PRD-0001 (CV Builder Pro Product Requirement Document)

## What to build
Xây dựng giao diện biên tập CV chia đôi màn hình (Split-screen) chuyên nghiệp:
- Bên trái là bảng nhập liệu dạng Accordion khoa học chứa các phần thông tin cá nhân, tóm tắt, học vấn, kinh nghiệm, dự án, kỹ năng, ngoại ngữ và chứng chỉ.
- Bên phải là bản render xem trước (Live Preview) thời gian thực của CV hiển thị trên layout giả lập tờ A4 chuẩn.
- Khi người dùng gõ vào form bên trái, dữ liệu bên phải phải cập nhật tức thì dưới client (không reload trang).
- Tải mặc định thông tin mẫu chất lượng cao của Nguyễn Văn A khi mở trang lần đầu để làm trực quan hóa.
- Cho phép người dùng chuyển đổi qua lại giữa 3 phong cách thiết kế mẫu (Modern, Classic, Creative) mà không mất mát dữ liệu đang nhập.

## Acceptance criteria
- [ ] Giao diện chia đôi màn hình hoạt động mượt mà, responsive tốt trên các màn hình lớn (Desktop).
- [ ] Có đầy đủ các form nhập liệu cho tất cả các trường dữ liệu được mô tả trong schema.
- [ ] Live Preview ở khung bên phải phản hồi tức thì (<100ms) theo các thay đổi trong form nhập liệu bên trái.
- [ ] Thay đổi template (Modern, Classic, Creative) cập nhật ngay lập tức phong cách hiển thị (font chữ, layout, màu sắc) của CV bên phải mà không làm reset dữ liệu trong form.
- [ ] Khi truy cập đường dẫn trang chủ (`/`), form được tự động điền dữ liệu CV mẫu của Nguyễn Văn A.
