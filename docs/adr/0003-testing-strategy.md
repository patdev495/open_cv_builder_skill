# 0003-testing-strategy

## Status
Accepted

## Context
Để đảm bảo ứng dụng hoạt động ổn định, không phát sinh lỗi khi mở rộng tính năng và tự tin tái cấu trúc mã nguồn (refactoring) trong tương lai.

## Decision
Chúng tôi quyết định áp dụng chiến lược kiểm thử (Testing Strategy) cho dự án:
1. **Backend**:
   - Sử dụng **pytest** làm framework kiểm thử chính.
   - Viết các Integration Tests cho API endpoints (đặc biệt là kiểm tra các kịch bản: tạo CV mới, ghi đè khi đúng passcode, chặn ghi đè khi sai passcode, kiểm tra tính duy nhất của slug).
   - Chạy test thông qua công cụ UV: `uv run pytest`.
2. **Frontend**:
   - Thiết lập cấu hình **Vitest** kết hợp **React Testing Library** và **jsdom** để chạy các bộ test tự động nhanh chóng.
   - Áp dụng cấu trúc kiểm thử 3 tầng: Unit Test cho state reducer, Integration Test cho custom hooks (Translation & Passcode), và Component Test mô phỏng hành vi người dùng trên các Form Adapters.
   - Tất cả các tệp test được đặt cùng cấp với tệp mã nguồn tương ứng (`Colocated Tests`) để tăng tính dễ tiếp cận và dễ bảo trì.

## Consequences
- **Ưu điểm**: 
  - Đảm bảo tuyệt đối cả phần Backend (SQLite, APIs) và Frontend (UI Form, state, hooks) hoạt động chính xác.
  - Tự tin tuyệt đối khi mở rộng tính năng mới hoặc thực hiện nâng cấp các phiên bản thư viện cốt lõi mà không sợ regression bugs.
  - Chạy cực nhanh nhờ vào sự gọn nhẹ của Vitest và cấu trúc pure reducer.
- **Nhược điểm**: Đòi hỏi quy trình phát triển nghiêm túc, lập trình viên cần viết test song song khi xây dựng tính năng mới theo quy chuẩn của `docs/TESTING.md`.
