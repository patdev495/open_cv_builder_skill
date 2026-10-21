# 0012-versioned-portable-cv-package

## Status
Accepted

## Context

CV Builder cần cho phép người dùng và AI agent trao đổi dữ liệu của từng CV mà không tiết lộ Passcode và không phụ thuộc vào giao diện đang dùng. Định dạng này sẽ được lưu ngoài hệ thống, nên thay đổi thiếu kiểm soát sẽ làm các tệp cũ không thể dùng được.

## Decision

Hệ thống dùng CV Package v1: JSON có `format: "cv-builder/package"`, `version: 1`, `slug`, `template` và `cv_data`; nó không bao gồm Passcode hay analytics. Import chỉ nhận đúng cấu trúc v1, thay thế dữ liệu editor sau xác nhận, xoá Passcode và không tự lưu. Mọi người xem Interactive Portfolio đều có thể export CV Package của CV công khai mà không cần xác thực.

## Consequences

AI agent có một contract dữ liệu rõ ràng, đầy đủ và tương thích theo phiên bản. Các package phiên bản mới hoặc sai trường bị từ chối rõ ràng thay vì bị âm thầm mất dữ liệu.
