# HƯỚNG DẪN TRIỂN KHAI CV BUILDER LÊN VPS BẰNG DOCKER

Tài liệu này hướng dẫn bạn từng bước một cách chi tiết để triển khai hệ thống **CV Builder Pro** lên máy chủ VPS Linux (khuyên dùng Ubuntu Server 22.04 / 24.04 LTS) bằng Docker, Docker Compose kết hợp chứng chỉ bảo mật HTTPS miễn phí từ Let's Encrypt.

---

## 🛠️ CÁC BƯỚC CHUẨN BỊ TRÊN VPS

### Bước 1: Cài đặt Docker và Docker Compose
Đăng nhập vào VPS của bạn qua SSH (sử dụng Terminal hoặc PuTTY) và chạy các lệnh sau để cập nhật hệ điều hành và cài đặt Docker:

```bash
# 1. Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# 2. Cài đặt các công cụ cần thiết
sudo apt install -y curl git apt-transport-https ca-certificates gnupg lsb-release

# 3. Thêm khóa GPG chính thức của Docker
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 4. Thiết lập repository ổn định của Docker
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 5. Cài đặt Docker Engine và Docker Compose
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 6. Kích hoạt và cho phép Docker tự khởi động cùng hệ thống
sudo systemctl enable docker
sudo systemctl start docker
```

---

### Bước 2: Tạo thư mục lưu trữ Database SQLite bền vững
Để tránh việc SQLite bị mất dữ liệu khi cập nhật/build lại Container Docker, ta tạo một thư mục an toàn trên ổ đĩa VPS thật:

```bash
# Tạo thư mục lưu trữ dữ liệu
sudo mkdir -p /var/lib/cv-builder

# Phân quyền cho phép Docker đọc ghi dữ liệu an toàn
sudo chmod -R 777 /var/lib/cv-builder
```

---

### Bước 3: Cài đặt Certbot và Lấy Chứng Chỉ SSL (HTTPS) Let's Encrypt
Để trang web của bạn chạy ở chế độ bảo mật HTTPS chuẩn mực:

```bash
# 1. Cài đặt Certbot thông qua snap (khuyên dùng trên Ubuntu)
sudo apt install snapd -y
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot

# 2. Tạo liên kết Certbot ra toàn hệ thống
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# 3. Lấy chứng chỉ SSL (thay 'domain_cua_ban.com' bằng tên miền thực tế của bạn)
# Lưu ý: Hãy chắc chắn tên miền đã được trỏ bản ghi A về địa chỉ IP của VPS!
sudo certbot certonly --standalone -d domain_cua_ban.com -d www.domain_cua_ban.com --agree-tos --email email_cua_ban@gmail.com --non-interactive
```

Chứng chỉ bảo mật SSL của bạn sau khi tạo thành công sẽ được lưu trữ tại thư mục hệ thống: `/etc/letsencrypt/live/domain_cua_ban.com/`.

---

## 📂 CHUẨN BỊ MÃ NGUỒN VÀ TRIỂN KHAI

### Bước 4: Tải mã nguồn lên VPS
Bạn có thể clone trực tiếp kho lưu trữ GitHub của mình lên VPS:

```bash
# Di chuyển đến thư mục muốn lưu trữ dự án
cd /var/www

# Clone mã nguồn từ GitHub
git clone https://github.com/patdev495/open_cv_builder_skill.git
cd open_cv_builder_skill
```

---

### Bước 5: Cấu hình Nginx HTTPS trong Container
Trong mã nguồn hiện tại, tệp cấu hình Nginx mặc định là [nginx.conf](file:///d:/Workspace/AI/Vision/open_cv_builder/open_cv_builder_skill/frontend/nginx.conf) đang lắng nghe cổng 80 (HTTP). 

Để cấu hình Nginx trong Docker chạy bảo mật **HTTPS (cổng 443)** kết hợp tự động redirect từ HTTP sang HTTPS, hãy cập nhật nội dung tệp [frontend/nginx.conf](file:///d:/Workspace/AI/Vision/open_cv_builder/open_cv_builder_skill/frontend/nginx.conf) trên VPS của bạn như sau (thay `domain_cua_ban.com` bằng tên miền của bạn):

```nginx
# 1. Tự động chuyển hướng từ HTTP (cổng 80) sang HTTPS (cổng 443)
server {
    listen 80;
    server_name domain_cua_ban.com www.domain_cua_ban.com;

    # Cho phép Certbot thực hiện thử thách gia hạn SSL qua cổng 80
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# 2. Cấu hình HTTPS chính thức
server {
    listen 443 ssl;
    server_name domain_cua_ban.com www.domain_cua_ban.com;

    # Đường dẫn chứng chỉ SSL (đã được map từ VPS vào container)
    ssl_certificate /etc/letsencrypt/live/domain_cua_ban.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/domain_cua_ban.com/privkey.pem;

    # Tối ưu hóa bảo mật SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Giới hạn tải file lên (tối đa 10MB cho ảnh đại diện Base64)
    client_max_body_size 10M;

    # Serve Static Frontend Files
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Chuyển tiếp yêu cầu API xuống FastAPI Backend
    location /api {
        proxy_pass http://backend:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### Bước 6: Khởi chạy dự án bằng Docker Compose
Sau khi cấu hình xong, bạn chỉ cần chạy duy nhất 1 lệnh để Docker tự động tải ảnh, build mã nguồn, liên kết mạng và chạy ngầm toàn bộ dự án:

```bash
sudo docker compose up -d --build
```

**Kiểm tra trạng thái hoạt động của các Container:**
```bash
sudo docker compose ps
```
Nếu cả hai Container `cv-builder-backend` và `cv-builder-frontend` đều hiển thị trạng thái `Up`, xin chúc mừng! Hệ thống của bạn đã online tại địa chỉ `https://domain_cua_ban.com`!

---

## 🔄 CẬP NHẬT CODE VÀ GIA HẠN SSL TỰ ĐỘNG

### 1. Cách cập nhật code mới từ GitHub
Mỗi khi bạn đẩy code mới từ máy cá nhân lên GitHub, để cập nhật lên VPS chỉ cần chạy cụm lệnh:

```bash
cd /var/www/open_cv_builder_skill
git pull origin master
sudo docker compose up -d --build
```
*Nhờ cơ chế Mapping Database ra thư mục `/var/lib/cv-builder` ở ổ đĩa thật, toàn bộ dữ liệu CV của bạn được bảo vệ an toàn 100% trong quá trình build lại!*

### 2. Cấu hình tự động gia hạn SSL Let's Encrypt (Cronjob)
Chứng chỉ SSL Let's Encrypt có thời hạn 90 ngày. Chạy lệnh sau để Certbot tự động kiểm tra và gia hạn hàng tháng:

```bash
# Mở bảng lập lịch Cronjob của VPS
sudo crontab -e

# Dán dòng sau vào cuối file để tự động chạy gia hạn lúc 3 giờ sáng mỗi ngày 1 hàng tháng:
0 3 1 * * /usr/bin/certbot renew --post-hook "docker exec cv-builder-frontend nginx -s reload"
```

Chúc bạn triển khai dự án thành công rực rỡ! 🚀
