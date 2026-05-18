# 0005-implicit-toggling-and-clear-action

## Status
Accepted

## Context
Trong quá trình thiết kế trình biên tập CV Pro, người dùng có nhu cầu quản lý linh hoạt việc hiển thị các trường dữ liệu nhỏ (như Email, SĐT, Website, GitHub) và các vùng dữ liệu lớn (như Kinh nghiệm làm việc, Học vấn, Dự án). Một số thông tin người dùng muốn ẩn đi trên CV bản in/bản xem công khai nhưng vẫn có cách thêm lại dễ dàng.

Đồng thời, khi mở trang lần đầu, hệ thống luôn điền sẵn (pre-fill) một bản CV mẫu đầy đủ để làm chỉ dẫn trực quan. Tuy nhiên, người dùng thực tế cần một cơ chế nhanh gọn để dọn sạch dữ liệu mẫu này và bắt đầu viết CV của riêng mình từ đầu mà không cần xóa tay thủ công hàng chục ô nhập liệu.

Chúng tôi cần đưa ra quyết định kiến trúc để giải quyết hai vấn đề này một cách tinh giản, tối ưu dung lượng lưu trữ và mang lại trải nghiệm người dùng (UX) mượt mà nhất.

## Decision
Chúng tôi quyết định áp dụng hai giải pháp thiết kế bổ trợ lẫn nhau:

1. **Cơ chế Ẩn/Hiện Tự động (Implicit Toggling)**:
   - Hệ thống **không** sử dụng các switch hay checkbox bật/tắt hiển thị thủ công (Explicit Toggle) để tránh phình to cơ sở dữ liệu và làm phức tạp giao diện biên tập.
   - Thay vào đó, Live Preview bên phải và bản in PDF của CV sẽ tự động kiểm tra sự tồn tại của dữ liệu. Nếu một trường hoặc vùng dữ liệu bị để trống/xóa sạch ở cột soạn thảo bên trái, nó sẽ **tự động ẩn đi hoàn toàn** khỏi bản render mà không để lại khoảng trống thừa.
   - Ô nhập liệu bên trái vẫn luôn hiển thị cố định để người dùng có thể gõ nội dung và thêm lại bất cứ lúc nào.

2. **Nút Làm Trống CV (Clear CV Action) kèm Xác thực**:
   - Tích hợp nút bấm **"Làm trống CV" (Clear CV)** có biểu tượng thùng rác màu đỏ tinh tế ngay cạnh nút Lưu ở góc dưới cùng của panel cấu hình.
   - Khi click, hệ thống hiển thị hộp thoại xác nhận xác thực (`window.confirm`) để ngăn chặn việc người dùng vô tình xóa mất dữ liệu đang biên tập.
   - Sau khi xác nhận, toàn bộ trạng thái dữ liệu `cvData` sẽ được reset về một Schema trắng tinh (blank schema), giúp người dùng bắt đầu viết CV mới từ đầu chỉ sau 1 click.

## Consequences
- **Ưu điểm**:
  * **Tối giản hóa Schema**: Giữ cho `CVSchema` cực kỳ thuần khiết, không cần lưu trữ thêm bản đồ hiển thị (visibility map) vào SQLite.
  * **Giao diện đỉnh cao (WOW UI/UX)**: Trình biên tập không bị rối mắt bởi hàng chục nút checkbox ẩn/hiện. Bản in PDF tự động co dãn thông minh theo nội dung thực tế.
  * **Trải nghiệm khởi đầu mượt mà**: Nút Clear CV giải quyết triệt để sự bất tiện khi phải đi xóa thủ công từng công việc hay học vấn cũ của dữ liệu mẫu.
- **Nhược điểm**: 
  * Nếu người dùng muốn ẩn tạm thời một trường mà vẫn giữ chữ trong ô nhập thì sẽ phải xóa chữ đi (sau đó gõ lại nếu cần). Tuy nhiên, đây là hành vi rất tự nhiên, trực quan và khớp hoàn hảo với thói quen viết CV chuẩn quốc tế.
