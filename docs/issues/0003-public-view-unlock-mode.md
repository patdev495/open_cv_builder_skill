# Issue #0003: Read-Only Public URL View & Editing Unlock Dialog

**Status:** `ready-for-agent`
**Type:** AFK
**Blocked by:** Issue #0002

---

## Parent
- Ref: PRD-0001 (CV Builder Pro Product Requirement Document)

## What to build
Xây dựng trải nghiệm xem công khai và cơ chế quay lại chế độ biên tập:
- Khi người dùng truy cập trực tiếp URL chứa slug (ví dụ: `http://localhost:5173/pat`):
  - Frontend parse `slug` từ URL và gọi API `GET /api/cvs/{slug}` để lấy dữ liệu.
  - Hiển thị CV ở **Chế độ chỉ xem (View Mode)**: ẩn toàn bộ thanh công cụ soạn thảo bên trái, căn giữa trang CV A4 sang trọng.
  - Thêm một nút hành động nổi bật "Chỉnh sửa CV này" (Edit this CV) ở góc màn hình.
- Khi bấm nút "Chỉnh sửa CV này", hiển thị một Modal (Hộp thoại) yêu cầu nhập Passcode.
- Khi người dùng nhập Passcode và gửi đi, gọi API xác thực `POST /api/cvs/{slug}/verify`.
  - Nếu đúng mật mã: Frontend kích hoạt lại chế độ biên tập (Editor Mode), hiện lại form nhập liệu bên trái và cho phép chỉnh sửa trực tiếp. Bấm "Cập nhật" sẽ gửi request `PUT /api/cvs/{slug}` kèm passcode để lưu thay đổi.
  - Nếu sai mật mã: Hiển thị thông báo lỗi "Mật mã không đúng" và giữ nguyên chế độ chỉ xem.

## Acceptance criteria
- [ ] Truy cập đường dẫn chứa slug hiển thị đúng nội dung CV tương ứng của người dùng từ Database.
- [ ] Chế độ View Mode ẩn hoàn toàn form soạn thảo, tạo không gian đọc CV thoáng đãng, chuyên nghiệp.
- [ ] Nút "Chỉnh sửa CV này" kích hoạt hộp thoại yêu cầu Passcode chuẩn.
- [ ] Nhập sai Passcode hiển thị thông báo lỗi trực quan và chặn chuyển đổi chế độ soạn thảo.
- [ ] Nhập đúng Passcode khôi phục toàn bộ trạng thái Editor, cho phép chỉnh sửa và cập nhật thành công lên DB qua API PUT.
