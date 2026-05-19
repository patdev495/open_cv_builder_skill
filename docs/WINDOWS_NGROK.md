# HƯỚNG DẪN TRIỂN KHAI CV BUILDER TRÊN WINDOWS SERVER QUA NGROK

Tài liệu này hướng dẫn chi tiết từng bước để triển khai hệ thống **CV Builder Pro** trên hệ điều hành **Windows Server** (hoặc Windows cá nhân) sử dụng **Docker trong WSL2** kết hợp với dịch vụ **Ngrok** và **Tên miền tĩnh miễn phí (Free Static Domain)** để public ứng dụng ra ngoài Internet với kết nối HTTPS bảo mật và cố định trọn đời.

---

## 🛠️ CÁC BƯỚC CHUẨN BỊ BAN ĐẦU

### Bước 1: Đăng ký Tên miền tĩnh miễn phí trên Ngrok (Chỉ làm 1 lần)
Ngrok cung cấp cho mọi tài khoản miễn phí 1 subdomain tĩnh cố định (không bị thay đổi khi reset máy).
1. Đăng nhập vào trang quản trị [Ngrok Dashboard](https://dashboard.ngrok.com/).
2. Nhấn vào menu **Cloud Edge** ở cột bên trái -> chọn **Domains**.
3. Tại đây, bạn sẽ thấy Ngrok cung cấp sẵn một tên miền miễn phí dạng `ten-mien-cua-ban.ngrok-free.app`. Hãy nhấn **Create Domain** để kích hoạt nó.
4. Copy lại tên miền tĩnh này của bạn.

### Bước 2: Cài đặt và cấu hình Ngrok trực tiếp trong WSL2 (Ubuntu)
Chạy toàn bộ Ngrok ngay trong môi trường WSL2 giúp bạn quản lý tất cả dịch vụ (Docker, Git, Ngrok) trên một cửa sổ dòng lệnh duy nhất cực kỳ tiện lợi:

1. Thêm khóa bảo mật và kho lưu trữ chính thức của Ngrok vào Ubuntu trong WSL2:
   ```bash
   curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list && sudo apt update
   ```
2. Cài đặt Ngrok bằng APT:
   ```bash
   sudo apt install ngrok -y
   ```
3. Liên kết tài khoản Ngrok của bạn (lấy mã Token trong trang chủ Ngrok Dashboard):
   ```bash
   ngrok config add-authtoken <MÃ_AUTHTOKEN_CỦA_BẠN>
   ```

---

## 📂 KHỞI CHẠY HỆ THỐNG TRÊN WINDOWS / WSL2

### Bước 3: Chạy ứng dụng bằng Docker trong WSL2
Chúng ta sử dụng tệp cấu hình chuyên dụng [docker-compose.windows.yml](file:///d:/Workspace/Open_CV_Skill/docker-compose.windows.yml) đã được tối ưu hóa cho Windows (sử dụng cổng `8080` tránh trùng cổng hệ thống IIS, và map cơ sở dữ liệu về thư mục dự án tương đối).

1. Mở cửa sổ terminal **WSL2 (Ubuntu)** của bạn.
2. Di chuyển tới thư mục chứa dự án:
   ```bash
   cd /mnt/d/Workspace/Open_CV_Skill
   ```
3. Chạy lệnh Docker Compose để tự động build và chạy ngầm hệ thống:
   ```bash
   docker compose -f docker-compose.windows.yml up -d --build
   ```
4. Kiểm tra trạng thái hoạt động:
   ```bash
   docker compose -f docker-compose.windows.yml ps
   ```
   Nếu cả 2 container `cv-builder-frontend` và `cv-builder-backend` đều ở trạng thái `Up`, hệ thống local của bạn đã chạy thành công trên cổng `8080`.

---

## 🌐 MỞ CỔNG RA INTERNET BẰNG NGROK

### Bước 4: Khởi chạy Ngrok trực tiếp trong WSL2
1. Mở thêm 1 tab terminal **WSL2 (Ubuntu)** mới hoặc sử dụng các công cụ quản lý phiên như `screen`/`tmux`.
2. Chạy lệnh sau để tạo đường hầm bảo mật HTTPS trỏ thẳng tới tên miền tĩnh của bạn (thay `ten-mien-cua-ban.ngrok-free.app` bằng tên miền thật bạn đã lấy ở Bước 1):
   ```bash
   ngrok http --domain=ten-mien-cua-ban.ngrok-free.app 8080
   ```
3. Cửa sổ Ngrok sẽ hiển thị trạng thái `Online`. Lúc này:
   * **Địa chỉ truy cập Internet:** `https://ten-mien-cua-ban.ngrok-free.app`
   * Mọi yêu cầu truy cập từ Internet sẽ được Ngrok mã hóa bảo mật SSL (HTTPS) và chuyển tiếp trực tiếp vào cổng `8080` trên máy Windows Server, đi thẳng vào Nginx của Container để xử lý.

---

## 💾 QUẢN LÝ DỮ LIỆU VÀ SAO LƯU (BACKUP)

* Toàn bộ cơ sở dữ liệu chứa thông tin **CV Schema** của bạn sẽ được lưu trữ an toàn trong thư mục dự án tại đường dẫn:
  `d:\Workspace\Open_CV_Skill\data\db\cv_builder.db`
* Để sao lưu dữ liệu, bạn chỉ cần copy tệp `cv_builder.db` ra nơi khác.
* Dữ liệu này hoàn toàn độc lập với vòng đời của Container Docker. Khi bạn build lại hoặc cập nhật code mới, dữ liệu **CV** vẫn được bảo toàn nguyên vẹn 100%.

---

## 🔄 CẬP NHẬT MÃ NGUỒN MỚI
Mỗi khi đẩy code mới từ máy cá nhân lên GitHub, bạn chỉ cần chạy cụm lệnh sau trong WSL2 để cập nhật:
```bash
cd /mnt/d/Workspace/Open_CV_Skill
git pull origin master
docker compose -f docker-compose.windows.yml up -d --build
```
Hệ thống sẽ tự động cập nhật mà không gây gián đoạn đường hầm Ngrok đang chạy!
