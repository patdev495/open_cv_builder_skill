# 0002-frontend-and-backend-tech-stack-details

## Status
Accepted

## Context
Dự án cần được thiết kế bài bản, dễ bảo trì, có kiểm soát kiểu dữ liệu mạnh mẽ để tránh lỗi runtime và giao diện hiện đại, tối ưu hóa CSS.

## Decision
Chúng tôi quyết định sử dụng các công nghệ sau:
1. **Frontend**:
   - **Framework**: React (Vite) cung cấp Single Page Application (SPA).
   - **Language**: TypeScript để đảm bảo tính an toàn về kiểu dữ liệu (Type-safety), tự động hoàn thành code và dễ tái cấu trúc.
   - **Styling**: TailwindCSS để xây dựng giao diện nhanh chóng, nhất quán và hiện đại.
2. **Backend**:
   - **Framework**: FastAPI (Python) tận dụng tối đa hệ thống Type hints (gợi ý kiểu) để tự động sinh tài liệu API (Swagger UI) và kiểm tra dữ liệu runtime bằng Pydantic.
   - **ORM**: SQLModel làm cầu nối giữa các mô hình Pydantic và cơ sở dữ liệu SQLite.

## Consequences
- **Ưu điểm**: Khả năng bảo trì cực kỳ cao nhờ kiểm tra kiểu tĩnh (TypeScript & Python Type hints). Tốc độ phát triển frontend cực nhanh nhờ TailwindCSS.
- **Nhược điểm**: Có thêm một số bước build/compile cho frontend (TypeScript) và backend (Type check), nhưng giá trị mang lại cho việc phát triển lâu dài là rất lớn.
