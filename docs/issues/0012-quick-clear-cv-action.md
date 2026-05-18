---
id: 0012
title: Quick Clear CV Action
type: AFK
status: completed
blocked_by: ["#0001"]
---

## Parent

PRD-0001: [0001-cv-builder-prd.md](file:///d:/Workspace/Open_CV_Skill/docs/prd/0001-cv-builder-prd.md)

## What to build

Bổ sung nút hành động "Làm trống CV" (Clear CV) màu đỏ tinh tế tại thanh công cụ chính để người dùng nhanh chóng xóa sạch dữ liệu mẫu pre-filled, bắt đầu soạn thảo CV trống chỉ sau 1 click.

## Acceptance criteria

- [ ] Tích hợp nút bấm có biểu tượng Thùng rác (Trash2) và nhãn tiếng Anh/Việt ("Làm trống CV" / "Clear CV") bên cạnh nút Lưu.
- [ ] Kích hoạt hộp thoại cảnh báo xác nhận (confirmation dialog) để ngăn ngừa việc bấm nhầm mất dữ liệu.
- [ ] Reset thành công toàn bộ `cvData` state về cấu trúc Schema trống chuẩn (blank schema) sau khi người dùng đồng ý.

## Blocked by

- #0001: Live Preview & Mẫu A4
