# Issue #0004: Pixel-Perfect A4 PDF Browser Print Engine

**Status:** `completed`
**Type:** AFK
**Blocked by:** Issue #0001

---

## Parent
- Ref: PRD-0001 (CV Builder Pro Product Requirement Document)

## What to build
Thiết lập bộ quy tắc CSS in ấn nâng cao giúp người dùng xuất bản file PDF hoàn hảo từ trình duyệt:
- Tích hợp nút hành động "In / Xuất PDF" (Print / Export PDF) ở thanh công cụ. Bấm vào nút này sẽ kích hoạt lệnh `window.print()` của trình duyệt.
- Sử dụng CSS Media Queries `@media print` để kiểm soát bố cục trang khi in:
  - Ẩn toàn bộ các thành phần giao diện thừa bao gồm: thanh công cụ trên cùng, form nhập liệu bên trái, các nút hành động, và nền lưới (grid background).
  - Định hình trang CV vừa khít với kích thước khổ giấy A4 tiêu chuẩn (`width: 210mm`, `height: 297mm`).
  - Thiết lập lề trang in (`margin: 0`) và chống tràn trang không mong muốn.
  - Tối ưu hóa màu sắc hiển thị chữ và các đường kẻ phân cách để đạt độ tương phản cao nhất khi in trắng đen hoặc in màu.

## Acceptance criteria
- [ ] Bấm nút "In / Xuất PDF" mở đúng hộp thoại in (Print Dialog) mặc định của hệ thống.
- [ ] Trong giao diện xem trước in (Print Preview):
  - Form biên tập bên trái bị ẩn đi hoàn toàn.
  - Khung xem trước CV tự động căn giữa và chiếm trọn không gian trang in.
  - Không có bất kỳ header hay footer mặc định nào của trình duyệt (ví dụ: ngày tháng, tiêu đề URL) bị đè lên nội dung CV.
- [ ] Bản in PDF hoàn hảo, chữ hiển thị sắc nét, không bị mất dòng hoặc tràn sang trang thứ 2 do margin quá lớn.
