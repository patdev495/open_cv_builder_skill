# PRD-0001: CV Builder Pro - Trình Tạo và Quản Lý CV Trực Tuyến

---

## Problem Statement

Hiện nay, việc tạo và chia sẻ CV chuyên nghiệp thường gặp nhiều rào cản:
1. **Quá trình đăng ký rườm rà:** Hầu hết các nền tảng yêu cầu người dùng đăng ký tài khoản, xác thực email phức tạp chỉ để tạo một bản CV đơn giản.
2. **Khó chia sẻ trực tuyến:** Việc gửi file PDF qua email đôi khi bất tiện. Người dùng muốn có một đường dẫn URL đẹp, chuyên nghiệp, tải nhanh (ví dụ: `/pat`) để gửi trực tiếp cho nhà tuyển dụng.
3. **Chỉnh sửa thiếu trực quan:** Người dùng mất thời gian nhập dữ liệu vào form, bấm "Xem thử", rồi lại quay lại sửa do giao diện hiển thị không trùng khớp. Họ cần một cơ chế **Live Preview** thời gian thực (nhập bên trái, giao diện cập nhật ngay lập tức bên phải).
4. **Vấn đề bảo mật thông tin:** Khi cung cấp đường dẫn URL công khai, người dùng vẫn muốn đảm bảo không ai khác có thể chỉnh sửa nội dung CV của họ trừ khi có mật mã truy cập (**Passcode**).

---

## Solution

**CV Builder Pro** giải quyết triệt để các vấn đề trên bằng một ứng dụng Web Fullstack siêu nhẹ, bảo mật cao và không cần tài khoản:
1. **Biên tập song song (Live Preview):** Giao diện chia đôi trực quan. Bên trái nhập liệu qua các Accordion khoa học, bên phải hiển thị bản xem trước A4 chuẩn thời gian thực.
2. **Đăng ký URL tùy chỉnh (Slug) & Bảo mật không tài khoản (Passcode):** Khi lưu CV lần đầu, người dùng chọn một `Slug` mong muốn (ví dụ: `/pat`) và thiết lập một `Passcode`. Hệ thống sử dụng bcrypt để băm mật mã và lưu vào SQLite.
3. **Cơ chế chống ghi đè nghiêm ngặt (Strict Collision Handling):** Slug là định danh duy nhất. Không ai có thể lưu đè lên slug đã có trừ khi họ cung cấp chính xác `Passcode` đã đăng ký.
4. **Chế độ xem công khai (View Mode) & Mở khóa chỉnh sửa (Unlock Mode):** Truy cập `/slug` sẽ hiển thị CV ở dạng chỉ xem chuyên nghiệp. Nút "Chỉnh sửa CV này" sẽ yêu cầu nhập đúng Passcode để quay lại màn hình biên tập.
5. **Xuất bản PDF hoàn hảo (A4 Print Engine):** Xuất bản tài liệu PDF pixel-perfect thông qua hộp thoại in của trình duyệt bằng kỹ thuật CSS `@media print` tối ưu, tự động ẩn toàn bộ UI thừa của trình soạn thảo.
6. **Tải ảnh đại diện nén trực tuyến (Stateless Avatar Upload):** Cho phép tải lên ảnh chân dung cá nhân, tự động crop vuông 1:1 và nén tối ưu bằng HTML5 Canvas xuống dưới 150KB dưới dạng chuỗi Base64 lưu trực tiếp trong JSON CV Schema.
7. **Cơ chế ẩn/hiện tự động (Implicit Toggling):** Tự động ẩn các vùng dữ liệu rỗng và các trường thông tin không có nội dung trên Live Preview và bản in PDF, giúp giữ giao diện CV tối giản, cân đối mà không cần bật/tắt thủ công.

---

## User Stories

1. As a new user, I want to see a beautiful, pre-filled default CV upon opening the website, so that I can immediately understand what a finished CV looks like and how to use the editor.
2. As a user, I want to edit my personal information (Full Name, Title, Email, Phone, Location, Website, GitHub, LinkedIn), so that recruiters can easily contact me.
3. As a user, I want to write a short professional summary about my career, so that I can capture the recruiter's attention in 5 seconds.
4. As a user, I want to add multiple work experiences with company name, position, dates, and detailed bullet points, so that I can showcase my career progression.
5. As a user, I want to add education history including institution, degree, dates, and GPA/achievements, so that I can present my academic background.
6. As a user, I want to add professional projects with role, description, technologies used, and links, so that I can highlight my practical application of skills.
7. As a user, I want to group my skills into categories (e.g., Frontend, Backend, DevOps), so that my technical stack looks organized.
8. As a user, I want to add certifications and awards with dates and issuers, so that I can build credibility with employers.
9. As a user, I want to list languages I speak along with my proficiency levels, so that companies can evaluate my communication capabilities in global environments.
10. As a user, I want to see my CV render instantly on the right side of the screen as I type on the left side, so that I have immediate visual feedback without reloading.
11. As a user, I want to choose from three high-quality templates (Modern Minimalist, Classic Executive, Creative Tech), so that my CV aligns with my target industry's style.
12. As a user, I want to select a custom URL path (Slug) (e.g., `/pat`) for my CV, so that I have a clean and memorable link to put on my business card or social media.
13. As a user, I want to protect my CV with a Passcode when saving, so that my CV cannot be vandalized or altered by strangers.
14. As a user, I want my CV to be publicly accessible at `/slug` in a read-only View Mode, so that anyone with the link can view it instantly without logging in.
15. As a user, I want to click an "Unlock Editing" button when viewing my published CV and enter my passcode, so that I can return to the editor mode and update my details.
16. As a user, I want to export my CV as a high-quality PDF using the browser's print dialog, so that I can download a static copy for job applications.
17. As a recruiter, I want the printed PDF version to be perfectly formatted to fit an A4 page without any editor panels, buttons, or background grids, so that I receive a clean and professional document.
18. As a developer, I want the system to block saving if my selected slug is already registered by another user, so that my CV URL remains unique and my data is never overwritten.
19. As an automated test suite, I want to verify backend validation and passcode security, so that I can prevent security regressions in future updates.
20. As a user, I want to upload a professional portrait/avatar to my CV, so that recruiters can put a face to my name.
21. As a user, I want to delete my uploaded avatar easily if I decide to remove it, so that my CV only displays text.
22. As a user, I want empty CV fields and sections to be hidden automatically (Implicit Toggling) from the preview and print version, so that I don't have to manually delete or toggle empty sections to make my CV look complete.

---

## Implementation Decisions

### 1. Project Modules & Architecture
Hệ thống được thiết kế theo mô hình kiến trúc Monorepo phân tách rõ ràng:
- **Backend (FastAPI + SQLModel + SQLite):** Xử lý xác thực Passcode bằng `bcrypt` trực tiếp, kiểm tra trùng lặp slug, và lưu trữ dữ liệu dưới dạng JSON thuần túy trong SQLite.
- **Frontend (React + TypeScript + Vite + TailwindCSS v4):** Quản lý State nhập liệu động, đồng bộ trực tiếp sang bộ render Template (Live Preview), xử lý ẩn giao diện điều khiển khi kích hoạt chế độ in ấn (`@media print`).

### 2. CV Data Schema (TypeScript / Pydantic Shape)
Cấu trúc dữ liệu CV Schema được đồng bộ hóa chặt chẽ giữa Backend và Frontend:
```typescript
interface PersonalInfo {
  fullName: string;
  title?: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  avatar?: string; // Base64 Data URL (compressed JPEG, 1:1 ratio, max 150KB)
}

interface CVSchema {
  personalInfo: PersonalInfo;
  summary?: string;
  experience: { id: string; company: string; position: string; startDate: string; endDate?: string; description: string; }[];
  education: { id: string; institution: string; degree: string; startDate: string; endDate?: string; description?: string; }[];
  projects: { id: string; name: string; role: string; startDate: string; endDate?: string; description: string; technologies: string[]; url?: string; }[];
  skills: { id: string; category: string; skills: string[]; }[];
  certificates: { id: string; name: string; issuer: string; date: string; url?: string; }[];
  languages: { id: string; name: string; level: string; }[];
}
```

### 3. API Contract
- `POST /api/cvs`
  - *Mô tả:* Tạo mới CV. Trả về lỗi `400` nếu Slug đã tồn tại.
  - *Payload:* `{ slug: string, passcode: string, template: string, cv_data: CVSchema }`
- `GET /api/cvs/{slug}`
  - *Mô tả:* Lấy thông tin CV công khai (không yêu cầu passcode).
  - *Response:* `{ slug: string, template: string, cv_data: CVSchema }`
- `PUT /api/cvs/{slug}`
  - *Mô tả:* Cập nhật CV hiện tại. Yêu cầu truyền đúng passcode của slug đó, nếu sai trả về `401`.
  - *Payload:* `{ passcode: string, template: string, cv_data: CVSchema }`
- `POST /api/cvs/{slug}/verify`
  - *Mô tả:* Xác thực passcode để chuyển từ chế độ Xem công khai sang Chế độ Biên tập.
  - *Payload:* `{ passcode: string }`

---

## Testing Decisions

### 1. Nguyên tắc Kiểm thử (Good Test Principles)
- **Kiểm thử hành vi ngoại vi (Behavioral Testing):** Chỉ test các cổng giao tiếp API và kết quả thực tế trả về từ database. Không mock hoặc can thiệp sâu vào các hàm nội bộ của database session helper.
- **Tính cô lập (Isolation):** Mỗi bài test chạy trên một cơ sở dữ liệu SQLite in-memory mới tinh (`sqlite://`), tự khởi tạo Schema và tự động Drop toàn bộ bảng sau khi hoàn thành.

### 2. Các Modules được kiểm thử
- **Auth Module (`auth.py`):** Kiểm tra tính đúng đắn của hàm băm bcrypt và khớp mật mã.
- **CRUD & Router Module (`main.py` + `crud.py`):** Kiểm tra toàn bộ 5 kịch bản API chính:
  - Tạo mới CV thành công.
  - Chặn trùng lặp Slug (Collision).
  - Cập nhật thành công khi đúng Passcode.
  - Chặn cập nhật và trả về `401` khi sai Passcode.
  - Xác thực Passcode qua endpoint `/verify`.

### 3. Tiền lệ Kiểm thử (Prior Art)
Hệ thống sử dụng bộ framework `pytest` kết hợp với `FastAPI TestClient` và `httpx` (đã được cấu hình trong `backend/tests/test_api.py`). Bộ test này chạy cực nhanh (~4 giây) và độc lập hoàn toàn với database thực của ứng dụng (`cv_builder.db`).

---

## Out of Scope

Các tính năng sau không nằm trong phạm vi của MVP này và sẽ được xem xét ở các giai đoạn sau:
1. **Hệ thống Tài khoản Người dùng (User Accounts):** Không có chức năng đăng ký tài khoản, đăng nhập, khôi phục mật khẩu qua email. Hệ thống dựa hoàn toàn vào cặp `Slug` và `Passcode`.
2. **Server-side PDF Generator (Node/Puppeteer PDF Render):** Không sử dụng các engine nặng để render PDF phía backend để tiết kiệm tài nguyên. Xuất PDF dựa hoàn toàn vào cơ chế Print của trình duyệt phía Client.
3. **Tên miền phụ tùy chỉnh (Custom Domains):** Người dùng không thể trỏ tên miền cá nhân (ví dụ `pat.dev`) về CV của họ trên hệ thống, chỉ sử dụng đường dẫn URL dạng `/slug`.

---

## Further Notes

- **Xử lý khoảng trắng của Slug:** Toàn bộ Slug đầu vào từ client sẽ được chuẩn hóa: chuyển thành chữ thường, cắt bỏ khoảng trắng thừa ở hai đầu và loại bỏ các ký tự đặc biệt để đảm bảo URL luôn an toàn (`slug.trim().toLowerCase()`).
- **Lưu trữ SQLite:** Cơ sở dữ liệu SQLite mặc định được đặt tại `backend/cv_builder.db` giúp dễ dàng sao lưu, di chuyển hoặc tích hợp CI/CD.
