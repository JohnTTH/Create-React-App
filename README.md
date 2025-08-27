
# Employee Management & Realtime Chat System

Một ứng dụng **React + Vite** cho phép **admin quản lý nhân viên** với tính năng đăng nhập qua số điện thoại, xác thực OTP, thêm/xóa nhân viên, và chat realtime với nhiều nhân viên.
---

## 🔹 Tính năng chính

1. **Đăng nhập Admin bằng số điện thoại**
   - Gửi mã xác thực OTP qua SMS.
   - Xác thực để đăng nhập vào hệ thống quản lý.

2. **Quản lý nhân viên**
   - Thêm mới nhân viên.
   - Xóa nhân viên.
   - Xem danh sách nhân viên.

3. **Chat Realtime**
   - Chat trực tiếp giữa admin và nhiều nhân viên.
   - Hệ thống tin nhắn realtime sử dụng WebSocket / Socket.io.

---

## 🔹 Công nghệ sử dụng

- **Frontend:** React, Vite, SCSS, React Icons.
- **Realtime Chat:** Socket.io.
- **Backend:** Node.js + Express (API quản lý nhân viên, gửi OTP, chat).
- **Database:** Firebase Firestore .
- **Xác thực:** OTP qua số điện thoại (Twilio).
  **Xác thực:** OTP qua email (nodemailer).
- **Environment variables:** `.env` để lưu các key API, token OTP, secret JWT.

---

## 🔹 Cấu trúc dự án

```
src/
├─ Redux/            # Lưu lại các giá trị tạm thời qua từng trang
├─ pages/            # Các trang: Dashboard, Message, Login kèm theo scss
├─ store/            # Redux hoặc Context
├─ App.jsx
└─ main.jsx
```

Backend (Node.js / Express):
```
nodejs/
├─ config.js                        # Setup Firebase
├─ serviceAccountKey.json           # Api key
└─ index.js                         # Server và controller xử lí logic
```

---

## 🔹 Cài đặt & chạy dự án

1. Clone project:
```bash
git clone <repo-url>
cd project-name
```

2. Cài đặt frontend:
```bash
cd Create-React-App
npm run dev
```

3. Cài đặt backend:
```bash
cd backend
npm install bcrypt@^6.0.0 cookie-parser@^1.4.7 cors@^2.8.5 dotenv@^17.2.1 express@^5.1.0 firebase@^12.1.0 firebase-admin@^13.4.0 jsonwebtoken@^9.0.2 nodemailer@^7.0.5 nodemon@^3.1.10 socket.io@^4.8.1 socket.io-client@^4.8.1 twilio@^5.8.0
nodemon index.js
```

4. Thêm file `.env` với các biến môi trường cần thiết:
```
JWT_SECRET=....

TWILIO_ACCOUNT_SID=....
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=... 

EMAIL_USER=...
EMAIL_PASS=....
```

5. Truy cập ứng dụng trên: `http://localhost:5173` (frontend Vite)

---

## 🔹 Lưu ý

- Đảm bảo backend đang chạy trước khi frontend gọi API.
- Realtime chat yêu cầu kết nối Socket.io đến backend.
- OTP gửi qua SMS yêu cầu cài đặt Twilio.
- OPT gửi qua mail yêu cầu cài đặt nodemailer

---

## 🔹 Mô tả
- Giao diện quản lí admin. Trang thái Inactive tức là tài khoản chưa được đăng nhập còn active thì đã được kích hoạt 
  (screenshots/hinh2.jpg)

---
Giao diện thêm một nhân viên thành công 
(screenshots/hinh3.jpg)

---
Giao diện chat Realtime dành cho admin
(screenshots/hinh5.jpg)

---
Giao diện chat Realtime dành cho nhân viên
(screenshots/hinh6.jpg)



## 🔹 License
"# Create-React-App" 

