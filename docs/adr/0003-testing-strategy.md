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
   - Tạm thời chưa viết test tự động cho frontend trong giai đoạn MVP để tối ưu hóa thời gian phát triển, nhưng code sẽ được viết dạng Modular (tách rời Logic hooks khỏi UI) để dễ dàng viết unit test bằng Vitest sau này.

## Consequences
- **Ưu điểm**: Đảm bảo tuyệt đối các nghiệp vụ cốt lõi (bảo mật passcode, trùng lặp slug) hoạt động chính xác thông qua bộ test tự động trước khi deploy.
- **Nhược điểm**: Tốn thêm một chút thời gian viết test ban đầu, nhưng tiết kiệm rất nhiều thời gian debug về sau.
