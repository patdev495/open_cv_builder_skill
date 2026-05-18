# CV Builder Skill

A web application and AI assistant skill for creating, editing, and managing Curriculum Vitae (CVs) with dynamic templating.

## Language

**CV**:
Một tài liệu chuẩn hóa chứa thông tin cá nhân, học vấn, kinh nghiệm làm việc và kỹ năng của người dùng.
_Avoid_: Resume, profile

**Avatar**:
Ảnh chân dung định dạng vuông tỉ lệ 1:1 của người dùng, được mã hóa dưới dạng chuỗi Base64 và lưu trữ tùy chọn trong trường `personalInfo.avatar` của **CV Schema**.
_Avoid_: Photo, portrait, image file

**CV Schema**:
Cấu trúc dữ liệu JSON chuẩn hóa đại diện cho toàn bộ nội dung của một CV (bao gồm: Thông tin cá nhân, Giới thiệu bản thân, Kinh nghiệm làm việc, Học vấn, Dự án, Kỹ năng, Chứng chỉ & Giải thưởng, Ngoại ngữ), giúp phân tách dữ liệu thô khỏi giao diện hiển thị.
_Avoid_: CV format, CV layout

**Template**:
Một bố cục giao diện và phong cách thiết kế định sẵn được áp dụng lên **CV Schema** để hiển thị CV cho người dùng.
_Avoid_: Style, skin, theme, layout

**Typography** (Kiểu chữ):
Bộ phông chữ kỹ thuật số được chọn lọc kỹ lưỡng từ Google Fonts (bao gồm: *Inter, Outfit, Lora, Playfair Display, JetBrains Mono, Fira Code*) và áp dụng động lên **Template** để thay đổi sắc thái hiển thị của **CV**.
_Avoid_: Font, font family, text style

**Layout Density** (Mật độ bố cục):
Tỷ lệ khoảng cách lề ngoài (margin) và khoảng trống giữa các đoạn văn (inner spacing) bên trong một **Template**. Được chia thành 3 cấp độ: `compact` (Nhỏ/Dày đặc), `normal` (Tiêu chuẩn), và `comfortable` (Rộng rãi).
_Avoid_: Margin, padding, spacing

**Export**:
Hành động chuyển đổi **CV** từ giao diện web động thành một định dạng tài liệu tĩnh (ví dụ: PDF) thông qua cơ chế in của trình duyệt để người dùng tải về.
_Avoid_: Download, print, generate PDF

**Slug**:
Đường dẫn URL tùy chỉnh (ví dụ: `/pat`) do người dùng tự chọn để định danh duy nhất và chia sẻ **CV** của họ.
_Avoid_: Path, URL, link

**Passcode**:
Mật mã do người dùng thiết lập khi lưu **CV** để bảo vệ quyền chỉnh sửa và truy cập của CV đó trên hệ thống (không liên kết với tài khoản người dùng).
_Avoid_: Password, key, pin

**Live Preview**:
Chế độ hiển thị song song giúp cập nhật giao diện của **CV** theo **Template** đã chọn ngay lập tức trong quá trình người dùng nhập liệu ở bộ chỉnh sửa.
_Avoid_: Draft preview, static view

**Interactive Portfolio** (Hồ sơ Tương tác):
Chế độ hiển thị trực tuyến sống động của **CV** trên trang **Slug** công khai, hỗ trợ các hiệu ứng thị giác Glassmorphism, chuyển đổi giao diện sáng/tối (Dark/Light mode) dựa trên cấu hình mặc định trong **CV Schema**, và tích hợp các tiện ích nhúng dự án (Project Embed Widgets), nhưng tự động chuẩn hóa về dạng tài liệu tối giản khi **Export** PDF.
_Avoid_: Dynamic CV, personal site

**Project Embed** (Tiện ích Nhúng Dự án):
Một thành phần giao diện động được tự động sinh ra trên **Interactive Portfolio** khi người dùng cung cấp trường `embedUrl` trong khối dự án. Giao diện này tự phân tích tên miền nguồn (như GitHub, YouTube, Figma, CodeSandbox) để hiển thị widget tương tác động hoặc thẻ xem trước sang trọng, và tự rút gọn thành URL văn bản/QR code khi **Export** PDF.
_Avoid_: Video link, iframe, external link

**Engagement Analytics** (Thống kê Tương tác):
Hệ thống đo lường và ghi nhận ẩn danh các hành vi tương tác của người xem (như thời gian đọc, mức độ tập trung vào từng khối nội dung, các lượt bấm liên kết và lượt **Export** PDF) trên **Interactive Portfolio**, được tổng hợp và hiển thị trực quan thông qua biểu đồ trong bảng quản trị của ứng viên.
_Avoid_: Pageview counter, web tracker, visitor logs

**Implicit Toggling** (Ẩn/Hiện Tự động):
Cơ chế tự động ẩn các vùng dữ liệu (Sections) hoặc trường thông tin (Fields) trên bản xem trước **Live Preview** và tài liệu **Export** khi dữ liệu tương ứng bị bỏ trống trong trình soạn thảo, giúp tối ưu hóa diện tích hiển thị mà không cần các nút bật/tắt thủ công.
_Avoid_: Visibility filter, manual toggling, explicit display settings

## Relationships

- A **CV** is represented by a single **CV Schema**
- A **CV** is rendered using a **Template**
- A **CV** can be **Exported** as a static document
- A **CV** is identified by a unique **Slug**
- A **CV** is protected by a **Passcode** for modification
- A **Slug** must be globally unique; if a collision occurs, saving is blocked unless the matching **Passcode** is verified
- A **CV** can be edited with a real-time **Live Preview**
- A **CV** can optionally include an **Avatar** to be displayed dynamically within the **Template** layouts
- A **CV** automatically hides empty components through **Implicit Toggling** for optimal presentation layout.
- A **CV** displays as an **Interactive Portfolio** when accessed online via its public **Slug**
- An **Interactive Portfolio** supports dynamic client-side Dark/Light mode toggling, defaulting to the creator's saved preference in the **CV Schema**
- An **Interactive Portfolio** in Dark Mode transforms the simulated A4 container into a borderless, glassmorphic web dashboard, automatically reverting to a standard light A4 template upon **Export**
- An **Interactive Portfolio** renders a **Project Embed** dynamically when a project's `embedUrl` is provided inside the **CV Schema**
- An **Interactive Portfolio** anonymously logs viewer behaviors (such as read duration, section focus, click interactions) into **Engagement Analytics** to provide real-time performance feedback to the CV creator





## Example dialogue

> **Dev:** "Người dùng có thể đổi giao diện CV mà không làm mất thông tin cũ không?"
> **Domain expert:** "Được chứ, vì **CV Schema** (dữ liệu thô) hoàn toàn độc lập với **Template** (giao diện). Họ chỉ cần chọn một **Template** mới và hệ thống sẽ tự động hiển thị lại dữ liệu đó theo giao diện mới."

